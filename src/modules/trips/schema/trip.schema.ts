import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Trip {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  })
  template: mongoose.Schema.Types.ObjectId; // Liên kết với TripTemplate

  @Prop({ required: true })
  date: Date; // Ngày chạy thực tế

  @Prop({ required: true, default: 40 })
  availableSeats?: number;

  @Prop({ required: true, type: [String] })
  bookedSeats: string[];
}

export type TripDocument = HydratedDocument<Trip>;

export const TripSchema = SchemaFactory.createForClass(Trip);
