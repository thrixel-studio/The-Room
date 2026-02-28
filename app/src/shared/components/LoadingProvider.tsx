'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AppLoading from './AppLoading';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  finishLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Automatically finish loading after initial mount
    const timer = setTimeout(() => {
      finishLoading();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setIsFadingOut(false);
    setShowLoading(true);
  };

  const finishLoading = () => {
    setIsFadingOut(true);
    setIsLoading(false);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, finishLoading }}>
      {showLoading && (
        <AppLoading isFadingOut={isFadingOut} onComplete={handleLoadingComplete} />
      )}
      {children}
    </LoadingContext.Provider>
  );
}
