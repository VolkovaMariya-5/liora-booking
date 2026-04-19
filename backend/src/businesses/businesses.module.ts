import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService], // экспортируем для использования в StaffModule и ServicesModule
})
export class BusinessesModule {}
