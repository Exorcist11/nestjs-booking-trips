import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TripScheduleService } from './trip-schedule.service';
import { CreateTripScheduleDto } from './dto/tripSchedule.dto';
import { TripSchedule } from './schema/tripSchedule.schema';

@ApiTags('TripSchedule')
@Controller('tripSchedule')
export class TripScheduleController {
  constructor(private readonly TripScheduleService: TripScheduleService) {}

  @Post('/createTripSchedule')
  @ApiOperation({ summary: 'Create a new trip schedule' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createTripSchedule(@Body() tripSchedule: CreateTripScheduleDto) {
    return await this.TripScheduleService.createTripSchedule(tripSchedule);
  }

  @Get('/getAllTripSchedules')
  @ApiOperation({ summary: 'Get all trips schedule' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiQuery({ name: 'departure', required: false })
  @ApiQuery({ name: 'destination', required: false })
  @ApiQuery({ name: 'departureTime', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'index', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async getAllTrips(
    @Query('departure') departure?: string,
    @Query('destination') destination?: string,
    @Query('departureTime') departureTime?: Date,
    @Query('limit') limit?: number,
    @Query('index') index?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('sort') sort?: string,
  ) {
    const { data, total } = await this.TripScheduleService.findAll(
      departure,
      destination,
      departureTime,
      limit,
      index - 1,
      order,
      sort,
    );

    return {
      data,
      destination,
      departureTime,
      limit: Number(limit) || 10,
      index: Number(index) || 1,
      order,
      sort,
      total,
    };
  }

  @Get('/getScheduleById')
  @ApiOperation({ summary: 'Get schedule by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the schedule.',
    type: CreateTripScheduleDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found.',
  })
  async getScheduleById(@Query('id') id: string) {
    return await this.TripScheduleService.findById(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiResponse({
    status: 200,
    description: 'The schedule has been successfully deleted.',
    type: TripSchedule,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found.',
  })
  async deleteSchedule(@Param('id') id: string) {
    return this.TripScheduleService.delete(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update partial schedule details' })
  @ApiResponse({
    status: 200,
    description: 'The schedule details have been successfully updated.',
    type: TripSchedule,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found.',
  })
  async updatePartial(
    @Param('id') id: string,
    @Body() updateSchedule: CreateTripScheduleDto,
  ) {
    return this.TripScheduleService.update(id, updateSchedule);
  }
}
