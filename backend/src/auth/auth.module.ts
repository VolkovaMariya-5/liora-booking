import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // PassportModule — регистрирует Passport.js, 'jwt' — стратегия по умолчанию
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JwtModule.registerAsync — конфигурируем асинхронно, чтобы получить JWT_SECRET из ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // as `${number}${'s'|'m'|'h'|'d'}` — явный тип для совместимости с @nestjs/jwt
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '7d') as `${number}d`,
        },
      }),
    }),

    // UsersModule нужен для проверки пользователя при каждом запросе с токеном
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy, // стратегия для POST /login
    JwtStrategy,   // стратегия для всех защищённых маршрутов
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
