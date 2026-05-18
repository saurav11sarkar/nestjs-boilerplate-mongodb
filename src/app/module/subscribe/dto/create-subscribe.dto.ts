import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubscribeDto {
  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  planName!: string;

  @ApiPropertyOptional({ example: '', type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price!: number;

  @ApiPropertyOptional({ example: '', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}
