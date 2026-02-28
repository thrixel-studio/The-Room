'use client';

import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { writingApi } from '@/shared/lib/writing';
import Button from '@/shared/ui/button/Button';

interface FinishSessionButtonProps {
  sessionId: string;
  accessToken: string;
  onFinish: () => void;
  disabled?: boolean;
}

/**
 * Button to finish a writing session and trigger summary generation
 * After clicking, the GeneratingSummaryCard component should be rendered
 * to show the SSE streaming progress
 */
export function FinishSessionButton({
  sessionId,
  accessToken,
  onFinish,
  disabled = false,
}: FinishSessionButtonProps) {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    try {
      setIsFinishing(true);

      // Trigger the finish process on the backend
      await writingApi.finishSession(sessionId, accessToken);

      // Call the parent handler to show the GeneratingSummaryCard
      onFinish();
    } catch (error) {
      console.error('Failed to finish session:', error);
      setIsFinishing(false);
    }
  };

  return (
    <Button
      onClick={handleFinish}
      disabled={disabled || isFinishing}
      variant="primary"
      icon={isFinishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
    >
      {isFinishing ? 'Finishing...' : 'Finish & Generate Summary'}
    </Button>
  );
}
