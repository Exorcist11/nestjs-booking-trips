import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Promotion extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['percentage', 'fixed'] })
  discountType: string;

  @Prop({ required: true })
  discountValue: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 0 })
  minOrderValue: number;

  @Prop({ default: 0 })
  maxDiscount: number;

  @Prop({ default: 0 })
  usageLimit: number;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Route' }], default: [] })
  applicableRoutes: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;
}

export type PromotionDocument = HydratedDocument<Promotion>;

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
