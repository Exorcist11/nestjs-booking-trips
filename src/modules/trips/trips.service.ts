import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip, TripDocument } from './schema/trip.schema';
import { Car, CarDocument } from '../cars/schema/car.schema';
import { Route, RouteDocument } from '../route/schema/route.schema';
import { Schedule, ScheduleDocument } from '../schedule/schema/schedule.schema';
import { SearchTripDto } from './dto/search-trip.dto';
import { TripResponseDto } from './dto/response-trip.dto';
import { plainToClass } from 'class-transformer';
import { PlainCar } from './interface/car.interface';

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
    const schedule = await this.scheduleModel
      .findOne({
        _id: scheduleId,
        isActive: true,
        isDeleted: false,
      })
      .populate('routeId')
      .populate('carId')
      .exec();
    if (!schedule) {
      throw new NotFoundException(`Lịch trình không tồn tại`);
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const existingTrip = await this.tripModel
      .findOne({
        template: schedule._id,
        date: targetDate,
      })
      .exec();

    if (existingTrip) return existingTrip;

    const car = await this.carModel
      .findOne({ _id: schedule.carId, isDeleted: false })
      .exec();
    if (!car) throw new NotFoundException(`Xe không tồn tại`);

    const trip = await this.tripModel.create({
      template: schedule._id,
      date: targetDate,
      availableSeats: car.seats,
      bookedSeats: [],
      status: 'schedule',
      note: `Chuyến đi tạo cho ngày ${date}`,
    });
    return trip;
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

    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const normalizeString = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const routes = await this.routeModel
      .find({
        ...(startLocation && {
          startLocation: {
            $regex: normalizeString(startLocation),
            $options: 'i',
          },
        }),
        ...(endLocation && {
          endLocation: {
            $regex: normalizeString(endLocation),
            $options: 'i',
          },
        }),
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
      if (schedule.frequency === 'custom') {
        return true; // Thêm logic cho custom nếu cần
      }
      return false;
    });

    const scheduleIds = validSchedules.map((schedule) => schedule._id);
    const trips = await this.tripModel
      .find({
        template: { $in: scheduleIds },
        date: { $gte: targetDate, $lte: endOfDay },
        status: { $ne: 'cancelled' },
      })
      .select(
        'template date bookedSeats availableSeats status actualDepartureTime actualArrivalTime note createdAt updatedAt',
      )
      .lean();

    const virtualTrips: TripResponseDto[] = validSchedules
      .filter(
        (schedule) =>
          !trips.some(
            (trip) => trip.template.toString() === schedule._id.toString(),
          ),
      )
      .map((schedule) => {
        const route = routes.find(
          (r) => r._id.toString() === schedule.routeId.toString(),
        );
        const car = schedule.carId as unknown as PlainCar | null;

        return plainToClass(TripResponseDto, {
          id: `virtual-${schedule._id}-${date}`,
          template: schedule._id.toString(),
          date: targetDate.toISOString(),
          bookedSeats: [],
          availableSeats: car.seats,
          status: 'scheduled',
          actualDepartureTime: null,
          actualArrivalTime: null,
          note: `Chuyến đi ảo cho ngày ${date}`,
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

    const realTrips: TripResponseDto[] = trips.map((trip) => {
      const schedule = validSchedules.find(
        (s) => s._id.toString() === trip.template.toString(),
      );
      const route = routes.find(
        (r) => r._id.toString() === schedule?.routeId.toString(),
      );
      const car = schedule?.carId as unknown as PlainCar | null; // Ép kiểu an toàn
      const totalSeats = car?.seats || 40;
      const bookedSeats = trip.bookedSeats || [];
      const availableSeatsList = Array.from(
        { length: totalSeats },
        (_, i) => `S${i + 1}`,
      ).filter((seat) => !bookedSeats.includes(seat));

      return plainToClass(TripResponseDto, {
        id: trip._id.toString(),
        template: trip.template.toString(),
        date: trip.date.toISOString(),
        bookedSeats: trip.bookedSeats,
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

    return [...realTrips, ...virtualTrips]
      .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      .slice(skip, skip + limit);
  }
}
