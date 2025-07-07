import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Route extends Document {
  @Prop({ required: true })
  departure: string;

  @Prop({ required: true })
  destination: string;

  @Prop({
    required: true,
    type: [String],
    validate: { validator: (v) => v.length > 0 },
  })
  pickupPoints: string[];

  @Prop({
    required: true,
    type: [String],
    validate: { validator: (v) => v.length > 0 },
  })
  dropOffPoints: string[];

  @Prop({ required: true })
  distance: number;

  @Prop({ required: true })
  estimatedDuration: number;

  @Prop({ default: 'forward', enum: ['forward', 'backward'] })
  direction: string;

  @Prop({ default: 'Asia/Ho_Chi_Minh' })
  timeZone: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export type RouteDocument = HydratedDocument<Route>;

export const RouteSchema = SchemaFactory.createForClass(Route);
