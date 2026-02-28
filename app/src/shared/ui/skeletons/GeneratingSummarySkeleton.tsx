import { SkeletonBase } from './SkeletonBase';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

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

        {/* Custom Spinner in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative w-[76px] h-[76px]">

            {/* Static background ring */}
            <svg viewBox="0 0 76 76" className="absolute inset-0 w-full h-full">
              <circle
                cx="38" cy="38" r="34"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="3"
              />
            </svg>

            {/* Rotating arc */}
            <div className="absolute inset-0 animate-spin [animation-duration:2.2s]">
              <svg viewBox="0 0 76 76" className="w-full h-full">
                <circle
                  cx="38" cy="38" r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="53 160"
                />
              </svg>
            </div>

            {/* Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/images/logo/s3.png"
                alt="Loading"
                width={32}
                height={32}
              />
            </div>

          </div>
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
