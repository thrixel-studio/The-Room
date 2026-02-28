import React, { useState, useRef, useEffect } from "react";
import { NotebookText, Image, Sparkles, CirclePlay, Play, ExternalLink } from "lucide-react";
import { decodeHtmlEntities } from "@/shared/lib/text";
import OptimizedImage from "@/shared/components/OptimizedImage";

interface RecentMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface JournalEntry {
  id: string;
  entry_date: string;
  created_at: string;
  hero_image_url: string | null;
  summary_bullets: string[];
  title?: string | null;
  tags: Array<{
    id: string;
    name: string;
    kind: string;
  }>;
  emotions: Array<{
    id: string;
    name: string;
    intensity: number;
  }>;
  is_highlight: boolean;
  completion_percentage?: number;  // 0.0-1.0
  recent_messages?: RecentMessage[];  // Last few messages for draft preview
  last_message_timestamp?: string | null;
}

interface JournalEntryCardProps {
  entry: JournalEntry;
  onImageLoad?: () => void;
  priority?: boolean; // Load image eagerly (for first few visible cards)
  isDraft?: boolean; // Whether this is a draft entry
  animationDelay?: number; // Delay in ms for staggered animation
  todayHasFinalEntry?: boolean; // Whether today's date already has a completed (FINAL) entry
}

