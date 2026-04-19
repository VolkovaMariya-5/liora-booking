import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { BusinessesService } from '../businesses/businesses.service';
import { StaffService } from '../staff/staff.service';
import { ServicesService } from '../services/services.service';
import { CreateStaffDto } from '../staff/dto/create-staff.dto';
import { CreateServiceDto } from '../services/dto/create-service.dto';

// ManageController — все роуты для BUSINESS_ADMIN (/manage/*)
// Автоматически определяет businessId по текущему пользователю через findMyBusiness()
@ApiTags('Manage (BUSINESS_ADMIN)')
@Controller('manage')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUSINESS_ADMIN)
@ApiBearerAuth()
export class ManageController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly staffService: StaffService,
    private readonly servicesService: ServicesService,
  ) {}

  // ==================== МАСТЕРА ====================

  // GET /api/manage/staff — список всех мастеров своего бизнеса (включая неактивных)
  @Get('staff')
  @ApiOperation({ summary: 'Список мастеров своего бизнеса' })
  async getStaff(@CurrentUser('id') userId: string) {
    const business = await this.businessesService.findMyBusiness(userId);
    return this.staffService.findByBusinessForAdmin(business.id);
  }

  // POST /api/manage/staff — создать нового мастера
  @Post('staff')
  @ApiOperation({ summary: 'Добавить мастера в свой бизнес' })
  async createStaff(@CurrentUser('id') userId: string, @Body() dto: CreateStaffDto) {
    const business = await this.businessesService.findMyBusiness(userId);
    return this.staffService.create(business.id, dto, userId);
  }

  // PATCH /api/manage/staff/:id — обновить/активировать/деактивировать мастера
  @Patch('staff/:id')
  @ApiOperation({ summary: 'Обновить данные или статус мастера' })
  updateStaff(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: { bio?: string; photoUrl?: string; serviceIds?: string[]; isActive?: boolean },
  ) {
    // Если передан isActive=false — деактивируем, иначе обновляем профиль
    if (data.isActive === false) {
      return this.staffService.deactivate(id, userId);
    }
    if (data.isActive === true) {
      return this.staffService.activate(id, userId);
    }
    return this.staffService.update(id, data, userId);
  }

  // ==================== УСЛУГИ ====================

  // GET /api/manage/services — все услуги своего бизнеса (включая неактивные)
  @Get('services')
  @ApiOperation({ summary: 'Список услуг своего бизнеса' })
  async getServices(@CurrentUser('id') userId: string) {
    const business = await this.businessesService.findMyBusiness(userId);
    return this.servicesService.findByBusinessForAdmin(business.id);
  }

  // POST /api/manage/services — создать услугу
  @Post('services')
  @ApiOperation({ summary: 'Создать услугу' })
  async createService(@CurrentUser('id') userId: string, @Body() dto: CreateServiceDto) {
    const business = await this.businessesService.findMyBusiness(userId);
    return this.servicesService.create(business.id, dto, userId);
  }

  // PATCH /api/manage/services/:id — обновить услугу
  @Patch('services/:id')
  @ApiOperation({ summary: 'Обновить услугу' })
  updateService(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: Partial<CreateServiceDto>,
  ) {
    return this.servicesService.update(id, dto, userId);
  }

  // DELETE /api/manage/services/:id — деактивировать услугу (soft delete)
  @Delete('services/:id')
  @ApiOperation({ summary: 'Деактивировать услугу' })
  removeService(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.servicesService.remove(id, userId);
  }

  // ==================== НАСТРОЙКИ БИЗНЕСА ====================

  // GET /api/manage/settings — данные своего бизнеса
  @Get('settings')
  @ApiOperation({ summary: 'Настройки своего бизнеса' })
  getSettings(@CurrentUser('id') userId: string) {
    return this.businessesService.findMyBusiness(userId);
  }

  // PATCH /api/manage/settings — обновить бизнес
  @Patch('settings')
  @ApiOperation({ summary: 'Обновить настройки бизнеса' })
  async updateSettings(
    @CurrentUser('id') userId: string,
    @Body() dto: Record<string, unknown>,
  ) {
    const business = await this.businessesService.findMyBusiness(userId);
    return this.businessesService.update(business.id, dto as any, userId, Role.BUSINESS_ADMIN);
  }

  // ==================== ЗАПИСИ БИЗНЕСА ====================

  // GET /api/manage/bookings — переходит к BookingsService через findAll
  // (реализовано через тот же GET /api/bookings с ролью BUSINESS_ADMIN)
}
