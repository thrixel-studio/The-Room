"use client";

import React, { useEffect, useState } from "react";
import { Copy, CornerDownLeft, CornerDownRight, Ellipsis, Heart, RefreshCw, Zap } from "lucide-react";
import { useAppDispatch } from "@/shared/store/hooks";
import { setFrameworkSwitched } from "@/shared/store/slices/onboardingSlice";

const BADGE_APPEAR_DELAY = 700;
const ARROW_APPEAR_DELAY = BADGE_APPEAR_DELAY + 400;

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

interface FrameworkIllustrationProps {
  inputAlreadyHidden?: boolean;
  showStrategistSwitch?: boolean;
  skipInputAutoFade?: boolean;
}

export function FrameworkIllustration({ inputAlreadyHidden = false, showStrategistSwitch = false, skipInputAutoFade = false }: FrameworkIllustrationProps) {
  const dispatch = useAppDispatch();
  const [inputHidden, setInputHidden] = useState(inputAlreadyHidden || skipInputAutoFade);
  const [badgeVisible, setBadgeVisible] = useState(inputAlreadyHidden);
  const [arrowVisible, setArrowVisible] = useState(inputAlreadyHidden);
  const [strategistVisible, setStrategistVisible] = useState(inputAlreadyHidden && showStrategistSwitch);
  const [switched, setSwitched] = useState(false);
  const [separatorVisible, setSeparatorVisible] = useState(false);
  const [strategistMessageVisible, setStrategistMessageVisible] = useState(false);

  useEffect(() => {
    if (inputAlreadyHidden) return;
    const timers: number[] = [];
    if (!skipInputAutoFade) {
      timers.push(window.setTimeout(() => setInputHidden(true), 0));
    }
    timers.push(window.setTimeout(() => setBadgeVisible(true), BADGE_APPEAR_DELAY));
    timers.push(window.setTimeout(() => setArrowVisible(true), ARROW_APPEAR_DELAY));
    return () => timers.forEach(window.clearTimeout);
  }, [inputAlreadyHidden, skipInputAutoFade]);

  useEffect(() => {
    if (!showStrategistSwitch || !inputAlreadyHidden) return;
    const t = window.setTimeout(() => setStrategistVisible(true), 400);
    return () => window.clearTimeout(t);
  }, [showStrategistSwitch, inputAlreadyHidden]);

  const handleStrategistSwitch = () => {
    setSwitched(true);
    window.setTimeout(() => setSeparatorVisible(true), 400);
    window.setTimeout(() => setStrategistMessageVisible(true), 900);
    dispatch(setFrameworkSwitched());
  };

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Messages — all visible immediately */}
      <div className="flex-1 overflow-hidden px-6 pt-8 flex flex-col gap-5">
        {/* User */}
        <div className="flex justify-end">
          <div className="max-w-[80%] py-1.5 px-3 bg-[var(--app-bg-secondary-color)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md shadow-sm">
            <p className="text-sm text-white/90 leading-relaxed">
              I&apos;m feeling overwhelmed lately.
            </p>
          </div>
        </div>

        {/* AI */}
        <div className="flex justify-start w-full">
          <div className="relative w-full">
            <div
              className="w-full px-3 py-1.5"
              style={{ borderLeft: "2px solid var(--app-accent-color)" }}
            >
              <p className="text-sm text-white/90 leading-relaxed">
                That&apos;s okay. What&apos;s been weighing on you the most?
              </p>
            </div>
            <AiActions />
          </div>
        </div>

        {/* User */}
        <div className="flex justify-end">
          <div className="max-w-[80%] py-1.5 px-3 bg-[var(--app-bg-secondary-color)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md shadow-sm">
            <p className="text-sm text-white/90 leading-relaxed">
              Work deadlines and not enough sleep
            </p>
          </div>
        </div>

        {/* AI */}
        <div className="flex justify-start w-full">
          <div className="relative w-full">
            <div
              className="w-full px-3 py-1.5"
              style={{ borderLeft: "2px solid var(--app-accent-color)" }}
            >
              <p className="text-sm text-white/90 leading-relaxed">
                Sleep deprivation makes everything feel heavier. Have you had any
                moments recently where you felt even a little lighter?
              </p>
            </div>
            <AiActions />
          </div>
        </div>

        {/* Switch to Strategist + Separator — same slot, only on step 3 */}
        {showStrategistSwitch && (
          <div className="relative mt-4">
            {/* Switch block — slides right+down on click */}
            <div
              className={`flex justify-start transition-opacity duration-500 ease-out ${
                !strategistVisible ? "opacity-0 pointer-events-none" : switched ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="relative flex items-center gap-2">
                <span
                  className="absolute text-sm"
                  style={{
                    bottom: '100%',
                    left: '26px',
                    marginBottom: '4px',
                    color: 'var(--app-text-secondary-color)',
                  }}
                >
                  Switch to:
                </span>
                <CornerDownRight
                  size={18}
                  style={{ color: 'var(--app-accent-secondary-color)' }}
                />
                <button
                  type="button"
                  onClick={handleStrategistSwitch}
                  className="btn-onboarding flex items-center gap-2 px-4 py-2 text-base rounded-lg hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--app-accent-secondary-color)',
                    color: 'var(--app-bg-primary-color)',
                  }}
                >
                  <Zap size={16} />
                  <span>Strategist</span>
                </button>
              </div>
            </div>

            {/* Separator — fades + slides up at the same position */}
            <div
              className={`absolute top-0 left-0 right-0 transition-all duration-500 ease-out ${separatorVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
            >
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 h-px opacity-20" style={{ background: 'var(--app-accent-secondary-color)' }} />
                <span
                  className="flex items-center gap-1.5 text-xs select-none"
                  style={{ color: 'var(--app-accent-secondary-color)' }}
                >
                  Switched to <Zap size={11} /> Strategist
                </span>
                <div className="flex-1 h-px opacity-20" style={{ background: 'var(--app-accent-secondary-color)' }} />
              </div>
            </div>
          </div>
        )}
        {/* Strategist AI message — fades in after switch */}
        {showStrategistSwitch && (
          <div
            className={`flex justify-start w-full transition-all duration-500 ease-out ${strategistMessageVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <div className="relative w-full">
              <div
                className="w-full px-3 py-1.5"
                style={{ borderLeft: "2px solid var(--app-accent-color)" }}
              >
                <p className="text-sm text-white/90 leading-relaxed">
                  Let&apos;s prioritize. Which deadline carries the most consequence if missed — and what&apos;s the first step to clear it?
                </p>
              </div>
              <AiActions />
            </div>
          </div>
        )}
      </div>

      {/* Input — fades out */}
      <div
        className={`px-4 pb-4 pt-4 transition-opacity duration-500 ease-in ${
          inputHidden ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative">
          <div
            className="w-full bg-[var(--app-bg-tertiary-color)] rounded-2xl p-3 pr-12 text-sm text-[var(--app-text-tertiary-color)] leading-relaxed select-none"
            style={{
              minHeight: "80px",
              boxShadow: "inset 0 0 1.5px 1px rgb(0 0 0 / 0.1)",
            }}
          >
            Type your thoughts here...
          </div>
          <div className="absolute bottom-3 right-2 p-2 rounded-xl bg-[var(--app-accent-color)] text-white opacity-50">
            <CornerDownLeft className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xs text-[var(--app-text-tertiary-color)] text-center mt-1.5">
          Press <span className="font-medium">Enter</span> to send,{" "}
          <span className="font-medium">Shift + Enter</span> for new line
        </p>
      </div>

      {/* Framework badge — bottom right, fades in */}
      <div
        className={`absolute bottom-5 right-5 transition-opacity duration-500 ease-out ${
          badgeVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Curved arrow — only on step 2 */}
        {!showStrategistSwitch && (
          <div
            className={`absolute -top-20 -left-6 transition-opacity duration-500 ease-out ${arrowVisible ? "opacity-60" : "opacity-0"}`}
          >
            <img
              src="/images/shape/arrow.webp"
              alt=""
              className="w-16 h-16 scale-y-[-1] rotate-[80deg]"
            />
          </div>
        )}

        {/* Psychologist — fades out on switch */}
        <div className={`inline-flex items-center gap-2 text-[var(--app-accent-secondary-color)] transition-opacity duration-500 ${switched ? "opacity-0" : "opacity-100"}`}>
          <Heart className="w-5 h-5" />
          <span className="text-base">Psychologist</span>
        </div>
        {/* Strategist — fades in on switch */}
        <div className={`absolute inset-0 flex justify-end items-center gap-2 text-[var(--app-accent-secondary-color)] transition-opacity duration-500 ${switched ? "opacity-100" : "opacity-0"}`}>
          <Zap className="w-5 h-5" />
          <span className="text-base">Strategist</span>
        </div>
      </div>

    </div>
  );
}
