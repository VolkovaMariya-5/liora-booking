import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { QueryBusinessesDto } from './dto/query-businesses.dto';
import { Role } from '@prisma/client';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  // Публичный каталог бизнесов с фильтрами и пагинацией
  // Показываем только isActive=true, isVisible=true
  async findAll(query: QueryBusinessesDto) {
    const { search, category, country, city, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      isVisible: true,
      // Фильтрация по полям — применяем только если параметр передан
      ...(category && { category }),
      ...(country && { country }),
      ...(city && { city }),
      // Полнотекстовый поиск по названию и описанию
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    // Запрашиваем данные и общее количество одновременно (Promise.all)
    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          // Считаем средний рейтинг и количество отзывов для отображения в карточке
          reviews: { select: { rating: true } },
          staff: { where: { isActive: true }, select: { id: true } },
        },
      }),
      this.prisma.business.count({ where }),
    ]);

    // Вычисляем средний рейтинг для каждого бизнеса
    const result = businesses.map((b) => {
      const ratings = b.reviews.map((r) => r.rating);
      const avgRating = ratings.length
        ? Math.round((ratings.reduce((a, c) => a + c, 0) / ratings.length) * 10) / 10
        : null;

      return {
        ...b,
        reviews: undefined,     // не отправляем все отзывы в списке
        staff: undefined,
        staffCount: b.staff.length,
        avgRating,
        reviewCount: ratings.length,
      };
    });

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Страница конкретного бизнеса по slug (liora.app/belle-beauty)
  async findBySlug(slug: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug },
      include: {
        staff: {
          where: { isActive: true },
          include: {
            user: { select: { name: true, avatarUrl: true } },
            services: { include: { service: true } },
            schedules: true,
          },
        },
        services: { where: { isActive: true } },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 20, // последние 20 отзывов
          include: { client: { select: { name: true, avatarUrl: true } } },
        },
      },
    });

    if (!business || (!business.isActive && !business.isVisible)) {
      throw new NotFoundException('Бизнес не найден');
    }

    // Средний рейтинг
    const ratings = business.reviews.map((r) => r.rating);
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((a, c) => a + c, 0) / ratings.length) * 10) / 10
      : null;

    return { ...business, avgRating, reviewCount: ratings.length };
  }

  // Получение бизнеса по ID (для внутреннего использования)
  async findById(id: string) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) throw new NotFoundException('Бизнес не найден');
    return business;
  }

  // Получение бизнеса текущего BUSINESS_ADMIN
  async findMyBusiness(ownerId: string) {
    const business = await this.prisma.business.findUnique({
      where: { ownerId },
      include: { staff: true, services: true },
    });
    if (!business) throw new NotFoundException('У вас ещё нет зарегистрированного бизнеса');
    return business;
  }

  // Обновление данных бизнеса (только владелец)
  async update(id: string, dto: UpdateBusinessDto, userId: string, userRole: Role) {
    const business = await this.findById(id);

    // Проверяем что обновляет именно владелец (или SUPER_ADMIN)
    if (userRole !== Role.SUPER_ADMIN && business.ownerId !== userId) {
      throw new ForbiddenException('Вы не являетесь владельцем этого бизнеса');
    }

    // Проверяем уникальность нового slug если он меняется
    if (dto.slug && dto.slug !== business.slug) {
      const existing = await this.prisma.business.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Этот адрес (slug) уже занят');
    }

    return this.prisma.business.update({ where: { id }, data: dto });
  }

  // Блокировка/разблокировка бизнеса (только SUPER_ADMIN)
  async toggleActive(id: string) {
    const business = await this.findById(id);
    return this.prisma.business.update({
      where: { id },
      data: { isActive: !business.isActive },
    });
  }

  // Пересчёт isVisible — бизнес виден клиентам только если есть хотя бы один активный мастер И одна услуга
  // Вызывается при добавлении/деактивации мастеров и услуг
  async recalculateVisibility(businessId: string) {
    const [staffCount, serviceCount] = await Promise.all([
      this.prisma.staff.count({ where: { businessId, isActive: true } }),
      this.prisma.service.count({ where: { businessId, isActive: true } }),
    ]);

    const isVisible = staffCount > 0 && serviceCount > 0;

    await this.prisma.business.update({
      where: { id: businessId },
      data: { isVisible },
    });

    return isVisible;
  }

  // Список всех бизнесов для SUPER_ADMIN (без фильтра isVisible/isActive)
  async findAllAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { name: true, email: true } } },
      }),
      this.prisma.business.count(),
    ]);
    return { data: businesses, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
