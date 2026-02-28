'use client';

import Image from 'next/image';

interface ContentSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * A smaller, centered loading spinner for tab content.
 * Used when switching between tabs (not for hard page refreshes).
 * Matches the visual style of AppLoading but is inline and smaller.
 */
export default function ContentSpinner({ size = 'md', className = '' }: ContentSpinnerProps) {
  const sizeConfig = {
    sm: { outer: 48, inner: 40, logo: 22, inset: 4 },
    md: { outer: 64, inner: 56, logo: 30, inset: 5 },
    lg: { outer: 80, inner: 72, logo: 38, inset: 6 },
  };

  const { outer, inner, logo, inset } = sizeConfig[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: outer, height: outer }}>
        {/* Rotating outer ring - Accent color */}
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="rounded-full border-t-[2px] border-r-[2px]"
            style={{
              width: outer,
              height: outer,
              borderColor: 'var(--app-accent-color)'
            }}
          ></div>
        </div>

        {/* Counter-rotating middle ring - Secondary accent color */}
        <div
          className="absolute animate-spin-reverse"
          style={{ top: inset, left: inset, right: inset, bottom: inset }}
        >
          <div
            className="rounded-full border-b-[2px] border-l-[2px]"
            style={{
              width: inner,
              height: inner,
              borderColor: 'var(--app-accent-secondary-color)'
            }}
          ></div>
        </div>

        {/* Logo container with breathing animation */}
        <div
          className="relative flex items-center justify-center animate-breathe"
          style={{ width: outer, height: outer }}
        >
          <div className="relative">
            <Image
              src="/images/logo/s3.png"
              alt="Loading"
              width={logo}
              height={logo}
              className="drop-shadow-xl rounded-md"
              priority
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-spin-slow {
          animation: spin-slow 2.5s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
        .animate-breathe {
          animation: breathe 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
