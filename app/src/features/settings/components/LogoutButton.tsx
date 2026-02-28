"use client";

import React, { useState } from "react";
import { useAuth } from "@/features/auth";
import { LogOut } from "lucide-react";
import { ConfirmationModal } from "@/shared/ui/modal/ConfirmationModal";
import Button from "@/shared/ui/button/Button";

export default function LogoutButton() {
  const { logout } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white/90">
              Sign Out
            </h3>
            <p className="mt-0.5 text-xs font-normal text-gray-400">
              Sign out of your account on this device.
            </p>
          </div>

          <Button
            variant="error"
            onClick={() => setShowConfirmModal(true)}
            disabled={isLoggingOut}
            icon={<LogOut className="w-4 h-4" />}
            className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 !bg-transparent !text-[var(--app-danger-color)] border !border-[var(--app-danger-color)] hover:!bg-[var(--app-danger-color)] hover:!text-white"
          >
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          handleLogout();
        }}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your account."
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmColor="error"
        isLoading={isLoggingOut}
      />
    </>
  );
}
