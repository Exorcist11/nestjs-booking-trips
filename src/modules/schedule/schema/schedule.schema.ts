import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Schedule extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Route', required: true })
  routeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  carId: Types.ObjectId;

  @Prop({ required: true })
  departureTime: string; // e.g., "03:00" for 3 AM

  @Prop({ default: 'daily', enum: ['daily', 'weekly', 'custom'] })
  frequency: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export type ScheduleDocument = HydratedDocument<Schedule>;

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
