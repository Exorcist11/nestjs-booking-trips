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
import { TripDetailsDto } from './dto/detail-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
  ) {}

  private isScheduleValidForDate(schedule: any, targetDate: Date): boolean {
    if (schedule.frequency === 'daily') return true;
    if (schedule.frequency === 'weekly') {
      const scheduleDay = new Date(schedule.createdAt).getDay();
      return targetDate.getDay() === scheduleDay;
    }
    if (schedule.frequency === 'custom') return true;
    return false;
  }

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
        select: 'licensePlate seatingCapacity seats mainDriver phoneNumber',
      })
      .select('_id departureTime routeId carId frequency createdAt ')
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
              phoneNumber: car.phoneNumber,
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
                phoneNumber: car.phoneNumber,
              }
            : null,
        });
      });

    return [...realTrips, ...virtualTrips]
      .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      .slice(skip, skip + limit);
  }

  async getTripDetails(tripId: string): Promise<TripDetailsDto> {
    if (tripId.startsWith('virtual-')) {
      const [, scheduleId, dateStr] = tripId.split('-', 3);
      const targetDate = new Date(dateStr);
      if (isNaN(targetDate.getTime())) {
        throw new NotFoundException('Lịch trình không tồn tại');
      }

      // Fetch schedule with populated route and car
      const schedule = await this.scheduleModel
        .findById(scheduleId)
        .populate<{ routeId: RouteDocument; carId: CarDocument }>([
          { path: 'routeId', model: 'Route', match: { isDeleted: false } },
          { path: 'carId', model: 'Car', match: { isDeleted: false } },
        ])
        .lean()
        .exec();

      if (!schedule || !schedule.routeId || !schedule.carId) {
        throw new NotFoundException(
          'Không tìm thấy lịch trình hoặc dữ liệu liên quan',
        );
      }

      // Validate schedule frequency
      const isValidSchedule = this.isScheduleValidForDate(schedule, targetDate);
      if (!isValidSchedule) {
        throw new NotFoundException(
          'Lịch trình không hợp lệ vào ngày đã chỉ định',
        );
      }

      // Check for conflicting real trips
      const conflictingTrip = await this.tripModel
        .findOne({
          template: schedule._id,
          date: {
            $gte: new Date(
              targetDate.getFullYear(),
              targetDate.getMonth(),
              targetDate.getDate(),
              0,
              0,
              0,
            ),
            $lt: new Date(
              targetDate.getFullYear(),
              targetDate.getMonth(),
              targetDate.getDate(),
              23,
              59,
              59,
              999,
            ),
          },
          status: { $ne: 'cancelled' },
        })
        .lean()
        .exec();

      if (conflictingTrip) {
        throw new NotFoundException(
          'Có một chuyến đi thực tế cho lịch trình và ngày này',
        );
      }

      const seats = schedule.carId.seats.map((seatId: string) => ({
        id: seatId,
        isBooked: false,
      }));

      return plainToClass(TripDetailsDto, {
        tripId,
        startLocation: schedule.routeId.startLocation,
        endLocation: schedule.routeId.endLocation,
        departureTime: schedule.departureTime,
        date: targetDate.toISOString(),
        duration: schedule.routeId.duration,
        price: schedule.routeId.price,
        status: 'scheduled',
        note: `Chuyến đi ảo cho ngày ${targetDate.toLocaleDateString('vi-VN')}`,
        availableSeats: schedule.carId.seatingCapacity,
        bookedSeats: [],
        seats,
        seatLayout: schedule.carId.seatLayout || 'Unknown',
        carInfo: {
          licensePlate: schedule.carId.licensePlate,
          mainDriver: schedule.carId.mainDriver,
          ticketCollector: schedule.carId.ticketCollector,
          phoneNumber: schedule.carId.phoneNumber,
          model: schedule.carId.model || 'Unknown',
          yearOfManufacture: schedule.carId.yearOfManufacture || null,
        },
        actualDepartureTime: null,
        actualArrivalTime: null,
      });
    }

    // Handle real trip
    const trip = await this.tripModel
      .findById(tripId)
      .populate<{
        template: ScheduleDocument & {
          routeId: RouteDocument;
          carId: CarDocument;
        };
      }>({
        path: 'template',
        model: 'Schedule',
        match: { isDeleted: false },
        populate: [
          { path: 'routeId', model: 'Route', match: { isDeleted: false } },
          { path: 'carId', model: 'Car', match: { isDeleted: false } },
        ],
      })
      .lean()
      .exec();

    if (
      !trip ||
      !trip.template ||
      !trip.template.routeId ||
      !trip.template.carId
    ) {
      throw new NotFoundException(
        'Không tìm thấy chuyến xe hoặc dữ liệu liên quan',
      );
    }

    const bookedSeats = trip.bookedSeats || [];
    const seats = trip.template.carId.seats.map((seatId: string) => ({
      id: seatId,
      isBooked: bookedSeats.includes(seatId),
    }));

    return plainToClass(TripDetailsDto, {
      tripId: trip._id.toString(),
      startLocation: trip.template.routeId.startLocation,
      endLocation: trip.template.routeId.endLocation,
      departureTime: trip.template.departureTime,
      date: trip.date.toISOString(),
      duration: trip.template.routeId.duration,
      price: trip.template.routeId.price,
      status: trip.status,
      note: trip.note || null,
      availableSeats: trip.template.carId.seatingCapacity - bookedSeats.length,
      bookedSeats,
      seats,
      seatLayout: trip.template.carId.seatLayout || 'Unknown',
      carInfo: {
        licensePlate: trip.template.carId.licensePlate,
        mainDriver: trip.template.carId.mainDriver,
        ticketCollector: trip.template.carId.ticketCollector,
        phoneNumber: trip.template.carId.phoneNumber,
        model: trip.template.carId.model || 'Unknown',
        yearOfManufacture: trip.template.carId.yearOfManufacture || null,
      },
      actualDepartureTime: trip.actualDepartureTime?.toISOString() || null,
      actualArrivalTime: trip.actualArrivalTime?.toISOString() || null,
    });
  }
}
