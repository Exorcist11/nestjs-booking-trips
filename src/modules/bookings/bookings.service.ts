import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './schema/booking.schema';
import { Model } from 'mongoose';
import { Trip, TripDocument } from '../trips/schema/trip.schema';
import { User, UserDocument } from '../users/schema/user.schema';
import { Schedule, ScheduleDocument } from '../schedule/schema/schedule.schema';
import { Car, CarDocument } from '../cars/schema/car.schema';
import { Route, RouteDocument } from '../route/schema/route.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/response-booking.dto';
import { plainToClass } from 'class-transformer';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    private tripsService: TripsService,
  ) {}

  async createBooking(
    createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const {
      scheduleId,
      date,
      seats,
      totalPrice,
      pickupPoint,
      dropOffPoint,
      customerName,
      phoneNumber,
      email,
      isGuest,
      status,
      paymentMethod,
      note,
      user,
      promotion,
    } = createBookingDto;

    // Chuẩn hóa ngày
    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Kiểm tra lịch trình
    const schedule = await this.scheduleModel
      .findOne({ _id: scheduleId, isActive: true, isDeleted: false })
      .populate([
        { path: 'routeId', select: 'price startLocation endLocation' },
        {
          path: 'carId',
          select: 'seats licensePlate seatingCapacity mainDriver',
          match: { isDeleted: false },
        },
      ])
      .exec();

    if (!schedule || !schedule.carId) {
      throw new NotFoundException('Lịch trình hoặc xe không tồn tại');
    }

    // Kiểm tra xem lịch trình có hợp lệ cho ngày đã chọn
    if (
      schedule.frequency === 'weekly' &&
      new Date(schedule.createdAt).getDay() !== targetDate.getDay()
    ) {
      throw new BadRequestException(
        'Lịch trình không hoạt động vào ngày đã chọn',
      );
    }

    // Tìm hoặc tạo Trip
    let tripDoc: TripDocument | null = await this.tripModel
      .findOne({
        template: scheduleId,
        date: { $gte: targetDate, $lte: endOfDay },
        isDeleted: false,
      })
      .exec();

    if (!tripDoc) {
      tripDoc = await this.tripsService.createTripForDate(
        scheduleId.toString(),
        date,
      );
      if (!tripDoc) {
        throw new NotFoundException('Không thể tạo chuyến đi cho ngày này');
      }
    }

    // Lấy thông tin xe
    const car = schedule.carId as unknown as CarDocument;
    const validSeats = car.seats || [];
    const totalSeats = validSeats.length;

    // Validate ghế
    const newSeats = [...new Set(seats)]; // Loại bỏ ghế trùng lặp
    const invalidSeats = newSeats.filter((seat) => !validSeats.includes(seat));
    if (invalidSeats.length > 0) {
      throw new BadRequestException(
        `Các ghế không hợp lệ: ${invalidSeats.join(', ')}`,
      );
    }

    // Kiểm tra ghế đã được đặt
    const bookedSeats = tripDoc.bookedSeats || [];
    const alreadyBookedSeats = newSeats.filter((seat) =>
      bookedSeats.includes(seat),
    );
    if (alreadyBookedSeats.length > 0) {
      throw new BadRequestException(
        `Các ghế sau đã được đặt: ${alreadyBookedSeats.join(', ')}`,
      );
    }

    // Kiểm tra số ghế trống
    const availableSeatsCount =
      tripDoc.availableSeats !== undefined
        ? tripDoc.availableSeats
        : totalSeats;
    if (newSeats.length > availableSeatsCount) {
      throw new BadRequestException(
        `Không đủ ghế trống. Còn lại: ${availableSeatsCount} ghế`,
      );
    }

    // Tính giá vé
    const route = schedule.routeId as unknown as RouteDocument;
    const ticketPrice = route?.price || 0;
    const expectedTotalPrice = newSeats.length * ticketPrice;

    if (totalPrice !== expectedTotalPrice) {
      throw new BadRequestException(
        `Tổng giá không hợp lệ. Dự kiến: ${expectedTotalPrice} VNĐ cho ${newSeats.length} ghế`,
      );
    }

    // Cập nhật Trip
    const updatedTrip = await this.tripModel
      .findByIdAndUpdate(
        tripDoc._id,
        {
          $addToSet: { bookedSeats: { $each: newSeats } },
          availableSeats: availableSeatsCount - newSeats.length,
        },
        { new: true },
      )
      .exec();

    if (!updatedTrip) {
      throw new NotFoundException('Không thể cập nhật chuyến đi');
    }

    // Tạo Booking
    const booking = new this.bookingModel({
      trip: tripDoc._id,
      user: isGuest ? null : user,
      promotion,
      customerName,
      phoneNumber,
      email,
      seats: newSeats,
      pickupPoint,
      dropOffPoint,
      totalPrice,
      isGuest: isGuest || true,
      status: status || 'pending',
      paymentMethod: paymentMethod || 'cash',
      note,
      createdBy: user || null,
    });

    const savedBooking = await booking.save();

    // Trả về BookingResponseDto
    return plainToClass(BookingResponseDto, {
      id: savedBooking._id.toString(),
      trip: savedBooking.trip.toString(),
      user: savedBooking.user?.toString(),
      promotion: savedBooking.promotion?.toString(),
      customerName: savedBooking.customerName,
      phoneNumber: savedBooking.phoneNumber,
      email: savedBooking.email,
      seats: savedBooking.seats,
      pickupPoint: savedBooking.pickupPoint,
      dropOffPoint: savedBooking.dropOffPoint,
      totalPrice: savedBooking.totalPrice,
      isGuest: savedBooking.isGuest,
      bookingDate: date,
      status: savedBooking.status,
      isPaid: savedBooking.isPaid,
      paymentMethod: savedBooking.paymentMethod,
      note: savedBooking.note,
      createdAt: savedBooking.createdAt.toISOString(),
      updatedAt: savedBooking.updatedAt.toISOString(),
    });
  }
}
