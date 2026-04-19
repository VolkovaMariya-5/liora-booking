import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO регистрации обычного клиента
// class-validator автоматически проверяет входящие данные благодаря глобальному ValidationPipe
export class RegisterDto {
  @ApiProperty({ example: 'anna@example.com' })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @ApiProperty({ example: 'Secure123!', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @MaxLength(50)
  password: string;

  @ApiProperty({ example: 'Анна Смирнова' })
  @IsString()
  @MinLength(2, { message: 'Имя должно быть не менее 2 символов' })
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: '+79001234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'RU', description: 'Код страны для персонализации' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Москва' })
  @IsOptional()
  @IsString()
  city?: string;
}
