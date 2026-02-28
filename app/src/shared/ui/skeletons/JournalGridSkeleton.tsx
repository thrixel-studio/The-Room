import React from 'react';
import { JournalCardSkeleton } from './JournalCardSkeleton';

interface JournalGridSkeletonProps {
  count?: number;
  hasSidebar?: boolean;
}

/**
 * Skeleton for the journal grid layout
 * Renders multiple card skeletons in the same grid layout as the real component
 */
export function JournalGridSkeleton({ count = 8, hasSidebar = false }: JournalGridSkeletonProps) {
  return (
    <div className="flex justify-center pt-4 pb-8">
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${hasSidebar ? 'xl:grid-cols-4' : 'xl:grid-cols-5'} gap-6 max-w-[1600px] w-full pr-4`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            <JournalCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
