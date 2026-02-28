import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/shared/lib/writing';

/**
 * Manages scroll to position user messages at the top of viewport
 * Uses spacer elements to create empty space for AI responses
 *
 * @param messages - Array of chat messages
 * @param isInitializing - Whether the session is still initializing
 * @returns Object containing the messagesEndRef and lastUserMessageRef
 */
export function useAutoScroll(messages: ChatMessage[], isInitializing: boolean) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(0);

  // Scroll to position the last user message at the top when a new message is added
  useEffect(() => {
    if (isInitializing || messages.length === 0) return;

    const messageCountChanged = messages.length !== previousMessageCountRef.current;
    if (!messageCountChanged) return;

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

    if (lastUserMessage && messageCountChanged) {
      previousMessageCountRef.current = messages.length;

      // Scroll to position the user message at the top of the viewport
      setTimeout(() => {
        lastUserMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [messages, isInitializing]);

  return { messagesEndRef, lastUserMessageRef };
}
