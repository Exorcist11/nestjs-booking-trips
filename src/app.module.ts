import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TripsModule } from './modules/trips/trips.module';
import { CarsModule } from './modules/cars/cars.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:nothing123@nothing.vdgps.mongodb.net/booking_trips?retryWrites=true&w=majority&appName=Nothing',
    ),
    TripsModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
