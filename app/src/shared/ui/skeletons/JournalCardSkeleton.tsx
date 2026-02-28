'use client';

import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

interface JournalCardSkeletonProps {
  animationDelay?: number;
}

/**
 * Skeleton for JournalEntryCard component
 * Matches the exact layout and dimensions of the draft card
 */
export function JournalCardSkeleton({ animationDelay = 0 }: JournalCardSkeletonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <div
      className={`group relative rounded-2xl flex flex-col aspect-[10/13] transition-all duration-300 ease-out overflow-hidden border-2 border-[var(--app-bg-primary-color)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        backgroundColor: 'var(--app-bg-tertiary-color)',
        boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.2)'
      }}
    >
      {/* Date badge skeleton - top left */}
      <div className="absolute top-3 left-3 z-10">
        <div className="skeleton-shimmer w-24 h-6 rounded-lg" />
      </div>

      {/* Center Image Icon */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <Image
          size={48}
          className="text-[var(--app-bg-secondary-color)]"
          strokeWidth={1.5}
        />
      </div>

      {/* Bottom title skeleton */}
      <div className="mt-auto p-3">
        <div className="skeleton-shimmer w-3/4 h-4 rounded-md" />
      </div>
    </div>
  );
}
