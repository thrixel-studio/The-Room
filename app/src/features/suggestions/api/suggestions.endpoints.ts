import { baseApi, CACHE_TIERS } from '@/shared/store/api/baseApi';
import type {
  SuggestionListResponse,
  CreateChatFromSuggestionRequest,
  CreateChatFromSuggestionResponse,
  TipsResponse,
} from '../types';

export const suggestionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveSuggestions: builder.query<SuggestionListResponse, void>({
      query: () => '/suggestions',
      providesTags: ['Suggestions'],
      keepUnusedDataFor: CACHE_TIERS.MODERATE,
    }),
    getEntryTips: builder.query<TipsResponse, void>({
      query: () => '/entries/tips',
      keepUnusedDataFor: CACHE_TIERS.MODERATE,
    }),
    createChatFromSuggestion: builder.mutation<
      CreateChatFromSuggestionResponse,
      CreateChatFromSuggestionRequest
    >({
      query: (body) => ({
        url: '/suggestions/start-chat',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Suggestions', { type: 'WritingSession', id: 'LIST' }],
    }),
    dismissSuggestion: builder.mutation<void, string>({
      query: (suggestionId) => ({
        url: `/suggestions/${suggestionId}/dismiss`,
        method: 'POST',
      }),
      invalidatesTags: ['Suggestions'],
    }),
  }),
});

export const {
  useGetActiveSuggestionsQuery,
  useGetEntryTipsQuery,
  useCreateChatFromSuggestionMutation,
  useDismissSuggestionMutation,
} = suggestionsApi;
