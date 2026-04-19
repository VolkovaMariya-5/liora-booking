import { IsString, IsEnum, IsOptional, MinLength, MaxLength, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessCategory } from '@prisma/client';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Belle Beauty Studio' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'belle-beauty', description: 'Уникальный slug для URL' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  slug: string;

  @ApiProperty({ enum: BusinessCategory })
  @IsEnum(BusinessCategory)
  category: BusinessCategory;

  @ApiProperty({ example: 'RU' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Москва' })
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}
