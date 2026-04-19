import { IsInt, IsString, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO для одного дня в расписании мастера
export class ScheduleDayDto {
  @ApiProperty({ example: 1, description: '0=Вс, 1=Пн, ..., 6=Сб' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  endTime: string;

  @ApiProperty({ example: true, description: 'false = выходной день' })
  @IsBoolean()
  isWorking: boolean;
}
