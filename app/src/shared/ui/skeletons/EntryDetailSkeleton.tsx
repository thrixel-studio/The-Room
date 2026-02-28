import React from 'react';
import { SkeletonBase } from './SkeletonBase';

/**
 * Skeleton for entry detail page
 * Matches the layout of the full journal entry view
 */
export function EntryDetailSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 relative z-0 h-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-transparent overflow-hidden relative">
          {/* Image Section */}
          <div className="w-full h-[300px] overflow-hidden relative bg-neutral-900 rounded-b-2xl">
            <SkeletonBase width="w-full" height="h-full" rounded="2xl" />
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8 relative space-y-6">
            {/* Title */}
            <div className="space-y-3">
              <SkeletonBase width="w-3/4" height="h-8" rounded="lg" />
              <SkeletonBase width="w-1/3" height="h-4" rounded="md" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <SkeletonBase width="w-20" height="h-6" rounded="full" />
              <SkeletonBase width="w-24" height="h-6" rounded="full" />
              <SkeletonBase width="w-16" height="h-6" rounded="full" />
            </div>

            {/* Summary Bullets */}
            <div className="space-y-3">
              <SkeletonBase width="w-full" height="h-4" rounded="md" />
              <SkeletonBase width="w-full" height="h-4" rounded="md" />
              <SkeletonBase width="w-5/6" height="h-4" rounded="md" />
            </div>

            {/* Content Text */}
            <div className="space-y-3 pt-4">
              <SkeletonBase width="w-full" height="h-4" rounded="md" />
              <SkeletonBase width="w-full" height="h-4" rounded="md" />
              <SkeletonBase width="w-full" height="h-4" rounded="md" />
              <SkeletonBase width="w-4/5" height="h-4" rounded="md" />
              <SkeletonBase width="w-full" height="h-4" rounded="md" />
              <SkeletonBase width="w-full" height="h-4" rounded="md" />
              <SkeletonBase width="w-3/4" height="h-4" rounded="md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
