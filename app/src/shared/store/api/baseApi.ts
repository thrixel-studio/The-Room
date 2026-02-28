import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

/**
 * Cache tier configuration (in seconds):
 * - Tier A (volatile): 60s - drafts, active sessions
 * - Tier B (moderate): 300s (5min) - entries, insights
 * - Tier C (stable): 1800s (30min) - user settings, frameworks
 */
export const CACHE_TIERS = {
  VOLATILE: 60,
  MODERATE: 300,
  STABLE: 1800,
} as const;

/**
 * Base RTK Query API
 * All feature endpoints will be injected into this API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: CACHE_TIERS.MODERATE, // 5 min default
  tagTypes: [
    'Entry',
    'Entries',
    'Insights',
    'Framework',
    'User',
    'WritingSession',
    'ChatMessage',
    'Suggestions',
  ],
  endpoints: () => ({}),
});
