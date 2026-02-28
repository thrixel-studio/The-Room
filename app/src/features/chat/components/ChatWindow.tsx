import React from "react";

interface ChatWindowProps {
  children: React.ReactNode;
  className?: string;
}

export default function ChatWindow({ children, className = "" }: ChatWindowProps) {
  return (
    <div className={`flex flex-col h-full flex-1 min-h-0 relative ${className}`}>
      {children}
    </div>
  );
}
