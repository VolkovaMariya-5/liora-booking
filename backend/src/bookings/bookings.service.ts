import {
  Injectable, NotFoundException, ForbiddenException,
  ConflictException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, Role } from '@prisma/client';
import { CANCELLATION_HOURS_LIMIT } from './bookings.constants';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== СОЗДАНИЕ ЗАПИСИ ====================

  // POST /api/bookings — создание записи с защитой от race condition
  // Race condition: два клиента одновременно выбирают один слот
  // Решение: SELECT FOR UPDATE (транзакция + блокировка строк)
  async create(clientId: string, dto: CreateBookingDto) {
    // Загружаем услуги для расчёта цены и длительности
    const services = await this.prisma.service.findMany({
      where: { id: { in: dto.serviceIds }, isActive: true },
    });

    if (services.length !== dto.serviceIds.length) {
      throw new BadRequestException('Одна или несколько услуг не найдены или неактивны');
    }

    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const totalPrice = services.reduce((sum, s) => sum + Number(s.price), 0);

    // Вычисляем время окончания из startTime + totalDuration
    const endTime = this.addMinutes(dto.startTime, totalDuration);
    const bookingDate = new Date(dto.date);
    bookingDate.setHours(0, 0, 0, 0);

    // Транзакция с проверкой конфликта — атомарная проверка + создание
    // Если между проверкой и созданием другой запрос займёт тот же слот — откат
    return this.prisma.$transaction(async (tx) => {
      // Проверяем конфликт времени (раздел 8.4 ТЗ)
      // Ищем записи которые пересекаются с запрошенным временем
      const conflict = await tx.booking.findFirst({
        where: {
          staffId: dto.staffId,
          date: bookingDate,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          // Условие пересечения: существующая запись начинается до нашего конца
          // И заканчивается после нашего начала
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gt: dto.startTime } },
          ],
        },
      });

      if (conflict) {
        throw new ConflictException(
          'Этот временной слот уже занят. Выберите другое время.',
        );
      }

      // Создаём запись
      const booking = await tx.booking.create({
        data: {
          clientId,
          staffId: dto.staffId,
          businessId: dto.businessId,
          date: bookingDate,
          startTime: dto.startTime,
          endTime,
          totalPrice,
          totalDuration,
          status: BookingStatus.PENDING,
          notes: dto.notes,
          // Создаём BookingItem для каждой услуги — фиксируем цену на момент записи
          items: {
            create: services.map((s) => ({
              serviceId: s.id,
              price: s.price,
              duration: s.duration,
            })),
          },
        },
        include: { items: { include: { service: true } }, staff: { include: { user: true } } },
      });

      return booking;
    });
  }

  // ==================== ПОЛУЧЕНИЕ ЗАПИСЕЙ ====================

  // Список записей в зависимости от роли:
  // CLIENT — только свои записи
  // STAFF — записи к себе
  // BUSINESS_ADMIN — все записи своего бизнеса
  async findAll(userId: string, userRole: Role, statusFilter?: BookingStatus) {
    let where: Record<string, unknown> = {};

    if (userRole === Role.CLIENT) {
      where = { clientId: userId };
    } else if (userRole === Role.STAFF) {
      // Находим staffId по userId
      const staff = await this.prisma.staff.findUnique({ where: { userId } });
      if (!staff) return [];
      where = { staffId: staff.id };
    } else if (userRole === Role.BUSINESS_ADMIN) {
      const business = await this.prisma.business.findUnique({ where: { ownerId: userId } });
      if (!business) return [];
      where = { businessId: business.id };
    }

    if (statusFilter) {
      where.status = statusFilter;
    }

    return this.prisma.booking.findMany({
      where,
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
      include: {
        items: { include: { service: { select: { name: true } } } },
        staff: { include: { user: { select: { name: true, avatarUrl: true } } } },
        client: { select: { name: true, phone: true } },
        business: { select: { name: true, slug: true } },
        review: { select: { id: true, rating: true } },
      },
    });
  }

  async findById(id: string, userId: string, userRole: Role) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        items: { include: { service: true } },
        staff: { include: { user: { select: { name: true, avatarUrl: true } } } },
        client: { select: { name: true, phone: true, email: true } },
        business: true,
        review: true,
      },
    });

    if (!booking) throw new NotFoundException('Запись не найдена');

    // Проверяем что пользователь имеет доступ к этой записи
    await this.assertAccess(booking, userId, userRole);

    return booking;
  }

  // ==================== СТАТУСНАЯ МАШИНА (раздел 8.2 ТЗ) ====================

  // PATCH /api/bookings/:id/status
  // Допустимые переходы:
  //   PENDING → CONFIRMED (STAFF или BUSINESS_ADMIN)
  //   PENDING → CANCELLED (CLIENT, STAFF, BUSINESS_ADMIN)
  //   CONFIRMED → COMPLETED (STAFF или BUSINESS_ADMIN)
  //   CONFIRMED → CANCELLED (CLIENT за 2+ часа, STAFF, BUSINESS_ADMIN)
  async updateStatus(id: string, newStatus: BookingStatus, userId: string, userRole: Role) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Запись не найдена');

    await this.assertAccess(booking, userId, userRole);
    this.validateStatusTransition(booking.status, newStatus, userRole);

    // Для CLIENT: проверка правила 2 часов при отмене CONFIRMED
    if (
      userRole === Role.CLIENT &&
      newStatus === BookingStatus.CANCELLED &&
      booking.status === BookingStatus.CONFIRMED
    ) {
      this.assertCancellationAllowed(booking.date, booking.startTime);
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  // Валидация перехода статуса по матрице допустимых переходов
  private validateStatusTransition(
    current: BookingStatus,
    next: BookingStatus,
    role: Role,
  ) {
    // Матрица переходов: [currentStatus][role] → допустимые следующие статусы
    const allowed: Partial<Record<BookingStatus, Partial<Record<Role, BookingStatus[]>>>> = {
      [BookingStatus.PENDING]: {
        [Role.STAFF]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
        [Role.BUSINESS_ADMIN]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
        [Role.CLIENT]: [BookingStatus.CANCELLED],
      },
      [BookingStatus.CONFIRMED]: {
        [Role.STAFF]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
        [Role.BUSINESS_ADMIN]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
        [Role.CLIENT]: [BookingStatus.CANCELLED],
      },
    };

    const allowedForRole = allowed[current]?.[role] || [];
    if (!allowedForRole.includes(next)) {
      throw new ForbiddenException(
        `Переход статуса ${current} → ${next} недопустим для вашей роли`,
      );
    }
  }

  // Проверка правила отмены: нельзя отменить за менее чем CANCELLATION_HOURS_LIMIT часов
  private assertCancellationAllowed(bookingDate: Date, startTime: string) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const visitDateTime = new Date(bookingDate);
    visitDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffMs = visitDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < CANCELLATION_HOURS_LIMIT) {
      throw new BadRequestException(
        `Отменить запись можно не позднее чем за ${CANCELLATION_HOURS_LIMIT} часа до начала`,
      );
    }
  }

  // Проверка прав доступа к записи
  private async assertAccess(
    booking: { clientId: string; staffId: string; businessId: string },
    userId: string,
    userRole: Role,
  ) {
    if (userRole === Role.SUPER_ADMIN) return;

    if (userRole === Role.CLIENT && booking.clientId !== userId) {
      throw new ForbiddenException('Нет доступа к этой записи');
    }

    if (userRole === Role.STAFF) {
      const staff = await this.prisma.staff.findUnique({ where: { userId } });
      if (!staff || staff.id !== booking.staffId) {
        throw new ForbiddenException('Нет доступа к этой записи');
      }
    }

    if (userRole === Role.BUSINESS_ADMIN) {
      const business = await this.prisma.business.findUnique({ where: { ownerId: userId } });
      if (!business || business.id !== booking.businessId) {
        throw new ForbiddenException('Нет доступа к этой записи');
      }
    }
  }

  // ==================== ОТМЕНА ЗАПИСИ (DELETE) ====================

  // DELETE /api/bookings/:id — отмена записи пользователем
  // CLIENT: правило 2 часов для CONFIRMED, PENDING отменяет свободно
  // STAFF и BUSINESS_ADMIN: отменяют без ограничений
  async cancel(id: string, userId: string, userRole: Role) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Запись не найдена');

    await this.assertAccess(booking, userId, userRole);

    // Можно отменить только PENDING или CONFIRMED
    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException('Нельзя отменить запись в статусе ' + booking.status);
    }

    // Для CLIENT: проверка правила 2 часов только для CONFIRMED
    if (userRole === Role.CLIENT && booking.status === BookingStatus.CONFIRMED) {
      this.assertCancellationAllowed(booking.date, booking.startTime);
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  // Вспомогательная функция: прибавить минуты к "HH:MM"
  private addMinutes(time: string, minutes: number): string {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const nh = Math.floor(total / 60);
    const nm = total % 60;
    return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
  }
}
