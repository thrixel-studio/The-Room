"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import Button from "@/shared/ui/button/Button";
import { FrameworkBadge } from "@/features/frameworks";
import {
  MessageInput,
  GeneratingCardModal,
  MessageRenderer,
  ChatProgress,
  LoadingIndicator,
  useGetChatSessionQuery,
  useSendMessageMutation,
  useAutoScroll,
  useSessionFinish,
  useMessageAnimations,
} from "@/features/chat";
import { useContentReady } from "@/shared/contexts/NavigationContext";
import { tokenStorage } from "@/shared/lib/storage";
import type { ChatMessage } from "@/features/chat";

/**
 * Chat session page - displays an existing chat with messages.
 * Session ID comes from the URL: /chat/[id]
 */
export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [textareaValue, setTextareaValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingMessageIds, setTypingMessageIds] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch session data
  const {
    data: session,
    isLoading: isLoadingSession,
    error: loadError,
  } = useGetChatSessionQuery(sessionId, {
    skip: !sessionId,
  });

  const [sendMessageMutation] = useSendMessageMutation();

  // Initialize messages from loaded session
  useEffect(() => {
    if (session?.messages) {
      setMessages(session.messages);
    }
  }, [session?.messages]);

  // Session finish hook
  const {
    finishSession,
    isFinishing,
    showGeneratingModal,
    generatingSessionId,
    onModalComplete,
  } = useSessionFinish(sessionId);

  // Handle load errors
  useEffect(() => {
    if (loadError) {
      // Check if session not found or inactive - redirect to new chat
      router.push('/chat');
    }
  }, [loadError, router]);

  // Check if session is inactive (skip redirect while generating modal is open)
  useEffect(() => {
    if (session && session.state !== 'ACTIVE' && !showGeneratingModal) {
      router.push('/chat');
    }
  }, [session, router, showGeneratingModal]);

  // Auto-scroll hook
  const { messagesEndRef, lastUserMessageRef } = useAutoScroll(messages, isLoadingSession);

  // Get the last user message ID for ref attachment
  const lastUserMessageId = [...messages].reverse().find(m => m.role === 'user')?.id;

  // Message animations hook
  const { shouldAnimate } = useMessageAnimations(messages);

  // Signal content ready when session is loaded
  useContentReady(!isLoadingSession && !!session);

  // Get completion percentage from last AI message
  const lastAIMessage = [...messages].reverse().find(
    msg => msg.role === 'assistant' && msg.completion_percentage !== undefined
  );
  const isConversationComplete = lastAIMessage?.completion_percentage !== undefined &&
                                  lastAIMessage.completion_percentage >= 1.0;

  // Event handlers
  const handleSendMessage = async () => {
    if (!textareaValue.trim() || isSending) return;

    const userContent = textareaValue.trim();
    setTextareaValue("");
    setIsSending(true);
    setError(null);

    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        router.push('/signin');
        return;
      }

      // Add user message to UI immediately (optimistic update)
      const tempUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        session_id: sessionId,
        role: 'user',
        content: userContent,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);

      // Send message and get AI response
      const aiMessage = await sendMessageMutation({
        sessionId,
        content: userContent,
      }).unwrap();

      // Replace temp message with real one and add AI response
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempUserMessage.id);
        return [
          ...withoutTemp,
          { ...tempUserMessage, id: `user-${Date.now()}` },
          aiMessage,
        ];
      });
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => !m.id.startsWith('temp-')));
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFinishEntry = async () => {
    await finishSession();
  };

  const markTypingComplete = (messageId: string) => {
    setTypingMessageIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  // Show framework badge if session has a framework
  const showBadge = !!session?.framework;

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 relative shadow-none">
      {/* Framework Badge - Bottom Right Corner */}
      {showBadge && (
        <div className="fixed bottom-4 right-5 z-30">
          <FrameworkBadge frameworkKey={session?.framework as any} />
        </div>
      )}

      {/* Progress Bar - Fixed at top right corner */}
      <ChatProgress messages={messages} />

      {/* Error Message */}
      {error && (
        <div className="mx-auto w-full max-w-2xl mb-4">
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg bg-red-900/40 text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-4 bg-transparent">
        <div className="flex justify-center w-full">
          <div className="w-full max-w-2xl space-y-3 px-4">
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const isLastUserMessage = message.id === lastUserMessageId;
              const isLastAIMessage = message.role === 'assistant' && isLastMessage;

              return (
                <React.Fragment key={message.id}>
                  <div ref={isLastUserMessage ? lastUserMessageRef : null}>
                    <MessageRenderer
                      message={message}
                      isTyping={typingMessageIds.has(message.id)}
                      shouldAnimate={shouldAnimate(message.id)}
                      onTypingComplete={() => markTypingComplete(message.id)}
                      isLastAI={isLastAIMessage}
                    />
                  </div>

                  {/* Loading Indicator - Right after last user message */}
                  {isLastUserMessage && isSending && (
                    <LoadingIndicator show={true} />
                  )}

                  {/* Analyze Button - Right after last AI message, only when 100% complete */}
                  {isLastAIMessage && isConversationComplete && !isFinishing && !isSending && typingMessageIds.size === 0 && (
                    <div className="flex justify-start">
                      <Button
                        variant="primary"
                        onClick={handleFinishEntry}
                        disabled={isFinishing}
                        icon={<Sparkles className="w-4 h-4" />}
                        className="px-3 py-1.5 !bg-transparent !text-[var(--app-accent-secondary-color)] !border-[var(--app-accent-secondary-color)] hover:!bg-[var(--app-accent-secondary-color)] hover:!text-gray-900"
                      >
                        Analyze
                      </Button>
                    </div>
                  )}

                  {isLastMessage && (
                    <div className="flex-1 min-h-[60vh]" />
                  )}
                </React.Fragment>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div>
        <div className="flex justify-center w-full">
          <div className="w-full max-w-2xl">
            <MessageInput
              value={textareaValue}
              onChange={setTextareaValue}
              onSend={handleSendMessage}
              onKeyDown={handleKeyDown}
              textareaRef={textareaRef}
            />
          </div>
        </div>
      </div>

      {/* Generating Card Modal */}
      <GeneratingCardModal
        isOpen={showGeneratingModal}
        sessionId={generatingSessionId || ""}
        onComplete={onModalComplete}
      />
    </div>
  );
}
