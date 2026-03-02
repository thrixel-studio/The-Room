"use client";

import { MonthlyTarget, EmotionalStateTable } from "@/features/insights";
import { SuggestionsList } from "@/features/suggestions";
import React, { useState, useEffect } from "react";
import { useContentReady } from "@/shared/contexts/NavigationContext";
import { MobileHeader } from "@/shared/components/layout/MobileHeader";

// Hook for animation with delay
function useSlideAnimation(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
}

export default function InsightsPage() {
  // Signal content ready immediately since fixed content renders first
  useContentReady(true);

  // Staggered animations for each block
  const suggestionsVisible = useSlideAnimation(50);
  const journalProgressVisible = useSlideAnimation(100);
  const emotionalStateVisible = useSlideAnimation(150);

  return (
    <div className="flex flex-col md:h-full">
      {/* Mobile header */}
      <MobileHeader title="Insights" />

      <div className="flex flex-col gap-2 xl:gap-3 md:flex-1 md:min-h-0 p-3 md:p-0 md:pb-3">
        <div className="grid grid-cols-12 gap-2 xl:gap-3 md:flex-1 md:min-h-0">
          {/* Left Column - Journalling Progress + Emotional State */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-2 xl:gap-3 md:min-h-0 md:h-full">
            {/* Journalling Progress - Slide Down */}
            <div
              className={`transition-all duration-300 ease-out ${
                journalProgressVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-6'
              }`}
            >
              <MonthlyTarget />
            </div>
            {/* Emotional State - square on mobile, fills remaining height on desktop */}
            <div
              className={`aspect-square md:aspect-auto md:flex-1 md:min-h-0 transition-all duration-300 ease-out ${
                emotionalStateVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
            >
              <EmotionalStateTable />
            </div>
          </div>
          {/* Right Column - Explore Further (full height) */}
          <div
            className={`col-span-12 md:col-span-7 md:min-h-0 md:h-full transition-all duration-300 ease-out ${
              suggestionsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            <SuggestionsList />
          </div>
        </div>
      </div>
    </div>
  );
}
