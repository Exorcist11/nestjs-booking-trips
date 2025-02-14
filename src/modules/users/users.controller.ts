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
  async getAllUsers(
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
      total: data.length
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

  @Patch('/:id')
  @ApiOperation({ summary: 'Update partial user details' })
  @ApiResponse({
    status: 200,
    description: 'The user details have been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async updatePartial(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('/getUserById')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({
      status: 200,
      description: 'Return the user.',
      type: CreateUserDto,
    })
    @ApiResponse({
      status: 404,
      description: 'User not found.',
    })
    async getUserById(@Query('id') id: string) {
      return this.usersService.findById(id);
    }
}
