import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { CarsModule } from '../cars/cars.module';
import { ScheduleController } from './schedule.controller';
import { RouteModule } from '../route/route.module';
import { Car, CarSchema } from '../cars/schema/car.schema';
import { Route, RouteSchema } from '../route/schema/route.schema';
import { Trip, TripSchema } from '../trips/schema/trip.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Car.name, schema: CarSchema },
      { name: Route.name, schema: RouteSchema },
      { name: Trip.name, schema: TripSchema },
    ]),
    CarsModule,
    RouteModule,
  ],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [MongooseModule],
})
export class ScheduleModule {}
