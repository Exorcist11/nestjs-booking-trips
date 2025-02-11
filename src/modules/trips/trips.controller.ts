import { Body, Controller, Get, Post } from '@nestjs/common';
import { TripsService } from './trips.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
  getAllTrips() {
    return this.tripsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  async createTrip(@Body() trip: CreateTripDto) {
    return this.tripsService.create(trip);
  }
}
