import { SkeletonBase } from './SkeletonBase';
import { Sparkles } from 'lucide-react';
import ContentSpinner from '@/shared/components/ContentSpinner';

/**
 * Skeleton component shown while AI is generating the journal entry summary
 * Matches the exact style of JournalEntryCard with a "Generating..." badge
 */
export function GeneratingSummarySkeleton() {
  return (
    <div className="rounded-2xl bg-[#2B2D30] transition-all duration-200 flex flex-col">
      {/* Image Section */}
      <div className="w-full aspect-square rounded-t-2xl overflow-hidden relative bg-[#16171a]">
        <SkeletonBase width="w-full" height="h-full" rounded="2xl" className="!rounded-b-none" />

        {/* Spinner in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <ContentSpinner size="md" />
        </div>

        {/* Generating Badge - Top Left */}
        <div className="absolute top-3 left-3 z-30">
          <span className="text-sm font-medium text-white bg-black/15 backdrop-blur-sm px-2 py-1 rounded-lg whitespace-nowrap animate-pulse flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-white -mt-0.5" />
            Generating...
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5 relative">
        {/* Title */}
        <div className="flex-1">
          <div className="space-y-2">
            <SkeletonBase width="w-full" height="h-4" rounded="md" />
            <SkeletonBase width="w-3/4" height="h-4" rounded="md" />
          </div>
        </div>
      </div>

    </div>
  );
}
