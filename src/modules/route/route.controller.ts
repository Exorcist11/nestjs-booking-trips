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
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route } from './schema/route.schema';
import { RouteResponseDto } from './dto/response-route.dto';
import { SearchRouteDto } from './dto/search-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@ApiTags('Route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo tuyến đường mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tuyến đường được tạo thành công',
    type: RouteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async create(
    @Body() createRouteDto: CreateRouteDto,
  ): Promise<RouteResponseDto> {
    return this.routeService.create(createRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tuyến đường' })
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
      'Trường để sắp xếp (departure, destination, distance, estimatedDuration, direction, isActive)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Thứ tự sắp xếp (asc hoặc desc, mặc định: asc)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách tuyến đường',
    type: [RouteResponseDto],
  })
  async findAll(
    @Query() searchRouteDto: SearchRouteDto,
  ): Promise<RouteResponseDto[]> {
    return this.routeService.findAll(searchRouteDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin tuyến đường theo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID của tuyến đường',
    example: '65fa1c9e1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thông tin tuyến đường',
    type: RouteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy tuyến đường',
  })
  async findOne(@Param('id') id: string): Promise<RouteResponseDto> {
    return this.routeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin tuyến đường' })
  @ApiParam({
    name: 'id',
    description: 'ID của tuyến đường',
    example: '65fa1c9e1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tuyến đường được cập nhật thành công',
    type: RouteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy tuyến đường',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateRouteDto,
  ): Promise<RouteResponseDto> {
    return this.routeService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa mềm một tuyến đường theo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID của tuyến đường cần xóa',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Xóa mềm thành công' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tuyến đường hoặc tuyến đường đã bị xóa',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.routeService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục tuyến đường đã xóa mềm' })
  @ApiParam({
    name: 'id',
    description: 'ID của tuyến đường',
    example: '65fa1c9e1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tuyến đường được khôi phục thành công',
    type: RouteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy tuyến đường hoặc tuyến đường chưa bị xóa',
  })
  async restore(@Param('id') id: string): Promise<RouteResponseDto> {
    return this.routeService.restore(id);
  }
}
