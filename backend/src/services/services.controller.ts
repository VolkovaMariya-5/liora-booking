import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Services')
@Controller('businesses/:businessId/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Услуги бизнеса (публично)' })
  findAll(@Param('businessId') businessId: string) {
    return this.servicesService.findByBusiness(businessId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать услугу' })
  create(
    @Param('businessId') businessId: string,
    @Body() dto: CreateServiceDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.servicesService.create(businessId, dto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить услугу' })
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateServiceDto>,
    @CurrentUser('id') userId: string,
  ) {
    return this.servicesService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Деактивировать услугу (soft delete)' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.servicesService.remove(id, userId);
  }
}
