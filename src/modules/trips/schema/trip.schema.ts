import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Trip {
  @Prop({ required: true })
  departure: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  departureTime: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 40 })
  availableSeats?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true })
  car: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: [String] })
  bookedSeats: string[];
}

export type TripDocument = HydratedDocument<Trip>;

export const TripSchema = SchemaFactory.createForClass(Trip);
