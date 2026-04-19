import { PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBusinessDto } from './create-business.dto';

// PartialType делает все поля необязательными — идеально для PATCH запросов
export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {
  @ApiPropertyOptional({ example: 30, description: 'На сколько дней вперёд можно записаться' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(90)
  maxAdvanceBookingDays?: number;
}
