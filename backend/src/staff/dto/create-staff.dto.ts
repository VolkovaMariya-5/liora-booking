import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO для создания мастера — BUSINESS_ADMIN создаёт нового пользователя с ролью STAFF
export class CreateStaffDto {
  @ApiProperty({ example: 'yulia@mybusiness.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Staff123!', description: 'Временный пароль для мастера' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Юлия Морозова' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Стилист-колорист с 7-летним опытом' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: [String], description: 'ID услуг, которые выполняет мастер' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  serviceIds?: string[];
}
