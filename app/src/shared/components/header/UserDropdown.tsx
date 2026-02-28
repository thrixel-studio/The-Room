"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CircleUserRound } from "lucide-react";
import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import { DropdownItem } from "@/shared/ui/dropdown/DropdownItem";
import { useAuth } from "@/features/auth";

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user, logout } = useAuth();

function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  e.stopPropagation();
  e.preventDefault();
  setIsOpen((prev) => !prev);
}

  function closeDropdown() {
    setIsOpen(false);
  }

  const displayName = user?.display_name || user?.email?.split('@')[0] || 'User';
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
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
    <div className="relative">
      <button
        onClick={toggleDropdown} 
        className="flex items-center text-gray-700 text-gray-400 dropdown-toggle"
      >
        <span className="overflow-hidden rounded-full h-10 w-10 bg-gray-200 bg-gray-700 flex items-center justify-center">
          {finalAvatarUrl ? (
            isExternalUrl && !imageError ? (
              // Use native img for external URLs (Google, etc.) to avoid Next.js image optimization issues
              // eslint-disable-next-line @next/next/no-img-element
              <img
                width={40}
                height={40}
                src={finalAvatarUrl}
                alt={displayName}
                className="rounded-full object-cover w-10 h-10"
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <Image
                width={40}
                height={40}
                src={finalAvatarUrl}
                alt={displayName}
                className="rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <span className="text-gray-500 text-gray-400 text-sm font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-10 mt-6 flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg border-gray-100 bg-gray-dark"
      >
        <div className="px-3 py-2">
          <span className="block font-medium text-gray-700 text-theme-sm text-white">
            {user?.display_name || 'User'}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 text-white">
            {user?.email || ''}
          </span>
        </div>

        <div className="border-t border-gray-200 border-gray-800 my-2"></div>

        <Link
          href="/settings"
          onClick={closeDropdown}
          className="flex items-center gap-2 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 text-white hover:bg-white/5 w-full"
        >
          <CircleUserRound className="w-5 h-5 text-gray-500 group-hover:text-gray-700 text-white group-hover:text-white" />
          Account
        </Link>

        <div className="border-t border-gray-200 border-gray-800 my-2"></div>

        <button
          onClick={() => {
            closeDropdown();
            logout();
          }}
          className="flex items-center gap-2 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-red-50 hover:text-red-600 text-white hover:bg-red-500/10 hover:text-red-500 w-full"
        >
          <svg
            className="fill-gray-500 group-hover:fill-red-600 fill-white group-hover:fill-red-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
              fill=""
            />
          </svg>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}

export default React.memo(UserDropdown);
