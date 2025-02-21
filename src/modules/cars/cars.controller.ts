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
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './schema/car.schema';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({
    status: 200,
    description: 'Return all cars.',
    type: [CreateCarDto],
  })
  @ApiQuery({ name: 'licensePlate', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'index', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async getAllCars(
    @Query('licensePlate') search?: string,
    @Query('limit') limit?: number,
    @Query('index') index?: number,
    @Query('order') order?: string,
    @Query('sort') sort?: string,
  ) {
    const { data, total } = await this.carsService.findAll(
      search,
      limit,
      index - 1,
      order,
      sort,
    );

    return {
      data,
      search,
      limit: Number(limit) || 10,
      index: Number(index) || 1,
      order,
      sort,
      total,
    };
  }

  @Get('/getCarById')
  @ApiOperation({ summary: 'Get car by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the car.',
    type: CreateCarDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Car not found.',
  })
  async getCarByLicensePlate(@Query('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({
    status: 201,
    description: 'The car has been successfully created.',
    type: Car,
  })
  @ApiResponse({
    status: 409,
    description: 'License plate already exists.',
  })
  async createNewCar(@Body() car: CreateCarDto) {
    return this.carsService.create(car);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a car' })
  @ApiResponse({
    status: 200,
    description: 'The car has been successfully deleted.',
    type: Car,
  })
  @ApiResponse({
    status: 404,
    description: 'Car not found.',
  })
  async deleteCar(@Param('id') id: string) {
    return this.carsService.delete(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update partial car details' })
  @ApiResponse({
    status: 200,
    description: 'The car details have been successfully updated.',
    type: Car,
  })
  @ApiResponse({
    status: 404,
    description: 'Car not found.',
  })
  async updatePartial(
    @Param('id') id: string,
    @Body() updateCarDto: CreateCarDto,
  ) {
    return this.carsService.update(id, updateCarDto);
  }
}
