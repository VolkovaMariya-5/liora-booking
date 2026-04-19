import { Module } from '@nestjs/common';
import { ManageController } from './manage.controller';
import { BusinessesModule } from '../businesses/businesses.module';
import { StaffModule } from '../staff/staff.module';
import { ServicesModule } from '../services/services.module';

// ManageModule — модуль управления для BUSINESS_ADMIN
// Все роуты /manage/* делегируют в уже готовые сервисы: StaffService, ServicesService, BusinessesService
@Module({
  imports: [BusinessesModule, StaffModule, ServicesModule],
  controllers: [ManageController],
})
export class ManageModule {}
