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
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './schema/schedule.schema';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('/createSchedule')
  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createRoute(@Body() schedule: CreateScheduleDto) {
    return await this.scheduleService.createSchedule(schedule);
  }

  @Get('/getAllSchedule')
  @ApiOperation({ summary: 'Get all schedule' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiQuery({ name: 'car', required: false })
  @ApiQuery({ name: 'route', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'index', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async getAllSchedule(
    @Query('car') car?: string,
    @Query('route') route?: string,
    @Query('limit') limit?: number,
    @Query('index') index?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('sort') sort?: string,
  ) {
    const { data, total } = await this.scheduleService.findAll(
      car,
      route,
      limit,
      index - 1,
      order,
      sort,
    );

    return {
      data,
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
    type: CreateScheduleDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found.',
  })
  async getScheduleById(@Query('id') id: string) {
    return await this.scheduleService.findById(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiResponse({
    status: 200,
    description: 'The schedule has been successfully deleted.',
    type: Schedule,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found.',
  })
  async deleteSchedule(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update partial schedule details' })
  @ApiResponse({
    status: 200,
    description: 'The schedule details have been successfully updated.',
    type: Schedule,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found.',
  })
  async updatePartial(
    @Param('id') id: string,
    @Body() updateSchedule: CreateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateSchedule);
  }
}
