import { useGetDashboardQuery, useDismissCardMutation } from '../api/insights.endpoints';
import type { InsightsPeriod } from '../types';

export function useInsights(period: InsightsPeriod = '30d') {
  const { data, isLoading, error, refetch } = useGetDashboardQuery(period);
  const [dismissCard, { isLoading: isDismissing }] = useDismissCardMutation();

  return {
    insights: data,
    isLoading,
    error,
    refetch,
    dismissCard,
    isDismissing,
  };
}
