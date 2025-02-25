import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { CarsModule } from '../cars/cars.module';
import { ScheduleController } from './schedule.controller';
import { RouteModule } from '../route/route.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    CarsModule,
    RouteModule,
  ],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [MongooseModule],
})
export class ScheduleModule {}
