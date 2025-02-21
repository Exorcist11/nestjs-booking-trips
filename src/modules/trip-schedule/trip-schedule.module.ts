import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripScheduleController } from './trip-schedule.controller';
import { TripScheduleService } from './trip-schedule.service';
import { TripSchedule, TripScheduleSchema } from './schema/tripSchedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TripSchedule.name, schema: TripScheduleSchema },
    ]),
  ],
  providers: [TripScheduleService],
  controllers: [TripScheduleController],
  exports: [MongooseModule],
})
export class TripScheduleModule {}
