import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Payment } from './payment.schema';
import { PaymentEventsService } from './payment-events.service';

@Injectable()
export class PaymentsSeedService {
  private readonly logger = new Logger(PaymentsSeedService.name);

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    private readonly paymentEventsService: PaymentEventsService
  ) {}

  async seed(): Promise<void> {
    const count = await this.paymentModel.countDocuments();

    if (count > 0) {
      this.logger.log('Payments already seeded. Skipping.');
      return;
    }

    const tenants = ['tenant-a', 'tenant-b'];
    const methods = ['UPI', 'CARD', 'NETBANKING'];
    const statuses: Array<'success' | 'failed' | 'refunded'> = [
      'success',
      'failed',
      'refunded',
    ];

    const payments: Partial<Payment>[] = [];
    const now = Date.now();

    for (let i = 0; i < 500; i++) {
      const hoursAgo = Math.floor(Math.random() * 24); // last 24 hours
      const daysAgo = Math.floor(Math.random() * 30); // last 30 days

      const createdAt = new Date(
        now -
          hoursAgo * 60 * 60 * 1000 -
          daysAgo * 24 * 60 * 60 * 1000
      );

      payments.push({
        tenantId: tenants[i % tenants.length],
        amount: Math.floor(Math.random() * 5000) + 100,
        currency: 'INR',
        method: methods[i % methods.length],
        status: statuses[i % statuses.length],
        createdAt,
      });
    }

    await this.paymentModel.insertMany(payments);

    // Emit events for realtime feed
    payments.forEach((payment) => {
      if (!payment.status) return;

      const eventTypeMap: Record<
        'success' | 'failed' | 'refunded',
        'payment_received' | 'payment_failed' | 'payment_refunded'
      > = {
        success: 'payment_received',
        failed: 'payment_failed',
        refunded: 'payment_refunded',
      };

      this.paymentEventsService.emit({
        type: eventTypeMap[payment.status],
        payment: payment as any,
        timestamp: new Date(),
      });
    });

    this.logger.log(`Seeded ${payments.length} payments`);
  }
}

