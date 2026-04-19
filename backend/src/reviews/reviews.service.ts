import {
  Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, Role } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // Оставить отзыв — только клиент, только на COMPLETED запись, только один раз
  async create(
    clientId: string,
    data: { bookingId: string; rating: number; comment?: string },
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { review: true },
    });

    if (!booking) throw new NotFoundException('Запись не найдена');
    if (booking.clientId !== clientId) throw new ForbiddenException('Нет доступа');
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('Отзыв можно оставить только после завершённого визита');
    }
    if (booking.review) {
      throw new ConflictException('Вы уже оставили отзыв на эту запись');
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Оценка должна быть от 1 до 5');
    }

    return this.prisma.review.create({
      data: {
        bookingId: data.bookingId,
        clientId,
        staffId: booking.staffId,
        businessId: booking.businessId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  // Публичный список отзывов бизнеса
  async findByBusiness(businessId: string) {
    return this.prisma.review.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        client: { select: { name: true, avatarUrl: true } },
        booking: { select: { items: { include: { service: { select: { name: true } } } } } },
      },
    });
  }

  // Удаление отзыва (SUPER_ADMIN)
  async remove(id: string, userRole: Role) {
    if (userRole !== Role.SUPER_ADMIN) throw new ForbiddenException('Только SUPER_ADMIN');
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Отзыв не найден');
    return this.prisma.review.delete({ where: { id } });
  }
}
