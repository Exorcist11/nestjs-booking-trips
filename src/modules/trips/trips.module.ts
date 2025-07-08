import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schema/trip.schema';
import { CarsModule } from '../cars/cars.module';
import { Schedule, ScheduleSchema } from '../schedule/schema/schedule.schema';
import { Car, CarSchema } from '../cars/schema/car.schema';
import { Route, RouteSchema } from '../route/schema/route.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Car.name, schema: CarSchema },
      { name: Route.name, schema: RouteSchema },
      { name: Trip.name, schema: TripSchema },
    ]),
    CarsModule,
  ],
  providers: [TripsService],
  controllers: [TripsController],
  exports: [MongooseModule, TripsService],
})
export class TripsModule {}
