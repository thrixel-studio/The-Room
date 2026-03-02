"use client";

import { useAppSelector } from "@/shared/store/hooks";
import AppSidebar from "@/shared/components/layout/AppSidebar";
import Backdrop from "@/shared/components/layout/Backdrop";
import { PageTransition } from "@/shared/components/PageTransition";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/shared/contexts/UserDataContext";
import { tokenStorage } from "@/shared/lib/storage";

const AppLayout = React.memo(function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobileOpen = useAppSelector((state) => state.ui.sidebarMobileOpen);
  const router = useRouter();
  const { user, isLoading, isInitialized } = useUserData();
  const [tokenChecked, setTokenChecked] = useState(false);

  // Step 1: Check for token presence immediately on mount (client-side only)
  useEffect(() => {
    const hasToken = !!tokenStorage.getAccessToken();
    if (!hasToken) {
      router.replace("/signin");
      return;
    }
    setTokenChecked(true);
  }, [router]);

  // Step 2: Once token check passed and user data is resolved, verify user exists
  useEffect(() => {
    if (!tokenChecked || !isInitialized || isLoading) return;
    if (!user) {
      router.replace("/signin");
    }
  }, [tokenChecked, isInitialized, isLoading, user, router]);

  // Show blank screen while auth is being determined (avoids hydration mismatch)
  if (!tokenChecked || !isInitialized || isLoading || !user) {
    return <div className="min-h-screen bg-[#1e1f22]" />;
  }

  return (
    <div className="min-h-screen xl:flex relative">
      {/* Sidebar and Backdrop - Static, won't re-render on page changes */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className="flex-1 transition-all duration-300 ease-in-out flex flex-col h-screen md:ml-[60px]"
      >
        {/* Page Content - Each page now shows header immediately */}
        <div className="flex-1 min-h-0 overflow-y-auto pt-3 md:pr-3 mx-auto max-w-(--breakpoint-2xl) w-full shadow-none">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </div>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout;
