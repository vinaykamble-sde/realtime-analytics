import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.schema';
import { PaymentsSeedService } from './payments.seed';
import { PaymentEventsService } from './payment-events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  providers: [PaymentsSeedService,PaymentEventsService,],
  exports: [PaymentsSeedService,PaymentEventsService,],
})
export class PaymentsModule {}
