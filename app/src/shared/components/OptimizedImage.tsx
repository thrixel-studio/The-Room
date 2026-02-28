"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  sizes?: string;
  placeholderBg?: string; // Custom background color for placeholder
  hideShimmer?: boolean; // Hide the shimmer effect
  showInsetShadow?: boolean; // Show inset shadow overlay on top of image
}

/**
 * Optimized image component with:
 * - Lazy loading via IntersectionObserver
 * - Blur placeholder while loading
 * - Smooth fade-in animation
 * - Proper error handling
 */
export default function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  onLoad,
  onError,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  placeholderBg,
  hideShimmer = false,
  showInsetShadow = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use IntersectionObserver for lazy loading (unless priority)
  useEffect(() => {
    if (priority || !containerRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoaded(true);
    onError?.(e);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {/* Placeholder background - always visible */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundColor: placeholderBg || undefined,
        }}
      >
        {!placeholderBg && (
          <div className="absolute inset-0 bg-gray-200 bg-gray-700/60" />
        )}
        {/* Animated shimmer effect */}
        {!hideShimmer && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 via-white/5 to-transparent animate-shimmer" />
        )}
      </div>

      {/* Actual image - only render when in view */}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          unoptimized // Keep for S3 images
        />
      )}

      {/* Inset shadow overlay - renders on top of image */}
      {showInsetShadow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.2)'
          }}
        />
      )}
    </div>
  );
}
