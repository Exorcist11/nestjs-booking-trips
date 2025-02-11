import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Car {
  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ required: true })
  mainDriver: string;

  @Prop({ required: true })
  ticketCollector: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  seatingCapacity: number;
}

export type CarDocument = HydratedDocument<Car>;

export const CarSchema = SchemaFactory.createForClass(Car);
