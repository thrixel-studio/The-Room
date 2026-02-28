"use client";

import React, { useMemo } from "react";
import { pack, hierarchy } from "d3-hierarchy";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useGetDashboardQuery } from '../api/insights.endpoints';
import type { EmotionInsight } from '../types';

// Loading text shown while chart data loads
function ChartLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-[var(--app-text-secondary-color)] text-sm">Loading...</p>
    </div>
  );
}

const EmotionalStateTable = React.memo(function EmotionalStateTable() {
  // Fetch real emotion insights from API using RTK Query
  const { data: insightsData, error, isLoading } = useGetDashboardQuery('30d');

  const emotionState: EmotionInsight[] = insightsData?.emotion_state || [];

  // Calculate packed layout - always call useMemo to respect hooks rules
  const { nodes, width, height } = useMemo(() => {
    const width = 600;
    const height = 400;

    // Use real data if available, otherwise show empty state
    if (emotionState.length === 0) {
      return { nodes: [], width, height };
    }

    // Transform data into hierarchical format for d3
    const hierarchicalData = {
      name: "emotions",
      children: emotionState.map((emotion) => ({
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
      .padding(25);

    packLayout(root as any);

    // Filter out root node, only return leaf nodes (emotions)
    const leafNodes = root.leaves();

    return { nodes: leafNodes, width, height };
  }, [emotionState]);

  return (
    <div className="rounded-2xl bg-[var(--app-bg-secondary-color)] h-full shadow-sm">
      <div className="bg-[var(--app-bg-secondary-color)] shadow-default rounded-2xl h-full flex flex-col">
        <div className="p-4 flex-shrink-0">
          <h3 className="text-sm font-semibold text-white/90">
            Emotional State
          </h3>
          <p className="mt-0.5 font-normal text-xs text-gray-400">
            Based on how often each feeling appears in your entries.
          </p>
        </div>

        <div className="px-4 flex-shrink-0">
          <div className="border-t border-white/10"></div>
        </div>

        <div className="flex-1 overflow-hidden min-h-0 flex items-center justify-center relative">
          {isLoading ? (
            <ChartLoading />
          ) : error ? (
            <div className="text-red-400 text-xs">Failed to load emotion insights</div>
          ) : nodes.length === 0 ? (
            <div className="text-gray-400 text-center px-4">
              <p className="mb-1 text-xs">No emotions detected yet</p>
              <p className="text-xs">Start journaling to see your emotional patterns</p>
            </div>
          ) : (
            <TransformWrapper
              initialScale={1}
              minScale={0.2}
              maxScale={5}
              centerOnInit
              wheel={{ disabled: false }}
              doubleClick={{ disabled: false, mode: "zoomIn", step: 0.5 }}
              panning={{ velocityDisabled: true }}
              smooth={false}
            >
              {({ zoomIn, zoomOut }) => (
                <>
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                    contentStyle={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    wrapperClass="!transition-none"
                    contentClass="!transition-none"
                  >
                    <svg
                      width={width}
                      height={height}
                      viewBox={`0 0 ${width} ${height}`}
                      style={{ maxWidth: "600px", maxHeight: "400px" }}
                      className="!transition-none"
                    >
                      <defs>
                      </defs>
                      {nodes.map((node: any, i: number) => (
                        <g
                          key={i}
                          transform={`translate(${node.x},${node.y})`}
                          className="animate-fade-in"
                          style={{
                            animationDelay: `${i * 0.05}s`,
                            animationFillMode: 'both'
                          }}
                        >
                          <circle
                            r={node.r}
                            className="cursor-pointer"
                            fill="var(--app-accent-color-transparent)"
                            stroke="var(--app-accent-color)"
                            strokeWidth="2"
                          />
                          <text
                            textAnchor="middle"
                            dy="0"
                            className="fill-white font-semibold pointer-events-none"
                            style={{
                              fontSize: `${Math.min(node.r / 3.5, 14)}px`,
                            }}
                          >
                            {node.data.name}
                          </text>
                          <text
                            textAnchor="middle"
                            dy="1.2em"
                            className="fill-white pointer-events-none"
                            style={{
                              fontSize: `${Math.min(node.r / 5, 10)}px`,
                            }}
                          >
                            {node.data.count} {node.data.count === 1 ? "entry" : "entries"}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </TransformComponent>

                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
                    <button
                      onClick={() => zoomIn()}
                      className="w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--app-bg-secondary-color)] border border-white/10 text-[var(--app-text-secondary-color)] hover:brightness-90 shadow-sm transition-all"
                      aria-label="Zoom in"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      className="w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--app-bg-secondary-color)] border border-white/10 text-[var(--app-text-secondary-color)] hover:brightness-90 shadow-sm transition-all"
                      aria-label="Zoom out"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </TransformWrapper>
          )}
        </div>
      </div>
    </div>
  );
});

EmotionalStateTable.displayName = 'EmotionalStateTable';

export default EmotionalStateTable;
