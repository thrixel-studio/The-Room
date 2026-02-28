'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Modal } from '@/shared/ui/modal';
import JournalEntryCard from '@/features/journal/components/JournalEntryCard';
import { GeneratingSummarySkeleton } from '@/shared/ui/skeletons/GeneratingSummarySkeleton';
import { X, ArrowLeft } from 'lucide-react';
import { tokenStorage } from '@/shared/lib/storage';
import { authenticatedFetchJson } from '@/shared/lib/api-client';
import { entriesApi, EntryDetail } from '@/shared/lib/entries';
import { createBackoffPoller, PollerControls } from '@/shared/lib/polling';
import Button from '@/shared/ui/button/Button';
import { useRouter } from 'next/navigation';

interface GeneratingCardModalProps {
  isOpen: boolean;
  sessionId: string;
  onComplete: (entryId: string) => void;
}

interface AnalysisStatusResponse {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR';
  progress_percent?: number;
  stage?: string;
  message?: string;
  entry_id?: string;
  error?: string;
}

export function GeneratingCardModal({ isOpen, sessionId, onComplete }: GeneratingCardModalProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'completed' | 'error'>('loading');
  const [progress, setProgress] = useState({ percent: 0, stage: '', message: '' });
  const [entry, setEntry] = useState<EntryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollerRef = useRef<PollerControls | null>(null);

  // Fetch entry data after completion
  const fetchEntryData = useCallback(async (entryId: string) => {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        setStatus('error');
        setError('Authentication required');
        return;
      }
      const entryData = await entriesApi.getEntry(entryId, accessToken);
      setEntry(entryData);
      setProgress({ percent: 100, stage: 'COMPLETED', message: 'Complete!' });
      setStatus('completed');
    } catch (err) {
      console.error('Failed to fetch entry:', err);
      setStatus('error');
      setError('Failed to load generated card');
    }
  }, []);

  // Start polling fallback
  const startPollingFallback = useCallback(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      setStatus('error');
      setError('Authentication required');
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
          setStatus('error');
          setError('Authentication required');
          return true;
        }

        const response = await authenticatedFetchJson<AnalysisStatusResponse>(
          `/writing/chat/sessions/${sessionId}/analysis-status`,
          currentToken
        );

        if (response.status === 'IN_PROGRESS' || response.status === 'PENDING') {
          setProgress({
            percent: response.progress_percent || 0,
            stage: response.stage || '',
            message: response.message || 'Processing...'
          });
          return false;
        }

        if (response.status === 'COMPLETED' && response.entry_id) {
          await fetchEntryData(response.entry_id);
          return true;
        }

        if (response.status === 'ERROR') {
          setStatus('error');
          setError(response.error || 'Failed to generate card');
          return true;
        }

        return false;
      },
      onError: (err) => {
        console.error('Polling error:', err);
      },
      onTimeout: () => {
        setStatus('error');
        setError('Analysis timed out. Please check your journal.');
      },
    });
  }, [sessionId, fetchEntryData]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (pollerRef.current) {
      pollerRef.current.stop();
      pollerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    // Reset state when modal opens
    setStatus('loading');
    setProgress({ percent: 0, stage: '', message: '' });
    setEntry(null);
    setError(null);

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
        {/* Back Button - Top Left */}
        <button
          onClick={handleBackClick}
          className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300" />
          <span className="text-sm font-medium text-gray-300">Back</span>
        </button>

        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4 -mt-16">
            {/* Generating text */}
            <h3 className="text-3xl font-medium text-white mb-2">
              Analyzing...
            </h3>
            <p className="text-white/80 text-md text-center max-w-md mb-10">
              Conversation is under processing, please wait 20-25 seconds.
            </p>

            {/* Generating card skeleton - same size as generated card */}
            <div className="w-[280px]">
              <GeneratingSummarySkeleton />
            </div>
          </div>
        )}

        {status === 'completed' && entry && (
          <div className="flex flex-col items-center animate-modal-fade-in -mt-16">
            {/* Completion text */}
            <h3 className="text-3xl font-medium text-white mb-2">
              Generated Successfully
            </h3>
            <p className="text-gray-400 text-md text-center max-w-md mb-10">
              Click on a card to see expanded analysis of your conversation.
            </p>


            <div
              className="w-[280px] cursor-pointer transform transition-transform hover:scale-102"
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

        {status === 'error' && (
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <X className="w-10 h-10 text-red-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">
                Something went wrong
              </h3>
              <p className="text-gray-300">
                {error || 'Failed to generate card'}
              </p>
            </div>
            <Button
              onClick={() => onComplete('')}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2"
            >
              Go to Journal
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
