import React from "react";

interface DashboardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Dashboard({ children, className = "" }: DashboardProps) {
  return (
    <div className={`flex flex-col h-full flex-1 min-h-0 ${className}`}>
      {children}
    </div>
  );
}
