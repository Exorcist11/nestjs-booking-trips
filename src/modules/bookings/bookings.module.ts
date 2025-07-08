import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/booking.schema';
import { Schedule, ScheduleSchema } from '../schedule/schema/schedule.schema';
import { Car, CarSchema } from '../cars/schema/car.schema';
import { Route, RouteSchema } from '../route/schema/route.schema';
import { Trip, TripSchema } from '../trips/schema/trip.schema';
import { User, UserSchema } from '../users/schema/user.schema';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Car.name, schema: CarSchema },
      { name: Route.name, schema: RouteSchema },
      { name: Trip.name, schema: TripSchema },
      { name: User.name, schema: UserSchema },
    ]),
    TripsModule,
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [MongooseModule],
})
export class BookingsModule {}
