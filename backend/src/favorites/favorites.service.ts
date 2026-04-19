import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  // Список избранных мастеров клиента
  async findAll(clientId: string) {
    return this.prisma.favorite.findMany({
      where: { clientId },
      include: {
        staff: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            business: { select: { name: true, slug: true } },
            services: { include: { service: { select: { name: true, price: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Добавить мастера в избранное
  async add(clientId: string, staffId: string) {
    const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) throw new NotFoundException('Мастер не найден');

    // Проверяем что ещё не добавлен — @@unique([clientId, staffId]) в схеме
    const existing = await this.prisma.favorite.findUnique({
      where: { clientId_staffId: { clientId, staffId } },
    });
    if (existing) throw new ConflictException('Мастер уже в избранном');

    return this.prisma.favorite.create({ data: { clientId, staffId } });
  }

  // Убрать мастера из избранного
  async remove(clientId: string, staffId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { clientId_staffId: { clientId, staffId } },
    });
    if (!favorite) throw new NotFoundException('Мастер не в избранном');

    return this.prisma.favorite.delete({
      where: { clientId_staffId: { clientId, staffId } },
    });
  }

  // Проверить, в избранном ли мастер (для кнопки ❤ на карточке)
  async check(clientId: string, staffId: string): Promise<{ isFavorite: boolean }> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { clientId_staffId: { clientId, staffId } },
    });
    return { isFavorite: !!favorite };
  }
}
