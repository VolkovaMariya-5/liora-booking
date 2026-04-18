import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// PrismaService расширяет PrismaClient — это единственный экземпляр клиента БД на всё приложение
// NestJS создаёт его как singleton, поэтому соединение с БД открывается один раз
// Prisma 7 использует driver adapter: вместо встроенного соединения — явный пул через 'pg'
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    // Создаём пул соединений PostgreSQL через пакет 'pg'
    // Pool — управляет несколькими соединениями одновременно для производительности
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // PrismaPg — адаптер, соединяющий Prisma Client с пулом 'pg'
    const adapter = new PrismaPg(pool);

    // Передаём адаптер в PrismaClient (обязательно в Prisma 7)
    super({ adapter });

    this.pool = pool;
  }

  // OnModuleInit — подключаемся к БД при старте приложения
  async onModuleInit() {
    await this.$connect();
  }

  // OnModuleDestroy — закрываем соединение и пул при остановке приложения
  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
