import { baseApi, CACHE_TIERS } from '@/shared/store/api/baseApi';
import type { EntriesListResponse, EntryDetail, GetEntriesParams, UpdateEntryRequest, JournalEntry } from '../types';

/**
 * Build query string from params
 */
const buildEntriesQueryString = (params: GetEntriesParams = {}): string => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.page_size) searchParams.set('page_size', params.page_size.toString());
  if (params.status) searchParams.set('status', params.status);
  if (params.date_from) searchParams.set('from_date', params.date_from);
  if (params.date_to) searchParams.set('to_date', params.date_to);
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const journalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get entries with standard pagination (non-infinite)
     */
    getEntries: builder.query<EntriesListResponse, GetEntriesParams | void>({
      query: (params = {}) => `/entries${buildEntriesQueryString(params as GetEntriesParams)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Entry' as const, id })),
              { type: 'Entries' as const, id: 'LIST' },
            ]
          : [{ type: 'Entries' as const, id: 'LIST' }],
    }),

    /**
     * Get FINAL entries with infinite scroll support
     * Uses RTK Query's merge pattern for pagination
     */
    getFinalEntriesPaginated: builder.query<EntriesListResponse, { page: number; page_size: number }>({
      query: ({ page, page_size }) => `/entries?status=FINAL&page=${page}&page_size=${page_size}`,
      serializeQueryArgs: ({ endpointName }) => {
        // Use same cache key regardless of page - enables merging
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        // On first page, replace entirely
        if (arg.page === 1) {
          return newItems;
        }
        // On subsequent pages, append items
        return {
          ...newItems,
          items: [...currentCache.items, ...newItems.items],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        // Refetch when page changes
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Entry' as const, id })),
              { type: 'Entries' as const, id: 'FINAL_LIST' },
            ]
          : [{ type: 'Entries' as const, id: 'FINAL_LIST' }],
      keepUnusedDataFor: CACHE_TIERS.MODERATE, // 5 min for final entries
    }),

    /**
     * Get DRAFT entries (no pagination, fetch all)
     */
    getDraftEntries: builder.query<EntriesListResponse, { page_size?: number } | void>({
      query: (params) => `/entries?status=DRAFT&page_size=${params?.page_size || 50}`,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Entry' as const, id })),
              { type: 'Entries' as const, id: 'DRAFT_LIST' },
            ]
          : [{ type: 'Entries' as const, id: 'DRAFT_LIST' }],
      keepUnusedDataFor: CACHE_TIERS.VOLATILE, // 60s for drafts - they change frequently
    }),

    /**
     * Get entries for a specific date range (used by calendar/insights)
     */
    getEntriesByDateRange: builder.query<EntriesListResponse, { from_date: string; to_date: string; status?: 'DRAFT' | 'FINAL'; page_size?: number }>({
      query: ({ from_date, to_date, status = 'FINAL', page_size = 50 }) =>
        `/entries?status=${status}&from_date=${from_date}&to_date=${to_date}&page_size=${page_size}`,
      providesTags: (result, error, { from_date, to_date }) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Entry' as const, id })),
              { type: 'Entries' as const, id: `RANGE_${from_date}_${to_date}` },
            ]
          : [{ type: 'Entries' as const, id: `RANGE_${from_date}_${to_date}` }],
      keepUnusedDataFor: CACHE_TIERS.VOLATILE, // 60s - date-specific queries
    }),

    /**
     * Get single entry detail
     */
    getEntry: builder.query<EntryDetail, string>({
      query: (id) => `/entries/${id}`,
      providesTags: (result, error, id) => [{ type: 'Entry', id }],
      keepUnusedDataFor: CACHE_TIERS.MODERATE, // 5 min
    }),

    /**
     * Update entry
     */
    updateEntry: builder.mutation<EntryDetail, { id: string; updates: UpdateEntryRequest }>({
      query: ({ id, updates }) => ({
        url: `/entries/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Entry', id },
        { type: 'Entries', id: 'LIST' },
        { type: 'Entries', id: 'FINAL_LIST' },
        { type: 'Entries', id: 'DRAFT_LIST' },
      ],
    }),

    /**
     * Delete entry
     */
    deleteEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/entries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Entry', id },
        { type: 'Entries', id: 'LIST' },
        { type: 'Entries', id: 'FINAL_LIST' },
        { type: 'Entries', id: 'DRAFT_LIST' },
      ],
    }),

    /**
     * Delete all entries
     */
    deleteAllEntries: builder.mutation<void, void>({
      query: () => ({
        url: '/entries',
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Entries', id: 'LIST' },
        { type: 'Entries', id: 'FINAL_LIST' },
        { type: 'Entries', id: 'DRAFT_LIST' },
      ],
    }),

    /**
     * Share entry
     */
    shareEntry: builder.mutation<{ share_url: string }, string>({
      query: (id) => ({
        url: `/entries/${id}/share`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetEntriesQuery,
  useGetFinalEntriesPaginatedQuery,
  useGetDraftEntriesQuery,
  useGetEntriesByDateRangeQuery,
  useGetEntryQuery,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
  useDeleteAllEntriesMutation,
  useShareEntryMutation,
} = journalApi;
