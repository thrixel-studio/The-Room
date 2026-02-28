"use client";

import React from "react";
import { Play } from "lucide-react";
import { FrameworkBadge } from "@/features/frameworks";
import type { FrameworkKey } from "@/features/frameworks";
import { useSuggestions } from "../hooks/useSuggestions";
import type { Suggestion } from "../types";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onStart: (id: string) => void;
  isCreating: boolean;
}

function SuggestionCard({ suggestion, onStart, isCreating }: SuggestionCardProps) {
  return (
    <div className="bg-[var(--app-bg-secondary-color)] hover:brightness-90 rounded-xl p-4 transition-all duration-200">
      {suggestion.title && (
        <p className="text-sm font-semibold text-white mb-1">{suggestion.title}</p>
      )}
      <p className="text-sm text-white/60 leading-relaxed mb-3">{suggestion.suggestion_text}</p>
      <div className="flex items-center justify-between">
        <FrameworkBadge frameworkKey={suggestion.framework_key as FrameworkKey} />
        <button
          onClick={() => onStart(suggestion.id)}
          disabled={isCreating}
          className="flex items-center gap-1.5 text-xs text-white/60 transition-colors px-3 py-1 rounded-lg border border-white/10 disabled:opacity-50"
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--app-accent-secondary-color)';
            e.currentTarget.style.borderColor = 'var(--app-accent-secondary-color)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '';
            e.currentTarget.style.borderColor = '';
          }}
        >
          <Play className="w-3 h-3" />
          Discuss
        </button>
      </div>
    </div>
  );
}

export default function SuggestionsList() {
  const { suggestions, isLoading, handleStartChat, isCreating } = useSuggestions();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-sm text-[var(--app-text-secondary-color)]">
          Loading...
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <p className="text-sm text-[var(--app-text-secondary-color)] opacity-60">
          Complete a journal entry to get personalized suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <p className="text-xs font-medium text-[var(--app-text-secondary-color)] uppercase tracking-wider px-1 mb-2 flex-shrink-0">
        Explore Further
      </p>
      <div className="flex flex-col gap-2 xl:gap-3 overflow-y-auto min-h-0 flex-1">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onStart={handleStartChat}
            isCreating={isCreating}
          />
        ))}
      </div>
    </div>
  );
}
