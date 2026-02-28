import type { FrameworkKey } from '@/features/frameworks';

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    prompt_type?: string;
  };
  created_at: string;
  completion_percentage?: number;  // 0.0-1.0
  suggested_framework?: FrameworkKey;
}

export interface ChatSession {
  id: string;
  state: string;
  framework?: string | null;
  started_at: string;
  ended_at?: string;
  messages: ChatMessage[];
  continuation_of_chat_id?: string | null;
}

export interface SendMessageRequest {
  content: string;
}
