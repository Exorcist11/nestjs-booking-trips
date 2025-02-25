import { ScheduleModule } from './schedule.module';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from '../cars/schema/car.schema';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Route, RouteDocument } from '../route/schema/route.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
  ) {}

  async createSchedule(schedule: CreateScheduleDto): Promise<Schedule> {
    const carExists = await this.carModel.findById(schedule.car).exec();
    if (!carExists) {
      throw new NotFoundException('Car not found!');
    }
    const routeExists = await this.routeModel.findById(schedule.route).exec();
    if (!routeExists) {
      throw new NotFoundException('Route not found');
    }
    const newSchedule = new this.scheduleModel(schedule);
    return await newSchedule.save();
  }

  async findAll(
    car?: string,
    route?: string,

    limit: number = 10,
    index: number = 0,
    order: 'asc' | 'desc' = 'asc',
    sort = '_id',
  ): Promise<{ data: Schedule[]; total: number }> {
    const filter: {
      car?: { $regex: string; $options: string };
      route?: { $regex: string; $options: string };
    } = {};
    if (car) {
      filter.car = { $regex: car, $options: 'i' };
    }

    if (route) {
      filter.route = { $regex: route, $options: 'i' };
    }

    const sortOrder = order === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.scheduleModel
        .find(filter)
        .populate('car')
        .populate('route')
        .sort({ [sort]: sortOrder })
        .skip(index)
        .limit(limit)
        .exec(),
      this.scheduleModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<Schedule> {
    const exits = await this.scheduleModel.findById(id).exec();
    if (!exits) {
      throw new NotFoundException('Schedule not found');
    }
    return exits;
  }

  async update(id: string, updateDto: CreateScheduleDto): Promise<Schedule> {
    await this.findById(id);
    const carExists = await this.carModel.findById(updateDto.car).exec();
    if (!carExists && updateDto.car) {
      throw new NotFoundException('Car not found!');
    }
    const routeExists = await this.routeModel.findById(updateDto.route).exec();
    if (!routeExists && updateDto.route) {
      throw new NotFoundException('Route not found');
    }
    const updateSchedule = await this.scheduleModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .exec();
    return updateSchedule;
  }

  async delete(id: string): Promise<Schedule> {
    const exits = await this.scheduleModel.findByIdAndDelete(id).exec();
    if (!exits) {
      throw new NotFoundException('Schedule not found');
    }
    return exits;
  }
}
