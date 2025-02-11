import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(
    search?: string,
    limit = 10,
    index = 0,
    order = 'asc',
    sort = 'fullName',
  ): Promise<User[]> {
    const filter = search
      ? { fullName: { $regex: search, $options: 'i' } }
      : {};

    const sortOrder = order === 'asc' ? 1 : -1;

    return this.userModel
      .find(filter)
      .sort({ [sort]: sortOrder })
      .skip(index)
      .limit(limit)
      .exec();
  }

  async create(user: User): Promise<User> {
    const existingEmail = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    const newCar = new this.userModel(user);
    return newCar.save();
  }
}
