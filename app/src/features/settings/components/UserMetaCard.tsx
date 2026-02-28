"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/features/auth";
import Button from "@/shared/ui/button/Button";
import { Pencil, Save, X } from "lucide-react";

interface UserMetaCardProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  hasChanges: boolean;
}

const UserMetaCard = React.memo(function UserMetaCard({ isEditing, onEdit, onSave, onCancel, isSaving, hasChanges }: UserMetaCardProps) {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const displayName = user?.display_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';

  // Construct full avatar URL if it's a relative path from backend
  // External URLs (Google, etc.) start with http/https and are used directly
  let avatarUrl: string | null = null;
  if (user?.avatar_url) {
    if (user.avatar_url.startsWith('http://') || user.avatar_url.startsWith('https://')) {
      avatarUrl = user.avatar_url;
    } else if (user.avatar_url.startsWith('/')) {
      avatarUrl = `${API_URL}${user.avatar_url}`;
    } else {
      avatarUrl = `${API_URL}/${user.avatar_url}`;
    }
  }

  // Use fallback if no avatar or if image failed to load
  const finalAvatarUrl = (!avatarUrl || imageError)
    ? '/images/user/default-avatar.svg'
    : avatarUrl;

  // Determine if we should use unoptimized mode
  const isExternalUrl = avatarUrl?.startsWith('http://') || avatarUrl?.startsWith('https://');

  return (
    <div>
      <div className="flex flex-row items-center gap-4 min-w-0">
        <div className="w-16 h-16 overflow-hidden border border-white/10 rounded-full flex-shrink-0 bg-[var(--app-bg-primary-color)] flex items-center justify-center">
          {finalAvatarUrl ? (
            isExternalUrl && !imageError ? (
              // Use native img for external URLs (Google, etc.) to avoid Next.js image optimization issues
              // eslint-disable-next-line @next/next/no-img-element
              <img
                width={64}
                height={64}
                src={finalAvatarUrl}
                alt={displayName}
                className="rounded-full object-cover w-16 h-16"
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <Image
                width={64}
                height={64}
                src={finalAvatarUrl}
                alt={displayName}
                className="rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <span className="text-gray-400 text-xl font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white/90 truncate mb-1">
            {displayName}
          </h3>
          <p className="text-xs text-gray-400 truncate">
            {email}
          </p>
        </div>
        <div className="flex gap-2 ml-auto self-start">
          {isEditing ? (
            <>
              <Button
                onClick={onCancel}
                variant="primary"
                icon={<X className="w-4 h-4" />}
                className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 !bg-transparent !text-[var(--app-text-secondary-color)] border !border-[var(--app-text-secondary-color)] hover:!bg-[var(--app-text-secondary-color)] hover:!text-[var(--app-bg-primary-color)]"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                variant="accent"
                icon={<Save className="w-4 h-4" />}
                className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 !border-0"
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <Button
              onClick={onEdit}
              variant="primary"
              icon={<Pencil className="w-4 h-4" />}
              className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 !bg-transparent !text-[var(--app-text-secondary-color)] border !border-[var(--app-text-secondary-color)] hover:!bg-[var(--app-text-secondary-color)] hover:!text-[var(--app-bg-primary-color)]"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

UserMetaCard.displayName = 'UserMetaCard';

export default UserMetaCard;
