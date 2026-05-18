import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiPropertyOptional({ example: '' })
  @IsString()
  fullName!: string;

  @ApiPropertyOptional({ example: '' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  phoneNumber!: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  message!: string;
}
