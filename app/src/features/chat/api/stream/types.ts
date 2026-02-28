export interface StreamEvent {
  event: 'progress' | 'complete' | 'error';
  data?: {
    status?: string;
    entry_id?: string;
    message?: string;
  };
}
