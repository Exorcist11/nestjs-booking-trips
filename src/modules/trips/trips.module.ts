import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schema/trip.schema';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
    CarsModule,
  ],
  providers: [TripsService],
  controllers: [TripsController],
  exports: [MongooseModule],
})
export class TripsModule {}
