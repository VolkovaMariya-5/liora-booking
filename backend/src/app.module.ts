import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // ConfigModule — загружает переменные из .env файла
    // isGlobal: true — доступен во всех модулях без дополнительного импорта
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // PrismaModule — глобальный модуль для работы с БД через Prisma ORM
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
