import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/shared/lib/storage';
import { useToast } from '@/shared/hooks/useToast';
import { useSendMessageMutation } from '../api/chat.endpoints';
import { isAuthError } from '../utils/auth';
import type { ChatMessage } from '../types';

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  typingMessageIds: Set<string>;
  sendMessage: (content: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
  markTypingComplete: (messageId: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

/**
 * Manages message state, sending, and typing animations
 * Supports LAZY session creation - creates session on first message if needed
 *
 * This hook:
 * - Sends messages with optimistic UI updates
 * - Creates session lazily on first message if sessionId is null
 * - Manages typing animation state
 * - Handles errors with auth checks
 * - Provides typing completion callback
 *
 * @param sessionId - The current session ID (can be null for lazy creation)
 * @param initialMessages - Initial messages to populate the chat
 * @param textareaRef - Reference to the textarea element for auto-focus
 * @param createSessionIfNeeded - Function to create session lazily
 * @param setSessionId - Function to update sessionId after lazy creation
 * @returns Message state and control functions
 */
export function useChatMessages(
  sessionId: string | null,
  initialMessages: ChatMessage[] = [],
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>,
  createSessionIfNeeded?: () => Promise<string | null>,
  setSessionId?: (id: string) => void
): UseChatMessagesReturn {
  const router = useRouter();
  const { showError } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [typingMessageIds, setTypingMessageIds] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sendMessageMutation] = useSendMessageMutation();

  const sendMessage = async (content: string) => {
    if (!content.trim() || isSending) return;

    const userContent = content.trim();
    setIsSending(true);
    setError(null);

    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        router.push('/signin');
        return;
      }

      // Get or create session ID (lazy creation)
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        if (createSessionIfNeeded) {
          currentSessionId = await createSessionIfNeeded();
          if (!currentSessionId) {
            // Session creation failed (error already handled)
            setIsSending(false);
            return;
          }
          // Update parent state with new session ID
          setSessionId?.(currentSessionId);
        } else {
          setError('No session available');
          setIsSending(false);
          return;
        }
      }

      // Add user message to UI immediately (optimistic update)
      const tempUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        session_id: currentSessionId,
        role: 'user',
        content: userContent,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);

      // Send message and get AI response
      const aiMessage = await sendMessageMutation({
        sessionId: currentSessionId,
        content: userContent,
      }).unwrap();

      // Replace temp message with real one and add AI response
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempUserMessage.id);
        return [
          ...withoutTemp,
          { ...tempUserMessage, id: `user-${Date.now()}` },
          aiMessage,
        ];
      });
    } catch (err: any) {
      console.error('Failed to send message:', err);

      // Check if it's an authentication error
      if (isAuthError(err)) {
        // Redirect immediately without showing error
        router.push('/signin');
        return;
      } else {
        showError('Something Went Wrong');
        setError(err.message || 'Failed to send message');
      }

      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => !m.id.startsWith('temp-')));
    } finally {
      setIsSending(false);
      // Auto-focus after send
      textareaRef?.current?.focus();
    }
  };

  const markTypingComplete = (messageId: string) => {
    setTypingMessageIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  return {
    messages,
    typingMessageIds,
    sendMessage,
    isSending,
    error,
    markTypingComplete,
    setMessages,
  };
}
