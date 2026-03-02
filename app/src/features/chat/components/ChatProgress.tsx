import React from 'react';
import ProgressBar from '@/shared/components/ProgressBar';
import { ChatMessage } from '../types';

interface ChatProgressProps {
  messages?: ChatMessage[];
  inline?: boolean;
}

/**
 * Displays circular progress indicator showing chat completion status
 * Progress is calculated ONLY from AI-provided completion_percentage (0.0-1.0)
 * Shows 0% until AI provides the first completion percentage
 * Fixed position in top right corner (or inline when inline=true)
 *
 * @param messages - Array of chat messages to extract AI completion percentage
 * @param inline - When true, renders without fixed positioning (for use in headers)
 */
export function ChatProgress({ messages, inline }: ChatProgressProps) {
  // Find the last assistant message with completion_percentage
  let progress = 0;

  if (messages && messages.length > 0) {
    // Use the maximum completion_percentage across all assistant messages
    // so the bar can only increase or stay the same, never go backwards
    const maxPercentage = messages.reduce((max, msg) => {
      if (msg.role === 'assistant' && msg.completion_percentage !== undefined) {
        return Math.max(max, msg.completion_percentage);
      }
      return max;
    }, 0);

    progress = maxPercentage * 100;
  }

  return <ProgressBar progress={progress} unfilledColor="var(--app-bg-tertiary-color)" inline={inline} />;
}
