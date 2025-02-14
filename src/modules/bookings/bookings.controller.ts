import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({
    status: 200,
    description: 'Return all bookings.',
  })
  @ApiQuery({ name: 'phoneNumber', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'index', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async getAllBookings(
    @Query('phoneNumber') search?: string,
    @Query('limit') limit?: number,
    @Query('index') index?: number,
    @Query('order') order?: string,
    @Query('sort') sort?: string,
  ) {
    const data = await this.bookingService.getAllBookings(
      search,
      limit,
      index - 1,
      order,
      sort,
    );

    return {
      data,
      search,
      limit: limit || 10,
      index: index || 1,
      order,
      sort,
      total: data.length,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Confict' })
  async createTrip(@Body() trip: CreateBookingDto) {
    return await this.bookingService.bookSeats(trip);
  }
}
