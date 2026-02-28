import React from 'react';
import { SkeletonBase } from './SkeletonBase';

/**
 * Skeleton for Insights Dashboard page
 * Matches the 2-column layout (col-span-5 and col-span-7)
 */
export function InsightsDashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 xl:gap-6 flex-1 min-h-0">
      {/* Left column - Monthly Target + Calendar */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 xl:gap-6 min-h-0">
        {/* Monthly Target card */}
        <div className="bg-[rgb(240,235,225)] bg-gray-800/80 rounded-2xl p-6 space-y-4">
          <SkeletonBase width="w-32" height="h-6" rounded="lg" />
          <div className="space-y-2">
            <SkeletonBase width="w-full" height="h-16" rounded="xl" />
          </div>
          <div className="flex gap-4">
            <SkeletonBase width="w-1/3" height="h-12" rounded="lg" />
            <SkeletonBase width="w-1/3" height="h-12" rounded="lg" />
            <SkeletonBase width="w-1/3" height="h-12" rounded="lg" />
          </div>
        </div>

        {/* Calendar card */}
        <div className="flex-1 min-h-0 bg-[rgb(240,235,225)] bg-gray-800/80 rounded-2xl p-6">
          <SkeletonBase width="w-full" height="h-full" rounded="xl" />
        </div>
      </div>

      {/* Right column - Emotional State Table */}
      <div className="col-span-12 lg:col-span-7 bg-[rgb(240,235,225)] bg-gray-800/80 rounded-2xl p-6 space-y-4">
        <SkeletonBase width="w-40" height="h-6" rounded="lg" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <SkeletonBase width="w-1/3" height="h-10" rounded="lg" />
              <SkeletonBase width="w-1/2" height="h-10" rounded="lg" />
              <SkeletonBase width="w-20" height="h-10" rounded="lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
