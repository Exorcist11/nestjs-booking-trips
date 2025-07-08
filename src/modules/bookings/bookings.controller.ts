import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/response-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một booking mới' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 201,
    description: 'Booking được tạo thành công',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Chuyến đi hoặc xe không tồn tại' })
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.bookingService.createBooking(createBookingDto);
  }
}
