'use client';

import { useState, useEffect } from 'react';
import AppLoading from './AppLoading';
import { useNavigation } from '@/shared/contexts/NavigationContext';

export default function PageLoadingWrapper() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const { isInitialLoad, isContentReady, isUserDataLoaded, markInitialLoadComplete } = useNavigation();

  const isFullyReady = isInitialLoad
    ? (isContentReady && isUserDataLoaded)
    : isContentReady;

  useEffect(() => {
    if (!isFullyReady) return;

    setIsFadingOut(true);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      if (isInitialLoad) {
        markInitialLoadComplete();
      }
    }, 500);

    return () => clearTimeout(removeTimer);
  }, [isFullyReady, isInitialLoad, markInitialLoadComplete]);

  if (!shouldRender) return null;

  return <AppLoading isFadingOut={isFadingOut} />;
}
