// Components
export { default as Dashboard } from './components/Dashboard';
export { default as Calendar } from './components/Calendar';
export { default as EmotionalStateTable } from './components/EmotionalStateTable';
export { default as MonthlyTarget } from './components/MonthlyTarget';

// Hooks
export { useInsights } from './hooks/useInsights';

// API
export { insightsApi, useGetDashboardQuery, useDismissCardMutation } from './api/insights.endpoints';

// Types
export type {
  EmotionInsight,
  ConsistencyMetrics,
  InsightCard,
  DashboardInsights,
  InsightsPeriod,
} from './types';
