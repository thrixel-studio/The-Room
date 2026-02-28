import React from "react";
import "@/features/auth/styles/auth.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 z-1 sm:p-0 bg-[var(--app-bg-primary-color)]">
      <div className="relative flex w-full h-screen justify-center flex-col sm:p-0 bg-[var(--app-bg-primary-color)]">
        {children}
      </div>
    </div>
  );
}
