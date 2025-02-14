import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip, TripDocument } from './schema/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { Car, CarDocument } from '../cars/schema/car.schema';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
  ) {}

  async findAll(
    search?: string,
    limit = 10,
    index = 0,
    order: 'asc' | 'desc' = 'asc',
    sort = '_id',
  ): Promise<Trip[]> {
    const filter = search
      ? { departure: { $regex: search, $options: 'i' } }
      : {};

    const sortOrder = order === 'asc' ? 1 : -1;

    const trips = await this.tripModel
      .find(filter)
      .sort({ [sort]: sortOrder })
      .skip(index)
      .limit(limit)
      .populate('car')
      .exec();
   
    return trips;
  }

  async create(trip: CreateTripDto): Promise<Trip> {
    const carId = new Types.ObjectId(trip.car.toString());

    const carExists = await this.carModel.findById(carId).exec();
    if (!carExists) {
      throw new NotFoundException('Car not found');
    }

    trip.availableSeats = carExists.seatingCapacity;

    const newTrip = new this.tripModel({ ...trip, car: carId });
    return await newTrip.save();
  }

  async findById(id: string): Promise<Trip> {
    const existingTrip = await this.tripModel.findById(id).exec();
    if (!existingTrip) {
      throw new NotFoundException('Trip not found');
    }
    return existingTrip.populate('car');
  }

  async delelte(id: string): Promise<Trip> {
    const exitsTrip = await this.tripModel.findByIdAndDelete(id).exec();
    if (!exitsTrip) {
      throw new NotFoundException('Trip not found');
    }
    return exitsTrip;
  }

  async updateTrip(id: string, trip: CreateTripDto): Promise<Trip> {
    const existingTrip = await this.tripModel.findById(id);
    if (!existingTrip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.car) {
      const carExists = await this.carModel.findById(trip.car).exec();
      if (!carExists) {
        throw new NotFoundException('Car not found');
      }
      trip.availableSeats = carExists.seatingCapacity;
    }
    const updateTrip = (
      await this.tripModel.findByIdAndUpdate(
        id,
        { $set: trip },
        { new: true, runValidators: true },
      )
    ).populated('car');

    return updateTrip;
  }
}
