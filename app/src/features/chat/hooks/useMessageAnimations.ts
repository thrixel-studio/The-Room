import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/shared/lib/writing';

/**
 * Tracks which messages should show slide-in animations
 * Only newly appearing messages should animate
 *
 * @param messages - Array of chat messages
 * @returns Object with shouldAnimate function
 */
export function useMessageAnimations(messages: ChatMessage[]) {
  const [animatedMessageIds, setAnimatedMessageIds] = useState<Set<string>>(new Set());
  const previousMessageIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentMessageIds = new Set(messages.map(m => m.id));
    const previousIds = previousMessageIdsRef.current;

    // Find new messages that weren't in the previous set
    const newMessageIds = new Set(
      [...currentMessageIds].filter(id => !previousIds.has(id))
    );

    if (newMessageIds.size > 0) {
      // Mark new messages for animation
      setAnimatedMessageIds(prev => new Set([...prev, ...newMessageIds]));

      // After animation completes (400ms), remove from animated set
      setTimeout(() => {
        setAnimatedMessageIds(prev => {
          const updated = new Set(prev);
          newMessageIds.forEach(id => updated.delete(id));
          return updated;
        });
      }, 400);
    }

    // Update the previous message IDs
    previousMessageIdsRef.current = currentMessageIds;
  }, [messages]);

  /**
   * Determines if a message should show the slide-in animation
   * @param messageId - The ID of the message to check
   */
  const shouldAnimate = (messageId: string): boolean => {
    return animatedMessageIds.has(messageId);
  };

  return {
    shouldAnimate,
  };
}
