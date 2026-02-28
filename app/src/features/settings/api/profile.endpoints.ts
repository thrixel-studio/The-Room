import { baseApi, CACHE_TIERS } from '@/shared/store/api/baseApi';
import type { User, UpdateUserRequest } from '../types';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/me',
      providesTags: ['User'],
      keepUnusedDataFor: CACHE_TIERS.STABLE, // 30min - user data is stable
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: (updates) => ({
        url: '/me',
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<void, string>({
      query: (refreshToken) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { refresh_token: refreshToken },
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useLogoutMutation,
} = profileApi;
