export interface EmotionInsight {
  emotion_id: string;
  name: string;
  color?: string;
  count: number;
  avg_intensity: number;
}

export interface ConsistencyMetrics {
  days_written_this_month: number;
  target_days: number;
  current_streak_days: number;
  writing_minutes_month: number;
}

export interface InsightCard {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  payload?: any;
  status: string;
  created_at: string;
}

export interface DashboardInsights {
  consistency: ConsistencyMetrics;
  emotion_state: EmotionInsight[];
  cards: InsightCard[];
}

export type InsightsPeriod = '7d' | '30d' | '90d';
