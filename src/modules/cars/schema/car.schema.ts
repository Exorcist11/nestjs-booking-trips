import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
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

  @Prop({
    required: true,
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return v.length === this.seatingCapacity;
      },
      message: 'Seats array must match the seating capacity of the car.',
    },
  })
  seats: string[];

  @Prop()
  seatLayout: string;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'maintenace'] })
  status: string;

  @Prop()
  model: string;

  @Prop()
  yearOfManufacture: number;
}

export type CarDocument = HydratedDocument<Car>;

export const CarSchema = SchemaFactory.createForClass(Car);
