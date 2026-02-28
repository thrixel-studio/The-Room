import React from 'react';
import ProgressBar from '@/shared/components/ProgressBar';
import { ChatMessage } from '../types';

interface ChatProgressProps {
  messages?: ChatMessage[];
}

/**
 * Displays circular progress indicator showing chat completion status
 * Progress is calculated ONLY from AI-provided completion_percentage (0.0-1.0)
 * Shows 0% until AI provides the first completion percentage
 * Fixed position in top right corner
 *
 * @param messages - Array of chat messages to extract AI completion percentage
 */
export function ChatProgress({ messages }: ChatProgressProps) {
  // Find the last assistant message with completion_percentage
  let progress = 0;

  if (messages && messages.length > 0) {
    // Search backwards for the last assistant message with completion_percentage
    const lastAIMessage = [...messages].reverse().find(
      msg => msg.role === 'assistant' && msg.completion_percentage !== undefined
    );

    if (lastAIMessage && lastAIMessage.completion_percentage !== undefined) {
      // Convert 0.0-1.0 to 0-100
      progress = lastAIMessage.completion_percentage * 100;
    }
  }

  return <ProgressBar progress={progress} unfilledColor="var(--app-bg-tertiary-color)" />;
}
