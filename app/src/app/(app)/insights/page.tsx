"use client";

import { MonthlyTarget, EmotionalStateTable } from "@/features/insights";
import { SuggestionsList } from "@/features/suggestions";
import React, { useState, useEffect } from "react";
import { useContentReady } from "@/shared/contexts/NavigationContext";

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
    <div className="flex flex-col gap-2 xl:gap-3 h-full pb-3">
      <div className="grid grid-cols-12 gap-2 xl:gap-3 flex-1 min-h-0">
        {/* Left Column - Journalling Progress + Emotional State */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-2 xl:gap-3 min-h-0 h-full">
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
          {/* Emotional State - takes remaining height */}
          <div
            className={`flex-1 min-h-0 transition-all duration-300 ease-out ${
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
          className={`col-span-12 lg:col-span-7 min-h-0 h-full transition-all duration-300 ease-out ${
            suggestionsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <SuggestionsList />
        </div>
      </div>
    </div>
  );
}
