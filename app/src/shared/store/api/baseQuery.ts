import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { tokenStorage } from '@/shared/lib/storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Single flight lock for token refresh
 * Prevents multiple parallel 401s from each triggering their own refresh
 */
let isRefreshing = false;
let refreshPromise: Promise<{
  access_token: string;
  refresh_token: string;
} | null> | null = null;

/**
 * Base query with automatic token injection
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Perform token refresh with single flight guarantee
 * Only one refresh request will be made even if multiple 401s occur simultaneously
 */
const performTokenRefresh = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2]
): Promise<{ access_token: string; refresh_token: string } | null> => {
  // If already refreshing, wait for the existing refresh to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const tokens = refreshResult.data as {
          access_token: string;
          refresh_token: string;
        };
        return tokens;
      }
      return null;
    } catch {
      return null;
    }
  })();

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

/**
 * Base query with automatic token refresh on 401
 * Uses single flight lock to prevent token refresh races
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh the token (with single flight guarantee)
    const tokens = await performTokenRefresh(api, extraOptions);

    if (tokens) {
      // Determine if user wanted to stay logged in based on where tokens were stored
      const keepLoggedIn =
        (typeof window !== 'undefined' && localStorage.getItem('keep_logged_in') === 'true') ||
        (typeof window !== 'undefined' && sessionStorage.getItem('keep_logged_in') === 'true');

      // Store the new tokens with the same persistence preference
      tokenStorage.setTokens(tokens.access_token, tokens.refresh_token, keepLoggedIn);

      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clear tokens and redirect to login
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  }

  return result;
};

// Re-export tokenStorage for backward compatibility with imports from this file
export { tokenStorage };
