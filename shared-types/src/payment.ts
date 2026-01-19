export type PaymentStatus =
  | 'success'
  | 'failed'
  | 'refunded';

export interface Payment {
  id: string;
  tenantId: string;

  amount: number;
  currency: string;

  method: string;
  status: PaymentStatus;

  createdAt: Date;
}
