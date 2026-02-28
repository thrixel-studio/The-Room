'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

/**
 * Internal component that uses useSearchParams
 */
function NProgressBarInternal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      speed: 300,
      minimum: 0.08,
      trickleSpeed: 200,
    });
  }, []);

  useEffect(() => {
    // Complete progress when route changes
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

/**
 * NProgress bar component for route transitions
 * Automatically shows/hides progress bar when navigating between pages
 */
export function NProgressBar() {
  return (
    <Suspense fallback={null}>
      <NProgressBarInternal />
    </Suspense>
  );
}
