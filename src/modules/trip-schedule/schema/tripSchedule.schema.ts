import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TripSchedule extends Document {
  @Prop({ required: true })
  departure: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  departureTime: string; // Giờ khởi hành cố định (vd: "10:00")

  @Prop({ type: [String], required: true })
  schedule: string[]; // Các ngày chạy (["Monday", "Wednesday", "Friday"])

  @Prop({ default: true })
  isActive: boolean; // Bật/tắt tuyến xe này
}

export type TripScheduleDocument = HydratedDocument<TripSchedule>;

export const TripScheduleSchema = SchemaFactory.createForClass(TripSchedule);
