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

  @Prop({ required: true, match: /^(?:\+84|0)\d{9,10}$/ })
  phoneNumber: string;

  @Prop({ required: true })
  seatingCapacity: number;

  @Prop({
    required: true,
    type: [String],
    validate: {
      validator: function (seats: string[]) {
        return seats.length > 0 && seats.length === new Set(seats).size;
      },
      message: 'Danh sách ghế phải không rỗng và các ghế phải duy nhất',
    },
  })
  seats: string[];

  @Prop()
  seatLayout: string;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'maintenance'] })
  status: string;

  @Prop()
  model: string;

  @Prop()
  yearOfManufacture: number;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export type CarDocument = HydratedDocument<Car>;

export const CarSchema = SchemaFactory.createForClass(Car);
