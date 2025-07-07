import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './schema/car.schema';
import { CarResponseDto } from './dto/response-car.dto';
import { SearchCarsDto } from './dto/search-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo xe khách mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Xe khách được tạo thành công',
    type: CarResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async create(@Body() createCarDto: CreateCarDto): Promise<CarResponseDto> {
    return this.carsService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách xe khách' })
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
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description:
      'Trường để sắp xếp (licensePlate, seatingCapacity, status, yearOfManufacture)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Thứ tự sắp xếp (asc hoặc desc, mặc định: asc)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Từ khóa tìm kiếm (áp dụng cho licensePlate, mainDriver, ticketCollector, phoneNumber, model)',
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Lấy cả xe đã xóa mềm (true/false, mặc định: false)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách xe khách',
    type: [CarResponseDto],
  })
  async findAll(
    @Query() searchCarsDto: SearchCarsDto,
  ): Promise<CarResponseDto[]> {
    return this.carsService.findAll(searchCarsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin xe khách theo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID của xe khách',
    example: '65fa1c9e1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thông tin xe khách',
    type: CarResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy xe khách hoặc xe đã bị xóa',
  })
  async findOne(@Param('id') id: string): Promise<CarResponseDto> {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin xe khách' })
  @ApiParam({
    name: 'id',
    description: 'ID của xe khách',
    example: '65fa1c9e1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xe khách được cập nhật thành công',
    type: CarResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy xe khách hoặc xe đã bị xóa',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<CarResponseDto> {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa mềm một xe khách theo ID' })
  @ApiParam({ name: 'id', description: 'ID của xe cần xóa', type: String })
  @ApiResponse({ status: 204, description: 'Xóa mềm thành công' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy xe hoặc xe đã bị xóa',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.carsService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục xe khách đã xóa mềm' })
  @ApiParam({
    name: 'id',
    description: 'ID của xe khách',
    example: '65fa1c9e1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xe khách được khôi phục thành công',
    type: CarResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy xe khách hoặc xe chưa bị xóa',
  })
  async restore(@Param('id') id: string): Promise<CarResponseDto> {
    return this.carsService.restore(id);
  }
}
