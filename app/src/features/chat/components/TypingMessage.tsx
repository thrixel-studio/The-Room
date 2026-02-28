"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useWordTypingEffect } from '@/shared/hooks/useWordTypingEffect';
import { decodeHtmlEntities } from '@/shared/lib/text';

interface TypingMessageProps {
  content: string;
  speed?: number;
  onTypingComplete?: () => void;
  className?: string;
}

export function TypingMessage({
  content,
  speed = 50,
  onTypingComplete,
  className = ''
}: TypingMessageProps) {
  // Decode HTML entities before typing effect
  const decodedContent = useMemo(() => decodeHtmlEntities(content), [content]);
  const [isAnimating, setIsAnimating] = useState(false);

  const { displayedText, isTyping } = useWordTypingEffect({
    text: decodedContent,
    speed,
    onComplete: onTypingComplete
  });

  // Trigger animation pulse when text changes
  useEffect(() => {
    if (isTyping) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, isTyping]);

  return (
    <div className="relative group">
      <div
        className={`px-2.5 py-1.5 md:px-3 md:py-1.5 transition-all duration-150 ${className}`}
        style={{
          borderLeft: '2px solid var(--app-accent-color)',
          opacity: isAnimating ? 0.85 : 1
        }}
      >
        <p className="text-sm text-gray-800 text-white/90 leading-relaxed break-words">
          <span className="inline-block transition-all duration-100 ease-out">
            {displayedText}
          </span>
          {isTyping && (
            <span className="inline-block w-1 h-4 ml-0.5 bg-[var(--app-accent-color)] animate-pulse" />
          )}
        </p>
      </div>
    </div>
  );
}
