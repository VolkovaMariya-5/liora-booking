import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { QueryBusinessesDto } from './dto/query-businesses.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  // GET /api/businesses — публичный каталог с фильтрами
  @Get()
  @ApiOperation({ summary: 'Каталог бизнесов с фильтрами и пагинацией' })
  findAll(@Query() query: QueryBusinessesDto) {
    return this.businessesService.findAll(query);
  }

  // GET /api/businesses/my — бизнес текущего BUSINESS_ADMIN
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить свой бизнес (BUSINESS_ADMIN)' })
  getMyBusiness(@CurrentUser('id') userId: string) {
    return this.businessesService.findMyBusiness(userId);
  }

  // GET /api/businesses/:slug — страница бизнеса (публично)
  @Get(':slug')
  @ApiOperation({ summary: 'Страница бизнеса по slug' })
  @ApiResponse({ status: 404, description: 'Бизнес не найден' })
  findBySlug(@Param('slug') slug: string) {
    return this.businessesService.findBySlug(slug);
  }

  // PATCH /api/businesses/:id — обновление (владелец или SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить данные бизнеса' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBusinessDto,
    @CurrentUser() user: User,
  ) {
    return this.businessesService.update(id, dto, user.id, user.role);
  }

  // PATCH /api/businesses/:id/toggle — блокировка (SUPER_ADMIN)
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Заблокировать/разблокировать бизнес (SUPER_ADMIN)' })
  toggle(@Param('id') id: string) {
    return this.businessesService.toggleActive(id);
  }
}
