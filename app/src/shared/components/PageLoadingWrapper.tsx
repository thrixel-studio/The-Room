'use client';

import { useState, useEffect } from 'react';
import AppLoading from './AppLoading';
import ContentSpinner from './ContentSpinner';
import { useNavigation } from '@/shared/contexts/NavigationContext';

/**
 * Smart loading wrapper that shows:
 * - Full-screen AppLoading on initial page load (hard refresh)
 * - Smaller centered ContentSpinner on tab navigation
 *
 * The loading dissolves only when:
 * - On initial load: Both user data AND page content are ready
 * - On tab navigation: Only page content needs to be ready (user data already loaded)
 * - Or after a maximum timeout (2s fallback)
 */
export default function PageLoadingWrapper() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const { isInitialLoad, isContentReady, isUserDataLoaded, markInitialLoadComplete } = useNavigation();

  // On initial load, we need both user data AND page content to be ready
  // On subsequent navigation, we only need page content (user data is already loaded)
  const isFullyReady = isInitialLoad
    ? (isContentReady && isUserDataLoaded)
    : isContentReady;

  useEffect(() => {
    // Don't start fading until fully ready
    if (!isFullyReady) return;

    // Start fade out
    setIsFadingOut(true);

    // Remove from DOM after fade animation
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      if (isInitialLoad) {
        markInitialLoadComplete();
      }
    }, isInitialLoad ? 500 : 300);

    return () => {
      clearTimeout(removeTimer);
    };
  }, [isFullyReady, isInitialLoad, markInitialLoadComplete]);

  if (!shouldRender) {
    return null;
  }

  // Show full-screen loading on initial load, smaller spinner on navigation
  if (isInitialLoad) {
    return <AppLoading isFadingOut={isFadingOut} />;
  }

  // For tab navigation, show a centered spinner without fullscreen overlay
  return (
    <div
      className={`flex items-center justify-center h-full min-h-[200px] transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <ContentSpinner size="md" />
    </div>
  );
}
