import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ScheduleDayDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';

@ApiTags('Staff')
@Controller()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // GET /api/businesses/:businessId/staff — мастера бизнеса (публично)
  @Get('businesses/:businessId/staff')
  @ApiOperation({ summary: 'Список мастеров бизнеса (публично)' })
  findByBusiness(@Param('businessId') businessId: string) {
    return this.staffService.findByBusiness(businessId);
  }

  // POST /api/businesses/:businessId/staff — создать мастера
  @Post('businesses/:businessId/staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить мастера в бизнес' })
  create(
    @Param('businessId') businessId: string,
    @Body() dto: CreateStaffDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.staffService.create(businessId, dto, userId);
  }

  // PATCH /api/staff/:id — обновить профиль мастера
  @Patch('staff/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить профиль мастера' })
  update(
    @Param('id') id: string,
    @Body() data: { bio?: string; photoUrl?: string; serviceIds?: string[] },
    @CurrentUser('id') userId: string,
  ) {
    return this.staffService.update(id, data, userId);
  }

  // DELETE /api/staff/:id — деактивировать мастера
  @Delete('staff/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Деактивировать мастера' })
  deactivate(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.staffService.deactivate(id, userId);
  }

  // PUT /api/staff/:id/schedule — обновить расписание
  @Patch('staff/:id/schedule')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить расписание мастера' })
  updateSchedule(
    @Param('id') staffId: string,
    @Body() schedule: ScheduleDayDto[],
    @CurrentUser() user: User,
  ) {
    return this.staffService.updateSchedule(staffId, schedule, user.id, user.role);
  }

  // GET /api/staff/:id/available-slots — доступные слоты (ключевой эндпоинт!)
  @Get('staff/:id/available-slots')
  @ApiOperation({ summary: 'Доступные слоты для записи' })
  @ApiQuery({ name: 'date', example: '2024-04-25', description: 'Дата в формате YYYY-MM-DD' })
  @ApiQuery({ name: 'serviceIds', example: 'id1,id2', description: 'ID услуг через запятую' })
  getAvailableSlots(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('serviceIds') serviceIds: string,
  ) {
    // Парсим строку "id1,id2,id3" в массив
    const ids = serviceIds ? serviceIds.split(',').filter(Boolean) : [];
    return this.staffService.getAvailableSlots(id, date, ids);
  }
}
