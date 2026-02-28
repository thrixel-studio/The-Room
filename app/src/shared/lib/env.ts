/**
 * Environment variables configuration
 * Centralizes all environment variable access
 */

export const env = {
  /**
   * API Base URL
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',

  /**
   * Google OAuth Client ID
   */
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',

  /**
   * Environment name
   */
  nodeEnv: process.env.NODE_ENV || 'development',

  /**
   * Check if running in production
   */
  isProduction: process.env.NODE_ENV === 'production',

  /**
   * Check if running in development
   */
  isDevelopment: process.env.NODE_ENV === 'development',
} as const;
