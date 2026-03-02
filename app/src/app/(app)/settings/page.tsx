"use client";

import {
  UserMetaCard,
  UserBioCard,
  UserInfoCard,
  DeleteAllEntriesButton,
  LogoutButton,
} from "@/features/settings";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useToast } from '@/shared/hooks/useToast';
import { SkeletonBase } from '@/shared/ui/skeletons/SkeletonBase';
import { useContentReady } from "@/shared/contexts/NavigationContext";
import { MobileHeader } from "@/shared/components/layout/MobileHeader";

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-2 xl:gap-3 h-full pb-3">
      <div className="flex-1 overflow-y-auto min-h-0 relative z-0">
        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-[var(--app-bg-secondary-color)] shadow-sm rounded-2xl">
            {/* User Meta Card Skeleton */}
            <div className="p-4">
              <div className="flex flex-row items-center gap-4 min-w-0">
                <SkeletonBase width="w-16" height="h-16" rounded="full" />
                <div className="min-w-0 flex-1">
                  <SkeletonBase width="w-32" height="h-5" rounded="lg" className="mb-2" />
                  <SkeletonBase width="w-48" height="h-3" rounded="lg" />
                </div>
                <SkeletonBase width="w-16" height="h-8" rounded="lg" />
              </div>
            </div>

            {/* User Info Card Skeleton */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <SkeletonBase width="w-20" height="h-3" rounded="lg" className="mb-2" />
                  <SkeletonBase width="w-full" height="h-10" rounded="lg" />
                </div>
                <div>
                  <SkeletonBase width="w-20" height="h-3" rounded="lg" className="mb-2" />
                  <SkeletonBase width="w-full" height="h-10" rounded="lg" />
                </div>
              </div>
            </div>

            {/* User Bio Card Skeleton */}
            <div className="p-4">
              <SkeletonBase width="w-16" height="h-3" rounded="lg" className="mb-2" />
              <SkeletonBase width="w-full" height="h-24" rounded="lg" />
            </div>

            {/* Delete Button Skeleton */}
            <div className="p-4">
              <SkeletonBase width="w-full" height="h-10" rounded="lg" />
            </div>

            {/* Logout Button Skeleton */}
            <div className="p-4">
              <SkeletonBase width="w-full" height="h-10" rounded="lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user, updateUser, isLoadingUser } = useAuth();
  const { showInfo, showError } = useToast();

  // Signal content ready immediately - skeleton shows until data loads
  useContentReady(true);
  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bioText, setBioText] = useState('');

  // Slide up animation
  useEffect(() => {
    if (!isLoadingUser) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isLoadingUser]);

  const originalFirstName = user?.first_name || user?.display_name?.split(' ')[0] || '';
  const originalLastName = user?.last_name || user?.display_name?.split(' ').slice(1).join(' ') || '';
  const originalBio = user?.bio || '';

  useEffect(() => {
    setFirstName(originalFirstName);
    setLastName(originalLastName);
    setBioText(originalBio);
  }, [originalFirstName, originalLastName, originalBio]);

  const hasChanges =
    firstName !== originalFirstName ||
    lastName !== originalLastName ||
    bioText !== originalBio;

  // Show skeleton while user data is loading
  if (isLoadingUser) {
    return <SettingsSkeleton />;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFirstName(originalFirstName);
    setLastName(originalLastName);
    setBioText(originalBio);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        bio: bioText
      });
      showInfo('Success! Profile Updated');
      setIsEditing(false);
      setIsSaving(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      showError('Something Went Wrong');
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 xl:gap-3 h-full pb-3">
      <MobileHeader title="Settings" />
      <div className="flex-1 overflow-y-auto min-h-0 relative z-0 p-3 md:p-0">
        <div className="max-w-2xl mx-auto md:mt-6">
          <div
            className={`bg-[var(--app-bg-secondary-color)] shadow-sm rounded-2xl transition-all duration-300 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="p-4">
              <UserMetaCard
                isEditing={isEditing}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />
            </div>

            <div className="p-4">
              <UserInfoCard
                isEditing={isEditing}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
              />
            </div>

            <div className="p-4">
              <UserBioCard
                isEditing={isEditing}
                bioText={bioText}
                setBioText={setBioText}
              />
            </div>

            <div className="p-4">
              <DeleteAllEntriesButton />
            </div>

            <div className="p-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
