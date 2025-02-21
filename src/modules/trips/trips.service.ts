import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip, TripDocument } from './schema/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { Car, CarDocument } from '../cars/schema/car.schema';
import {
  TripSchedule,
  TripScheduleDocument,
} from '../trip-schedule/schema/tripSchedule.schema';

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
    @InjectModel(TripSchedule.name)
    private tripSCModule: Model<TripScheduleDocument>,
  ) {}

  async findAll(
    departure?: string,
    destination?: string,
    departureTime?: Date,
    limit: number = 10,
    index: number = 0,
    order: 'asc' | 'desc' = 'asc',
    sort = '_id',
  ): Promise<{ data: Trip[]; total: number }> {
    const filter: TripFilter = {};
    if (departure) {
      filter.departure = { $regex: departure, $options: 'i' };
    }

    if (destination) {
      filter.destination = { $regex: destination, $options: 'i' };
    }

    if (departureTime) {
      filter.departureTime = { $eq: new Date(departureTime) };
    }

    const sortOrder = order === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.tripModel
        .find(filter)
        .sort({ [sort]: sortOrder })
        .skip(index)
        .limit(limit)
        .populate('car')
        .exec(),
      this.tripModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
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
