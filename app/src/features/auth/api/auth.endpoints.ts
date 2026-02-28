import { baseApi } from '@/shared/store/api/baseApi';
import type { AuthTokens, User, LoginRequest, RegisterRequest } from '../types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthTokens, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<User, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    refreshToken: builder.mutation<AuthTokens, string>({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refresh_token: refreshToken },
      }),
    }),
    googleLogin: builder.mutation<AuthTokens, string>({
      query: (token) => ({
        url: '/auth/google',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGoogleLoginMutation,
} = authApi;
