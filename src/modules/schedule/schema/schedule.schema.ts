import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema()
export class Schedule extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Route' })
  route: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Car' })
  car: Types.ObjectId;

  @Prop({ required: true, type: Date })
  departureTime: Date;

  @Prop({ required: true, type: Date })
  arrivalTime: Date;

  @Prop({ required: true })
  price: number;

  @Prop({
    required: true,
    type: [String],
    validate: { validator: (v) => v.length > 0 },
  })
  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  note: string;
}

export type ScheduleDocument = HydratedDocument<Schedule>;

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
