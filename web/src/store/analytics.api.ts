import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PaymentMetrics, TrendData } from '@org/shared-types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3000/api';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
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