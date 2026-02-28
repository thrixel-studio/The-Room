"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { decodeHtmlEntities } from "@/shared/lib/text";
import { Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/shared/ui/modal/ConfirmationModal";
import { useToast } from '@/shared/hooks/useToast';
import { FrameworkKey } from "@/features/frameworks";
import { SidebarItemSkeleton } from "@/shared/ui/skeletons/SidebarItemSkeleton";
import { useGetDraftEntriesQuery } from '../api/journal.endpoints';
import { useDeleteChatSessionMutation } from '@/features/chat/api/chat.endpoints';

// Framework display names
const frameworkNames: Record<FrameworkKey, string> = {
  mental_wellness: "Psychologist",
  decision_making: "Advisor",
  productivity_boost: "Strategist",
  problem_solving: "Mediator",
};

interface ContinueWritingSidebarProps {
  isPageLoaded?: boolean;
}

export default function ContinueWritingSidebar({ isPageLoaded = false }: ContinueWritingSidebarProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // RTK Query for draft entries
  const { data: entriesData, isLoading } = useGetDraftEntriesQuery(
    { page_size: 10 },
    {
      selectFromResult: ({ data, isLoading }) => ({
        data,
        isLoading,
      }),
    }
  );

  // RTK Query mutation for deleting sessions
  const [deleteChatSession] = useDeleteChatSessionMutation();

  // Draft entries are already filtered by the API, just sort them
  const draftEntries = useMemo(() => {
    return (entriesData?.items || [])
      .sort((a, b) => {
        // Sort by last message timestamp, most recent first
        const timeA = a.last_message_timestamp ? new Date(a.last_message_timestamp).getTime() : 0;
        const timeB = b.last_message_timestamp ? new Date(b.last_message_timestamp).getTime() : 0;
        return timeB - timeA;
      });
  }, [entriesData?.items]);

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await deleteChatSession(sessionToDelete).unwrap();
      showSuccess('Conversation deleted');
      setDeleteModalOpen(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error('Error deleting session:', error);
      showError('Failed to delete conversation');
    }
  };

  // Get framework display name
  const getFrameworkName = (framework: string | null | undefined): string => {
    if (!framework) return "Psychologist";
    return frameworkNames[framework as FrameworkKey] || "Psychologist";
  };

  // Format date for badge - same as journal cards
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";

    const timestamp = new Date(dateString);
    const date = timestamp.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const time = timestamp.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Check if the date is today
    const today = new Date();
    const isToday = timestamp.toDateString() === today.toDateString();

    return isToday ? `Today, ${time}` : `${date}, ${time}`;
  };

  // Don't render if no draft entries or page not loaded
  if (!isPageLoaded || (!isLoading && draftEntries.length === 0)) {
    return null;
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto pb-4 pt-4 pl-0 space-y-3">
          {isLoading ? (
            <SidebarItemSkeleton count={3} />
          ) : (
            draftEntries.map((entry, index) => (
              <a
                key={entry.id}
                href={`/chat/${entry.session_id}`}
                className="relative block rounded-lg bg-[rgb(240,235,225)] bg-gray-800/80 p-4 cursor-pointer transition-all hover:shadow-md"
                onMouseEnter={() => setHoveredId(entry.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Delete button - top right */}
                <button
                  onClick={(e) => handleDeleteClick(e, entry.session_id || '')}
                  className="absolute top-4 right-4 text-gray-400 text-gray-500 hover:text-red-600 hover:text-red-400 transition-colors"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Title - last message content */}
                <h4 className="font-semibold text-gray-800 text-sm text-white/90 line-clamp-2 pr-8 mb-2">
                  {entry.last_message ? decodeHtmlEntities(entry.last_message).substring(0, 100) + (entry.last_message.length > 100 ? "..." : "") : "Start your conversation..."}
                </h4>

                {/* Bottom row: Framework name on left, Date on right */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500 text-gray-400">
                    {getFrameworkName(entry.framework)}
                  </span>
                  <span className="text-xs text-gray-500 text-gray-400">
                    {formatDate(entry.last_message_timestamp)}
                  </span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSessionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation"
        message="Are you sure you want to delete this unfinished conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />
    </>
  );
}
