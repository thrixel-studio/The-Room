import React, { useState, useEffect } from 'react';
import { Sparkles, Coffee } from 'lucide-react';

/**
 * Skeleton component shown while AI is generating the journal entry summary
 * Matches the exact style of JournalEntryCard with a "Generating..." badge
 */
export function GeneratingSummarySkeleton() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDotCount((c) => (c + 1) % 4);
    }, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="skeleton-card-shimmer rounded-2xl transition-all duration-200 flex flex-col bg-[var(--app-bg-secondary-color)] relative"
      style={{ boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.2)' }}
    >
      {/* Centered spinner over entire card */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="relative -translate-y-2">
          <div
            className="rounded-full animate-spin"
            style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: 'var(--app-accent-secondary-color)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Coffee
              className="w-4 h-4"
              style={{ color: 'var(--app-accent-secondary-color)' }}
            />
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full aspect-square rounded-t-2xl overflow-hidden relative">

        {/* Generating Badge - Top Left with dot animation */}
        <div className="absolute top-3 left-3 z-30">
          <span className="text-sm font-medium text-white px-2 py-1 whitespace-nowrap flex items-center animate-pulse">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-white -mt-0.5" />
            Generating{'.'.repeat(dotCount)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5 relative">
        {/* Title */}
        <div className="flex-1">
          <div className="space-y-2">
            <div className="w-full h-4 rounded-md bg-[var(--app-bg-primary-color)]" />
            <div className="w-3/4 h-4 rounded-md bg-[var(--app-bg-primary-color)]" />
          </div>
        </div>
      </div>

    </div>
  );
}
