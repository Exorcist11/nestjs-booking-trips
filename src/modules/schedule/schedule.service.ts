import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from '../cars/schema/car.schema';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Route, RouteDocument } from '../route/schema/route.schema';
import { Trip, TripDocument } from '../trips/schema/trip.schema';
import { ScheduleResponseDto } from './dto/response-schedule.dto';
import { plainToClass } from 'class-transformer';
import { SearchSchedulesDto } from './dto/search-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

export interface ScheduleItemRes {
  schedue_id: string;
  departure: string;
  destination: string;
  time_start: string;
  price: string;
}

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
  ) {}

  async create(
    createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    const route = await this.routeModel
      .findOne({ _id: createScheduleDto.routeId, isDeleted: false })
      .exec();

    if (!route) {
      throw new NotFoundException(
        `Không tìm thấy tuyến đường với ID ${createScheduleDto.routeId}`,
      );
    }

    const car = await this.carModel
      .findOne({ _id: createScheduleDto.carId, isDeleted: false })
      .exec();
    if (!car) {
      throw new NotFoundException(
        `Không tìm thấy xe với ID ${createScheduleDto.carId}`,
      );
    }

    // Validate departureTime format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(createScheduleDto.departureTime)) {
      throw new BadRequestException('Giờ khởi hành phải có định dạng HH:mm');
    }

    const createdSchedule = await this.scheduleModel.create(createScheduleDto);
    const scheduleResponse = plainToClass(
      ScheduleResponseDto,
      createdSchedule.toObject(),
    );
    scheduleResponse.startLocation = route.startLocation;
    scheduleResponse.endLocation = route.endLocation;
    scheduleResponse.duration = route.duration;
    scheduleResponse.price = route.price;
    scheduleResponse.carLicensePlate = car.licensePlate;
    return scheduleResponse;
  }

  async findAll(
    searchSchedulesDto: SearchSchedulesDto,
  ): Promise<ScheduleResponseDto[]> {
    const {
      startLocation,
      endLocation,
      carLicensePlate,
      includeDeleted = false,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = 'asc',
    } = searchSchedulesDto;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const schedules = await this.scheduleModel
      .find(query)
      .populate({
        path: 'routeId',
        match: {
          isDeleted: false,
          ...(startLocation && {
            startLocation: new RegExp(startLocation, 'i'),
          }),
          ...(endLocation && { endLocation: new RegExp(endLocation, 'i') }),
        },
        select: 'startLocation endLocation duration price',
      })
      .populate({
        path: 'carId',
        match: {
          isDeleted: false,
          ...(carLicensePlate && {
            licensePlate: new RegExp(carLicensePlate, 'i'),
          }),
        },
        select: 'licensePlate',
      })
      .skip(skip)
      .limit(limit)
      .sort(
        sortBy
          ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
          : { createdAt: -1 },
      )
      .exec();

    return schedules
      .filter((schedule) => schedule.routeId && schedule.carId)
      .map((schedule) => {
        const scheduleResponse = plainToClass(
          ScheduleResponseDto,
          schedule.toObject(),
        );

        return scheduleResponse;
      });
  }

  async findOne(id: string): Promise<ScheduleResponseDto> {
    const schedule = await this.scheduleModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: 'routeId',
        match: { isDeleted: false },
        select: 'startLocation endLocation duration price',
      })
      .populate({
        path: 'carId',
        match: { isDeleted: false },
        select: 'licensePlate',
      })
      .exec();
    if (!schedule || !schedule.routeId || !schedule.carId) {
      throw new NotFoundException(`Không tìm thấy lịch trình với ID ${id}`);
    }
    return plainToClass(ScheduleResponseDto, schedule.toObject());
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    // Validate Route if provided
    if (updateScheduleDto.routeId) {
      const route = await this.routeModel
        .findOne({ _id: updateScheduleDto.routeId, isDeleted: false })
        .exec();
      if (!route) {
        throw new NotFoundException(
          `Không tìm thấy tuyến đường với ID ${updateScheduleDto.routeId}`,
        );
      }
    }

    // Validate Car if provided
    if (updateScheduleDto.carId) {
      const car = await this.carModel
        .findOne({ _id: updateScheduleDto.carId, isDeleted: false })
        .exec();
      if (!car) {
        throw new NotFoundException(
          `Không tìm thấy xe với ID ${updateScheduleDto.carId}`,
        );
      }
    }

    // Validate departureTime format if provided
    if (updateScheduleDto.departureTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(updateScheduleDto.departureTime)) {
        throw new BadRequestException('Giờ khởi hành phải có định dạng HH:mm');
      }
    }

    const updatedSchedule = await this.scheduleModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateScheduleDto, {
        new: true,
        runValidators: true,
      })
      .populate({
        path: 'routeId',
        match: { isDeleted: false },
        select: 'startLocation endLocation duration price',
      })
      .populate({
        path: 'carId',
        match: { isDeleted: false },
        select: 'licensePlate',
      })
      .exec();

    if (
      !updatedSchedule ||
      !updatedSchedule.routeId ||
      !updatedSchedule.carId
    ) {
      throw new NotFoundException(`Không tìm thấy lịch trình với ID ${id}`);
    }

    return plainToClass(ScheduleResponseDto, updatedSchedule.toObject());
  }

  async remove(id: string): Promise<void> {
    // Check if schedule is used in active trips
    const activeTrips = await this.tripModel
      .findOne({ scheduleId: id, isDeleted: false })
      .exec();
    if (activeTrips) {
      throw new BadRequestException(
        'Lịch trình đang được sử dụng trong một chuyến đi!',
      );
    }

    const result = await this.scheduleModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!result) {
      throw new NotFoundException(`Không tìm thấy lịch trình với ID ${id}`);
    }
  }
}
