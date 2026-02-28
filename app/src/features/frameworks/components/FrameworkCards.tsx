'use client';

import React, { useState, useEffect } from "react";

interface Framework {
  id: string;
  name: string;
  description: string;
  key: string;
}

interface FrameworkCardsProps {
  frameworks: Framework[];
  selectedFramework?: string;
  onSelect?: (frameworkKey: string) => void;
}

interface FrameworkCardProps {
  framework: Framework;
  isSelected: boolean;
  onSelect?: (frameworkKey: string) => void;
  animationDelay: number;
}

function FrameworkCard({ framework, isSelected, onSelect, animationDelay }: FrameworkCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <div
      onClick={() => onSelect?.(framework.key)}
      className={`
        p-6 rounded-lg cursor-pointer transition-all duration-300 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'}
        ${isSelected
          ? 'bg-brand-500/10 border-2 border-brand-500'
          : 'bg-gray-100 bg-gray-800 border-2 border-transparent hover:border-brand-400'}
      `}
    >
      <h3 className="text-lg font-semibold text-gray-800 text-white/90 mb-2">
        {framework.name}
      </h3>
      <p className="text-sm text-gray-600 text-gray-400">
        {framework.description}
      </p>
    </div>
  );
}

export default function FrameworkCards({ frameworks, selectedFramework, onSelect }: FrameworkCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {frameworks.map((framework, index) => (
        <FrameworkCard
          key={framework.id}
          framework={framework}
          isSelected={selectedFramework === framework.key}
          onSelect={onSelect}
          animationDelay={index * 50}
        />
      ))}
    </div>
  );
}
