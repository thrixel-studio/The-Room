"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useAppDispatch } from "@/shared/store/hooks";
import { toggleMobileSidebar } from "@/shared/store/slices/uiSlice";

interface MobileHeaderProps {
  title?: string;
  right?: React.ReactNode;
  className?: string;
}

export function MobileHeader({ title, right, className = "" }: MobileHeaderProps) {
  const dispatch = useAppDispatch();

  return (
    <div className={`md:hidden flex-shrink-0 flex items-center justify-between px-4 py-1.5 -mt-3 border-b border-[var(--app-border-primary-color)] ${className}`}>
      <button
        onClick={() => dispatch(toggleMobileSidebar())}
        className="p-1.5 -ml-1.5 text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {title ? (
        <span className="text-sm font-medium text-[var(--app-text-primary-color)]">{title}</span>
      ) : (
        <div />
      )}

      {right ? right : <div className="w-5" />}
    </div>
  );
}
