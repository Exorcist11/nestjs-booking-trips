import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './schema/schedule.schema';
import { ScheduleResponseDto } from './dto/response-schedule.dto';
import { SearchSchedulesDto } from './dto/search-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo lịch trình mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lịch trình được tạo thành công',
    type: ScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lịch trình' })
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
    description: 'Trường để sắp xếp (departureTime)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Thứ tự sắp xếp (asc hoặc desc, mặc định: asc)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách lịch trình',
    type: [ScheduleResponseDto],
  })
  async findAll(
    @Query() searchScheduleDto: SearchSchedulesDto,
  ): Promise<ScheduleResponseDto[]> {
    return this.scheduleService.findAll(searchScheduleDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin lịch trình theo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID của lịch trình',
    example: '65fa1c9e1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thông tin lịch trình',
    type: ScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy lịch trình',
  })
  async findOne(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return this.scheduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lịch trình' })
  @ApiParam({
    name: 'id',
    description: 'ID của lịch trình',
    example: '686b769942785df2e9cc4eb6',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lịch trình được cập nhật thành công',
    type: ScheduleResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa mềm lịch trình' })
  @ApiParam({
    name: 'id',
    description: 'ID của lịch trình',
    example: '686b769942785df2e9cc4eb6',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lịch trình được xóa mềm thành công',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.scheduleService.remove(id);
  }
}
