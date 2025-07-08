import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TripResponseDto } from './dto/response-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Lấy danh sách chuyến đi trong ngày chỉ định' })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Ngày đi (định dạng ISO, ví dụ: 2025-07-15)',
  })
  @ApiQuery({
    name: 'startLocation',
    required: false,
    type: String,
    description: 'Điểm xuất phát (ví dụ: Hanoi)',
  })
  @ApiQuery({
    name: 'endLocation',
    required: false,
    type: String,
    description: 'Điểm đến (ví dụ: Ho Chi Minh)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Số trang (mặc định: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số bản ghi mỗi trang (mặc định: 10)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách chuyến đi (thực tế và ảo)',
    type: [TripResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Tham số không hợp lệ',
  })
  async findDaily(
    @Query() searchTripsDto: SearchTripDto,
  ): Promise<TripResponseDto[]> {
    return this.tripsService.findDaily(searchTripsDto);
  }
}
