import { useEffect, useRef } from 'react';

/**
 * Auto-focuses the textarea when appropriate
 * Focuses when initialization completes and no typing animations are running
 *
 * @param isInitializing - Whether the session is still initializing
 * @param typingMessageIds - Set of message IDs currently showing typing animations
 * @returns Object containing the textareaRef to attach to the textarea element
 */
export function useInputFocus(
  isInitializing: boolean,
  typingMessageIds: Set<string>
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when initializing completes and no typing animations are running
  useEffect(() => {
    if (!isInitializing && typingMessageIds.size === 0 && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isInitializing, typingMessageIds]);

  return { textareaRef };
}
