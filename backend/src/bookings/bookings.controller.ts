import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BookingStatus } from '@prisma/client';
import type { User } from '@prisma/client';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard) // все эндпоинты bookings требуют авторизации
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать запись' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Список записей (зависит от роли)' })
  @ApiQuery({ name: 'status', enum: BookingStatus, required: false })
  findAll(
    @CurrentUser() user: User,
    @Query('status') status?: BookingStatus,
  ) {
    return this.bookingsService.findAll(user.id, user.role, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детали записи' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.findById(id, user.id, user.role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Сменить статус записи' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.updateStatus(id, status, user.id, user.role);
  }
}
