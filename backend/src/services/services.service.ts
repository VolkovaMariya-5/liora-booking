import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { BusinessesService } from '../businesses/businesses.service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessesService: BusinessesService,
  ) {}

  // Список активных услуг бизнеса (публично)
  async findByBusiness(businessId: string) {
    return this.prisma.service.findMany({
      where: { businessId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // Создание услуги (только BUSINESS_ADMIN своего бизнеса)
  async create(businessId: string, dto: CreateServiceDto, ownerId: string) {
    await this.assertOwner(businessId, ownerId);

    const service = await this.prisma.service.create({
      data: { ...dto, businessId },
    });

    // После добавления услуги пересчитываем видимость бизнеса
    await this.businessesService.recalculateVisibility(businessId);

    return service;
  }

  // Обновление услуги
  async update(id: string, dto: Partial<CreateServiceDto>, ownerId: string) {
    const service = await this.findById(id);
    await this.assertOwner(service.businessId, ownerId);

    return this.prisma.service.update({ where: { id }, data: dto });
  }

  // Soft delete услуги — не удаляем физически (есть история бронирований)
  // Проверяем что нет активных записей на эту услугу
  async remove(id: string, ownerId: string) {
    const service = await this.findById(id);
    await this.assertOwner(service.businessId, ownerId);

    // Проверяем активные записи: PENDING или CONFIRMED
    const activeBookings = await this.prisma.bookingItem.count({
      where: {
        serviceId: id,
        booking: { status: { in: ['PENDING', 'CONFIRMED'] } },
      },
    });

    if (activeBookings > 0) {
      throw new BadRequestException(
        `Нельзя удалить услугу: есть ${activeBookings} активных записей`,
      );
    }

    const updated = await this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    // После деактивации пересчитываем видимость
    await this.businessesService.recalculateVisibility(service.businessId);

    return updated;
  }

  private async findById(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Услуга не найдена');
    return service;
  }

  // Проверка что пользователь — владелец бизнеса, которому принадлежит услуга
  private async assertOwner(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business || business.ownerId !== ownerId) {
      throw new ForbiddenException('Недостаточно прав');
    }
  }
}
