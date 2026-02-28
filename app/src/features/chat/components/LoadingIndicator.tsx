import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingIndicatorProps {
  show: boolean;
}

/**
 * Displays animated sparkles icon while waiting for AI response
 * Shows with fade-in animation when a message is being sent
 * "Thinking" dots animate: 0 → 1 → 2 → 3 → repeat
 *
 * @param show - Whether to display the loading indicator
 */
export function LoadingIndicator({ show }: LoadingIndicatorProps) {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!show) return;
    const id = setInterval(() => {
      setDotCount((c) => (c + 1) % 4);
    }, 700);
    return () => clearInterval(id);
  }, [show]);

  if (!show) return null;

  return (
    <div className="flex justify-start animate-modal-fade-in">
      <div className="py-1.5 md:py-1.5">
        <div className="flex items-center gap-2 animate-pulse">
          <Sparkles
            className="w-5 h-5"
            style={{ color: 'var(--app-accent-color)' }}
          />
          <span className="text-sm text-[var(--app-text-secondary-color)]">
            Thinking{'.'.repeat(dotCount)}
          </span>
        </div>
      </div>
    </div>
  );
}
