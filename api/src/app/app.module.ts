import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentsModule } from './payments/payments.module';
import { PaymentsSeedService } from './payments/payments.seed';
import { AnalyticsModule } from './analytics/analytics.module';
import { CommonModule } from '../common/common.module';
import { RealtimeModule } from './realtime/realtime.module';
import { HealthController } from './health.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'api/.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    PaymentsModule,
    AnalyticsModule,
    CommonModule,
    RealtimeModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly paymentsSeedService: PaymentsSeedService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.paymentsSeedService.seed();
  }
}
