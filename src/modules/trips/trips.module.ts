import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schema/trip.schema';
import { CarsModule } from '../cars/cars.module';
import { TripScheduleModule } from '../trip-schedule/trip-schedule.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
    CarsModule,
    TripScheduleModule,
  ],
  providers: [TripsService],
  controllers: [TripsController],
  exports: [MongooseModule],
})
export class TripsModule {}
