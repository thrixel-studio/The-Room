"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { makeStore, AppStore } from '@/shared/store/store';
import { LoadingProvider } from '@/shared/components/LoadingProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  
  // Initialize QueryClient
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,     // Data fresh for 5 minutes
        gcTime: 10 * 60 * 1000,       // Keep in cache for 10 minutes
        refetchOnWindowFocus: false,   // Don't refetch on window focus
        retry: 1,                      // Retry failed requests once
      },
    },
  }));
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Apply theme class to document on mount and updates
  useEffect(() => {
    // Initialize theme from localStorage on client
    const stored = localStorage.getItem('theme');
    const theme = stored === 'dark' || stored === 'light' 
      ? stored 
      : window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    
    // Apply initial theme immediately
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Subscribe to theme changes
    const unsubscribe = storeRef.current?.subscribe(() => {
      const state = storeRef.current?.getState();
      if (state?.theme.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={storeRef.current}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </QueryClientProvider>
    </Provider>
  );
}
