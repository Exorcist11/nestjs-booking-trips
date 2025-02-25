import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Route, RouteDocument } from './schema/route.schema';
import { Model } from 'mongoose';
import { CreateRouteDto } from './dto/route.dto';

interface RouteFilter {
  departure?: { $regex: string; $options: string };
  destination?: { $regex: string; $options: string };
}

@Injectable()
export class RouteService {
  constructor(
    @InjectModel(Route.name)
    private routeModel: Model<RouteDocument>,
  ) {}

  async createRoute(Route: CreateRouteDto): Promise<Route> {
    const newRoute = new this.routeModel(Route);
    return await newRoute.save();
  }

  async findAll(
    departure?: string,
    destination?: string,

    limit: number = 10,
    index: number = 0,
    order: 'asc' | 'desc' = 'asc',
    sort = '_id',
  ): Promise<{ data: Route[]; total: number }> {
    const filter: RouteFilter = {};
    if (departure) {
      filter.departure = { $regex: departure, $options: 'i' };
    }

    if (destination) {
      filter.destination = { $regex: destination, $options: 'i' };
    }

    const sortOrder = order === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.routeModel.find(filter)
        .sort({ [sort]: sortOrder })
        .skip(index)
        .limit(limit)
        .exec(),
      this.routeModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<Route> {
    const exits = await this.routeModel.findById(id).exec();
    if (!exits) {
      throw new NotFoundException('Route not found');
    }
    return exits;
  }

  async update(id: string, updateDto: CreateRouteDto): Promise<Route> {
    await this.findById(id);
    const updateRoute = await this.routeModel.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true },
    ).exec();
    return updateRoute;
  }

  async delete(id: string): Promise<Route> {
    const exits = await this.routeModel.findByIdAndDelete(id).exec();
    if (!exits) {
      throw new NotFoundException('Route not found');
    }
    return exits;
  }
}
