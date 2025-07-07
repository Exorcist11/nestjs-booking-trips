import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './schema/promotion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
    ]),
    PromotionModule,
  ],
  providers: [PromotionService],
  exports: [MongooseModule],
  controllers: [PromotionController],
})
export class PromotionModule {}
