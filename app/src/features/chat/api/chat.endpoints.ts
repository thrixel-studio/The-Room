import { baseApi, CACHE_TIERS } from '@/shared/store/api/baseApi';
import type { ChatSession, ChatMessage, SendMessageRequest } from '../types';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveSessions: builder.query<ChatSession[], void>({
      query: () => '/writing/chat/sessions',
      providesTags: [{ type: 'WritingSession', id: 'LIST' }],
      keepUnusedDataFor: CACHE_TIERS.VOLATILE, // 60s - sessions are volatile
    }),
    createChatSession: builder.mutation<ChatSession, { framework_key?: string } | void>({
      query: (body) => ({
        url: '/writing/chat/sessions',
        method: 'POST',
        body: body || {},
      }),
      invalidatesTags: [{ type: 'WritingSession', id: 'LIST' }],
    }),
    getChatSession: builder.query<ChatSession, string>({
      query: (sessionId) => `/writing/chat/sessions/${sessionId}`,
      providesTags: (result, error, id) => [{ type: 'WritingSession', id }],
      keepUnusedDataFor: CACHE_TIERS.VOLATILE, // 60s - active session data
    }),
    sendMessage: builder.mutation<ChatMessage, { sessionId: string; content: string }>({
      query: ({ sessionId, content }) => ({
        url: `/writing/chat/sessions/${sessionId}/messages`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { sessionId }) => [{ type: 'WritingSession', id: sessionId }],
    }),
    finishSession: builder.mutation<{ entry_id: string }, string>({
      query: (sessionId) => ({
        url: `/writing/chat/sessions/${sessionId}/finish`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, sessionId) => [
        { type: 'WritingSession', id: sessionId },
        { type: 'WritingSession', id: 'LIST' },
        { type: 'Entries', id: 'LIST' },
        { type: 'Entries', id: 'FINAL_LIST' },
      ],
    }),
    deleteChatSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `/writing/chat/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, sessionId) => [
        { type: 'WritingSession', id: sessionId },
        { type: 'WritingSession', id: 'LIST' },
        { type: 'Entries', id: 'DRAFT_LIST' },
      ],
    }),
  }),
});

export const {
  useGetActiveSessionsQuery,
  useCreateChatSessionMutation,
  useGetChatSessionQuery,
  useSendMessageMutation,
  useFinishSessionMutation,
  useDeleteChatSessionMutation,
} = chatApi;
