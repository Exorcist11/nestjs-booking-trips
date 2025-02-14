import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './schema/booking.schema';
import { Model } from 'mongoose';
import { Trip, TripDocument } from '../trips/schema/trip.schema';
import { User, UserDocument } from '../users/schema/user.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    const trip = await this.tripModel.findById(booking.tripId).exec();
    if (!trip) throw new NotFoundException('Trip not found');

    const isAvailable = await this.checkAvailableSeats(
      booking.tripId,
      booking.seats,
    );
    if (!isAvailable)
      throw new BadRequestException('Some seats are already booked');

    let user = null;
    if (booking.userId) {
      user = await this.userModel.findById(booking.userId).exec();
      if (!user) throw new NotFoundException('User not found');
      booking.customerName = user.fullName;
      booking.phoneNumber = user.phoneNumber;
    }
    const totalPrice = trip.price * booking.seats.length;

    const newBooking = new this.bookingModel({
      ...booking,
      trip: booking.tripId,
      user: user ? user._id : null,
      totalPrice: totalPrice,
      isGuest: !user,
    });

    await newBooking.save();

    trip.bookedSeats.push(...booking.seats);
    trip.availableSeats -= booking.seats.length;

    await trip.save();

    return newBooking;
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
