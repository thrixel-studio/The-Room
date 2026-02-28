"use client";

import { useAppSelector } from "@/shared/store/hooks";
import AppSidebar from "@/shared/components/layout/AppSidebar";
import Backdrop from "@/shared/components/layout/Backdrop";
import { PageTransition } from "@/shared/components/PageTransition";
import React from "react";

const AppLayout = React.memo(function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobileOpen = useAppSelector((state) => state.ui.sidebarMobileOpen);

  return (
    <div className="min-h-screen xl:flex relative">
      {/* Sidebar and Backdrop - Static, won't re-render on page changes */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className="flex-1 transition-all duration-300 ease-in-out flex flex-col h-screen lg:ml-[60px]"
      >
        {/* Page Content - Each page now shows header immediately */}
        <div className="flex-1 min-h-0 overflow-y-auto pt-3 pr-3 mx-auto max-w-(--breakpoint-2xl) w-full shadow-none">
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
