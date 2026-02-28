import React from "react";
import Badge from "@/shared/ui/badge/Badge";
import Button from "@/shared/ui/button/Button";
import { PencilLine, Pencil, Check, X } from "lucide-react";
import { decodeHtmlEntities } from "@/shared/lib/text";

interface EntryDetailProps {
  entry: {
    id: string;
    title?: string | null;
    created_at: string;
    summary?: {
      one_line_summary?: string;
      summary_bullets: string[];
    };
    tags: Array<{
      id: string;
      name: string;
      kind: string;
    }>;
  };
  isEditingTitle: boolean;
  editedTitle: string;
  onEditTitle: () => void;
  onSaveTitle: () => void;
  onCancelEdit: () => void;
  onTitleChange: (value: string) => void;
}

export default function EntryDetail({
  entry,
  isEditingTitle,
  editedTitle,
  onEditTitle,
  onSaveTitle,
  onCancelEdit,
  onTitleChange,
}: EntryDetailProps) {
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
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="text-2xl font-semibold text-gray-800 text-white/90 bg-transparent border-b-2 border-brand-500 focus:outline-none w-full pr-16"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSaveTitle();
                      if (e.key === 'Escape') onCancelEdit();
                    }}
                  />
                  <div className="absolute right-0 bottom-0 flex gap-2 pb-1">
                    <button
                      onClick={onSaveTitle}
                      className="text-gray-400 text-gray-500 hover:text-gray-600 hover:text-gray-300 transition-colors"
                      aria-label="Save title"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className="text-gray-400 text-gray-500 hover:text-gray-600 hover:text-gray-300 transition-colors"
                      aria-label="Cancel edit"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 text-white/90 truncate max-w-sm">
                    {entry.title}
                  </h2>
                  <button
                    onClick={onEditTitle}
                    className="text-gray-400 text-gray-500 hover:text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0"
                    aria-label="Edit title"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
          <span className="text-sm text-gray-400 text-gray-500 animate-slide-in-from-left" style={{ animationDelay: '0.1s' }}>
            {formatDateTime(entry.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            icon={<PencilLine className="w-4 h-4" />}
            disabled
            className="animate-fade-in [animation-delay:0.2s]"
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Separator */}
      <div className="my-6 border-t border-gray-200 border-gray-800"></div>

      {/* Summary */}
      {entry.summary && entry.summary.one_line_summary && (
        <div className="mb-6 animate-slide-in-from-left" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-semibold text-gray-800 text-white/90 mb-4">
            Summary
          </h3>
          <p className="text-base text-gray-600 text-gray-400 leading-relaxed">
            {decodeHtmlEntities(entry.summary.one_line_summary)}
          </p>
        </div>
      )}

      {/* Separator */}
      {entry.summary && entry.summary.summary_bullets.length > 0 && (
        <div className="my-6 border-t border-gray-200 border-gray-800"></div>
      )}

      {/* Key Points */}
      {entry.summary && entry.summary.summary_bullets.length > 0 && (
        <div className="space-y-4 mb-6 animate-slide-in-from-left" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-semibold text-gray-800 text-white/90 mb-4">
            Key Points
          </h3>
          <ul className="space-y-2">
            {entry.summary.summary_bullets.map((bullet, index) => (
              <li key={index} className="text-base text-gray-600 text-gray-400 flex items-start leading-relaxed">
                <span className="mr-2 text-gray-400 text-gray-500 flex-shrink-0">•</span>
                <span className="flex-1">{decodeHtmlEntities(bullet)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 border-gray-800">
          <h4 className="text-sm font-medium text-gray-700 text-gray-300 mb-3">
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
  );
}
