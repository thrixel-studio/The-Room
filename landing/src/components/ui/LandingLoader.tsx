'use client';

import { useState, useEffect } from 'react';
import { PageLoader } from './PageLoader';

export function LandingLoader() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const triggerFadeOut = () => setIsFadingOut(true);

    if (document.readyState === 'complete') {
      // Page already fully loaded (e.g. navigating back from cache)
      triggerFadeOut();
    } else {
      window.addEventListener('load', triggerFadeOut, { once: true });
      return () => window.removeEventListener('load', triggerFadeOut);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <PageLoader
      isFadingOut={isFadingOut}
      onComplete={() => setShouldRender(false)}
    />
  );
}
