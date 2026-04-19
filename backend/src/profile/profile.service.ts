import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, phone: true, avatarUrl: true,
        role: true, country: true, city: true, createdAt: true,
        // Статистика клиента
        bookings: { select: { status: true } },
      },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    // Считаем статистику
    const stats = {
      total: user.bookings.length,
      completed: user.bookings.filter((b) => b.status === 'COMPLETED').length,
      upcoming: user.bookings.filter((b) => ['PENDING', 'CONFIRMED'].includes(b.status)).length,
    };

    return { ...user, bookings: undefined, stats };
  }

  async updateProfile(
    userId: string,
    data: { name?: string; phone?: string; country?: string; city?: string; avatarUrl?: string },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, name: true, phone: true, avatarUrl: true,
        role: true, country: true, city: true,
      },
    });
  }

  // Смена пароля — проверяем старый, сохраняем хеш нового
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new BadRequestException('Неверный текущий пароль');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    return { message: 'Пароль успешно изменён' };
  }

  // Soft delete аккаунта — помечаем isDeleted, не удаляем из БД
  async deleteAccount(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return { message: 'Аккаунт удалён' };
  }
}
