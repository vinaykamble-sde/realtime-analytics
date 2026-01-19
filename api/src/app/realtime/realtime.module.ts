import { Module } from '@nestjs/common';
import { PaymentsGateway } from './payments.gateway';
import { PaymentsModule } from '../payments/payments.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [PaymentsModule, AnalyticsModule],
  providers: [PaymentsGateway],
})
export class RealtimeModule {}
