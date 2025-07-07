import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TripsModule } from './modules/trips/trips.module';
import { CarsModule } from './modules/cars/cars.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingsModule } from './modules/bookings/bookings.module';
import { RouteModule } from './modules/route/route.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { CarsService } from './modules/cars/cars.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TripsModule,
    RouteModule,
    CarsModule,
    UsersModule,
    CloudinaryModule,
    BookingsModule,
    ScheduleModule,
    PromotionModule,
  ],
  controllers: [AppController],
  providers: [AppService, CarsService],
})
export class AppModule {}
