import { baseApi } from '@/shared/store/api/baseApi';
import type { DashboardInsights, InsightsPeriod } from '../types';

export const insightsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardInsights, InsightsPeriod>({
      query: (period = '30d') => `/insights/dashboard?period=${period}`,
      providesTags: ['Insights'],
      keepUnusedDataFor: 600, // 10min - insights are moderately stable
    }),
    dismissCard: builder.mutation<void, string>({
      query: (cardId) => ({
        url: `/insights/cards/${cardId}/dismiss`,
        method: 'POST',
      }),
      invalidatesTags: ['Insights'],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useDismissCardMutation,
} = insightsApi;
