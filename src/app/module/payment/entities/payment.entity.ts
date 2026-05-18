import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subscribe' })
  subscribe!: Types.ObjectId;

  @Prop()
  amount!: number;

  @Prop({ default: 'subscription' })
  paymentType!: string;

  @Prop({
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  })
  status!: string;

  @Prop()
  stripePaymentIntentId!: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
