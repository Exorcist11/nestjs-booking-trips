import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip, TripDocument } from './schema/trip.schema';
import { Car, CarDocument } from '../cars/schema/car.schema';
import { Route, RouteDocument } from '../route/schema/route.schema';
import { Schedule, ScheduleDocument } from '../schedule/schema/schedule.schema';
import { SearchTripDto } from './dto/search-trip.dto';
import { TripResponseDto } from './dto/response-trip.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
  ) {}

  async createTripForDate(
    scheduleId: string,
    date: string,
  ): Promise<TripDocument> {
    // Chuẩn hóa ngày
    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Kiểm tra lịch trình
    const schedule = await this.scheduleModel
      .findOne({ _id: scheduleId, isActive: true, isDeleted: false })
      .populate({
        path: 'carId',
        select: 'seats licensePlate seatingCapacity',
        match: { isDeleted: false },
      })
      .exec();

    if (!schedule || !schedule.carId) {
      throw new NotFoundException('Lịch trình hoặc xe không tồn tại');
    }

    // Kiểm tra tần suất
    if (schedule.frequency === 'weekly') {
      const scheduleDay = new Date(schedule.createdAt).getDay();
      const targetDay = targetDate.getDay();
      if (scheduleDay !== targetDay) {
        throw new BadRequestException(
          'Lịch trình không hoạt động vào ngày này',
        );
      }
    }

    // Kiểm tra xem Trip đã tồn tại
    let trip = await this.tripModel
      .findOne({
        template: scheduleId,
        date: { $gte: targetDate, $lte: endOfDay },
        isDeleted: false,
      })
      .exec();

    if (trip) {
      return trip;
    }

    // Lấy thông tin xe
    const car = schedule.carId as unknown as CarDocument;
    const totalSeats = car.seats?.length || 0;

    if (totalSeats === 0) {
      throw new BadRequestException('Xe không có danh sách ghế hợp lệ');
    }

    // Tạo Trip mới
    trip = new this.tripModel({
      template: scheduleId,
      date: targetDate,
      bookedSeats: [],
      availableSeats: totalSeats,
      status: 'scheduled',
      isDeleted: false,
    });

    return trip.save();
  }

  async findDaily(searchTripsDto: SearchTripDto): Promise<TripResponseDto[]> {
    const {
      date,
      startLocation,
      endLocation,
      page = 1,
      limit = 10,
    } = searchTripsDto;
    const skip = (page - 1) * limit;

    const inputDate = new Date(date);
    const targetDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const routes = await this.routeModel
      .find({
        ...(startLocation && { startLocation: new RegExp(startLocation, 'i') }),
        ...(endLocation && { endLocation: new RegExp(endLocation, 'i') }),
        isDeleted: false,
      })
      .select('_id price startLocation endLocation duration')
      .lean();

    if (!routes.length) return [];

    const routeIds = routes.map((route) => route._id.toString());

    const schedules = await this.scheduleModel
      .find({
        routeId: { $in: routeIds },
        isActive: true,
        isDeleted: false,
      })
      .populate({
        path: 'carId',
        match: { isDeleted: false },
        select: 'licensePlate seatingCapacity seats mainDriver',
      })
      .select('_id departureTime routeId carId frequency createdAt')
      .lean();

    if (!schedules.length) return [];

    const validSchedules = schedules.filter((schedule) => {
      if (schedule.frequency === 'daily') return true;
      if (schedule.frequency === 'weekly') {
        const scheduleDay = new Date(schedule.createdAt).getDay();
        return targetDate.getDay() === scheduleDay;
      }
      if (schedule.frequency === 'custom') return true;
      return false;
    });

    const scheduleIds = validSchedules.map((schedule) => schedule._id);

    const trips = await this.tripModel
      .find({
        template: { $in: scheduleIds },
        date: {
          $gte: targetDate,
          $lt: endOfDay,
        },
        status: { $ne: 'cancelled' },
      })
      .select(
        'template date bookedSeats availableSeats status actualDepartureTime actualArrivalTime note createdAt updatedAt',
      )
      .lean();

    // Map để tra cứu nhanh template
    const tripsByTemplate = new Map<string, any>();
    trips.forEach((trip) => {
      tripsByTemplate.set(trip.template.toString(), trip);
    });

    // Tập hợp các key carId-departureTime-date để loại virtual trùng
    const realTripKeys = new Set(
      trips.map((trip) => {
        const schedule = validSchedules.find(
          (s) => s._id.toString() === trip.template.toString(),
        );
        const carId = (schedule?.carId as any)?._id?.toString();
        return `${carId}-${schedule?.departureTime}`;
      }),
    );

    // Chuẩn bị dữ liệu cho realTrips
    const realTrips: TripResponseDto[] = trips.map((trip) => {
      const schedule = validSchedules.find(
        (s) => s._id.toString() === trip.template.toString(),
      );
      const route = routes.find(
        (r) => r._id.toString() === schedule?.routeId.toString(),
      );
      const car = schedule?.carId as unknown as CarDocument | null;

      const validSeats = car?.seats || [];
      const bookedSeats = trip.bookedSeats || [];
      const availableSeatsList = validSeats.filter(
        (seat) => !bookedSeats.includes(seat),
      );

      return plainToClass(TripResponseDto, {
        id: trip._id.toString(),
        template: trip.template.toString(),
        date: trip.date.toISOString(),
        bookedSeats: bookedSeats,
        availableSeats: availableSeatsList,
        status: trip.status,
        actualDepartureTime: trip.actualDepartureTime?.toISOString(),
        actualArrivalTime: trip.actualArrivalTime?.toISOString(),
        note: trip.note,
        createdAt: trip.createdAt.toISOString(),
        updatedAt: trip.updatedAt.toISOString(),
        startLocation: route?.startLocation,
        endLocation: route?.endLocation,
        duration: route?.duration,
        price: route?.price,
        departureTime: schedule?.departureTime,
        car: car
          ? {
              licensePlate: car.licensePlate,
              seatingCapacity: car.seatingCapacity,
              seats: car.seats,
              mainDriver: car.mainDriver,
            }
          : null,
      });
    });

    // Generate virtual trips, excluding those that conflict with real trips
    const virtualTrips: TripResponseDto[] = validSchedules
      .filter((schedule) => {
        const scheduleIdStr = schedule._id.toString();
        const carId = (schedule.carId as any)?._id?.toString();
        const key = `${carId}-${schedule.departureTime}`;

        return !tripsByTemplate.has(scheduleIdStr) && !realTripKeys.has(key);
      })
      .map((schedule) => {
        const route = routes.find(
          (r) => r._id.toString() === schedule.routeId.toString(),
        );
        const car = schedule.carId as unknown as CarDocument | null;

        return plainToClass(TripResponseDto, {
          id: `virtual-${schedule._id}-${targetDate.toISOString()}`,
          template: schedule._id.toString(),
          date: targetDate.toISOString(),
          bookedSeats: [],
          availableSeats: car?.seats || [],
          status: 'scheduled',
          actualDepartureTime: null,
          actualArrivalTime: null,
          note: `Chuyến đi ảo cho ngày ${targetDate.toLocaleDateString('vi-VN')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          startLocation: route?.startLocation,
          endLocation: route?.endLocation,
          duration: route?.duration,
          price: route?.price,
          departureTime: schedule.departureTime,
          car: car
            ? {
                licensePlate: car.licensePlate,
                seatingCapacity: car.seatingCapacity,
                seats: car.seats,
                mainDriver: car.mainDriver,
              }
            : null,
        });
      });

    return [...realTrips, ...virtualTrips]
      .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      .slice(skip, skip + limit);
  }
}
