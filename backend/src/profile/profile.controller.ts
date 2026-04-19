import { Controller, Get, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Обновить профиль' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() data: { name?: string; phone?: string; country?: string; city?: string; avatarUrl?: string },
  ) {
    return this.profileService.updateProfile(userId, data);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Сменить пароль' })
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.profileService.changePassword(userId, body.currentPassword, body.newPassword);
  }

  @Delete()
  @ApiOperation({ summary: 'Удалить аккаунт (soft delete)' })
  deleteAccount(@CurrentUser('id') userId: string) {
    return this.profileService.deleteAccount(userId);
  }
}
