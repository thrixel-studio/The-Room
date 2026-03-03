"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Zap } from "lucide-react";

// Smooth animation easing
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface InsightCard {
  id: number;
  title: string;
  emoji: string;
  value: string;
  delay: number;
}

const insightCards: InsightCard[] = [
  {
    id: 1,
    title: "Emotional State",
    emoji: "😊",
    value: "70% confident",
    delay: 300,
  },
  {
    id: 2,
    title: "Key Themes",
    emoji: "💭",
    value: "Growth, Balance",
    delay: 700,
  },
  {
    id: 3,
    title: "Mood Trend",
    emoji: "📈",
    value: "+15% this week",
    delay: 1100,
  },
];

export function InsightsIllustration() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [chartHeight, setChartHeight] = useState(0);

  useEffect(() => {
    // Trigger card animations
    const cardTimers = insightCards.map((card) =>
      window.setTimeout(
        () => setVisibleCards((prev) => [...prev, card.id]),
        card.delay
      )
    );

    // Animate chart
    const chartTimer = window.setTimeout(() => setChartHeight(100), 1500);

    return () => {
      cardTimers.forEach(clearTimeout);
      clearTimeout(chartTimer);
    };
  }, []);

  const isCardVisible = (id: number) => visibleCards.includes(id);

  return (
    <div className="flex flex-col h-full w-full px-8 py-8 gap-8">
      {/* Header with trend icon */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--app-accent-secondary-color)]/20">
          <TrendingUp size={20} style={{ color: "var(--app-accent-secondary-color)" }} />
        </div>
        <h3 className="text-lg font-semibold text-white">Your Insights Dashboard</h3>
      </div>

      {/* Mini chart */}
      <div className="flex items-end gap-2 h-20 bg-[var(--app-bg-tertiary-color)] rounded-lg px-4 py-4">
        {[60, 75, 85, 70, 90, 95, 88].map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-[var(--app-accent-secondary-color)] rounded-t transition-all duration-700 ease-out"
            style={{
              height: `${(chartHeight / 100) * (height / 100) * 80}px`,
              opacity: chartHeight > 0 ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Insight cards grid */}
      <div className="grid grid-cols-1 gap-3">
        {insightCards.map((card) => (
          <div
            key={card.id}
            className={`flex items-center justify-between p-4 rounded-lg bg-[var(--app-bg-tertiary-color)] border border-white/5 transition-all duration-500 ease-out ${
              isCardVisible(card.id)
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{card.emoji}</div>
              <div>
                <p className="text-sm text-white/60">{card.title}</p>
                <p className="text-sm font-medium text-white">{card.value}</p>
              </div>
            </div>
            <Zap size={16} style={{ color: "var(--app-accent-secondary-color)" }} />
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className={`mt-auto pt-4 text-center transition-all duration-500 ease-out ${
        visibleCards.length === insightCards.length
          ? "opacity-100"
          : "opacity-0"
      }`}>
        <p className="text-xs text-white/50">
          Track patterns, discover growth
        </p>
      </div>
    </div>
  );
}
