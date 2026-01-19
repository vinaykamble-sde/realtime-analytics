import { Payment } from './payment';
export type PaymentEventType =
  | 'payment_received'
  | 'payment_failed'
  | 'payment_refunded';

export interface PaymentEvent {
  type: PaymentEventType;
  payment: Payment;
  timestamp: Date;
}
