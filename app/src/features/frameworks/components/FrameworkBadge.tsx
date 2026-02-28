"use client";

import React from "react";
import { Heart, Target, Zap, Lightbulb, LucideIcon } from "lucide-react";
import { FrameworkKey } from "@/features/frameworks";

interface FrameworkBadgeProps {
  frameworkKey: FrameworkKey;
  className?: string;
}

const frameworkConfig: Record<FrameworkKey, { name: string; icon: LucideIcon }> = {
  mental_wellness: {
    name: "Psychologist",
    icon: Heart,
  },
  decision_making: {
    name: "Advisor",
    icon: Target,
  },
  productivity_boost: {
    name: "Strategist",
    icon: Zap,
  },
  problem_solving: {
    name: "Mediator",
    icon: Lightbulb,
  },
};

export default function FrameworkBadge({ frameworkKey, className = "" }: FrameworkBadgeProps) {
  const config = frameworkConfig[frameworkKey];
  
  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-[var(--app-accent-secondary-color)] ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">
        {config.name}
      </span>
    </div>
  );
}
