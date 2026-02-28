"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import JournalEntryCard from "./JournalEntryCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from '@/shared/hooks/useToast';
import {
  useGetFinalEntriesPaginatedQuery,
  useGetDraftEntriesQuery,
  useDeleteEntryMutation,
} from '../api/journal.endpoints';
import { useDeleteChatSessionMutation } from '@/features/chat/api/chat.endpoints';
import { JournalCardSkeleton } from '@/shared/ui/skeletons/JournalCardSkeleton';
import type { JournalEntry } from '../types';

// Lazy loading wrapper - only mounts children when near viewport
interface LazyCardProps {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  rootMargin?: string;
}

function LazyCard({ children, skeleton, rootMargin = '300px' }: LazyCardProps) {
  const [shouldMount, setShouldMount] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className="block">
      {shouldMount ? children : skeleton}
    </div>
  );
}

interface JournalEntryCardsProps {
  onAllImagesLoaded?: () => void;
}

const PAGE_SIZE = 20;
const CARDS_PER_ROW = 5;

export default function JournalEntryCards({
  onAllImagesLoaded
}: JournalEntryCardsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showInfo } = useToast();
  const parentRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const loadedImagesRef = useRef(new Set<string>());
  const [containerWidth, setContainerWidth] = useState(0);
  const initialLoadComplete = useRef(false);

  // Pagination state for infinite scroll
  const [currentPage, setCurrentPage] = useState(1);

  // RTK Query for FINAL entries with pagination
  const {
    data: finalData,
    error: finalError,
    isLoading: isFinalLoading,
    isFetching: isFetchingFinal,
    refetch: refetchFinal,
  } = useGetFinalEntriesPaginatedQuery(
    { page: currentPage, page_size: PAGE_SIZE },
    {
      // Use selectFromResult to minimize re-renders
      selectFromResult: ({ data, error, isLoading, isFetching }) => ({
        data,
        error,
        isLoading,
        isFetching,
      }),
    }
  );

  // RTK Query for DRAFT entries
  const {
    data: draftsData,
    isLoading: isDraftsLoading,
    refetch: refetchDrafts,
  } = useGetDraftEntriesQuery(
    { page_size: 50 },
    {
      selectFromResult: ({ data, isLoading }) => ({
        data,
        isLoading,
      }),
    }
  );

  // Mutations
  const [deleteEntry] = useDeleteEntryMutation();
  const [deleteChatSession] = useDeleteChatSessionMutation();

  // Calculate if there are more pages to load
  const hasNextPage = useMemo(() => {
    if (!finalData) return false;
    const totalPages = Math.ceil(finalData.total / PAGE_SIZE);
    return currentPage < totalPages;
  }, [finalData, currentPage]);

  // Check if today already has a completed (FINAL) entry
  const todayHasFinalEntry = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
    return (finalData?.items ?? []).some(e => e.entry_date === todayStr);
  }, [finalData?.items]);

  // Combine drafts and final entries
  const entries = useMemo(() => {
    const finalEntries = finalData?.items || [];
    const draftEntries = draftsData?.items || [];

    // Combine and sort: drafts first (by last_message_timestamp), then final entries (by created_at)
    const allEntries = [
      ...draftEntries.map(e => ({ ...e, isDraft: true })),
      ...finalEntries.map(e => ({ ...e, isDraft: false }))
    ];

    // Sort: drafts by last_message_timestamp (most recent first), finals by created_at (most recent first)
    return allEntries.sort((a, b) => {
      if (a.isDraft && b.isDraft) {
        const timeA = a.last_message_timestamp ? new Date(a.last_message_timestamp).getTime() : 0;
        const timeB = b.last_message_timestamp ? new Date(b.last_message_timestamp).getTime() : 0;
        return timeB - timeA;
      }
      if (a.isDraft && !b.isDraft) return -1; // Drafts come first
      if (!a.isDraft && b.isDraft) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [finalData?.items, draftsData?.items]);

  const isLoading = isFinalLoading || isDraftsLoading;
  const isFetchingNextPage = isFetchingFinal && currentPage > 1;
  const error = finalError;

  const refetch = useCallback(async () => {
    setCurrentPage(1); // Reset to first page
    await Promise.all([refetchFinal(), refetchDrafts()]);
  }, [refetchFinal, refetchDrafts]);

  // Load next page for infinite scroll
  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingFinal) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage, isFetchingFinal]);

  // Calculate grid layout based on container width
  const cardsPerRow = useMemo(() => {
    if (containerWidth === 0) return CARDS_PER_ROW;

    // Responsive breakpoints
    if (containerWidth < 640) return 1;  // sm
    if (containerWidth < 768) return 2;  // md
    if (containerWidth < 900) return 3;  // lg
    if (containerWidth < 1100) return 4; // xl
    return CARDS_PER_ROW; // 5 cards for screens >= 1100px
  }, [containerWidth]);

  // Track container width for responsive layout
  useEffect(() => {
    if (!parentRef.current) return;

    const updateWidth = () => {
      if (parentRef.current) {
        setContainerWidth(parentRef.current.offsetWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(parentRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Infinite scroll - load more when near bottom
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 500;

      if (scrolledToBottom && hasNextPage && !isFetchingFinal) {
        loadNextPage();
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingFinal, loadNextPage]);

  // Image load tracking for initial content ready signal
  const handleImageLoad = useCallback((entryId: string) => {
    loadedImagesRef.current.add(entryId);
    setLoadedImages(new Set(loadedImagesRef.current));
  }, []);

  // Signal content ready when first batch of images loads
  useEffect(() => {
    if (initialLoadComplete.current || isLoading || entries.length === 0) return;

    const entriesWithImages = entries.filter(e => e.hero_image_url).slice(0, cardsPerRow * 2);
    const totalInitialImages = entriesWithImages.length;

    if (totalInitialImages === 0) {
      initialLoadComplete.current = true;
      onAllImagesLoaded?.();
      return;
    }

    const loadedCount = entriesWithImages.filter(e => loadedImages.has(e.id)).length;

    // Signal ready when 80% of first 2 rows are loaded (or all if fewer)
    if (loadedCount >= Math.ceil(totalInitialImages * 0.8)) {
      initialLoadComplete.current = true;
      onAllImagesLoaded?.();
    }
  }, [loadedImages, entries, cardsPerRow, isLoading, onAllImagesLoaded]);

  // Refetch entries if we have an openEntry or refresh parameter
  useEffect(() => {
    const openEntryId = searchParams.get('openEntry');
    const refreshParam = searchParams.get('refresh');
    if (openEntryId || refreshParam === 'true') {
      refetch();
    }
  }, [searchParams, refetch]);

  // Navigate to entry page if openEntry parameter is present
  useEffect(() => {
    const openEntryId = searchParams.get('openEntry');
    if (openEntryId) {
      router.push(`/journal/${openEntryId}`);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, router]);

  const handleDeleteClick = async (entryId: string, isDraft: boolean, sessionId?: string | null) => {
    try {
      if (isDraft && sessionId) {
        // Delete draft session using RTK Query mutation
        await deleteChatSession(sessionId).unwrap();
        showInfo('Conversation deleted');
      } else {
        // Delete final entry using RTK Query mutation
        await deleteEntry(entryId).unwrap();
        showInfo('Success! Entry Deleted');
      }
    } catch (err: any) {
      console.error('Failed to delete entry:', err);
      showError('Something Went Wrong');
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center pt-20">
        <div className="text-red-500 text-red-400">
          {'status' in error ? `Error: ${error.status}` : 'Failed to load journal entries'}
        </div>
      </div>
    );
  }

  // Show skeleton grid while loading
  if (isLoading) {
    return (
      <div className="flex justify-center pb-8 h-full overflow-auto">
        <div className="w-full max-w-[1600px] pr-4">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${cardsPerRow || 5}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <JournalCardSkeleton key={index} animationDelay={index * 30} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex justify-center items-center pt-20">
        <div className="text-center">
          <p className="text-gray-500 text-gray-400 mb-4">No journal entries yet</p>
          <p className="text-sm text-gray-400 text-gray-500">
            Start writing to create your first entry
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex justify-center pb-8 h-full overflow-auto"
    >
      <div className="w-full max-w-[1600px] pr-4">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${cardsPerRow}, minmax(0, 1fr))`,
          }}
        >
          {entries.map((item, index) => {
            // Calculate if this card should have priority (first 2 rows)
            const isPriority = index < cardsPerRow * 2;

            const entry = item as JournalEntry & { isDraft?: boolean };
            const isDraft = entry.isDraft || false;

            // For drafts, link to chat with session_id, for finals link to journal entry
            const href = isDraft && entry.session_id
              ? `/chat/${entry.session_id}`
              : `/journal/${entry.id}`;

            // Stagger animation delay: 30ms per card from first to last
            const animationDelay = index * 30;

            const card = (
              <Link
                key={entry.id}
                href={href}
                className="block"
              >
                <JournalEntryCard
                  entry={entry}
                  onImageLoad={() => handleImageLoad(entry.id)}
                  priority={isPriority}
                  isDraft={isDraft}
                  animationDelay={animationDelay}
                  todayHasFinalEntry={isDraft ? todayHasFinalEntry : undefined}
                />
              </Link>
            );

            // First 2 rows render immediately, rest are lazy loaded
            if (isPriority) {
              return <React.Fragment key={entry.id}>{card}</React.Fragment>;
            }

            return (
              <LazyCard key={entry.id} rootMargin="300px" skeleton={<JournalCardSkeleton animationDelay={index * 30} />}>
                {card}
              </LazyCard>
            );
          })}
        </div>

        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500 text-gray-400">Loading more...</div>
          </div>
        )}
      </div>
    </div>
  );
}
