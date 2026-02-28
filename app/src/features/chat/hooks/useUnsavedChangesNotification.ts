import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';
import type { ChatMessage } from '../types';

/**
 * Shows toast notification when navigating away with unsaved messages
 *
 * This hook:
 * - Tracks the initial message count on mount
 * - Shows info toast on unmount if new messages were added but not finished
 * - Invalidates entries query to refresh journal page with draft
 *
 * @param sessionId - The current session ID
 * @param messages - Current messages array
 * @param hasFinished - Whether the session has been finished
 * @param initialMessageCount - The count of messages when session was first loaded
 */
export function useUnsavedChangesNotification(
  sessionId: string | null,
  messages: ChatMessage[],
  hasFinished: boolean,
  initialMessageCount: number
): void {
  const queryClient = useQueryClient();
  const { showInfo } = useToast();

  const messagesRef = useRef<ChatMessage[]>([]);
  const sessionIdRef = useRef<string | null>(null);
  const hasFinishedRef = useRef(false);

  // Keep refs in sync with state for cleanup effect
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    hasFinishedRef.current = hasFinished;
  }, [hasFinished]);

  // Handle navigation away without finishing
  useEffect(() => {
    return () => {
      // Only show toast on component unmount if navigating away without finishing
      // Use refs to get the current values at unmount time
      // Only show if NEW messages were added during this session
      const currentMessageCount = messagesRef.current.length;
      const newMessagesAdded = currentMessageCount > initialMessageCount;

      if (newMessagesAdded && !hasFinishedRef.current && sessionIdRef.current) {
        showInfo('Success! Draft Saved');
        // Invalidate entries query so the journal page will refetch and show the draft
        queryClient.invalidateQueries({ queryKey: ['entries'] });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
