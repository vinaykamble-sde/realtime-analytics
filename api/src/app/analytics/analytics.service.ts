import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Payment } from '../payments/payment.schema';
import { PaymentMetrics, TrendData } from '@org/shared-types';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) {}

  async getMetrics(): Promise<PaymentMetrics> {
    const result = await this.paymentModel.aggregate([
      {
        $group: {
          _id: null,
          totalVolume: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          successCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'success'] }, 1, 0],
            },
          },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    const metrics = result[0] ?? {
      totalVolume: 0,
      averageAmount: 0,
      successCount: 0,
      totalCount: 0,
    };

    const topMethod = await this.paymentModel.aggregate([
      { $group: { _id: '$method', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const peakHourResult = await this.paymentModel.aggregate([
      {
        $project: {
          hour: { $hour: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    return {
      totalVolume: metrics.totalVolume,
      averageAmount: Math.round(metrics.averageAmount),
      successRate:
        metrics.totalCount === 0
          ? 0
          : metrics.successCount / metrics.totalCount,
      topPaymentMethod: topMethod[0]?._id ?? 'N/A',
      peakHour: peakHourResult[0]?._id ?? 0,
    };
  }

  async getTrends(
    period: 'day' | 'week' | 'month',
  ): Promise<TrendData[]> {
    const now = new Date();
  
    let from: Date;
    let groupBy: any;
    let timestampExpr: any;
  
    if (period === 'day') {
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' },
      };
  
      timestampExpr = {
        $dateFromParts: {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
          hour: '$_id.hour',
        },
      };
    } else if (period === 'week') {
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
  
      timestampExpr = {
        $dateFromParts: {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
        },
      };
    } else {
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
  
      timestampExpr = {
        $dateFromParts: {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
        },
      };
    }
  
    const results = await this.paymentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: from },
        },
      },
      {
        $group: {
          _id: groupBy,
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'success'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          timestamp: timestampExpr,
          amount: 1,
          count: 1,
          successRate: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              { $divide: ['$successCount', '$count'] },
            ],
          },
        },
      },
      { $sort: { timestamp: 1 } },
    ]);
  
    return results;
  }
  
}
