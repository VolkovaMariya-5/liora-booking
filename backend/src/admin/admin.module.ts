import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { BusinessesModule } from '../businesses/businesses.module';

@Module({
  imports: [BusinessesModule],
  controllers: [AdminController],
})
export class AdminModule {}
