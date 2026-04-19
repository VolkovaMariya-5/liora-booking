import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

// Payload — данные, которые мы сохраняем внутри JWT токена при его создании
interface JwtPayload {
  sub: string;   // sub (subject) — стандартное поле JWT, хранит ID пользователя
  email: string;
  role: string;
}

// JwtStrategy — проверяет Bearer токен в заголовке Authorization
// Используется во всех защищённых эндпоинтах через JwtAuthGuard
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Извлекаем токен из заголовка: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false — просроченный токен будет отклонён
      ignoreExpiration: false,
      // Секрет для проверки подписи токена — должен совпадать с тем, что используется при создании
      secretOrKey: config.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  // validate() вызывается после успешной проверки подписи токена
  // Загружаем актуальные данные пользователя из БД (на случай если пользователь был удалён)
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден или был удалён');
    }
    // Возвращаемый объект будет доступен в req.user во всех защищённых маршрутах
    return user;
  }
}
