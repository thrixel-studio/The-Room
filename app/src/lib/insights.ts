/**
 * Legacy insights API - plain fetch wrapper for react-query consumers.
 * New code should use RTK Query hooks from @/features/insights/api/insights.endpoints
 */

import { authenticatedFetchJson } from '@/shared/lib/api-client';
import type { DashboardInsights } from '@/features/insights/types';

export type { EmotionInsight } from '@/features/insights/types';

export const insightsApi = {
  async getDashboard(accessToken: string, period = '30d'): Promise<DashboardInsights> {
    return authenticatedFetchJson<DashboardInsights>(
      `/insights/dashboard?period=${period}`,
      accessToken
    );
  },
};
