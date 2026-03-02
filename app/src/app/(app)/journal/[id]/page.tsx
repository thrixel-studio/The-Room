"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from '@tanstack/react-query';
import Image from "next/image";
import Badge from "@/shared/ui/badge/Badge";
import { Maximize, Share2, Trash2, ArrowLeft, Pencil, Check, X, Play, Sparkles, Lightbulb, BringToFront } from "lucide-react";
import { entriesApi, EntryDetail } from "@/shared/lib/entries";
import { tokenStorage } from "@/shared/lib/storage";
import { Modal } from "@/shared/ui/modal";
import { ConfirmationModal } from "@/shared/ui/modal/ConfirmationModal";
import { useToast } from '@/shared/hooks/useToast';
import { decodeHtmlEntities } from "@/shared/lib/text";
import { useGetEntryQuery, useUpdateEntryMutation } from "@/features/journal/api/journal.endpoints";
import { EntryDetailSkeleton } from "@/shared/ui/skeletons/EntryDetailSkeleton";
import { useContentReady } from "@/shared/contexts/NavigationContext";
import { FrameworkBadge } from "@/features/frameworks";
import type { FrameworkKey } from "@/features/frameworks";
import { useCreateChatFromSuggestionMutation } from "@/features/suggestions";
import { useAppDispatch } from "@/shared/store/hooks";
import { journalApi } from "@/features/journal/api/journal.endpoints";

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const entryId = params.id as string;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use RTK Query hooks for data fetching
  const { data: entry, isLoading, error: queryError } = useGetEntryQuery(entryId);
  const [updateEntry, { isLoading: isUpdating }] = useUpdateEntryMutation();
  const [createChatFromSuggestion] = useCreateChatFromSuggestionMutation();
  const dispatch = useAppDispatch();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { showInfo, showError: showErrorToast } = useToast();

  // Reset image loaded state when entry changes
  useEffect(() => {
    setImageLoaded(false);
    setContentReady(false);
  }, [entryId]);

  // Determine if we should show skeleton
  // Show skeleton until data is loaded AND (image is loaded OR there's no image)
  const hasHeroImage = entry?.hero_image_url;
  const shouldShowSkeleton = isLoading || (hasHeroImage && !imageLoaded);

  // Mark content as ready once skeleton should be hidden
  useEffect(() => {
    if (!shouldShowSkeleton && entry && !contentReady) {
      setContentReady(true);
    }
  }, [shouldShowSkeleton, entry, contentReady]);

  // Signal to navigation context that content is ready
  useContentReady(contentReady);

  // Auto scroll 500px down when content is ready (after image loads)
  useEffect(() => {
    if (contentReady && scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: 500,
          behavior: 'smooth'
        });
      }, 100); // Shorter delay since we already waited for image
    }
  }, [contentReady]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleExpandImage = () => {
    setIsImageModalOpen(true);
  };

  const handleModalImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!entry) return;

    setIsDeleting(true);
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        router.push('/signin');
        return;
      }

      await entriesApi.deleteEntry(entry.id, accessToken);
      
      // Invalidate the entries list cache before navigating
      await queryClient.invalidateQueries({ queryKey: ['entries'] });

      // Navigate back to journal page with a flag to refresh
      router.push('/journal?refresh=true');
    } catch (err: any) {
      console.error('Failed to delete entry:', err);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEditTitle = () => {
    setEditedTitle(entry?.title || "");
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    if (!entry || !editedTitle.trim()) return;

    const newTitle = editedTitle.trim();
    setIsEditingTitle(false);

    // Use RTK Query mutation
    try {
      await updateEntry({
        id: entry.id,
        updates: { title: newTitle },
      }).unwrap();
      showInfo('Title updated successfully');
    } catch (err) {
      console.error('Failed to update title:', err);
      showErrorToast('Failed to update title');
      setEditedTitle(entry.title || '');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditedTitle("");
  };

  const handleStartSession = async (suggestionId: string) => {
    try {
      const result = await createChatFromSuggestion({ suggestion_id: suggestionId }).unwrap();
      dispatch(journalApi.util.invalidateTags([{ type: 'Entry', id: entryId }]));
      router.push(`/chat/${result.session_id}`);
    } catch (err) {
      console.error('Failed to start session from suggestion:', err);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  };

  return (
      <div className="flex flex-col h-screen flex-1 min-h-0 -mt-4 md:-mt-6 -mx-4 md:-mx-6 relative">
        {/* Back Arrow - Positioned absolutely in top left - Always visible */}
        <button
        onClick={() => router.push('/journal')}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
        <span className="text-sm font-medium text-white">Back</span>
      </button>
{/* Hidden image preloader - loads image while skeleton is showing */}
      {entry?.hero_image_url && !imageLoaded && (
        <img
          src={entry.hero_image_url.startsWith('http')
            ? entry.hero_image_url
            : `${API_URL}${entry.hero_image_url}`}
          alt=""
          onLoad={handleImageLoad}
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        />
      )}

      {/* Loading State - show skeleton until data AND image are ready */}
      {shouldShowSkeleton ? (
        <EntryDetailSkeleton />
      ) : queryError || !entry ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-red-500 text-red-400 mb-4">
            {queryError instanceof Error ? queryError.message : 'Entry not found'}
          </div>
          <button
            onClick={() => router.push('/journal')}
            className="text-brand-500 hover:text-brand-600 text-brand-400 hover:text-brand-300"
          >
            Back to Journal
          </button>
        </div>
      ) : (
        <>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 relative z-0 h-full">
        <div className="max-w-4xl mx-auto">
          <div className="bg-transparent overflow-hidden relative">
            {/* Image Section */}
            {entry.hero_image_url && (
              <div className="w-full h-[700px] overflow-hidden relative bg-neutral-900 rounded-b-2xl">
                <Image
                  src={entry.hero_image_url.startsWith('http')
                    ? entry.hero_image_url
                    : `${API_URL}${entry.hero_image_url}`}
                  alt={`Journal entry from ${formatDateTime(entry.entry_date)}`}
                  width={1200}
                  height={700}
                  className="w-full h-full object-cover rounded-b-2xl cursor-pointer"
                  onClick={handleExpandImage}
                  priority
                  unoptimized
                  onLoad={handleImageLoad}
                />
                
                {/* Inset Shadow Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none z-[1]"
                  style={{ 
                    boxShadow: 'inset 0 0 80px 10px rgba(0, 0, 0, 0.4)',
                  }}
                />
                
                {/* Emotions - Bottom Right */}
                {entry.emotions.length > 0 && (
                  <div 
                    className="absolute bottom-5 right-3 z-[2]"
                    style={{ 
                      maxWidth: entry.emotions.length > 3 ? 'calc(100% - 180px)' : 'auto',
                      overflowX: entry.emotions.length > 3 ? 'auto' : 'visible',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      {entry.emotions.map((emotion) => (
                        <span
                          key={emotion.id}
                          className="text-sm font-medium text-white drop-shadow-lg bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg whitespace-nowrap"
                        >
                          {emotion.name}: {Math.round(emotion.intensity * 100)}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Expand, Share, and Delete Buttons - Bottom Left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 z-[2]">
                  <button
                    onClick={handleExpandImage}
                    className="bg-black/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-300 hover:bg-black/50 shadow-lg"
                    style={{ borderRadius: '9999px' }}
                    aria-label="Expand image"
                  >
                    <Maximize className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share && entry.hero_image_url) {
                        navigator.share({
                          title: entry.title || 'Journal Entry',
                          text: 'Check out my journal entry',
                          url: window.location.href
                        }).catch(err => console.log('Error sharing:', err));
                      }
                    }}
                    className="bg-black/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-300 hover:bg-black/50 shadow-lg"
                    style={{ borderRadius: '9999px' }}
                    aria-label="Share"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="bg-black/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-300 hover:bg-black/50 shadow-lg"
                    style={{ borderRadius: '9999px' }}
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-6 lg:p-8 relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  {entry.title && (
                    <div className="mb-2 animate-slide-in-from-left">
                      {isEditingTitle ? (
                        <div className="relative max-w-md">
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="text-2xl font-semibold text-white bg-transparent border-b-2 border-brand-500 focus:outline-none w-full pr-16"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveTitle();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <div className="absolute right-0 bottom-0 flex gap-2 pb-1">
                            <button
                              onClick={handleSaveTitle}
                              className="text-white/60 hover:text-gray-600 hover:text-gray-300 transition-colors"
                              aria-label="Save title"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-white/60 hover:text-gray-600 hover:text-gray-300 transition-colors"
                              aria-label="Cancel edit"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-semibold text-white truncate max-w-sm">
                            {entry.title}
                          </h2>
                          <button
                            onClick={handleEditTitle}
                            className="text-white/60 hover:text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0"
                            aria-label="Edit title"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-sm text-white/60 animate-slide-in-from-left" style={{ animationDelay: '0.1s' }}>
                    {formatDateTime(entry.created_at)}
                  </span>
                </div>
              </div>

              {/* Key Insight */}
              {entry.summary?.key_insight && (
                <div className="mb-6 animate-slide-in-from-left" style={{ animationDelay: '0.25s' }}>
                  <div className="flex items-center gap-1.5 mb-2 ml-3">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--app-accent-secondary-color)' }} />
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--app-accent-secondary-color)' }}>Key Insight</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(199, 152, 112, 0.08)', border: '1px solid rgba(199, 152, 112, 0.25)' }}>
                    <p className="text-base leading-relaxed text-white/80">{entry.summary.key_insight}</p>
                  </div>
                </div>
              )}

              {/* Patterns Noticed */}
              {entry.summary?.patterns && entry.summary.patterns.length > 0 && (
                <>
                  <div className="mb-6 animate-slide-in-from-left" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-xl font-semibold text-white mb-4">Patterns Noticed</h3>
                    <div className="space-y-3">
                      {entry.summary.patterns.map((pattern, index) => {
                        const text = decodeHtmlEntities(pattern).replace(/^you\s+/i, '');
                        const display = text.charAt(0).toUpperCase() + text.slice(1);
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <BringToFront className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'rgba(167, 139, 250, 0.8)' }} />
                            <p className="text-base text-white/80 leading-relaxed">{display}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Reflect On */}
              {entry.summary?.reflection_questions && entry.summary.reflection_questions.length > 0 && (
                <>
                  <div className="mb-6 animate-slide-in-from-left" style={{ animationDelay: '0.5s' }}>
                    <h3 className="text-xl font-semibold text-white mb-4">Reflect On</h3>
                    <div className="space-y-3">
                      {entry.summary.reflection_questions.map((question, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'var(--app-accent-color)' }} />
                          <p className="text-base text-white/80 leading-relaxed">{decodeHtmlEntities(question)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Explore Further — tip-based cards */}
              {entry.suggestions && entry.suggestions.length > 0 && (
                <>
                  <div className="mb-6 animate-slide-in-from-left" style={{ animationDelay: '0.6s' }}>
                    <h3 className="text-xl font-semibold text-white mb-4">Explore Further</h3>
                    <div className="space-y-3">
                      {entry.suggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="bg-[var(--app-bg-secondary-color)] hover:brightness-90 rounded-xl p-4 transition-all duration-200 cursor-pointer"
                          onClick={() => handleStartSession(suggestion.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            {suggestion.title && (
                              <p className="text-sm font-semibold text-white">{suggestion.title}</p>
                            )}
                            <FrameworkBadge frameworkKey={suggestion.framework_key as FrameworkKey} />
                          </div>
                          <div className="flex items-end justify-between gap-3">
                            <p className="text-sm text-white/60 leading-relaxed">{suggestion.suggestion_text}</p>
                            <button
                              onClick={e => { e.stopPropagation(); handleStartSession(suggestion.id); }}
                              className="flex-shrink-0 flex items-center gap-1.5 text-xs text-white/60 transition-colors px-3 py-1 rounded-lg border border-white/10"
                              onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--app-accent-secondary-color)';
                                e.currentTarget.style.borderColor = 'var(--app-accent-secondary-color)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.color = '';
                                e.currentTarget.style.borderColor = '';
                              }}
                            >
                              <Play className="w-3 h-3" />
                              Discuss
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Summary */}
              {entry.summary && entry.summary.one_line_summary && (
                <div className="mb-6 animate-slide-in-from-left" style={{ animationDelay: '0.7s' }}>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Summary
                  </h3>
                  <p className="text-base text-white/80 leading-relaxed">
                    {decodeHtmlEntities(entry.summary.one_line_summary)}
                  </p>
                </div>
              )}

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-white mb-3">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="light"
                        color="primary"
                        size="md"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {entry?.hero_image_url && (
        <Modal
          isOpen={isImageModalOpen}
          onClose={() => {
            setIsImageModalOpen(false);
            setImageDimensions(null);
          }}
          className="!w-auto !max-w-none !bg-transparent p-0 flex items-center justify-center"
          isFullscreen={false}
        >
          <div 
            className="relative bg-transparent inline-block"
            style={
              imageDimensions
                ? {
                    aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                  }
                : {
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                  }
            }
          >
            <Image
              src={entry.hero_image_url.startsWith('http') 
                ? entry.hero_image_url 
                : `${API_URL}${entry.hero_image_url}`}
              alt={`Journal entry from ${formatDateTime(entry.entry_date)}`}
              width={imageDimensions?.width || 1400}
              height={imageDimensions?.height || 800}
              className="w-full h-full object-contain rounded-2xl"
              onLoad={handleModalImageLoad}
              unoptimized
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        isLoading={isDeleting}
      />
      </>
      )}
      </div>
  );
}
