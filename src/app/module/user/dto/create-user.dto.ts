import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: '' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ enum: ['user', 'admin'] })
  @IsOptional()
  @IsEnum(['user', 'admin'])
  role?: string;

  @ApiPropertyOptional({ enum: ['male', 'female'] })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  otpExpiry?: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  verifiedForget?: boolean;

  @ApiPropertyOptional({ enum: ['active', 'suspended'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  stripeAccountId?: string;
}
