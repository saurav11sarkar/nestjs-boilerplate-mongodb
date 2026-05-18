import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type SubscribeDocument = HydratedDocument<Subscribe>;

@Schema({ timestamps: true })
export class Subscribe {
  @Prop()
  planName!: string;

  @Prop()
  price!: number;

  @Prop()
  features!: [string];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  user!: Types.ObjectId[];
}

export const SubscribeSchema = SchemaFactory.createForClass(Subscribe);
