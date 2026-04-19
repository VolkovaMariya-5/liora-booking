import {
  Injectable, NotFoundException, ForbiddenException,
  ConflictException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessesService } from '../businesses/businesses.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ScheduleDayDto } from './dto/update-schedule.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessesService: BusinessesService,
  ) {}

  // Список мастеров бизнеса (публично — только активные)
  async findByBusiness(businessId: string) {
    return this.prisma.staff.findMany({
      where: { businessId, isActive: true },
      include: {
        user: { select: { name: true, avatarUrl: true, email: true } },
        services: { include: { service: { select: { id: true, name: true, price: true, duration: true } } } },
        schedules: true,
      },
    });
  }

  // Получить одного мастера по ID
  async findById(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        services: { include: { service: true } },
        schedules: true,
        business: { select: { maxAdvanceBookingDays: true } },
      },
    });
    if (!staff) throw new NotFoundException('Мастер не найден');
    return staff;
  }

  // Создание мастера — BUSINESS_ADMIN создаёт пользователя STAFF + Staff профиль
  async create(businessId: string, dto: CreateStaffDto, ownerId: string) {
    await this.assertOwner(businessId, ownerId);

    // Проверяем что email не занят
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Пользователь с таким email уже существует');

    // Транзакция: создаём User + Staff + StaffService связи одновременно
    const result = await this.prisma.$transaction(async (tx) => {
      const passwordHash = await bcrypt.hash(dto.password, 10);

      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          role: Role.STAFF,
        },
      });

      const staff = await tx.staff.create({
        data: {
          userId: user.id,
          businessId,
          bio: dto.bio,
        },
      });

      // Привязываем выбранные услуги к мастеру
      if (dto.serviceIds?.length) {
        await tx.staffService.createMany({
          data: dto.serviceIds.map((serviceId) => ({ staffId: staff.id, serviceId })),
        });
      }

      return { staff, user };
    });

    // После добавления мастера пересчитываем видимость бизнеса
    await this.businessesService.recalculateVisibility(businessId);

    return result.staff;
  }

  // Обновление мастера (биo, фото, услуги)
  async update(
    id: string,
    data: { bio?: string; photoUrl?: string; serviceIds?: string[] },
    ownerId: string,
  ) {
    const staff = await this.prisma.staff.findUnique({ where: { id } });
    if (!staff) throw new NotFoundException('Мастер не найден');
    await this.assertOwner(staff.businessId, ownerId);

    return this.prisma.$transaction(async (tx) => {
      // Обновляем профиль мастера
      const updated = await tx.staff.update({
        where: { id },
        data: { bio: data.bio, photoUrl: data.photoUrl },
      });

      // Обновляем список услуг — удаляем старые и создаём новые
      if (data.serviceIds !== undefined) {
        await tx.staffService.deleteMany({ where: { staffId: id } });
        if (data.serviceIds.length) {
          await tx.staffService.createMany({
            data: data.serviceIds.map((serviceId) => ({ staffId: id, serviceId })),
          });
        }
      }

      return updated;
    });
  }

  // Деактивация мастера (soft delete)
  async deactivate(id: string, ownerId: string) {
    const staff = await this.prisma.staff.findUnique({ where: { id } });
    if (!staff) throw new NotFoundException('Мастер не найден');
    await this.assertOwner(staff.businessId, ownerId);

    // Предупреждение если есть активные записи (CONFIRMED)
    const activeBookings = await this.prisma.booking.count({
      where: { staffId: id, status: { in: ['PENDING', 'CONFIRMED'] } },
    });

    const updated = await this.prisma.staff.update({
      where: { id },
      data: { isActive: false },
    });

    await this.businessesService.recalculateVisibility(staff.businessId);

    return { ...updated, activeBookingsCount: activeBookings };
  }

  // ==================== РАСПИСАНИЕ ====================

  // Обновить расписание мастера (7 дней)
  async updateSchedule(staffId: string, schedule: ScheduleDayDto[], requesterId: string, requesterRole: Role) {
    const staff = await this.prisma.staff.findUnique({
      where: { id: staffId },
      include: { business: true },
    });
    if (!staff) throw new NotFoundException('Мастер не найден');

    // Разрешаем обновлять расписание: владелец бизнеса или сам мастер
    const isOwner = staff.business.ownerId === requesterId;
    const isOwnStaff = staff.userId === requesterId;
    if (!isOwner && !isOwnStaff) {
      throw new ForbiddenException('Недостаточно прав');
    }

    // Удаляем старое расписание и создаём новое
    return this.prisma.$transaction(async (tx) => {
      await tx.schedule.deleteMany({ where: { staffId } });
      await tx.schedule.createMany({
        data: schedule.map((day) => ({ ...day, staffId })),
      });
      return tx.schedule.findMany({ where: { staffId }, orderBy: { dayOfWeek: 'asc' } });
    });
  }

  // ==================== АЛГОРИТМ ДОСТУПНЫХ СЛОТОВ ====================

  // GET /api/staff/:id/available-slots?date=2024-04-20&serviceIds=id1,id2
  // Возвращает список доступных временных слотов с учётом:
  // 1. Рабочего расписания мастера (Schedule)
  // 2. Уже занятых слотов (Booking PENDING/CONFIRMED)
  // 3. Суммарной длительности выбранных услуг
  // 4. maxAdvanceBookingDays бизнеса
  async getAvailableSlots(staffId: string, date: string, serviceIds: string[]) {
    const staff = await this.findById(staffId);

    // Проверяем что дата не превышает maxAdvanceBookingDays
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + staff.business.maxAdvanceBookingDays);

    if (requestedDate < today) {
      throw new BadRequestException('Нельзя записаться на прошедшую дату');
    }
    if (requestedDate > maxDate) {
      throw new BadRequestException(
        `Запись доступна только на ${staff.business.maxAdvanceBookingDays} дней вперёд`,
      );
    }

    // Определяем день недели (0=Вс, 1=Пн, ...)
    const dayOfWeek = requestedDate.getDay();
    const daySchedule = staff.schedules.find((s) => s.dayOfWeek === dayOfWeek);

    // Если мастер не работает в этот день — слотов нет
    if (!daySchedule || !daySchedule.isWorking) {
      return { date, slots: [], message: 'В этот день мастер не работает' };
    }

    // Считаем суммарную длительность выбранных услуг
    let totalDuration = 0;
    if (serviceIds.length > 0) {
      const services = await this.prisma.service.findMany({
        where: { id: { in: serviceIds } },
        select: { duration: true },
      });
      totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    }

    if (totalDuration === 0) {
      throw new BadRequestException('Не выбраны услуги для расчёта слотов');
    }

    // Получаем занятые промежутки времени из существующих записей
    const bookings = await this.prisma.booking.findMany({
      where: {
        staffId,
        date: requestedDate,
        status: { in: ['PENDING', 'CONFIRMED'] }, // только активные записи
      },
      select: { startTime: true, endTime: true },
    });

    // Генерируем слоты с шагом 30 минут в пределах рабочего дня
    const slots = this.generateSlots(
      daySchedule.startTime,
      daySchedule.endTime,
      totalDuration,
      bookings,
    );

    return { date, slots, totalDuration };
  }

  // Алгоритм генерации слотов (раздел 8.1 ТЗ)
  // startWork/endWork — рабочее время мастера ("09:00", "18:00")
  // duration — суммарная длительность записи в минутах
  // occupied — занятые промежутки из существующих бронирований
  private generateSlots(
    startWork: string,
    endWork: string,
    duration: number,
    occupied: { startTime: string; endTime: string }[],
  ): string[] {
    const slots: string[] = [];

    // Переводим "HH:MM" в минуты от начала суток для удобства арифметики
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const fromMinutes = (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const workStart = toMinutes(startWork);
    const workEnd = toMinutes(endWork);

    // Строим список занятых интервалов в минутах
    const busyIntervals = occupied.map((b) => ({
      start: toMinutes(b.startTime),
      end: toMinutes(b.endTime),
    }));

    // Перебираем слоты с шагом 30 минут
    for (let time = workStart; time + duration <= workEnd; time += 30) {
      const slotEnd = time + duration;

      // Проверяем пересечение с занятыми интервалами
      // Слот занят если он пересекается с любой существующей записью
      const isOccupied = busyIntervals.some(
        (busy) => time < busy.end && slotEnd > busy.start,
      );

      if (!isOccupied) {
        slots.push(fromMinutes(time));
      }
    }

    return slots;
  }

  // Проверка что пользователь — владелец бизнеса
  private async assertOwner(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business || business.ownerId !== ownerId) {
      throw new ForbiddenException('Недостаточно прав');
    }
  }
}
