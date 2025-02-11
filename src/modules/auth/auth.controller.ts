import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/schema/user.schema';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register account' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email alrealy exits.',
  })
  async register(@Body() user: RegisterDto) {
    return this.authServices.register(user);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: LoginDto,
  })
  async login(@Body() user: LoginDto) {
    return this.authServices.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getCurrentUser')
  @ApiBearerAuth()
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
