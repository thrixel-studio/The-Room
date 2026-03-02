"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/shared/lib/storage";
import {
  MessageInput,
  EmptyStatePrompt,
  ChatProgress,
  useCreateChatSessionMutation,
  useSendMessageMutation,
} from "@/features/chat";
import { FrameworkBadge, useFrameworks } from "@/features/frameworks";
import { useContentReady } from "@/shared/contexts/NavigationContext";

/**
 * Welcome screen for starting a new chat.
 * No session is created until user sends their first message.
 * After first message, user is redirected to /chat/[sessionId]
 */
export default function ChatWelcomePage() {
  const router = useRouter();
  const [textareaValue, setTextareaValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [createSession] = useCreateChatSessionMutation();
  const [sendMessage] = useSendMessageMutation();

  // Get user's selected framework
  const { selectedFramework } = useFrameworks();

  // Content is ready immediately - no loading needed
  useContentReady(true);

  // Slide up animation on mount
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!textareaValue.trim() || isSending) return;

    const userContent = textareaValue.trim();
    setIsSending(true);
    setError(null);

    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        router.push('/signin');
        return;
      }

      // Create session
      const session = await createSession().unwrap();

      // Send the first message
      await sendMessage({
        sessionId: session.id,
        content: userContent,
      }).unwrap();

      // Redirect to the chat session page
      router.push(`/chat/${session.id}`);
    } catch (err: any) {
      console.error('Failed to start chat:', err);
      setError(err.message || 'Failed to start chat');
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 relative shadow-none">
      {/* Framework Badge - Bottom Right Corner (deferred to avoid hydration mismatch) */}
      {mounted && selectedFramework && (
        <div className="fixed bottom-4 right-5 z-30">
          <FrameworkBadge frameworkKey={selectedFramework} />
        </div>
      )}

      {/* Progress Bar - Fixed at top right corner */}
      <ChatProgress messages={[]} />

      {/* Error Message */}
      {error && (
        <div className="mx-auto w-full max-w-2xl mb-4 px-4">
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg bg-red-900/40 text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Welcome Screen */}
      <div className="flex-1 flex flex-col items-center justify-center bg-transparent">
        <div
          className={`w-full max-w-2xl px-4 -mt-20 transition-all duration-300 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <EmptyStatePrompt show={true} />
          <div>
            <MessageInput
              value={textareaValue}
              onChange={setTextareaValue}
              onSend={handleSendMessage}
              onKeyDown={handleKeyDown}
              textareaRef={textareaRef}
              disabled={isSending}
              isLoading={isSending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
