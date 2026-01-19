import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentDocument = Payment & HydratedDocument<Payment>;
@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, index: true })
  tenantId!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  currency!: string;

  @Prop({ required: true, index: true })
  method!: string;

  @Prop({ required: true, index: true })
  status!: 'success' | 'failed' | 'refunded';

  @Prop({ required: true, index: true })
  createdAt!: Date;
}


export const PaymentSchema = SchemaFactory.createForClass(Payment);
