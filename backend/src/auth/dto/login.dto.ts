import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO для входа в систему — используется passport-local стратегией
export class LoginDto {
  @ApiProperty({ example: 'anna@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Client123!' })
  @IsString()
  @MinLength(6)
  password: string;
}
