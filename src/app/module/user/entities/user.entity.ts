import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
import * as bcrypt from 'bcrypt';
import config from '../../../config';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, 'Full name is required'],
    trim: true,
  })
  fullName: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  })
  password: string;

  @Prop({
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop({ enum: ['male', 'female'] })
  gender: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  address: string;

  @Prop()
  profilePicture: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiry?: Date;

  @Prop({ enum: ['active', 'suspended'], default: 'active' })
  status: string;

  @Prop()
  verifiedForget: boolean;

  @Prop()
  stripeAccountId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcryptSaltRounds),
  );
});
