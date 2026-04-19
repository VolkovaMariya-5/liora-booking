import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessCategory } from '@prisma/client';

// DTO регистрации владельца бизнеса — создаёт и пользователя (BUSINESS_ADMIN) и бизнес одновременно
export class RegisterBusinessDto {
  // Данные пользователя
  @ApiProperty({ example: 'owner@mybusiness.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secure123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Наталья Белова' })
  @IsString()
  @MinLength(2)
  name: string;

  // Данные бизнеса
  @ApiProperty({ example: 'Belle Beauty Studio' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  businessName: string;

  @ApiProperty({
    example: 'belle-beauty',
    description: 'Уникальный slug: liora.app/belle-beauty (только строчные буквы, цифры, дефис)',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  slug: string;

  @ApiProperty({ enum: BusinessCategory, example: 'BEAUTY_SALON' })
  @IsEnum(BusinessCategory)
  category: BusinessCategory;

  @ApiProperty({ example: 'RU' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Москва' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ example: 'Премиальный салон красоты' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'ул. Тверская, 15' })
  @IsOptional()
  @IsString()
  address?: string;
}
