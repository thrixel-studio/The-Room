/**
 * Exponential backoff polling utility with visibility awareness
 * Reduces server load by increasing intervals and pausing when tab is hidden
 */

export interface PollingOptions {
  /** Initial polling interval in ms (default: 1500) */
  initialInterval: number;
  /** Maximum interval cap in ms (default: 10000) */
  maxInterval: number;
  /** Backoff multiplier (default: 2) */
  backoffMultiplier: number;
  /** Maximum polling attempts before stopping (default: 120) */
  maxAttempts: number;
  /** Polling function - return true to stop polling */
  onPoll: () => Promise<boolean>;
  /** Called when polling completes (either success or max attempts) */
  onComplete?: () => void;
  /** Called on error */
  onError?: (error: Error) => void;
  /** Called when max attempts reached */
  onTimeout?: () => void;
}

export interface PollerControls {
  /** Stop polling and cleanup */
  stop: () => void;
  /** Reset interval back to initial value */
  resetInterval: () => void;
}

/**
 * Creates an exponential backoff poller with document visibility awareness
 *
 * Features:
 * - Exponential backoff: intervals grow from initialInterval to maxInterval
 * - Visibility awareness: pauses when tab is hidden, resumes on focus
 * - Automatic cleanup on stop or max attempts
 *
 * @example
 * const poller = createBackoffPoller({
 *   initialInterval: 1500,
 *   maxInterval: 10000,
 *   backoffMultiplier: 2,
 *   maxAttempts: 120,
 *   onPoll: async () => {
 *     const status = await fetchStatus();
 *     return status === 'COMPLETED'; // return true to stop
 *   },
 *   onError: (error) => console.error(error),
 * });
 *
 * // Later: poller.stop();
 */
export function createBackoffPoller(options: PollingOptions): PollerControls {
  const {
    initialInterval,
    maxInterval,
    backoffMultiplier,
    maxAttempts,
    onPoll,
    onComplete,
    onError,
    onTimeout,
  } = options;

  let currentInterval = initialInterval;
  let attempts = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isPaused = false;
  let isStopped = false;

  const handleVisibilityChange = () => {
    if (isStopped) return;

    const wasHidden = isPaused;
    isPaused = document.hidden;

    // Resume polling when tab becomes visible
    if (wasHidden && !isPaused && timeoutId === null) {
      scheduleNext();
    }
  };

  const scheduleNext = () => {
    if (isPaused || isStopped) return;

    timeoutId = setTimeout(executePoll, currentInterval);
    // Increase interval for next poll (exponential backoff)
    currentInterval = Math.min(currentInterval * backoffMultiplier, maxInterval);
  };

  const executePoll = async () => {
    timeoutId = null;

    if (isPaused || isStopped) return;

    attempts++;

    try {
      const shouldStop = await onPoll();

      if (shouldStop) {
        cleanup();
        onComplete?.();
        return;
      }

      if (attempts >= maxAttempts) {
        cleanup();
        onTimeout?.();
        return;
      }

      scheduleNext();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));

      // Continue polling on error unless max attempts reached
      if (attempts < maxAttempts && !isStopped) {
        scheduleNext();
      } else {
        cleanup();
        onTimeout?.();
      }
    }
  };

  const cleanup = () => {
    isStopped = true;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };

  // Initialize
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    isPaused = document.hidden;
  }

  // Start immediately with first poll
  if (!isPaused) {
    executePoll();
  }

  return {
    stop: cleanup,
    resetInterval: () => {
      currentInterval = initialInterval;
    },
  };
}
