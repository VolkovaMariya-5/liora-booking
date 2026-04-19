import { IsString, IsArray, IsUUID, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'staff-uuid' })
  @IsUUID()
  staffId: string;

  @ApiProperty({ example: 'business-uuid' })
  @IsUUID()
  businessId: string;

  @ApiProperty({ example: '2024-04-25', description: 'Дата визита YYYY-MM-DD' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Дата должна быть в формате YYYY-MM-DD' })
  date: string;

  @ApiProperty({ example: '10:00', description: 'Время начала HH:MM' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Время должно быть в формате HH:MM' })
  startTime: string;

  @ApiProperty({ type: [String], description: 'ID выбранных услуг' })
  @IsArray()
  @IsUUID('4', { each: true })
  serviceIds: string[];

  @ApiPropertyOptional({ example: 'Предпочитаю светлые тона' })
  @IsOptional()
  @IsString()
  notes?: string;
}
