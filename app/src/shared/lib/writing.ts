/**
 * Legacy writing API - Bridge file
 * TODO: Migrate to RTK Query in @/features/chat
 */

import { authenticatedFetchJson } from './api-client';

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  framework?: string | null;
  state: 'ACTIVE' | 'COMPLETED';
}

export const writingApi = {
  async createChatSession(accessToken: string): Promise<ChatSession> {
    return authenticatedFetchJson<ChatSession>('/writing/chat/sessions', accessToken, {
      method: 'POST',
    });
  },
  
  async getChatSession(id: string, accessToken: string): Promise<ChatSession> {
    return authenticatedFetchJson<ChatSession>(`/writing/chat/sessions/${id}`, accessToken);
  },
  
  async sendMessage(sessionId: string, content: string, accessToken: string): Promise<ChatMessage> {
    return authenticatedFetchJson<ChatMessage>(
      `/writing/chat/sessions/${sessionId}/messages`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      }
    );
  },
  
  async finishSession(sessionId: string, accessToken: string): Promise<void> {
    await authenticatedFetchJson(
      `/writing/chat/sessions/${sessionId}/finish`,
      accessToken,
      {
        method: 'POST',
      }
    );
  },
};
