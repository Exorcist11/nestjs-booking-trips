import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true })
  trip: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  email: string;

  @Prop({ required: true, type: [String] })
  seats: string[];

  @Prop({ required: true })
  pickupPoint: string;

  @Prop({ required: true })
  dropOffPoint: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: false })
  isGuest: boolean;

  @Prop({ type: Date, default: Date.now })
  bookingDate: Date;

  @Prop({
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  })
  status: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: 'cash', enum: ['cash', 'transfer', 'card', 'e-wallet'] })
  paymentMethod: string;

  @Prop()
  note: string;
}

export type BookingDocument = HydratedDocument<Booking>;

export const BookingSchema = SchemaFactory.createForClass(Booking);
