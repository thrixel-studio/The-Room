/**
 * SSE (Server-Sent Events) stream for monitoring summary generation
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SummaryStreamEvent {
  event: 'progress' | 'complete' | 'error';
  data?: {
    status?: string;
    entry_id?: string;
    message?: string;
  };
}

export function createSummaryStream(
  sessionId: string,
  accessToken: string,
  onEvent: (event: SummaryStreamEvent) => void,
  onError?: (error: Error) => void
): () => void {
  const url = `${API_URL}/writing/summary-stream/${sessionId}`;
  
  const eventSource = new EventSource(url + `?token=${accessToken}`);

  eventSource.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onEvent({
        event: 'progress',
        data,
      });
      
      // If status is 'completed', close the connection
      if (data.status === 'completed') {
        onEvent({
          event: 'complete',
          data,
        });
        eventSource.close();
      }
    } catch (error) {
      console.error('Error parsing SSE message:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    if (onError) {
      onError(new Error('Stream connection error'));
    }
    eventSource.close();
  };

  // Return cleanup function
  return () => {
    eventSource.close();
  };
}
