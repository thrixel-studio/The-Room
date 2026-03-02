/**
 * Legacy API client - Bridge file
 * TODO: Migrate to RTK Query endpoints in features
 */

import { env } from './env';
import { tokenStorage } from './storage';

const API_URL = env.apiUrl;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    // Handle 401 Unauthorized - redirect to sign in instead of showing error
    if (response.status === 401) {
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      // Throw a specific error that won't be shown to user
      throw new Error('REDIRECT_TO_SIGNIN');
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response;
}

export async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(endpoint, options);
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return undefined as T;
  }
  return response.json();
}

export async function authenticatedFetchJson<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  
  return fetchJson<T>(endpoint, { ...options, headers });
}
