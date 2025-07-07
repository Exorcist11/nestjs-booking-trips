import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Route, RouteDocument } from './schema/route.schema';
import { Model } from 'mongoose';
import { CreateRouteDto } from './dto/create-route.dto';
import { RouteResponseDto } from './dto/response-route.dto';
import { plainToClass } from 'class-transformer';
import { SearchRouteDto } from './dto/search-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectModel(Route.name)
    private routeModel: Model<RouteDocument>,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<RouteResponseDto> {
    const newRoute = await this.routeModel.create(createRouteDto);
    return plainToClass(RouteResponseDto, newRoute.toObject());
  }

  async findAll(searchRouteDto: SearchRouteDto): Promise<RouteResponseDto[]> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = 'asc',
      startLocation,
      endLocation,
    } = searchRouteDto;

    const skip = (page - 1) * limit;

    const query: any = {};
    if (startLocation || endLocation) {
      query.startLocation = new RegExp(startLocation, 'i');
      query.endLocation = new RegExp(endLocation, 'i');
    }

    const sort: any = {};
    if (sortBy) {
      const validSortFields = [
        'startLocation',
        'endLocation',
        'duration',
        'price',
        'isDeleted',
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

    const routes = await this.routeModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    return routes.map((route) =>
      plainToClass(RouteResponseDto, route.toObject()),
    );
  }

  async findOne(id: string): Promise<RouteResponseDto> {
    const route = await this.routeModel.findById(id).exec();

    if (!route) {
      throw new NotFoundException(`Không tìm thấy tuyến đường với ID ${id}`);
    }
    return plainToClass(RouteResponseDto, route.toObject());
  }

  async update(
    id: string,
    updateRouteDto: UpdateRouteDto,
  ): Promise<RouteResponseDto> {
    const updatedRoute = await this.routeModel.findByIdAndUpdate(
      id,
      updateRouteDto,
      { new: true, runValidators: true },
    );

    if (!updatedRoute) {
      throw new NotFoundException(`Không tìm thấy tuyến đường với ID ${id}`);
    }

    return plainToClass(RouteResponseDto, updatedRoute.toObject());
  }

  async remove(id: string): Promise<void> {
    const result = await this.routeModel
      .findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        {
          new: true,
        },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Không tìm thấy tuyến đường  với ID ${id} hoặc xe đã bị xóa`,
      );
    }
  }

  async restore(id: string): Promise<RouteResponseDto> {
    const restoredRoute = await this.routeModel
      .findOneAndUpdate(
        {
          _id: id,
          isDeleted: true,
        },
        {
          isDeleted: true,
          $unset: { deletedAt: 1 },
        },
        {
          new: true,
        },
      )
      .exec();

    if (!restoredRoute) {
      throw new NotFoundException(
        `Không tìm thấy tuyến đường  với ID ${id} hoặc tuyến đường chưa bị xóa`,
      );
    }

    return plainToClass(RouteResponseDto, restoredRoute.toObject());
  }
}
