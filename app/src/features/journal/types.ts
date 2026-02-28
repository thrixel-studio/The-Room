export interface RecentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    event?: string;
    from_framework?: string;
    to_framework?: string;
  } | null;
}

export interface JournalEntry {
  id: string;
  entry_date: string;
  created_at: string;
  hero_image_url: string | null;
  summary_bullets: string[];
  title?: string | null;
  tags: Array<{
    id: string;
    name: string;
    kind: string;
  }>;
  emotions: Array<{
    id: string;
    name: string;
    intensity: number;
    color?: string;
  }>;
  is_highlight: boolean;
  status: string;
  framework?: string | null;
  session_id?: string | null;
  last_message?: string | null;
  last_message_timestamp?: string | null;
  completion_percentage?: number;  // 0.0-1.0
  recent_messages?: RecentMessage[];  // Last few messages for draft preview
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface EntryDetail {
  id: string;
  title: string | null;
  content_text: string;
  status: string;
  is_highlight: boolean;
  entry_date: string;
  created_at: string;
  updated_at: string;
  finished_at: string | null;
  hero_image_url: string | null;
  source_type: string;
  tags: Array<{
    id: string;
    name: string;
    kind: string;
  }>;
  emotions: Array<{
    id: string;
    name: string;
    intensity: number;
    color?: string;
  }>;
  summary: {
    summary_bullets: string[];
    one_line_summary: string | null;
    tips: Array<{
      title: string;
      description: string;
      framework_key: string;
    }>;
    key_insight: string | null;
    patterns: string[];
    reflection_questions: string[];
  } | null;
  suggestions: Array<{
    id: string;
    title: string | null;
    suggestion_text: string;
    framework_key: string;
    context_brief: string | null;
  }>;
  session_id: string | null;
  messages: ChatMessage[];
}

export interface EntriesListResponse {
  items: JournalEntry[];
  total: number;
  page: number;
  page_size: number;
}

export interface GetEntriesParams {
  page?: number;
  page_size?: number;
  status?: 'DRAFT' | 'FINAL';
  date_from?: string;
  date_to?: string;
}

export interface UpdateEntryRequest {
  title?: string;
  is_highlight?: boolean;
}
