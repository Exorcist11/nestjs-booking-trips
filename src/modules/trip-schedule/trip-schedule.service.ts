import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TripSchedule,
  TripScheduleDocument,
} from './schema/tripSchedule.schema';
import { Model } from 'mongoose';
import { CreateTripScheduleDto } from './dto/tripSchedule.dto';

interface TripFilter {
  departure?: { $regex: string; $options: string };
  destination?: { $regex: string; $options: string };
  departureTime?: { $eq: Date };
}

@Injectable()
export class TripScheduleService {
  constructor(
    @InjectModel(TripSchedule.name)
    private tripSCModule: Model<TripScheduleDocument>,
  ) {}

  async createTripSchedule(
    tripTemplate: CreateTripScheduleDto,
  ): Promise<TripSchedule> {
    const newTripSchedule = new this.tripSCModule(tripTemplate);
    return await newTripSchedule.save();
  }

  async findAll(
    departure?: string,
    destination?: string,
    departureTime?: Date,
    limit: number = 10,
    index: number = 0,
    order: 'asc' | 'desc' = 'asc',
    sort = '_id',
  ): Promise<{ data: TripSchedule[]; total: number }> {
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
      this.tripSCModule
        .find(filter)
        .sort({ [sort]: sortOrder })
        .skip(index)
        .limit(limit)
        .exec(),
      this.tripSCModule.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<TripSchedule> {
    const exits = await this.tripSCModule.findById(id).exec();
    if (!exits) {
      throw new NotFoundException('Trip Schedule not found');
    }
    return exits;
  }

  async update(
    id: string,
    updateDto: CreateTripScheduleDto,
  ): Promise<TripSchedule> {
    await this.findById(id);
    const updateSchedule = await this.tripSCModule
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .exec();
    return updateSchedule;
  }

  async delete(id: string): Promise<TripSchedule> {
    const exits = await this.tripSCModule.findByIdAndDelete(id).exec();
    if (!exits) {
      throw new NotFoundException('Trip Schedule not found');
    }
    return exits;
  }
}
