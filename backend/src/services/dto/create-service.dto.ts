import { IsString, IsNumber, IsInt, Min, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @ApiProperty({ example: 'Стрижка женская' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Модельная стрижка с укладкой' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2500, description: 'Цена в рублях' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({ example: 60, description: 'Длительность в минутах (минимум 15)' })
  @Type(() => Number)
  @IsInt()
  @Min(15)
  duration: number;
}
