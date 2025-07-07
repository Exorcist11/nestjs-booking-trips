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
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route } from './schema/route.schema';

@ApiTags('Route')
@Controller('route')
export class RouteController {
  constructor(private readonly RouteService: RouteService) {}

  @Post('/createRoute')
  @ApiOperation({ summary: 'Create a new routee' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createRoute(@Body() route: CreateRouteDto) {
    return await this.RouteService.createRoute(route);
  }

  @Get('/getAllRoute')
  @ApiOperation({ summary: 'Get all route' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiQuery({ name: 'departure', required: false })
  @ApiQuery({ name: 'destination', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'index', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async getAllRoute(
    @Query('departure') departure?: string,
    @Query('destination') destination?: string,
    @Query('limit') limit?: number,
    @Query('index') index?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('sort') sort?: string,
  ) {
    const { data, total } = await this.RouteService.findAll(
      departure,
      destination,
      limit,
      index - 1,
      order,
      sort,
    );

    return {
      data,
      destination,
      limit: Number(limit) || 10,
      index: Number(index) || 1,
      order,
      sort,
      total,
    };
  }

  @Get('/getRouteById')
  @ApiOperation({ summary: 'Get route by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the route.',
    type: CreateRouteDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Route not found.',
  })
  async getRouteById(@Query('id') id: string) {
    return await this.RouteService.findById(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a route' })
  @ApiResponse({
    status: 200,
    description: 'The route has been successfully deleted.',
    type: Route,
  })
  @ApiResponse({
    status: 404,
    description: 'Route not found.',
  })
  async deleteRoute(@Param('id') id: string) {
    return this.RouteService.delete(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update partial route details' })
  @ApiResponse({
    status: 200,
    description: 'The route details have been successfully updated.',
    type: Route,
  })
  @ApiResponse({
    status: 404,
    description: 'Route not found.',
  })
  async updatePartial(
    @Param('id') id: string,
    @Body() updateSchedule: CreateRouteDto,
  ) {
    return this.RouteService.update(id, updateSchedule);
  }
}
