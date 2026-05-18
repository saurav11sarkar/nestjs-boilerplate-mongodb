import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User, UserDocument } from '../user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from '@nestjs/jwt';
import config from '../../config';
import sendMailer from 'src/app/helpers/sendMailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: jwt.JwtService,
  ) {}

  async register(CreateAuthDto: CreateAuthDto) {
    const user = await this.userModel.findOne({ email: CreateAuthDto.email });
    if (user) {
      throw new HttpException('User already exists', 400);
    }
    const newUser = await this.userModel.create(CreateAuthDto);
    return newUser;
  }

  async login(loginDto: { email: string; password: string }, res: Response) {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException('Incorrect password', 401);
    }

    const accessToken = this.jwtService.sign(
      { id: user._id, email: user.email, role: user.role },
      {
        secret: config.jwt.accessTokenSecret,
        expiresIn: config.jwt.accessTokenExpires as any,
      } as jwt.JwtSignOptions,
    );
    const refreshToken = this.jwtService.sign(
      { id: user._id, email: user.email, role: user.role },
      {
        secret: config.jwt.refreshTokenSecret,
        expiresIn: config.jwt.refreshTokenExpires as any,
      } as jwt.JwtSignOptions,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { accessToken, user };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('Email not found', 404);

    const generateOtpNumber = Math.floor(100000 + Math.random() * 900000);

    user.otp = generateOtpNumber.toString();
    user.otpExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const html = `
    <div style="font-family: Arial; text-align: center;">
      <h2 style="color:#4f46e5;">Password Reset OTP</h2>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing:4px;">${generateOtpNumber}</h1>
      <p>This code will expire in 1 hour.</p>
    </div>
  `;

    await sendMailer(user.email, 'Reset Password OTP', html);

    return { message: 'Check your email for OTP' };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('Invalid link', 400);

    if (user.otp !== otp) throw new HttpException('Invalid OTP', 400);
    if (!user.otpExpiry) throw new HttpException('Invalid OTP', 400);
    const todayDate = new Date();
    if (user.otpExpiry < todayDate) throw new HttpException('OTP expired', 400);

    user.otp = undefined as any;
    user.otpExpiry = undefined as any;

    user.verifiedForget = true;
    await user.save();
    if (!user.verifiedForget) throw new HttpException('Invalid link', 400);

    return { message: 'OTP verified successfully' };
  }

  async resetPasswordChange(email: string, newPassword: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('Invalid link', 400);

    if (!user.verifiedForget) throw new HttpException('Invalid link', 400);

    user.password = newPassword;
    user.verifiedForget = false;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) throw new HttpException('User not found', 404);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) throw new HttpException('Invalid old password', 400);

    if (oldPassword === newPassword)
      throw new HttpException(
        'New password cannot be same as old password',
        400,
      );

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }
}
