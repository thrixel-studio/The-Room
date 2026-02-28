import React from 'react';

interface SkeletonBaseProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Base skeleton component with beautiful shimmer animation
 * Uses global CSS variables for consistent theming
 */
export function SkeletonBase({
  width = 'w-full',
  height = 'h-4',
  className = '',
  rounded = 'md'
}: SkeletonBaseProps) {
  const roundedClass = {
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-full',
  }[rounded];

  return (
    <div
      className={`skeleton-shimmer ${width} ${height} ${roundedClass} ${className}`}
    />
  );
}
