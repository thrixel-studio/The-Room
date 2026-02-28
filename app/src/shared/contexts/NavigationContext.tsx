'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextValue {
  /** True if this is the very first load of the app (hard refresh) */
  isInitialLoad: boolean;
  /** True if page content is ready to be shown */
  isContentReady: boolean;
  /** True if user data has been loaded (on initial load) */
  isUserDataLoaded: boolean;
  /** Mark initial load as complete (called after first page renders) */
  markInitialLoadComplete: () => void;
  /** Mark content as ready (called by pages when their content is rendered) */
  markContentReady: () => void;
  /** Reset content ready state (called on navigation) */
  resetContentReady: () => void;
  /** Mark user data as loaded (called by UserDataProvider) */
  markUserDataLoaded: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const contentReadyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track pathname changes to detect navigation
  useEffect(() => {
    if (previousPathname.current !== null && previousPathname.current !== pathname) {
      // Navigation happened - reset content ready
      setIsContentReady(false);

      // Clear any pending timeout
      if (contentReadyTimeoutRef.current) {
        clearTimeout(contentReadyTimeoutRef.current);
      }

      // Set a maximum wait time - if content doesn't signal ready within 2s, show anyway
      contentReadyTimeoutRef.current = setTimeout(() => {
        setIsContentReady(true);
      }, 2000);
    }

    previousPathname.current = pathname;

    return () => {
      if (contentReadyTimeoutRef.current) {
        clearTimeout(contentReadyTimeoutRef.current);
      }
    };
  }, [pathname]);

  const markInitialLoadComplete = useCallback(() => {
    setIsInitialLoad(false);
  }, []);

  const markContentReady = useCallback(() => {
    if (contentReadyTimeoutRef.current) {
      clearTimeout(contentReadyTimeoutRef.current);
    }
    setIsContentReady(true);
  }, []);

  const resetContentReady = useCallback(() => {
    setIsContentReady(false);
  }, []);

  const markUserDataLoaded = useCallback(() => {
    setIsUserDataLoaded(true);
  }, []);

  return (
    <NavigationContext.Provider value={{
      isInitialLoad,
      isContentReady,
      isUserDataLoaded,
      markInitialLoadComplete,
      markContentReady,
      resetContentReady,
      markUserDataLoaded,
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

/**
 * Hook that marks content as ready when component mounts
 * Use this in page components to signal when they're ready to be shown
 */
export function useContentReady(isReady: boolean = true) {
  const { markContentReady } = useNavigation();

  useEffect(() => {
    if (isReady) {
      // Small delay to ensure DOM has updated
      const timer = setTimeout(() => {
        markContentReady();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isReady, markContentReady]);
}
