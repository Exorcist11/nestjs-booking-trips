import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/booking.schema';
import { TripsModule } from '../trips/trips.module';
import { UsersModule } from '../users/users.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    TripsModule,
    UsersModule,
    ScheduleModule,
    CarsModule,
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [MongooseModule],
})
export class BookingsModule {}
