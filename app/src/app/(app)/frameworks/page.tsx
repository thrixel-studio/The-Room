"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Circle, CircleCheck, Heart, Target, Zap, Lightbulb } from "lucide-react";
import { useFrameworks } from "@/features/frameworks";
import { useToast } from '@/shared/hooks/useToast';
import { useContentReady } from "@/shared/contexts/NavigationContext";
import { MobileHeader } from "@/shared/components/layout/MobileHeader";
import type { FrameworkKey } from "@/features/frameworks";

// Hook for staggered card animation
function useCardAnimation(index: number, delay: number = 50) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * delay);
    return () => clearTimeout(timer);
  }, [index, delay]);

  return isVisible;
}

export default function Frameworks() {
  const { selectedFramework, setSelectedFramework, frameworks } = useFrameworks();

  // Signal content ready immediately
  useContentReady(true);
  const { showError } = useToast();

  const getFrameworkIcon = (frameworkKey: FrameworkKey) => {
    switch (frameworkKey) {
      case "mental_wellness":
        return Heart;
      case "decision_making":
        return Target;
      case "productivity_boost":
        return Zap;
      case "problem_solving":
        return Lightbulb;
      default:
        return null;
    }
  };

  const handleFrameworkClick = async (frameworkKey: FrameworkKey) => {
    // Always set the selected framework (no toggle behavior)
    await setSelectedFramework(frameworkKey, showError);
  };

  return (
    <div className="flex flex-col md:h-full md:flex-1 md:min-h-0">
      <MobileHeader title="Frameworks" />

      <div className="flex md:flex-1 md:min-h-0">
        {/* Framework Cards */}
        <div className="flex-1 md:overflow-y-scroll md:min-h-0 relative z-0">
          <div className="flex justify-center items-start md:min-h-full p-3 md:p-0 md:pt-16 md:pb-8">
            <div className="w-full md:max-w-[1600px] md:pr-4">
              {/* Explanation Text */}
              <div className="max-w-3xl mx-auto mb-6 md:mb-8 text-center">
                <h2 className="hidden md:block text-xl md:text-2xl font-semibold text-white/90 mb-1.5">
                  Choose Your Framework
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                  Unique perspectives to help you explore different aspects
                  of your thoughts.
                </p>
              </div>

              {/* Framework Cards Grid */}
              <div className="max-w-[480px] mx-auto md:max-w-5xl md:mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
                {frameworks.map((framework, index) => (
                  <FrameworkCard
                    key={framework.key}
                    framework={framework}
                    index={index}
                    isSelected={selectedFramework === framework.key}
                    onClick={() => handleFrameworkClick(framework.key)}
                    getFrameworkIcon={getFrameworkIcon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FrameworkCardProps {
  framework: any;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  getFrameworkIcon: (key: FrameworkKey) => any;
}

function FrameworkCard({ framework, index, isSelected, onClick, getFrameworkIcon }: FrameworkCardProps) {
  const isVisible = useCardAnimation(index, 50);
  const IconComponent = getFrameworkIcon(framework.key);

  return (
    <div
      onClick={onClick}
      className={`group rounded-2xl transition-all duration-300 ease-out cursor-pointer flex flex-col relative ${isSelected ? 'shadow-sm' : ''} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        backgroundColor: 'var(--app-bg-tertiary-color)',
        boxShadow: isSelected ? 'inset 0 2px 4px 0 rgb(0 0 0 / 0.4)' : 'inset 0 2px 4px 0 rgb(0 0 0 / 0.2)',
        borderColor: isSelected ? 'var(--app-accent-secondary-color)' : 'var(--app-bg-primary-color)',
        borderWidth: '1.5px',
        borderStyle: 'solid'
      }}
    >
      {/* Selection Circle Icon */}
      <div className="absolute top-3 right-3 z-30">
        {isSelected ? (
          <CircleCheck
            className="w-5 h-5"
            style={{ color: 'var(--app-accent-secondary-color)' }}
          />
        ) : (
          <Circle
            className="w-5 h-5"
            style={{ color: 'var(--app-bg-secondary-color)' }}
          />
        )}
      </div>

      {/* Image */}
      <div className="w-full rounded-t-2xl overflow-hidden relative p-3">
        <Image
          src={framework.image}
          alt={framework.title}
          width={400}
          height={240}
          className="w-full h-auto"
          priority
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-3 relative bg-transparent">
        <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-2">
          {IconComponent && (
            <IconComponent
              className="w-5 h-5"
              style={{ color: isSelected ? 'var(--app-accent-secondary-color)' : undefined }}
            />
          )}
          <span style={{ color: isSelected ? 'var(--app-accent-secondary-color)' : undefined }}>
            {framework.title}
          </span>
        </h3>
        <p className="text-xs text-white/60 leading-relaxed">
          {framework.description}
        </p>
      </div>
    </div>
  );
}
