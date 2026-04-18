import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() — делает PrismaModule глобальным
// Это значит, что PrismaService можно инжектировать в любой модуль
// без необходимости импортировать PrismaModule каждый раз
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // экспортируем, чтобы другие модули могли использовать
})
export class PrismaModule {}
