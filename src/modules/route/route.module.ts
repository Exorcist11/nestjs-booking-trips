import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RouteController } from './route.controller';
import { Route, RouteSchema } from './schema/route.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    RouteModule,
  ],
  providers: [RouteService],
  exports: [MongooseModule],
  controllers: [RouteController],
})
export class RouteModule {}
