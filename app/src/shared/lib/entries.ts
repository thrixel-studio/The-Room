/**
 * Legacy entries API - Bridge file
 * TODO: Migrate to RTK Query in @/features/journal
 */

import { authenticatedFetchJson } from './api-client';

export interface EntryDetail {
  id: string;
  title?: string | null;
  summary?: {
    one_line_summary?: string;
    summary_bullets: string[];
  };
  hero_image_url?: string | null;
  entry_date: string;
  created_at: string;
  tags: Array<{
    id: string;
    name: string;
    kind: string;
  }>;
  emotions: Array<{
    id: string;
    name: string;
    intensity: number;
  }>;
  is_highlight: boolean;
}

export const entriesApi = {
  async getEntry(id: string, accessToken: string): Promise<EntryDetail> {
    return authenticatedFetchJson<EntryDetail>(`/entries/${id}`, accessToken);
  },
  
  async getEntries(accessToken: string, params?: any) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page_size) searchParams.set('page_size', params.page_size.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/entries${queryString ? `?${queryString}` : ''}`;
    
    return authenticatedFetchJson<any>(endpoint, accessToken);
  },
  
  async deleteEntry(id: string, accessToken: string): Promise<void> {
    await authenticatedFetchJson(`/entries/${id}`, accessToken, {
      method: 'DELETE',
    });
  },
};
