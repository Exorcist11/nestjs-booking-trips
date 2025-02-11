import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      throw new UnauthorizedException('Email or Password is not correct');
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email or Password is not correct');
    }

    const payload = {
      userId: findUser._id,
      email: findUser.email,
      role: findUser.role,
    };

    const token = this.jwtService.sign(payload);
    return { token };
  }

  async register(user: User): Promise<User> {
    const existEmail = await this.userModel.findOne({ email: user.email });
    if (existEmail) {
      throw new ConflictException('Email already exits');
    }

    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
