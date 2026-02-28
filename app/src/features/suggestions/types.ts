import type { FrameworkKey } from "@/features/frameworks";

export interface Tip {
  tip_text: string;
  framework_key: FrameworkKey;
  entry_id: string;
}

export interface TipsResponse {
  tips: Tip[];
}

export interface Suggestion {
  id: string;
  source_chat_id: string;
  title: string | null;
  suggestion_text: string;
  framework_key: FrameworkKey;
  context_brief: string | null;
  is_dismissed: boolean;
  acted_on_chat_id: string | null;
  created_at: string;
}

export interface SuggestionListResponse {
  suggestions: Suggestion[];
}

export interface CreateChatFromSuggestionRequest {
  suggestion_id: string;
}

export interface CreateChatFromSuggestionResponse {
  session_id: string;
  framework: string;
  started_at: string;
}
