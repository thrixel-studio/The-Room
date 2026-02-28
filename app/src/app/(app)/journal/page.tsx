"use client";

import { JournalEntryCards } from "@/features/journal";
import React from "react";
import { useContentReady } from "@/shared/contexts/NavigationContext";

export default function JournalPage() {
  // Signal content ready immediately - skeleton shows until data loads
  useContentReady(true);

  return (
    <div className="flex flex-col h-full flex-1 min-h-0">
      <div className="flex flex-1 min-h-0">
        {/* Journal Cards */}
        <div className="flex-1 overflow-y-scroll min-h-0 relative z-0 custom-scrollbar">
          <JournalEntryCards />
        </div>
      </div>
    </div>
  );
}
