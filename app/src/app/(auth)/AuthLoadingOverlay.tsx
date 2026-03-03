'use client';

import { useState, useEffect } from 'react';
import AppLoading from '@/shared/components/AppLoading';
import { useNavigation } from '@/shared/contexts/NavigationContext';

export function AuthLoadingOverlay() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const { isContentReady } = useNavigation();

  useEffect(() => {
    if (!isContentReady) return;
    setIsFadingOut(true);
    const t = setTimeout(() => setShouldRender(false), 500);
    return () => clearTimeout(t);
  }, [isContentReady]);

  if (!shouldRender) return null;
  return <AppLoading isFadingOut={isFadingOut} />;
}
