import React from "react";
import { decodeHtmlEntities } from "@/shared/lib/text";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  typingMessageIds?: Set<string>;
  renderMessage?: (message: Message, isTyping: boolean) => React.ReactNode;
}

export default function MessageList({ messages, typingMessageIds = new Set(), renderMessage }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto py-4 pb-60 bg-transparent">
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-2xl space-y-3">
          {messages.map((message) => {
            const isTyping = typingMessageIds.has(message.id);
            
            if (renderMessage) {
              return (
                <div key={message.id} className="flex justify-start">
                  {renderMessage(message, isTyping)}
                </div>
              );
            }

            return (
              <div key={message.id} className="flex justify-start">
                <div className="w-full">
                  {message.role === "assistant" ? (
                    <div className="relative group">
                      <div className="px-2.5 py-1.5 md:px-3 md:py-1.5" style={{ borderLeft: '2px solid #7c3aed' }}>
                        <p className="text-base text-gray-800 text-white/90 leading-relaxed whitespace-pre-wrap">
                          {decodeHtmlEntities(message.content)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2.5 md:py-3">
                      <p className="text-base text-gray-800 text-white/90 leading-relaxed whitespace-pre-wrap">
                        {decodeHtmlEntities(message.content)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
