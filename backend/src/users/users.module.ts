import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

// UsersModule — отвечает за работу с пользователями в БД
// Экспортируется, чтобы AuthModule мог использовать UsersService
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
