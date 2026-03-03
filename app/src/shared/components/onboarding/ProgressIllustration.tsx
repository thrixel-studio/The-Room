"use client";

import React, { useEffect, useState } from "react";
import { Copy, Ellipsis, RefreshCw, Sparkles } from "lucide-react";
import ProgressBar from "@/shared/components/ProgressBar";
import { useAppDispatch } from "@/shared/store/hooks";
import { setAnalyzeClicked } from "@/shared/store/slices/onboardingSlice";

function AiActions() {
  return (
    <div className="flex gap-2 mt-2">
      <button className="p-0 bg-transparent border-0" style={{ color: "var(--app-text-secondary-color)" }}>
        <Copy size={14} />
      </button>
      <button className="p-0 bg-transparent border-0" style={{ color: "var(--app-text-secondary-color)" }}>
        <RefreshCw size={14} />
      </button>
      <button className="p-0 bg-transparent border-0" style={{ color: "var(--app-text-secondary-color)" }}>
        <Ellipsis size={14} />
      </button>
    </div>
  );
}

const STEP = 900;
const DELAY = 1000;

export function ProgressIllustration() {
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(50);
  const [barVisible, setBarVisible] = useState(false);
  const [u1Visible, setU1Visible] = useState(false);
  const [a1Visible, setA1Visible] = useState(false);
  const [u2Visible, setU2Visible] = useState(false);
  const [a2Visible, setA2Visible] = useState(false);
  const [analyzeVisible, setAnalyzeVisible] = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setBarVisible(true), 300),
      window.setTimeout(() => setU1Visible(true), DELAY),
      window.setTimeout(() => { setA1Visible(true); setProgress(75); }, DELAY + STEP),
      window.setTimeout(() => setU2Visible(true), DELAY + STEP * 2),
      window.setTimeout(() => { setA2Visible(true); setAnalyzeVisible(true); setProgress(100); }, DELAY + STEP * 3),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const fadeIn = (visible: boolean) =>
    `transition-all duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`;

  return (
    <div className="flex flex-col h-full w-full">

      {/* Progress bar — top right, in-flow */}
      <div className={`flex justify-end px-4 pt-3 transition-all duration-500 ease-out ${barVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
        <ProgressBar progress={progress} unfilledColor="var(--app-bg-tertiary-color)" inline />
      </div>

      {/* Messages — bottom-anchored */}
      <div className="flex-1 overflow-hidden px-6 flex flex-col justify-start gap-5 pt-4 pb-6">

        {/* User 1 */}
        <div className={`flex justify-end ${fadeIn(u1Visible)}`}>
          <div className="max-w-[80%] py-1.5 px-3 bg-[var(--app-bg-secondary-color)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md shadow-sm">
            <p className="text-sm text-white/90 leading-relaxed">
              I feel like I&apos;m just going through the motions lately
            </p>
          </div>
        </div>

        {/* AI 1 */}
        <div className={`flex justify-start w-full ${fadeIn(a1Visible)}`}>
          <div className="relative w-full">
            <div className="w-full px-3 py-1.5" style={{ borderLeft: "2px solid var(--app-accent-color)" }}>
              <p className="text-sm text-white/90 leading-relaxed">
                That kind of numbness is worth paying attention to. When did you first notice it?
              </p>
            </div>
            <AiActions />
          </div>
        </div>

        {/* User 2 */}
        <div className={`flex justify-end ${fadeIn(u2Visible)}`}>
          <div className="max-w-[80%] py-1.5 px-3 bg-[var(--app-bg-secondary-color)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md shadow-sm">
            <p className="text-sm text-white/90 leading-relaxed">
              A few months ago. After a big change at work
            </p>
          </div>
        </div>

        {/* AI 2 */}
        <div className={`flex justify-start w-full ${fadeIn(a2Visible)}`}>
          <div className="relative w-full">
            <div className="w-full px-3 py-1.5" style={{ borderLeft: "2px solid var(--app-accent-color)" }}>
              <p className="text-sm text-white/90 leading-relaxed">
                Big transitions take more from us than we realize. You&apos;re already doing something by naming it.
              </p>
            </div>
            <AiActions />
          </div>
        </div>

        {/* Analyze button */}
        <div className={`flex justify-start ${fadeIn(analyzeVisible)}`}>
          <button
            type="button"
            onClick={() => dispatch(setAnalyzeClicked())}
            className="btn-onboarding flex items-center gap-2 px-4 py-2 text-base rounded-lg hover:opacity-80"
            style={{ backgroundColor: 'var(--app-accent-secondary-color)', color: 'var(--app-bg-primary-color)' }}
          >
            <Sparkles size={16} />
            <span>Analyze</span>
          </button>
        </div>

      </div>

    </div>
  );
}
