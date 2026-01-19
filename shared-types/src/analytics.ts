export interface PaymentMetrics {
    totalVolume: number;
    successRate: number;
    averageAmount: number;
    peakHour: number;
    topPaymentMethod: string;
  }
  
  export interface TrendData {
    timestamp: Date;
    amount: number;
    count: number;
    successRate: number;
  }
  