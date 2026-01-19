import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PaymentMetrics, TrendData } from '@org/shared-types';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
  }),
  tagTypes: ['Metrics', 'Trends'],
  endpoints: (builder) => ({
    getMetrics: builder.query<PaymentMetrics, void>({
      query: () => '/analytics/metrics',
      providesTags: ['Metrics'],
    }),

    getTrends: builder.query<TrendData[], { period: string }>({
      query: ({ period }) => `/analytics/trends?period=${period}`,
      providesTags: ['Trends'],
    }),
  }),
});

export const {
  useGetMetricsQuery,
  useGetTrendsQuery,
} = analyticsApi;