/**
 * Session management utility functions for chat feature
 */

/**
 * Updates the browser URL with the current session ID
 * Uses window.history.replaceState to avoid triggering navigation
 *
 * @param sessionId - The session ID to add to the URL
 */
export function updateUrlWithSession(sessionId: string): void {
  window.history.replaceState({}, '', `/chat/${sessionId}`);
}
