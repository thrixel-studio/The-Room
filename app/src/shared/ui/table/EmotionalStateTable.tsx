"use client";

import React, { useMemo } from "react";
import { pack, hierarchy } from "d3-hierarchy";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useQuery } from "@tanstack/react-query";
import { insightsApi, EmotionInsight } from "@/lib/insights";
import { tokenStorage } from "@/shared/lib/storage";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/shared/lib/query-keys";

export default function EmotionalStateTable() {
  const router = useRouter();

  // Fetch real emotion insights from API
  const { data: insightsData, error } = useQuery({
    queryKey: queryKeys.insights.dashboard('30d'),
    queryFn: async () => {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        router.push('/signin');
        throw new Error('No access token');
      }
      return insightsApi.getDashboard(accessToken, '30d');
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const emotionState: EmotionInsight[] = insightsData?.emotion_state || [];

  const { nodes, width, height } = useMemo(() => {
    const width = 600;
    const height = 400;

    // Use real data if available, otherwise show empty state
    if (emotionState.length === 0) {
      return { nodes: [], width, height };
    }

    // Use standard purple color for circle fill
    const circleColor = '#7c3aed'; // brand-500

    // Transform data into hierarchical format for d3
    const hierarchicalData = {
      name: "emotions",
      children: emotionState.map((emotion) => ({
        name: emotion.name,
        value: emotion.count,
        count: emotion.count,
        color: circleColor,
      })),
    };

    // Create hierarchy and pack layout
    const root = hierarchy(hierarchicalData)
      .sum((d: any) => d.value)
      .sort((a: any, b: any) => (b.value || 0) - (a.value || 0));

    const packLayout = pack<any>()
      .size([width, height])
      .padding(10);

    packLayout(root as any);

    // Filter out root node, only return leaf nodes (emotions)
    const leafNodes = root.leaves();

    return { nodes: leafNodes, width, height };
  }, [emotionState]);

  return (
    <div className="rounded-2xl bg-gray-100 bg-white/[0.03] h-full">
      <div className="bg-[rgb(240,235,225)] shadow-default rounded-2xl bg-gray-800/80 h-full flex flex-col">
        <div className="px-5 pt-5 sm:px-6 sm:pt-6 pb-5 sm:pb-6 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800 text-white/90">
            Emotional State
          </h3>
          <p className="mt-1 font-normal text-gray-500 text-theme-sm text-gray-400">
            Based on how often each feeling appears in your entries.
          </p>
        </div>

        <div className="px-5 sm:px-6 flex-shrink-0">
          <div className="border-t border-gray-200/50 border-white/10"></div>
        </div>

        <div className="flex-1 overflow-hidden min-h-0 flex items-center justify-center relative">
          {error ? (
            <div className="text-red-500 text-red-400">Failed to load emotion insights</div>
          ) : nodes.length === 0 ? (
            <div className="text-gray-500 text-gray-400 text-center px-4">
              <p className="mb-2">No emotions detected yet</p>
              <p className="text-sm">Start journaling to see your emotional patterns</p>
            </div>
          ) : (
            <TransformWrapper
                initialScale={1.1}
                minScale={0.2}
                maxScale={5}
                centerOnInit
                wheel={{ smoothStep: 0.01 }}
                doubleClick={{ disabled: false, mode: "zoomIn", step: 0.5 }}
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
                  >
                    <svg
                      width={width}
                      height={height}
                      viewBox={`0 0 ${width} ${height}`}
                      style={{ maxWidth: "600px", maxHeight: "400px" }}
                    >
                      <defs>
                      </defs>
                      {nodes.map((node: any, i: number) => (
                        <g key={i} transform={`translate(${node.x},${node.y})`}>
                          <circle
                            r={node.r}
                            className="cursor-pointer transition-colors"
                            fill={node.data.color}
                            stroke="#7c3aed"
                            strokeWidth="2"
                          />
                          <text
                            textAnchor="middle"
                            dy="0"
                            className="fill-white font-semibold pointer-events-none"
                            style={{
                              fontSize: `${Math.min(node.r / 3, 16)}px`,
                            }}
                          >
                            {node.data.name}
                          </text>
                          <text
                            textAnchor="middle"
                            dy="1.2em"
                            className="fill-white pointer-events-none"
                            style={{
                              fontSize: `${Math.min(node.r / 4, 12)}px`,
                            }}
                          >
                            {node.data.count} {node.data.count === 1 ? "entry" : "entries"}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </TransformComponent>
                  
                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                    <button
                      onClick={() => zoomIn()}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white bg-gray-800 border border-gray-200 border-gray-700 text-gray-700 text-gray-300 hover:bg-gray-50 hover:bg-gray-700 shadow-sm transition-colors"
                      aria-label="Zoom in"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white bg-gray-800 border border-gray-200 border-gray-700 text-gray-700 text-gray-300 hover:bg-gray-50 hover:bg-gray-700 shadow-sm transition-colors"
                      aria-label="Zoom out"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
}
