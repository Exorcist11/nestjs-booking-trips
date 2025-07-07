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
import { CreateBookingDto } from './dto/create-booking.dto';
import { Schedule, ScheduleDocument } from '../schedule/schema/schedule.schema';
import { Car, CarDocument } from '../cars/schema/car.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
  ) {}

  async checkAvailableSeats(
    tripId: string,
    requestSeats: string[],
  ): Promise<boolean> {
    const trip = await this.tripModel.findById(tripId);
    if (!trip) throw new NotFoundException('Trip not found');

    const bookedSeats = trip.bookedSeats;

    const isAvailable = requestSeats.every(
      (seat) => !bookedSeats.includes(seat),
    );

    return isAvailable;
  }

  async bookSeats(booking: CreateBookingDto): Promise<Booking> {
    return;
    // const { tripID, seats, userID, bookingDate, phoneNumber, customerName } =
    //   booking;

    // let tripExists = await this.tripModel
    //   .findOne({ template: tripID, date: bookingDate })
    //   .exec();

    // const tripSchedule = await this.scheduleModel.findById(tripID).exec();
    // if (!tripSchedule) throw new NotFoundException('Schedule not found');

    // const price = tripSchedule.price;

    // // Nếu không tìm thấy chuyến đi -> Tạo mới
    // if (!tripExists) {
    //   const car = await this.carModel.findById(tripSchedule.car).exec();
    //   if (!car) throw new NotFoundException('Car not found');

    //   tripExists = new this.tripModel({
    //     template: tripID,
    //     date: bookingDate,
    //     bookedSeats: [],
    //     availableSeats: car.seatingCapacity,
    //   });

    //   await tripExists.save(); // 🔥 Lưu lại để tránh `null`
    // }

    // // 🔥 Kiểm tra lại nếu `tripExists` vẫn null
    // if (!tripExists)
    //   throw new InternalServerErrorException(
    //     'Failed to create or retrieve trip',
    //   );

    // // Kiểm tra ghế còn trống
    // const isAvailable = seats.every(
    //   (seat) => !tripExists.bookedSeats.includes(seat),
    // );
    // if (!isAvailable)
    //   throw new BadRequestException('Some seats are already booked');

    // // Xác định thông tin khách hàng
    // let isGuest = true;
    // let finalCustomerName = customerName;
    // let finalPhoneNumber = phoneNumber;

    // if (userID) {
    //   isGuest = false;
    //   const user = await this.userModel.findById(userID);
    //   if (!user) throw new NotFoundException('User not found');

    //   finalCustomerName = user.fullName;
    //   finalPhoneNumber = user.phoneNumber;
    // }

    // // Tạo booking
    // const newBooking = new this.bookingModel({
    //   trip: tripExists._id,
    //   user: userID || null,
    //   customerName: finalCustomerName,
    //   phoneNumber: finalPhoneNumber,
    //   seats,
    //   totalPrice: price * seats.length,
    //   isGuest,
    //   isPaid: false,
    //   bookingDate: bookingDate || new Date(),
    // });

    // tripExists.bookedSeats.push(...seats);
    // tripExists.availableSeats -= seats.length;

    // await tripExists.save();

    // return await newBooking.save();
  }

  async getAllBookings(
    search?: string,
    limit = 10,
    index = 0,
    order = 'asc',
    sort = 'fullName',
  ): Promise<Booking[]> {
    const filter = search
      ? { phoneNumber: { $regex: search, $options: 'i' } }
      : {};

    const sortOrder = order === 'asc' ? 1 : -1;

    return this.bookingModel
      .find(filter)
      .sort({ [sort]: sortOrder })
      .skip(index)
      .limit(limit)
      .populate('trip')
      .exec();
  }
}
