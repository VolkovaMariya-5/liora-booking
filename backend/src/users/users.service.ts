import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Поиск пользователя по email — используется при логине (passport-local)
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        isDeleted: false, // мягко удалённые пользователи не могут войти
      },
    });
  }

  // Поиск пользователя по ID — используется в JWT стратегии для проверки токена
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
  }

  // Создание нового пользователя — используется при регистрации
  async create(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    country?: string;
    city?: string;
    role?: Role;
  }): Promise<User> {
    // Хешируем пароль перед сохранением — никогда не храним пароли в открытом виде
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        phone: data.phone,
        country: data.country,
        city: data.city,
        role: data.role || Role.CLIENT,
      },
    });
  }

  // Получение безопасного объекта пользователя без хеша пароля
  // Используется в ответах API — никогда не отправляем passwordHash клиенту
  sanitize(user: User): Omit<User, 'passwordHash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
