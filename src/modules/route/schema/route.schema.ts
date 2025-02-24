import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Route extends Document {
  @Prop({ required: true })
  departure: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ default: true })
  isActive: boolean;
}

export type RouteDocument = HydratedDocument<Route>;

export const RouteSchema = SchemaFactory.createForClass(Route);
