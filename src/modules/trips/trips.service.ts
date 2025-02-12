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
    order = 'asc',
    sort = '_id',
  ): Promise<Trip[]> {
    const filter = search
      ? { departure: { $regex: search, $options: 'i' } }
      : {};

    const sortOrder = order === 'asc' ? 1 : -1;
    return this.tripModel
      .find(filter)
      .sort({ [sort]: sortOrder })
      .skip(index)
      .limit(limit)
      .populate('car')
      .exec();
  }

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    const carId = new Types.ObjectId(createTripDto.car);

    const carExists = await this.carModel.findById(carId);
    if (!carExists) {
      throw new NotFoundException('Car not found');
    }

    const newTrip = new this.tripModel({ ...createTripDto, car: carId });
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

  async updateTrip(id: string, updateTripDto: CreateTripDto): Promise<Trip> {
    const existingTrip = await this.tripModel.findById(id);
    if (!existingTrip) {
      throw new NotFoundException('Trip not found');
    }

    if (updateTripDto.car) {
      const carExists = await this.carModel.findById(updateTripDto.car);
      if (!carExists) {
        throw new NotFoundException('Car not found');
      }
    }
    const updateTrip = (
      await this.tripModel.findByIdAndUpdate(
        id,
        { $set: updateTripDto },
        { new: true, runValidators: true },
      )
    ).populated('car');

    return updateTrip;
  }
}
