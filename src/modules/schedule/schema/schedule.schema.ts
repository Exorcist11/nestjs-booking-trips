import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema()
export class Schedule extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Route' })
  route: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Car' })
  car: Types.ObjectId;

  @Prop({ required: true })
  departureTime: string; // Giờ khởi hành (vd: "10:00")

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  isActive: boolean;
}

export type ScheduleDocument = HydratedDocument<Schedule>;

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
