import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessesService } from '../businesses/businesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessesService: BusinessesService,
  ) {}

  // Общая статистика платформы
  @Get('stats')
  @ApiOperation({ summary: 'Статистика платформы (SUPER_ADMIN)' })
  async getStats() {
    const [users, businesses, bookings, reviews] = await Promise.all([
      this.prisma.user.count({ where: { isDeleted: false } }),
      this.prisma.business.count(),
      this.prisma.booking.count(),
      this.prisma.review.count(),
    ]);

    const bookingsByStatus = await this.prisma.booking.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      users,
      businesses,
      bookings,
      reviews,
      bookingsByStatus: Object.fromEntries(
        bookingsByStatus.map((b) => [b.status, b._count.status]),
      ),
    };
  }

  // Список всех бизнесов с пагинацией
  @Get('businesses')
  @ApiOperation({ summary: 'Все бизнесы (SUPER_ADMIN)' })
  getBusinesses(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.businessesService.findAllAdmin(Number(page), Number(limit));
  }

  // Блокировка/разблокировка бизнеса
  @Patch('businesses/:id/toggle')
  @ApiOperation({ summary: 'Блокировать/разблокировать бизнес' })
  toggleBusiness(@Param('id') id: string) {
    return this.businessesService.toggleActive(id);
  }

  // Добавить/убрать из ТОП-подборки на лендинге
  @Patch('businesses/:id/featured')
  @ApiOperation({ summary: 'Добавить/убрать бизнес из ТОП' })
  toggleFeatured(@Param('id') id: string) {
    return this.businessesService.toggleFeatured(id);
  }

  // Список пользователей
  @Get('users')
  @ApiOperation({ summary: 'Все пользователи (SUPER_ADMIN)' })
  async getUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('role') role?: Role,
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    const where = { isDeleted: false, ...(role && { role }) };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, name: true, role: true,
          country: true, city: true, createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    };
  }

  // Создать пользователя с любой ролью
  @Post('users')
  @ApiOperation({ summary: 'Создать пользователя (SUPER_ADMIN)' })
  async createUser(
    @Body() body: { name: string; email: string; password: string; role: Role; city?: string; country?: string },
  ) {
    const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new BadRequestException('Email уже занят');
    const passwordHash = await bcrypt.hash(body.password, 10);
    return this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: body.role,
        city: body.city,
        country: body.country,
      },
      select: { id: true, name: true, email: true, role: true, city: true, country: true, createdAt: true },
    });
  }

  // Обновить пользователя (имя, email, роль, город)
  @Patch('users/:id')
  @ApiOperation({ summary: 'Обновить пользователя (SUPER_ADMIN)' })
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; role?: Role; city?: string; country?: string },
  ) {
    if (body.email) {
      const conflict = await this.prisma.user.findFirst({
        where: { email: body.email, id: { not: id } },
      });
      if (conflict) throw new BadRequestException('Email уже занят');
    }
    return this.prisma.user.update({
      where: { id },
      data: body,
      select: { id: true, name: true, email: true, role: true, city: true, country: true, createdAt: true },
    });
  }

  // Soft delete пользователя
  @Delete('users/:id')
  @ApiOperation({ summary: 'Удалить пользователя (soft delete, SUPER_ADMIN)' })
  deleteUser(@Param('id') id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
      select: { id: true, isDeleted: true },
    });
  }
}
