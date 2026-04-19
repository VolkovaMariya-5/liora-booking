import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оставить отзыв (только CLIENT, только COMPLETED)' })
  create(
    @CurrentUser('id') userId: string,
    @Body() body: { bookingId: string; rating: number; comment?: string },
  ) {
    return this.reviewsService.create(userId, body);
  }

  @Get('businesses/:businessId/reviews')
  @ApiOperation({ summary: 'Отзывы бизнеса (публично)' })
  findByBusiness(@Param('businessId') businessId: string) {
    return this.reviewsService.findByBusiness(businessId);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить отзыв (SUPER_ADMIN)' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.reviewsService.remove(id, user.role);
  }
}
