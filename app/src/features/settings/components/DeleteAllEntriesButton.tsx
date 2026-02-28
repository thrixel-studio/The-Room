"use client";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useModal } from "@/shared/hooks/useModal";
import { ConfirmationModal } from "@/shared/ui/modal/ConfirmationModal";
import Button from "@/shared/ui/button/Button";
import { entriesApi } from "@/shared/lib/entries";
import { tokenStorage } from "@/shared/lib/storage";
import { useToast } from '@/shared/hooks/useToast';

export default function DeleteAllEntriesButton() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showInfo, showError } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      await entriesApi.deleteAllEntries(accessToken);
      showInfo('Success! All Entries Deleted');
      closeModal();
      // Refresh the page to show updated entries list
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete all entries:", error);
      showError('Something Went Wrong');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white/90">
              Journal Data
            </h3>
            <p className="mt-0.5 text-xs font-normal text-gray-400">
              Permanently delete all your journal entries. This action cannot be undone.
            </p>
          </div>

          <Button
            variant="error"
            onClick={openModal}
            icon={<Trash2 className="w-4 h-4" />}
            className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 !bg-transparent !text-[var(--app-danger-color)] border !border-[var(--app-danger-color)] hover:!bg-[var(--app-danger-color)] hover:!text-white"
          >
            Delete All
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete All Journal Entries"
        message="Are you sure you want to permanently delete all your journal entries?"
        confirmText="Delete All"
        cancelText="Cancel"
        confirmColor="error"
        isLoading={isDeleting}
      />
    </>
  );
}
