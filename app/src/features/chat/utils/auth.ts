/**
 * Authentication utility functions for chat feature
 */

/**
 * Detects if an error is authentication-related
 * Centralizes auth error detection logic used throughout the chat feature
 *
 * @param error - The error object to check
 * @returns true if the error indicates an authentication issue
 */
export function isAuthError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message?.toLowerCase() || '';

  return (
    errorMessage.includes('authentication') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('401')
  );
}
