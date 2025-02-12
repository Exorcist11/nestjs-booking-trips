import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
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
  availableSeats: number;
}

export type TripDocument = HydratedDocument<Trip>;

export const TripSchema = SchemaFactory.createForClass(Trip);
