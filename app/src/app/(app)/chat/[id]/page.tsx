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
  ChatMobileHeader,
  LoadingIndicator,
  SwitchFrameworkButton,
  FrameworkSwitchDivider,
  useGetChatSessionQuery,
  useSendMessageMutation,
  useAutoScroll,
  useSessionFinish,
  useMessageAnimations,
  useSwitchSessionFrameworkMutation,
} from "@/features/chat";
import { EmergencyInline } from "@/features/chat/components/EmergencyInline";
import { useContentReady } from "@/shared/contexts/NavigationContext";
import { tokenStorage } from "@/shared/lib/storage";
import type { ChatMessage } from "@/features/chat";
import type { FrameworkKey } from "@/features/frameworks";

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

  // Framework switching — stays in same session, context preserved
  // switchedFramework is only for the optimistic badge update before session refetches
  const [switchedFramework, setSwitchedFramework] = useState<FrameworkKey | null>(null);

  // Fetch session data
  const {
    data: session,
    isLoading: isLoadingSession,
    error: loadError,
  } = useGetChatSessionQuery(sessionId, {
    skip: !sessionId,
  });

  const [sendMessageMutation] = useSendMessageMutation();
  const [switchSessionFramework] = useSwitchSessionFrameworkMutation();

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

  // Derive stable IDs for last user/AI messages (ignoring system messages)
  const lastUserMessageId = [...messages].reverse().find(m => m.role === 'user')?.id;
  const lastAIMessageId = [...messages].reverse().find(m => m.role === 'assistant')?.id;

  // Show emergency contacts if the last AI message has crisis_score >= 10
  // and no user message has been sent after it
  const showEmergencyContacts = (() => {
    const lastAI = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAI || lastAI.crisis_score === undefined || lastAI.crisis_score < 10) return false;
    const lastAIIndex = messages.findIndex(m => m.id === lastAI.id);
    const hasUserMessageAfter = messages.slice(lastAIIndex + 1).some(m => m.role === 'user');
    return !hasUserMessageAfter;
  })();

  // True once any framework switch system message exists — hides switch button permanently
  const hasEverSwitched = messages.some(
    m => m.role === 'system' && m.metadata?.event === 'framework_switch'
  );

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

  const handleSwitchFramework = async (frameworkKey: FrameworkKey, triggerMessageId: string) => {
    // Optimistic: insert a system message right after the trigger message so the
    // divider appears immediately (before the session refetches from the server)
    const optimisticMsg: ChatMessage = {
      id: `switch-opt-${Date.now()}`,
      session_id: sessionId,
      role: 'system',
      content: `Framework switched to ${frameworkKey}`,
      created_at: new Date().toISOString(),
      metadata: {
        event: 'framework_switch',
        from_framework: session?.framework ?? undefined,
        to_framework: frameworkKey,
      },
    };

    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === triggerMessageId);
      const next = [...prev];
      next.splice(idx >= 0 ? idx + 1 : next.length, 0, optimisticMsg);
      return next;
    });
    setSwitchedFramework(frameworkKey);

    try {
      await switchSessionFramework({ sessionId, frameworkKey }).unwrap();
      // Session auto-refetches via invalidatesTags, replacing the optimistic message
      // with the real system message stored in the DB
    } catch (err) {
      console.error('Failed to switch framework:', err);
      // Revert optimistic message and badge
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setSwitchedFramework(null);
    }
  };

  const markTypingComplete = (messageId: string) => {
    setTypingMessageIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  // Active framework: local switch overrides session default
  const displayFramework = switchedFramework || session?.framework;
  const showBadge = !!displayFramework;

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 relative shadow-none">
      {/* Mobile Header - sidebar toggle, framework, progress (mobile only) */}
      <ChatMobileHeader
        frameworkKey={displayFramework as FrameworkKey | undefined}
        messages={messages}
      />

      {/* Framework Badge - Bottom Right Corner (desktop only) */}
      {showBadge && (
        <div className="hidden md:block fixed bottom-4 right-5 z-30">
          <FrameworkBadge frameworkKey={displayFramework as any} />
        </div>
      )}

      {/* Progress Bar - Fixed at top right corner (desktop only) */}
      <div className="hidden md:block">
        <ChatProgress messages={messages} />
      </div>

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
          <div className="w-full max-w-2xl space-y-3 px-4 pt-5 md:pt-0">
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;

              // System framework-switch messages render as a divider, not a chat bubble
              if (message.role === 'system' && message.metadata?.event === 'framework_switch') {
                return (
                  <React.Fragment key={message.id}>
                    <FrameworkSwitchDivider frameworkKey={message.metadata.to_framework as FrameworkKey} />
                  </React.Fragment>
                );
              }

              const isLastUserMessage = message.id === lastUserMessageId;
              const isLastAIMessage = message.id === lastAIMessageId;

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

                  {/* Loading Indicator - right after last user message, only if no AI reply yet */}
                  {isLastUserMessage && isLastMessage && isSending && (
                    <LoadingIndicator show={true} />
                  )}

                  {/* Analyze Button - right after last AI message, only when 100% complete and no crisis */}
                  {isLastAIMessage && isConversationComplete && !showEmergencyContacts && !isFinishing && !isSending && typingMessageIds.size === 0 && (
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

                  {/* Switch Framework Button - hidden permanently once any switch has occurred */}
                  {isLastAIMessage && message.suggested_framework && !isSending &&
                    typingMessageIds.size === 0 && !isFinishing && !hasEverSwitched && (
                    <div className="flex justify-start">
                      <SwitchFrameworkButton
                        frameworkKey={message.suggested_framework}
                        onClick={() => handleSwitchFramework(message.suggested_framework!, message.id)}
                      />
                    </div>
                  )}

                </React.Fragment>
              );
            })}

            {showEmergencyContacts && <EmergencyInline />}
            <div className="flex-1 min-h-[60vh]" />
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
              isLoading={isSending}
            />
          </div>
        </div>
      </div>

      {/* Generating Card Modal */}
      <GeneratingCardModal
        isOpen={showGeneratingModal}
        sessionId={generatingSessionId || ""}
        onComplete={onModalComplete}
        messageCount={messages.length}
      />

    </div>
  );
}
