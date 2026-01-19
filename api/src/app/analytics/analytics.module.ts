import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Payment, PaymentSchema } from '../payments/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}
