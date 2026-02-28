'use client';

import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wrapper for page content. Transition animations removed for now.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}
