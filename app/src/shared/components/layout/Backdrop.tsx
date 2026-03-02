"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { closeMobileSidebar } from "@/shared/store/slices/uiSlice";

const Backdrop: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const isMobileOpen = useAppSelector((state) => state.ui.sidebarMobileOpen);

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
      onClick={() => dispatch(closeMobileSidebar())}
    />
  );
});

Backdrop.displayName = 'Backdrop';

export default Backdrop;
