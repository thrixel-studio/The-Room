import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Ellipsis } from 'lucide-react';
import { decodeHtmlEntities } from '@/shared/lib/text';
import type { ChatMessage } from '../types';

interface MessageRendererProps {
  message: ChatMessage;
  isTyping: boolean;
  shouldAnimate: boolean;
  onTypingComplete: () => void;
  isLastAI?: boolean;
}

/**
 * Renders an individual message with slide-in animations
 * Handles both user and assistant messages with different styling
 *
 * @param message - The message to render
 * @param isTyping - Whether to show typing animation for this message (unused, kept for compatibility)
 * @param shouldAnimate - Whether to show slide-in animation
 * @param onTypingComplete - Callback when typing animation completes (unused, kept for compatibility)
 * @param isLastAI - Whether this is the last AI message (for slide-up animation)
 */
export const MessageRenderer = React.memo(function MessageRenderer({
  message,
  isTyping,
  shouldAnimate,
  onTypingComplete,
  isLastAI = false,
}: MessageRendererProps) {
  const isAssistant = message.role === 'assistant';
  const [isCopied, setIsCopied] = useState(false);

  const animationClass = shouldAnimate && isAssistant
    ? (isLastAI ? 'animate-slide-in-up' : 'animate-slide-in-from-left')
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      // Reset back to copy icon after 1 second
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} ${animationClass}`}>
      <div className={isAssistant ? 'w-full' : 'max-w-[80%]'}>
        {isAssistant ? (
          <div className="relative group">
            <div
              className="px-2.5 py-1.5 md:px-3 md:py-1.5"
              style={{ borderLeft: '2px solid var(--app-accent-color)' }}
            >
              <p className="text-sm text-gray-800 text-white/90 leading-relaxed break-words whitespace-pre-wrap">
                {decodeHtmlEntities(message.content)}
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="p-0 bg-transparent border-0 transition-all duration-200 hover:opacity-70"
                style={{ color: 'var(--app-text-secondary-color)' }}
                onClick={handleCopy}
                title={isCopied ? 'Copied!' : 'Copy message'}
              >
                <div className="relative w-[14px] h-[14px]">
                  <Copy
                    size={14}
                    className={`absolute inset-0 transition-all duration-200 ${
                      isCopied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
                    }`}
                  />
                  <Check
                    size={14}
                    className={`absolute inset-0 transition-all duration-200 ${
                      isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                  />
                </div>
              </button>
              <button
                className="p-0 bg-transparent border-0"
                style={{ color: 'var(--app-text-secondary-color)' }}
                onClick={() => console.log('Refresh clicked')}
              >
                <RefreshCw size={14} />
              </button>
              <button
                className="p-0 bg-transparent border-0"
                style={{ color: 'var(--app-text-secondary-color)' }}
                onClick={() => console.log('Ellipsis clicked')}
              >
                <Ellipsis size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-1.5 px-3 bg-[var(--app-bg-secondary-color)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md shadow-sm">
            <p className="text-sm text-gray-800 text-white/90 leading-relaxed break-words whitespace-pre-wrap">
              {decodeHtmlEntities(message.content)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

MessageRenderer.displayName = 'MessageRenderer';
