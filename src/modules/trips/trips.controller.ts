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
  @ApiQuery({ name: 'destination', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'index', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'sort', required: false })
  getAllTrips(
    @Query('destination') search?: string,
    @Query('limit') limit?: number,
    @Query('index') index?: number,
    @Query('order') order?: string,
    @Query('sort') sort?: string,
  ) {
    const data = this.tripsService.findAll(
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
  getTripById(@Query('id') id: string) {
    return this.tripsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Confict' })
  async createTrip(@Body() trip: CreateTripDto) {
    return this.tripsService.create(trip);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a trip' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({
    status: 404,
    description: 'Success',
  })
  deleteTrip(@Param('id') id: string) {
    return this.tripsService.delelte(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a trip' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Success' })
  async updateTrip(
    @Param('id') id: string,
    @Body() updateTripDto: CreateTripDto,
  ) {
    return this.tripsService.updateTrip(id, updateTripDto);
  }
}
