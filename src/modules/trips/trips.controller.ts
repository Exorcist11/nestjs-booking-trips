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
import { TripsService } from './trips.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateTripDto } from './dto/create-trip.dto';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
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
    const { data, total } = await this.tripsService.findAll(
      departure,
      destination,
      departureTime,
      limit,
      index,
      order,
      sort,
    );

    return {
      data,
      destination,
      departureTime,
      limit: limit || 10,
      index: index || 1,
      order,
      sort,
      total,
    };
  }

  @Get('/getTripById')
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateTripDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Success',
  })
  async getTripById(@Query('id') id: string) {
    return await this.tripsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Confict' })
  async createTrip(@Body() trip: CreateTripDto) {
    return await this.tripsService.create(trip);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a trip' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({
    status: 404,
    description: 'Success',
  })
  async deleteTrip(@Param('id') id: string) {
    return await this.tripsService.delelte(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a trip' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Success' })
  async updateTrip(
    @Param('id') id: string,
    @Body() updateTripDto: CreateTripDto,
  ) {
    return await this.tripsService.updateTrip(id, updateTripDto);
  }
}
