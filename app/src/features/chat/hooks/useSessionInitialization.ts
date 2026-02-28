import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenStorage } from '@/shared/lib/storage';
import { useCreateChatSessionMutation, useGetChatSessionQuery } from '../api/chat.endpoints';
import { isAuthError } from '../utils/auth';
import { updateUrlWithSession } from '../utils/session';
import type { ChatMessage } from '../types';

interface UseSessionInitializationReturn {
  sessionId: string | null;
  sessionFramework: string | null;
  isInitializing: boolean;
  error: string | null;
  initialMessageCount: number;
  messages: ChatMessage[];
  setTypingMessageIds: (ids: Set<string>) => void;
  /** Create session lazily (on first message). Returns the new session ID. */
  createSessionIfNeeded: () => Promise<string | null>;
  /** Update session ID after lazy creation */
  setSessionId: (id: string) => void;
}

/**
 * Handles session creation, loading from URL, and state management
 * Supports LAZY session creation - sessions are only created when:
 * 1. User explicitly clicks "New Chat" (?new param)
 * 2. User sends their first message (via createSessionIfNeeded)
 * 3. URL contains a session ID that needs loading
 *
 * This reduces empty session creation on route entry.
 *
 * @returns Session initialization state and data
 */
export function useSessionInitialization(): UseSessionInitializationReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionFramework, setSessionFramework] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingMessageIds, setTypingMessageIds] = useState<Set<string>>(new Set());

  const initializingRef = useRef(false);
  const previousSessionIdRef = useRef<string | null>(null);
  const initialMessageCountRef = useRef<number>(0);

  const [createSession] = useCreateChatSessionMutation();

  const urlSessionId = searchParams.get('id');
  const newSessionParam = searchParams.get('new');

  // Only query if we have a URL session ID
  const { data: loadedSession, error: loadError, isLoading: isLoadingSession } = useGetChatSessionQuery(
    urlSessionId || '',
    {
      skip: !urlSessionId || !!newSessionParam,
    }
  );

  /**
   * Create a new session lazily (called before first message)
   * Returns the new session ID or null on failure
   */
  const createSessionIfNeeded = useCallback(async (): Promise<string | null> => {
    // Already have a session
    if (sessionId) return sessionId;

    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        router.push('/signin');
        return null;
      }

      const session = await createSession().unwrap();
      setSessionId(session.id);
      setSessionFramework(session.framework || null);
      previousSessionIdRef.current = session.id;
      setMessages(session.messages || []);
      initialMessageCountRef.current = session.messages?.length || 0;
      updateUrlWithSession(session.id);

      return session.id;
    } catch (err: any) {
      console.error('Failed to create session:', err);
      if (isAuthError(err)) {
        router.push('/signin');
      } else {
        setError(err.message || 'Failed to create session');
      }
      return null;
    }
  }, [sessionId, createSession, router]);

  // Initialize: only load existing sessions or handle explicit "new" param
  useEffect(() => {
    // If no URL session ID and no "new" param, we're ready for lazy creation
    if (!urlSessionId && !newSessionParam) {
      setIsInitializing(false);
      return;
    }

    // Handle "new" param - explicit user action to create new session
    if (newSessionParam) {
      if (initializingRef.current) return;
      initializingRef.current = true;

      const createNewSession = async () => {
        setIsInitializing(true);
        setError(null);

        try {
          const accessToken = tokenStorage.getAccessToken();
          if (!accessToken) {
            router.push('/signin');
            return;
          }

          const session = await createSession().unwrap();
          setSessionId(session.id);
          setSessionFramework(session.framework || null);
          previousSessionIdRef.current = session.id;
          setMessages(session.messages || []);
          initialMessageCountRef.current = session.messages?.length || 0;
          setTypingMessageIds(new Set());
          updateUrlWithSession(session.id);
        } catch (err: any) {
          console.error('Failed to create session:', err);
          if (isAuthError(err)) {
            router.push('/signin');
          } else {
            setError(err.message || 'Failed to create session');
          }
        } finally {
          setIsInitializing(false);
          initializingRef.current = false;
        }
      };

      createNewSession();
      return;
    }

    // Handle URL session ID - load existing session
    if (urlSessionId && urlSessionId !== previousSessionIdRef.current) {
      // Wait for query to complete
      if (isLoadingSession) {
        setIsInitializing(true);
        return;
      }

      if (loadError) {
        console.error('Failed to load session:', loadError);

        if (isAuthError(loadError)) {
          router.push('/signin');
          return;
        }

        // Session not found - clear and allow lazy creation
        setError('Session not found');
        setIsInitializing(false);
        return;
      }

      if (loadedSession) {
        // Check if session is still active
        if (loadedSession.state !== 'ACTIVE') {
          // Inactive session - clear and allow lazy creation
          setSessionId(null);
          setMessages([]);
          setIsInitializing(false);
          return;
        }

        // Load the session
        setSessionId(loadedSession.id);
        setSessionFramework(loadedSession.framework || null);
        previousSessionIdRef.current = loadedSession.id;
        setMessages(loadedSession.messages);
        initialMessageCountRef.current = loadedSession.messages.length;
        setTypingMessageIds(new Set());
        setIsInitializing(false);
      }
    }
  }, [
    urlSessionId,
    newSessionParam,
    loadedSession,
    loadError,
    isLoadingSession,
    createSession,
    router,
  ]);

  return {
    sessionId,
    sessionFramework,
    isInitializing,
    error,
    initialMessageCount: initialMessageCountRef.current,
    messages,
    setTypingMessageIds,
    createSessionIfNeeded,
    setSessionId,
  };
}
