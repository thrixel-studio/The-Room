/**
 * Storage utilities for browser localStorage
 * Provides type-safe and SSR-safe storage access
 */

const isBrowser = typeof window !== 'undefined';

/**
 * Generic storage helper
 */
export const storage = {
  /**
   * Get item from localStorage
   */
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   */
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: (): void => {
    if (!isBrowser) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },

  /**
   * Get parsed JSON from localStorage
   */
  getJSON: <T>(key: string): T | null => {
    const item = storage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * Set JSON in localStorage
   */
  setJSON: <T>(key: string, value: T): void => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error stringifying JSON for localStorage: ${key}`, error);
    }
  },
};

/**
 * Token storage keys
 */
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  KEEP_LOGGED_IN: 'keep_logged_in',
} as const;

/**
 * Get the appropriate storage based on keep logged in preference
 */
const getStorageType = (): Storage => {
  if (!isBrowser) return localStorage;

  // Check if user wants to stay logged in (check both storages)
  const keepLoggedIn =
    localStorage.getItem(TOKEN_KEYS.KEEP_LOGGED_IN) === 'true' ||
    sessionStorage.getItem(TOKEN_KEYS.KEEP_LOGGED_IN) === 'true';

  return keepLoggedIn ? localStorage : sessionStorage;
};

/**
 * Token storage helper with support for session-only and persistent storage
 */
export const tokenStorage = {
  getAccessToken: () => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN) ||
             sessionStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error reading access token', error);
      return null;
    }
  },

  getRefreshToken: () => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN) ||
             sessionStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error reading refresh token', error);
      return null;
    }
  },

  setTokens: (accessToken: string, refreshToken: string, keepLoggedIn: boolean = true) => {
    if (!isBrowser) return;
    try {
      const storageType = keepLoggedIn ? localStorage : sessionStorage;

      // Clear tokens from the other storage type
      const otherStorage = keepLoggedIn ? sessionStorage : localStorage;
      otherStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      otherStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      otherStorage.removeItem(TOKEN_KEYS.KEEP_LOGGED_IN);

      // Store tokens in the appropriate storage
      storageType.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      storageType.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
      storageType.setItem(TOKEN_KEYS.KEEP_LOGGED_IN, String(keepLoggedIn));
    } catch (error) {
      console.error('Error setting tokens', error);
    }
  },

  clearTokens: () => {
    if (!isBrowser) return;
    try {
      // Clear from both storages
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.KEEP_LOGGED_IN);
      sessionStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(TOKEN_KEYS.KEEP_LOGGED_IN);
    } catch (error) {
      console.error('Error clearing tokens', error);
    }
  },
};
