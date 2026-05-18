import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'Saurav Sarkar' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'saurav@example.com' })
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}

export class LoginAuthDto {
  @ApiProperty({ example: 'saurav@example.com' })
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'saurav@example.com' })
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email!: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'saurav@example.com' })
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'saurav@example.com' })
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'newsecret123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldsecret123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  oldPassword!: string;

  @ApiProperty({ example: 'newsecret123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword!: string;
}
