"use client";

import { Menu } from "lucide-react";
import { useAppDispatch } from "@/shared/store/hooks";
import { toggleMobileSidebar } from "@/shared/store/slices/uiSlice";
import FrameworkBadge from "@/features/frameworks/components/FrameworkBadge";
import { ChatProgress } from "./ChatProgress";
import type { FrameworkKey } from "@/features/frameworks";
import type { ChatMessage } from "../types";

interface ChatMobileHeaderProps {
  frameworkKey?: FrameworkKey;
  messages?: ChatMessage[];
}

export function ChatMobileHeader({ frameworkKey, messages }: ChatMobileHeaderProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="lg:hidden flex-shrink-0 flex items-center justify-between px-4 py-1.5 -mt-3 border-b border-[var(--app-border-primary-color)]">
      {/* Left: Sidebar toggle */}
      <button
        onClick={() => dispatch(toggleMobileSidebar())}
        className="p-1.5 -ml-1.5 text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center: Framework */}
      {frameworkKey ? (
        <FrameworkBadge frameworkKey={frameworkKey} />
      ) : (
        <div />
      )}

      {/* Right: Progress */}
      <ChatProgress messages={messages} inline={true} />
    </div>
  );
}
