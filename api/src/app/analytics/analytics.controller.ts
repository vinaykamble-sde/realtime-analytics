import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PaymentMetrics, TrendData } from '@org/shared-types';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('metrics')
  async getMetrics(): Promise<PaymentMetrics> {
    return this.analyticsService.getMetrics();
  }

  @Get('trends')
  async getTrends(
    @Query('period') period: 'day' | 'week' | 'month' = 'day',
  ): Promise<TrendData[]> {
    return this.analyticsService.getTrends(period);
  }
}
