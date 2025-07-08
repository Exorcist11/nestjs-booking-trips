import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Booking {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true,
  })
  trip: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true,
  })
  user?: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion',
    required: false,
  })
  promotion?: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true, match: /^(?:\+84|0)\d{9,10}$/ })
  phoneNumber: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ type: [String], required: true })
  seats: string[];

  @Prop({ required: true })
  pickupPoint: string;

  @Prop({ required: true })
  dropOffPoint: string;

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({ default: false })
  isGuest: boolean;

  @Prop({ type: Date, default: Date.now, index: true })
  bookingDate: Date;

  @Prop({
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    index: true,
  })
  status: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: 'cash', enum: ['cash', 'transfer', 'card', 'e-wallet'] })
  paymentMethod: string;

  @Prop()
  note?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  createdBy?: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<Booking>;

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Thêm index
BookingSchema.index({ trip: 1, status: 1 });
BookingSchema.index({ user: 1, bookingDate: -1 });
