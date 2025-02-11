import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [CreateUserDto],
  })
  @ApiQuery({ name: 'fullName', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'index', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async getAllCars(
    @Query('fullName') search?: string,
    @Query('limit') limit?: number,
    @Query('index') index?: number,
    @Query('order') order?: string,
    @Query('sort') sort?: string,
  ) {
    const data = await this.usersService.findAll(
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

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })
  async createNewUser(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }
}
