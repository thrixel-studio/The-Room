import React from 'react';
import { SkeletonBase } from './SkeletonBase';

interface SidebarItemSkeletonProps {
  count?: number;
}

/**
 * Skeleton for Continue Writing Sidebar items
 * Matches the card layout in the sidebar
 */
export function SidebarItemSkeleton({ count = 3 }: SidebarItemSkeletonProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-4 pt-4 pl-0 space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="relative block rounded-lg bg-[rgb(240,235,225)] bg-gray-800/80 p-4"
          >
            {/* Title - 2 lines */}
            <div className="pr-8 mb-2 space-y-2">
              <SkeletonBase width="w-full" height="h-4" rounded="md" />
              <SkeletonBase width="w-3/4" height="h-4" rounded="md" />
            </div>

            {/* Bottom row: Framework name and date */}
            <div className="flex items-center justify-between gap-2">
              <SkeletonBase width="w-24" height="h-3" rounded="md" />
              <SkeletonBase width="w-20" height="h-3" rounded="md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
