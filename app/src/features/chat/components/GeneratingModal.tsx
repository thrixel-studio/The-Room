'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Modal } from '@/shared/ui/modal';
import JournalEntryCard from '@/features/journal/components/JournalEntryCard';
import { GeneratingSummarySkeleton } from '@/shared/ui/skeletons/GeneratingSummarySkeleton';
import { ArrowLeft } from 'lucide-react';
import { tokenStorage } from '@/shared/lib/storage';
import { authenticatedFetchJson } from '@/shared/lib/api-client';
import { entriesApi, EntryDetail } from '@/shared/lib/entries';
import { createBackoffPoller, PollerControls } from '@/shared/lib/polling';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/shared/contexts/ToastContext';

interface GeneratingCardModalProps {
  isOpen: boolean;
  sessionId: string;
  onComplete: (entryId: string) => void;
  messageCount?: number;
}

interface AnalysisStatusResponse {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR';
  progress_percent?: number;
  stage?: string;
  message?: string;
  entry_id?: string;
  error?: string;
}

export function GeneratingCardModal({ isOpen, sessionId, onComplete, messageCount = 0 }: GeneratingCardModalProps) {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [status, setStatus] = useState<'loading' | 'completed'>('loading');
  const [entry, setEntry] = useState<EntryDetail | null>(null);

  const pollerRef = useRef<PollerControls | null>(null);
  // Refs to avoid stale closures in poller callbacks
  const onCompleteRef = useRef(onComplete);
  const showToastRef = useRef(showToast);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { showToastRef.current = showToast; }, [showToast]);

  // Called on any error path — shows toast and dismisses the modal
  const handleAnalysisError = useCallback(() => {
    showToastRef.current({
      variant: 'error',
      title: 'Analysis failed to create',
      message: 'Something went wrong generating your analysis. Please try again.',
      duration: 5000,
    });
    onCompleteRef.current('');
  }, []);

  const fetchEntryData = useCallback(async (entryId: string) => {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        handleAnalysisError();
        return;
      }
      const entryData = await entriesApi.getEntry(entryId, accessToken);
      setEntry(entryData);
      setStatus('completed');
    } catch (err) {
      console.error('Failed to fetch entry:', err);
      handleAnalysisError();
    }
  }, [handleAnalysisError]);

  const startPollingFallback = useCallback(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      handleAnalysisError();
      return;
    }

    pollerRef.current = createBackoffPoller({
      initialInterval: 1500,
      maxInterval: 3000,
      backoffMultiplier: 1.5,
      maxAttempts: 120,
      onPoll: async () => {
        const currentToken = tokenStorage.getAccessToken();
        if (!currentToken) {
          handleAnalysisError();
          return true;
        }

        const response = await authenticatedFetchJson<AnalysisStatusResponse>(
          `/writing/chat/sessions/${sessionId}/analysis-status`,
          currentToken
        );

        if (response.status === 'IN_PROGRESS' || response.status === 'PENDING') {
          return false;
        }

        if (response.status === 'COMPLETED' && response.entry_id) {
          await fetchEntryData(response.entry_id);
          return true;
        }

        if (response.status === 'ERROR') {
          handleAnalysisError();
          return true;
        }

        return false;
      },
      onError: (err) => {
        console.error('Polling error:', err);
      },
      onTimeout: () => {
        handleAnalysisError();
      },
    });
  }, [sessionId, fetchEntryData, handleAnalysisError]);

  const cleanup = useCallback(() => {
    if (pollerRef.current) {
      pollerRef.current.stop();
      pollerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    setStatus('loading');
    setEntry(null);

    startPollingFallback();

    return cleanup;
  }, [isOpen, sessionId, startPollingFallback, cleanup]);

  const handleBackClick = () => {
    cleanup();
    router.push('/journal');
  };

  const handleCardClick = () => {
    if (entry) {
      router.push(`/journal/${entry.id}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      showCloseButton={false}
      isFullscreen={true}
    >
      <div className="fixed inset-0 bg-[#111111]/85 backdrop-blur-sm flex items-center justify-center p-4">
        {/* Back Button - Top Left — hidden while generating if conversation has 10+ messages */}
        {!(status === 'loading' && messageCount >= 10) && (
          <button
            onClick={handleBackClick}
            className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
            <span className="text-sm font-medium text-gray-300">Back</span>
          </button>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4 -mt-16">
            <h3 className="text-3xl font-medium text-white mb-2">
              Analyzing...
            </h3>
            <p className="text-white/80 text-md text-center max-w-md mb-10">
              Conversation is under processing, please wait 20-25 seconds.
            </p>
            <div className="w-[240px]">
              <GeneratingSummarySkeleton />
            </div>
          </div>
        )}

        {status === 'completed' && entry && (
          <div className="flex flex-col items-center animate-modal-fade-in -mt-16">
            <h3 className="text-3xl font-medium text-white mb-2">
              Generated Successfully
            </h3>
            <p className="text-gray-400 text-md text-center max-w-md mb-10">
              Click on a card to see expanded analysis of your conversation.
            </p>
            <div
              className="cursor-pointer"
              onClick={handleCardClick}
            >
              <JournalEntryCard entry={{
                ...entry,
                hero_image_url: entry.hero_image_url ?? null,
                summary_bullets: entry.summary?.summary_bullets || []
              }} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
