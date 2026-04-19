import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessesService } from '../businesses/businesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

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
}
