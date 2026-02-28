import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface EmptyStatePromptProps {
  show: boolean;
}

/**
 * Displays the "What's on your mind today?" heading when chat is empty
 *
 * @param show - Whether to display the prompt
 */
export function EmptyStatePrompt({ show }: EmptyStatePromptProps) {
  const { user } = useAuth();

  if (!show) return null;

  // Get user's first name
  const userName = user?.first_name || '';
  const showUserName = !!userName;

  return (
    <h1 className="text-center font-bold text-[var(--app-text-secondary-color)] text-4xl pb-6 mb-4 font-[family-name:var(--font-dancing-script)]">
      What's on your mind today{showUserName ? ',' : ''}{' '}
      {showUserName && (
        <span className="inline-block">
          {userName}
        </span>
      )}
      ?
    </h1>
  );
}
