import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip, TripDocument } from './schema/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { Car, CarDocument } from '../cars/schema/car.schema';

interface TripFilter {
  departure?: { $regex: string; $options: string };
  destination?: { $regex: string; $options: string };
  departureTime?: { $eq: Date };
}

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
  ) {}

}
