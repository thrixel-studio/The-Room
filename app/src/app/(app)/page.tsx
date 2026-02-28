"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContentReady } from "@/shared/contexts/NavigationContext";

export default function Home() {
  const router = useRouter();

  // Signal content ready immediately for redirect page
  useContentReady(true);

  useEffect(() => {
    router.replace("/chat");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Redirecting to chat...</p>
    </div>
  );
}
