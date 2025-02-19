import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './schema/car.schema';
import { Model } from 'mongoose';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async findAll(
    search?: string,
    limit = 10,
    index = 0,
    order = 'asc',
    sort = 'licensePlate',
  ): Promise<{ data: Car[]; total: number }> {
    const filter = search
      ? { licensePlate: { $regex: search, $options: 'i' } }
      : {};

    const sortOrder = order === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.carModel
        .find(filter)
        .sort({ [sort]: sortOrder })
        .skip(index)
        .limit(limit)
        .exec(),
      this.carModel.countDocuments(filter),
    ]);

    return { data, total };
  }

  async create(car: Car): Promise<Car> {
    const existingCar = await this.carModel
      .findOne({ licensePlate: car.licensePlate })
      .exec();
    if (existingCar) {
      throw new ConflictException('License plate already exists');
    }
    car.seatingCapacity = car.seats.length;
    const newCar = new this.carModel(car);
    return newCar.save();
  }

  async findOne(id: string): Promise<Car> {
    const existingCar = await this.carModel.findById(id).exec();
    if (!existingCar) {
      throw new NotFoundException('Car not found');
    }
    return existingCar;
  }

  async update(id: string, updateCarDto: Car): Promise<Car> {
    await this.findOne(id);

    if (updateCarDto.seats) {
      updateCarDto.seatingCapacity = updateCarDto.seats.length;
    }

    const updateCar = await this.carModel
      .findByIdAndUpdate(id, { $set: updateCarDto }, { new: true })
      .exec();

    return updateCar;
  }

  async delete(id: string): Promise<Car> {
    const existingCar = await this.carModel.findByIdAndDelete(id).exec();
    if (!existingCar) {
      throw new NotFoundException('Car not found');
    }
    return existingCar;
  }
}
