import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Список избранных мастеров' })
  findAll(@CurrentUser('id') userId: string) {
    return this.favoritesService.findAll(userId);
  }

  @Post(':staffId')
  @ApiOperation({ summary: 'Добавить мастера в избранное' })
  add(@CurrentUser('id') userId: string, @Param('staffId') staffId: string) {
    return this.favoritesService.add(userId, staffId);
  }

  @Delete(':staffId')
  @ApiOperation({ summary: 'Убрать мастера из избранного' })
  remove(@CurrentUser('id') userId: string, @Param('staffId') staffId: string) {
    return this.favoritesService.remove(userId, staffId);
  }

  @Get(':staffId/check')
  @ApiOperation({ summary: 'Проверить добавлен ли мастер в избранное' })
  check(@CurrentUser('id') userId: string, @Param('staffId') staffId: string) {
    return this.favoritesService.check(userId, staffId);
  }
}