const JournalEntryCard = React.memo(function JournalEntryCard({ entry, onImageLoad, priority = false, isDraft = false, animationDelay = 0, todayHasFinalEntry = false }: JournalEntryCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (isDraft && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [isDraft, entry.recent_messages]);

  // Build full image URL if it's a relative path
  const imageUrl = entry.hero_image_url
    ? (entry.hero_image_url.startsWith('http')
        ? entry.hero_image_url
        : `${API_URL}${entry.hero_image_url}`)
    : null;

  // Reset image loaded state when image URL changes
  React.useEffect(() => {
    setIsImageLoaded(false);
    setIsVisible(false);
  }, [entry.hero_image_url]);

  // Show card immediately for drafts or entries without images
  React.useEffect(() => {
    if (isDraft || !imageUrl) {
      // Use the animation delay prop
      const timer = setTimeout(() => setIsVisible(true), animationDelay);
      return () => clearTimeout(timer);
    }
  }, [isDraft, imageUrl, animationDelay]);

  // Use last_message_timestamp for drafts, created_at for finals
  const dateString = isDraft && entry.last_message_timestamp
    ? entry.last_message_timestamp
    : entry.created_at;

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

  // Check if the entry date is today
  const today = new Date();
  const isToday = timestamp.toDateString() === today.toDateString();

  // Get title: for drafts use last_message, for finals use title or first bullet
  const displayTitle = isDraft
    ? (entry.last_message
        ? decodeHtmlEntities(entry.last_message).substring(0, 100) + (entry.last_message.length > 100 ? "..." : "")
        : "Start your conversation...")
    : decodeHtmlEntities(
        entry.title || (entry.summary_bullets.length > 0 ? entry.summary_bullets[0] : "Untitled")
      );

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    onImageLoad?.();
    // Trigger visibility animation after image loads with delay
    if (!isDraft && imageUrl) {
      setTimeout(() => setIsVisible(true), animationDelay);
    }
  };

  return (
    <>
    <div
      className={`group relative rounded-2xl cursor-pointer flex flex-col aspect-[10/13] transition-all duration-300 ease-out overflow-hidden border-[var(--app-bg-primary-color)] hover:border-[var(--app-accent-secondary-color)] ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
      }`}
      style={{
        borderWidth: '1.5px',
        backgroundColor: isDraft ? 'var(--app-bg-tertiary-color)' : 'var(--app-bg-tertiary-color)',
        boxShadow: isDraft ? 'inset 0 2px 4px 0 rgb(0 0 0 / 0.2)' : undefined,
        containerType: isDraft ? 'size' as any : undefined
      }}
    >
      {/* Background Image - Full card coverage for generated entries */}
      {!isDraft && imageUrl && (
        <div className="absolute inset-0 z-[2]">
          <OptimizedImage
            src={imageUrl}
            alt={`Journal entry from ${date}`}
            fill
            className="object-cover"
            priority={priority}
            onLoad={handleImageLoad}
            onError={handleImageLoad}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            placeholderBg="var(--app-bg-tertiary-color)"
            hideShimmer={true}
            showInsetShadow={!isImageLoaded}
          />
          {/* Inset shadow overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.2)' }}
          />
        </div>
      )}

      {/* Image Section - Only for drafts */}
      {isDraft && (
        <div className="w-full aspect-square rounded-t-2xl overflow-hidden relative">
          {imageUrl && (
            <OptimizedImage
              src={imageUrl}
              alt={`Journal entry from ${date}`}
              fill
              className="object-cover"
              priority={priority}
              onLoad={handleImageLoad}
              onError={handleImageLoad}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              showInsetShadow={true}
            />
          )}
        </div>
      )}

      {/* Circular Progress Overlay - Top Right - Only for drafts with completion_percentage */}
      {isDraft && entry.completion_percentage !== undefined && (
        <div className="absolute top-3 right-3 z-20">
          <div className="relative w-7 h-7">
            {/* Progress ring - hidden on hover */}
            <div className="transition-opacity duration-200 group-hover:opacity-0">
              {/* SVG circular progress ring */}
              <svg
                className="absolute top-0 left-0 transform -rotate-90"
                width="28"
                height="28"
              >
                {/* Background circle */}
                <circle
                  cx="14"
                  cy="14"
                  r="12"
                  fill="none"
                  stroke="var(--app-bg-primary-color)"
                  strokeWidth="2.5"
                />
                {/* Progress circle */}
                <circle
                  cx="14"
                  cy="14"
                  r="12"
                  fill="none"
                  stroke="var(--app-accent-secondary-color)"
                  strokeWidth="2.5"
                  strokeDasharray={2 * Math.PI * 12}
                  strokeDashoffset={2 * Math.PI * 12 * (1 - entry.completion_percentage)}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              {/* Icon in the center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles
                  size={12}
                  className={todayHasFinalEntry ? "text-[var(--app-accent-secondary-color)]" : "text-[var(--app-text-secondary-color)]"}
                  style={{ transition: 'color 0.3s ease' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date and Time Badge - Top Left */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`text-sm font-medium text-[var(--app-text-secondary-color)] px-2 py-1 rounded-lg whitespace-nowrap ${isDraft ? 'bg-[var(--app-bg-primary-color)]' : 'bg-black/30 backdrop-blur-sm'}`}>
          {isToday ? `Today, ${time}` : `${date}, ${time}`}
        </span>
      </div>

      {/* Center Image Icon - Only while generated images are loading */}
      {!isDraft && !isImageLoaded && imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
          <Image
            size={48}
            className="text-[var(--app-bg-secondary-color)]"
            strokeWidth={1.5}
          />
        </div>
      )}

      {/* Content - positioned at bottom */}
      <div className={`mt-auto flex flex-col p-3 relative z-10 ${isDraft ? 'pb-0' : ''}`}>
        {/* Gradient overlay for text readability on generated cards */}
        {!isDraft && imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
        )}
        {isDraft ? (
          /* Draft: Show last 5 messages aligned to bottom */
          <div ref={messagesRef} className="flex flex-col gap-1.5 overflow-y-auto" style={{ height: '85cqh', scrollbarWidth: 'none', maskImage: 'linear-gradient(to bottom, transparent 0%, black 16px)' }}>
            <div className="mt-auto" />
            {entry.recent_messages && entry.recent_messages.length > 0 ? (
              entry.recent_messages.slice(-5).map((msg, idx) => (
                <div key={idx} className={`last:mb-3 ${msg.role === 'assistant' ? 'w-full' : 'flex justify-end'}`}>
                  {msg.role === 'assistant' ? (
                    <div
                      className="text-[13px] text-white/70 pl-1"
                      style={{ borderLeft: '1px solid var(--app-accent-color)' }}
                    >
                      {decodeHtmlEntities(msg.content)}
                    </div>
                  ) : (
                    <div className="text-[13px] text-white/70 px-2 py-0.5 rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-[1.5px] bg-[var(--app-bg-primary-color)] max-w-[90%]">
                      {decodeHtmlEntities(msg.content)}
                    </div>
                  )}
                </div>
              ))
            ) : entry.last_message ? (
              <div className="text-xs text-white/70 truncate">
                {decodeHtmlEntities(entry.last_message)}
              </div>
            ) : (
              <div className="text-xs text-white/50">
                Start your conversation...
              </div>
            )}
          </div>
        ) : (
          /* Generated: Show title */
          <div>
            <h3 className="text-sm text-[var(--app-text-secondary-color)] truncate font-semibold drop-shadow-md px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm w-fit flex items-center gap-1.5">
              <Sparkles size={14} className="shrink-0" />
              {displayTitle}
            </h3>
          </div>
        )}
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm rounded-2xl">
        <span className="text-sm font-medium text-[var(--app-accent-secondary-color)] flex items-center gap-1.5 drop-shadow-lg">
          {isDraft ? (
            <>
              <Play size={14} className="shrink-0" />
              Continue
            </>
          ) : (
            <>
              <ExternalLink size={14} className="shrink-0" />
              Open
            </>
          )}
        </span>
      </div>
    </div>
    </>
  );
});

JournalEntryCard.displayName = 'JournalEntryCard';

export default JournalEntryCard;
