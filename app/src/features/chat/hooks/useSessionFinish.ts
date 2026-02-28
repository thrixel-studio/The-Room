import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '@/shared/lib/storage';
import { useFinishSessionMutation } from '../api/chat.endpoints';

interface UseSessionFinishReturn {
  finishSession: () => Promise<void>;
  isFinishing: boolean;
  showGeneratingModal: boolean;
  generatingSessionId: string | null;
  onModalComplete: (entryId: string) => void;
}

/**
 * Handles session finishing and modal management
 * Migrates from legacy writingApi to RTK Query useFinishSessionMutation
 *
 * This hook:
 * - Prevents multiple simultaneous finish requests
 * - Shows generating modal immediately
 * - Calls finish API in background
 * - Handles modal completion and navigation
 *
 * @param sessionId - The current session ID
 * @returns Session finish state and control functions
 */
export function useSessionFinish(sessionId: string | null): UseSessionFinishReturn {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isFinishing, setIsFinishing] = useState(false);
  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [generatingSessionId, setGeneratingSessionId] = useState<string | null>(null);

  const [finishSessionMutation] = useFinishSessionMutation();

  const finishSession = async () => {
    if (!sessionId) return;

    // Prevent multiple simultaneous finish requests
    if (isFinishing) {
      console.log('Entry already being finished, ignoring duplicate request');
      return;
    }

    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      router.push('/signin');
      return;
    }

    console.log('Finishing session:', sessionId);

    // Mark as finishing
    setIsFinishing(true);

    // Show modal immediately (don't navigate)
    setGeneratingSessionId(sessionId);
    setShowGeneratingModal(true);

    // Call finish API in background
    try {
      await finishSessionMutation(sessionId).unwrap();
    } catch (err: any) {
      console.error('Failed to finish entry:', err);
      setShowGeneratingModal(false);
      setIsFinishing(false);
    }
  };

  const onModalComplete = (entryId: string) => {
    setShowGeneratingModal(false);
    queryClient.invalidateQueries({ queryKey: ['entries'] });
    router.push('/journal');
  };

  return {
    finishSession,
    isFinishing,
    showGeneratingModal,
    generatingSessionId,
    onModalComplete,
  };
}
