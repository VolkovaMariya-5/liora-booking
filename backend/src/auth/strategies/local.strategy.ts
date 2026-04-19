import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

// LocalStrategy — проверяет email + пароль при логине
// Passport автоматически вызывает validate() до выполнения контроллера
// Если validate() бросит исключение — Passport вернёт 401
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // Говорим Passport использовать поле 'email' вместо стандартного 'username'
    super({ usernameField: 'email' });
  }

  // validate() вызывается Passport автоматически с данными из тела запроса
  // Возвращаемый объект будет доступен в req.user
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    return user;
  }
}
