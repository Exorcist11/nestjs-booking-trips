import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Seats {
  @Prop({ required: true })
  model?: string;

  @Prop({ required: true })
  seats: string[];
}

export type SeatsDocument = HydratedDocument<Seats>;

export const SeatsSchema = SchemaFactory.createForClass(Seats);
