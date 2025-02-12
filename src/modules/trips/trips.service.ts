import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip, TripDocument } from './trip.schema';

@Injectable()
export class TripsService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<TripDocument>) {}

  async findAll(): Promise<Trip[]> {
    return this.tripModel.find().exec();
  }

  async create(trip: Trip): Promise<Trip> {
    const newTrip = new this.tripModel(trip);
    return newTrip.save();
  }
}
