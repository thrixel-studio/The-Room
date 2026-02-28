'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useGetCurrentUserQuery } from '@/features/settings/api/profile.endpoints';
import { tokenStorage } from '@/shared/lib/storage';
import type { User } from '@/features/auth/types';

interface UserDataContextValue {
  /** The current user data (null if not loaded or not authenticated) */
  user: User | undefined;
  /** True while user data is being fetched */
  isLoading: boolean;
  /** True if user data has been loaded at least once (even if null) */
  isInitialized: boolean;
  /** Refetch user data */
  refetch: () => void;
}

const UserDataContext = createContext<UserDataContextValue | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const hasToken = typeof window !== 'undefined' && !!tokenStorage.getAccessToken();
  const initializedRef = useRef(false);

  const {
    data: user,
    isLoading,
    isFetching,
    refetch,
    isSuccess,
    isError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !hasToken,
  });

  // Track initialization - user data is initialized when:
  // - No token exists (no user to load), or
  // - Query has completed (success or error)
  const isInitialized = !hasToken || isSuccess || isError || (!isLoading && !isFetching);

  // Set initialized ref once we're done
  useEffect(() => {
    if (isInitialized && !initializedRef.current) {
      initializedRef.current = true;
    }
  }, [isInitialized]);

  return (
    <UserDataContext.Provider value={{
      user,
      isLoading: isLoading || isFetching,
      isInitialized: initializedRef.current || isInitialized,
      refetch,
    }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider');
  }
  return context;
}
