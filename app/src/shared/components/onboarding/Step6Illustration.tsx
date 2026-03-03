"use client";

import React, { useMemo, useEffect, useState } from "react";
import { pack, hierarchy } from "d3-hierarchy";

// Sample emotion data for the emotional map
const SAMPLE_EMOTIONS = [
  { name: "Hopeful", count: 3 },
  { name: "Focused", count: 5 },
  { name: "Calm", count: 8 },
  { name: "Grateful", count: 5 },
  { name: "Inspired", count: 7 },
  { name: "Peaceful", count: 4 },
  { name: "Anxious", count: 5 },
  { name: "Excited", count: 4 },
  { name: "Curious", count: 10 },
  { name: "Relaxed", count: 6 },
  { name: "Stressed", count: 3 },
  { name: "Motivated", count: 20 },
  { name: "Exhausted", count: 18 },
];

export function Step6Illustration() {
  const [imageVisible, setImageVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setImageVisible(true), 150);
    const t2 = window.setTimeout(() => setMapVisible(true), 350);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const { nodes, width, height } = useMemo(() => {
    const width = 500;
    const height = 320;

    // Transform data into hierarchical format for d3
    const hierarchicalData = {
      name: "emotions",
      children: SAMPLE_EMOTIONS.map((emotion) => ({
        name: emotion.name,
        value: emotion.count,
        count: emotion.count,
      })),
    };

    // Create hierarchy and pack layout
    const root = hierarchy(hierarchicalData)
      .sum((d: any) => d.value)
      .sort((a: any, b: any) => (b.value || 0) - (a.value || 0));

    const packLayout = pack<any>()
      .size([width, height])
      .padding(28);

    packLayout(root as any);

    // Filter out root node, only return leaf nodes (emotions)
    const leafNodes = root.leaves();

    return { nodes: leafNodes, width, height };
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-0">
      {/* Cards Image - 50% height */}
      <div
        className={`h-1/2 flex-shrink-0 p-6 pb-4 flex items-center justify-center transition-opacity duration-500 ease-out ${
          imageVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src="/images/tutorial/cards.webp"
          alt="Insight cards"
          className="w-full max-w-sm h-auto object-contain rounded-lg"
        />
      </div>

      {/* Emotional State Map - 50% height */}
      <div
        className={`h-1/2 flex-1 rounded-none bg-transparent overflow-hidden flex flex-col transition-opacity duration-500 ease-out ${
          mapVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex-1 overflow-hidden min-h-0 flex items-center justify-center relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          >
            {nodes.map((node: any, i: number) => {
              const radiusScale = 1.25;
              const scaledR = node.r * radiusScale;

              return (
                <g
                  key={i}
                  transform={`translate(${node.x},${node.y})`}
                >
                  <circle
                    r={scaledR}
                    fill="var(--app-accent-color-transparent)"
                    stroke="var(--app-accent-color)"
                    strokeWidth="2"
                  />
                  <text
                    textAnchor="middle"
                    dy="0"
                    className="fill-white font-semibold pointer-events-none"
                    style={{
                      fontSize: `${Math.min(scaledR / 3.5, 16)}px`,
                    }}
                  >
                    {node.data.name}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="1.2em"
                    className="fill-white pointer-events-none"
                    style={{
                      fontSize: `${Math.min(scaledR / 5, 12)}px`,
                    }}
                  >
                    {node.data.count} {node.data.count === 1 ? "entry" : "entries"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
