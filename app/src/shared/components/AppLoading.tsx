'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AppLoadingProps {
  isFadingOut?: boolean;
  onComplete?: () => void;
}

export default function AppLoading({ isFadingOut = false, onComplete }: AppLoadingProps) {
  const [internalFadingOut, setInternalFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (isFadingOut) {
      // Start fade out animation
      setInternalFadingOut(true);

      // After animation completes, stop rendering
      const timer = setTimeout(() => {
        setShouldRender(false);
        onComplete?.();
      }, 500); // Match the transition-opacity duration-500 (500ms)

      return () => clearTimeout(timer);
    }
  }, [isFadingOut, onComplete]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] min-h-screen w-full flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        internalFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: 'var(--app-bg-primary-color)' }}
    >
      {/* Main loading container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Rotating outer ring - Accent color */}
        <div className="relative">
          <div className="absolute inset-0 animate-spin-slow">
            <div
              className="w-24 h-24 rounded-full border-t-[2.5px] border-r-[2.5px]"
              style={{ borderColor: 'var(--app-accent-color)' }}
            ></div>
          </div>

          {/* Counter-rotating middle ring - Secondary accent color */}
          <div className="absolute inset-[8px] animate-spin-reverse">
            <div
              className="w-[80px] h-[80px] rounded-full border-b-[2.5px] border-l-[2.5px]"
              style={{ borderColor: 'var(--app-accent-secondary-color)' }}
            ></div>
          </div>

          {/* Logo container with breathing animation */}
          <div className="relative w-24 h-24 flex items-center justify-center animate-breathe">
            <div className="relative w-[45px] h-[45px]">
              {/* Logo */}
              <div className="relative z-10">
                <Image
                  src="/images/logo/logo1.png"
                  alt="Loading"
                  width={45}
                  height={45}
                  className="drop-shadow-2xl rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 4s linear infinite;
        }

        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
