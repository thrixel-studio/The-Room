"use client";

import React, { useEffect, useState } from "react";
import { Copy, CornerDownLeft, Ellipsis, RefreshCw } from "lucide-react";

// Delays (ms) for each message to fade in
const MESSAGE_DELAYS = [300, 900, 1500, 2200];

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

const INPUT_DELAY = 100;

export function ChatIllustration() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [inputVisible, setInputVisible] = useState(false);

  useEffect(() => {
    const timers = MESSAGE_DELAYS.map((delay, i) =>
      window.setTimeout(() => setVisibleCount(i + 1), delay)
    );
    const inputTimer = window.setTimeout(() => setInputVisible(true), INPUT_DELAY);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(inputTimer);
    };
  }, []);

  const msgClass = (index: number) =>
    `transition-all duration-500 ease-out ${
      visibleCount > index
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-2"
    }`;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages */}
      <div className="flex-1 overflow-hidden px-6 pt-8 flex flex-col gap-5">
        {/* User */}
        <div className={`flex justify-end ${msgClass(0)}`}>
          <div className="max-w-[80%] py-1.5 px-3 bg-[var(--app-bg-secondary-color)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md shadow-sm">
            <p className="text-sm text-white/90 leading-relaxed">
              I&apos;m feeling overwhelmed lately.
            </p>
          </div>
        </div>

        {/* AI */}
        <div className={`flex justify-start w-full ${msgClass(1)}`}>
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
        <div className={`flex justify-end ${msgClass(2)}`}>
          <div className="max-w-[80%] py-1.5 px-3 bg-[var(--app-bg-secondary-color)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md shadow-sm">
            <p className="text-sm text-white/90 leading-relaxed">
              Work deadlines and not enough sleep
            </p>
          </div>
        </div>

        {/* AI */}
        <div className={`flex justify-start w-full ${msgClass(3)}`}>
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

      </div>

      {/* Input */}
      <div className={`px-4 pb-4 pt-4 transition-all duration-500 ease-out ${inputVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
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
    </div>
  );
}
