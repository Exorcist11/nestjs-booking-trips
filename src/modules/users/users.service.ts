import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(
    search?: string,
    limit = 10,
    index = 0,
    order: 'asc' | 'desc' = 'asc',
    sort = 'fullName',
  ): Promise<{ data: User[]; total: number }> {
    const filter = search
      ? { fullName: { $regex: search, $options: 'i' } }
      : {};

    const sortOrder = order === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ [sort]: sortOrder })
        .skip(index)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return { data, total };
  }

  async create(user: User): Promise<User> {
    const existingEmail = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findById(userId: string): Promise<User> {
    const existUser = await this.userModel.findById(userId).exec();

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    return existUser;
  }

  async updateUser(id: string, updateDto: CreateUserDto): Promise<User> {
    await this.findById(id);
    const updateUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .exec();
    return updateUser;
  }

  async deleteUser(id: string): Promise<User> {
    const exitsUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!exitsUser) {
      throw new NotFoundException('User not found');
    }
    return exitsUser;
  }
}
