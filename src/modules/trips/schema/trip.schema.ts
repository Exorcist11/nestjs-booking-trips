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

  @Prop({ required: true, type: Date }) // Ngày cụ thể của chuyến đi
  date: Date; // VD: "2025-07-07T00:00:00+07:00"

  @Prop({ required: true, default: 40 })
  availableSeats: number;

  @Prop({ required: true, type: [String] })
  bookedSeats: string[];

  @Prop({
    default: 'scheduled',
    enum: ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled'],
  })
  status: string;

  @Prop({ type: Date })
  actualDepartureTime: Date;

  @Prop({ type: Date })
  actualArrivalTime: Date;

  @Prop()
  note: string;
}

export type TripDocument = HydratedDocument<Trip>;

export const TripSchema = SchemaFactory.createForClass(Trip);
