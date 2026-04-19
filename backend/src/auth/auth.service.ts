import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // validateUser — вызывается LocalStrategy при логине
  // Возвращает пользователя без пароля если credentials верны, null если нет
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    // bcrypt.compare сравнивает пароль в открытом виде с хешем в БД
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return null;

    // Возвращаем пользователя без хеша пароля
    return this.usersService.sanitize(user);
  }

  // login — создаёт JWT токен для авторизованного пользователя
  // Вызывается после успешной проверки credentials в LocalStrategy
  login(user: { id: string; email: string; role: Role }) {
    // payload — данные внутри токена (не шифруются, только подписываются)
    const payload = {
      sub: user.id,     // sub = subject (стандарт JWT) — ID пользователя
      email: user.email,
      role: user.role,
    };

    return {
      user,
      // Подписываем токен секретом из .env, срок действия из JWT_EXPIRES_IN
      accessToken: this.jwtService.sign(payload),
    };
  }

  // register — регистрация нового клиента
  async register(dto: RegisterDto) {
    // Проверяем, что email уже не занят
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      phone: dto.phone,
      country: dto.country,
      city: dto.city,
      role: Role.CLIENT,
    });

    // Сразу возвращаем токен — пользователь не должен повторно логиниться
    return this.login(user);
  }

  // registerBusiness — регистрация владельца бизнеса
  // Атомарно создаёт пользователя + бизнес в одной транзакции
  async registerBusiness(dto: RegisterBusinessDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Проверяем уникальность slug бизнеса
    const existingBusiness = await this.prisma.business.findUnique({
      where: { slug: dto.slug },
    });
    if (existingBusiness) {
      throw new ConflictException('Адрес (slug) уже занят другим бизнесом');
    }

    // Транзакция гарантирует атомарность: либо создаётся всё, либо ничего
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Создаём пользователя с ролью BUSINESS_ADMIN
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          country: dto.country,
          city: dto.city,
          role: Role.BUSINESS_ADMIN,
        },
      });

      // 2. Создаём бизнес, привязанный к этому пользователю
      const business = await tx.business.create({
        data: {
          name: dto.businessName,
          slug: dto.slug,
          description: dto.description,
          address: dto.address,
          category: dto.category,
          country: dto.country,
          city: dto.city,
          ownerId: user.id,
          // isVisible: false — бизнес скрыт пока нет мастеров и услуг
        },
      });

      return { user, business };
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = result.user;
    return this.login(safeUser);
  }

  // loginWithGoogle — поиск или создание пользователя при входе через Google
  // Вызывается из NextAuth.js при успешном Google OAuth
  async loginWithGoogle(data: { email: string; name: string }) {
    let user = await this.usersService.findByEmail(data.email);

    if (!user) {
      // Новый пользователь — создаём с временным паролем (он не нужен, т.к. вход через Google)
      const randomPassword = Math.random().toString(36).slice(-12);
      user = await this.usersService.create({
        email: data.email,
        password: randomPassword,
        name: data.name,
        role: Role.CLIENT,
      });
    }

    const safeUser = this.usersService.sanitize(user);
    return this.login(safeUser);
  }
}
