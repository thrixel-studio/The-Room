'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface PageLoaderProps {
  isFadingOut?: boolean;
  onComplete?: () => void;
}

export function PageLoader({ isFadingOut = false, onComplete }: PageLoaderProps) {
  const [internalFadingOut, setInternalFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isFadingOut) return;

    setInternalFadingOut(true);

    const timer = setTimeout(() => {
      setShouldRender(false);
      onCompleteRef.current?.();
    }, 500);

    return () => clearTimeout(timer);
  }, [isFadingOut]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        internalFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: 'var(--app-bg-primary-color)' }}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="relative animate-loader-breathe">
            <Image
              src="/logo/logo-full.svg"
              alt="The Room"
              width={160}
              height={52}
              priority
            />
          </div>
        </div>

        {/* Loading bar */}
        <div
          className="relative w-44 h-[4px] rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--app-bg-tertiary-color)' }}
        >
          <div
            className="absolute h-full rounded-full animate-loader-bar"
            style={{ backgroundColor: 'var(--app-text-secondary-color)' }}
          />
        </div>
      </div>
    </div>
  );
}
