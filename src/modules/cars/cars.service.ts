import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './schema/car.schema';
import { Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { CarResponseDto } from './dto/response-car.dto';
import { plainToClass } from 'class-transformer';
import { UpdateCarDto } from './dto/update-car.dto';
import { SearchCarsDto } from './dto/search-car.dto';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async create(createCarDto: CreateCarDto): Promise<CarResponseDto> {
    if (createCarDto.seats.length !== createCarDto.seatingCapacity) {
      throw new BadRequestException('Số lượng ghế không khớp với sức chứa!');
    }

    const existingCar = await this.carModel
      .findOne({ licensePlate: createCarDto.licensePlate, isDeleted: false })
      .exec();
    if (existingCar) {
      throw new BadRequestException('Biển số xe đã tồn tại!');
    }

    const newCar = await this.carModel.create(createCarDto);
    return plainToClass(CarResponseDto, newCar.toObject());
  }

  async findAll(searchCarsDto: SearchCarsDto): Promise<CarResponseDto[]> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = 'asc',
      search,
      includeDeleted = false,
    } = searchCarsDto;

    const skip = (page - 1) * limit;

    const query: any = {};
    if (!includeDeleted) {
      query.isDeleted = false;
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { licensePlate: searchRegex },
        { mainDriver: searchRegex },
        { ticketCollector: searchRegex },
        { phoneNumber: searchRegex },
        { model: searchRegex },
      ];
    }

    const sort: any = {};
    if (sortBy) {
      const validSortFields = [
        'licensePlate',
        'seatingCapacity',
        'status',
        'yearOfManufacture',
      ];
      if (!validSortFields.includes(sortBy)) {
        throw new BadRequestException(
          `Trường sắp xếp phải là một trong: ${validSortFields.join(', ')}`,
        );
      }
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const cars = await this.carModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    return cars.map((car) => plainToClass(CarResponseDto, car.toObject()));
  }

  async findOne(id: string): Promise<CarResponseDto> {
    const car = await this.carModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!car) {
      throw new NotFoundException(`Không tìm thấy xe khách với ID ${id}`);
    }
    return plainToClass(CarResponseDto, car.toObject());
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
  ): Promise<CarResponseDto> {
    if (
      updateCarDto.seats &&
      updateCarDto.seatingCapacity &&
      updateCarDto.seats.length !== updateCarDto.seatingCapacity
    ) {
      throw new BadRequestException('Số lượng ghế không khớp với sức chứa!');
    }

    if (updateCarDto.licensePlate) {
      const existingCar = await this.carModel.findOne({
        licensePlate: updateCarDto.licensePlate,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (existingCar) {
        throw new BadRequestException('Biển số xe đã tồn tại!');
      }
    }

    const updatedCar = await this.carModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateCarDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedCar) {
      throw new NotFoundException(`Không tìm thấy xe khách với ID ${id}`);
    }

    return plainToClass(CarResponseDto, updatedCar.toObject());
  }

  async delete(id: string): Promise<Car> {
    const existingCar = await this.carModel.findByIdAndDelete(id).exec();
    if (!existingCar) {
      throw new NotFoundException('Car not found');
    }
    return existingCar;
  }

  async remove(id: string): Promise<void> {
    const result = await this.carModel
      .findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Không tìm thấy xe khách với ID ${id} hoặc xe đã bị xóa`,
      );
    }
  }

  async restore(id: string): Promise<CarResponseDto> {
    const restoredCar = await this.carModel
      .findOneAndUpdate(
        {
          _id: id,
          isDeleted: true,
        },
        {
          isDeleted: false,
          $unset: { deletedAt: 1 },
        },
        {
          new: true,
        },
      )
      .exec();

    if (!restoredCar) {
      throw new NotFoundException(
        `Không tìm thấy xe khách với ID ${id} hoặc xe chưa bị xóa`,
      );
    }

    return plainToClass(CarResponseDto, restoredCar.toObject());
  }
}
