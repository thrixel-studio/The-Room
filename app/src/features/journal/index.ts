// Components
export { default as EntryDetail } from './components/EntryDetail';
export { default as EntryHero } from './components/EntryHero';
export { FinishSessionButton } from './components/FinishSessionButton';
// Legacy exports for backward compatibility
export { default as JournalEntryCards } from './components/JournalEntryCards';
export { default as JournalEntryCard } from './components/JournalEntryCard';

// Hooks
export { useJournal, useEntry } from './hooks/useJournal';

// API
export {
  journalApi,
  useGetEntriesQuery,
  useGetEntryQuery,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
  useDeleteAllEntriesMutation,
  useShareEntryMutation,
} from './api/journal.endpoints';

// Types
export type {
  JournalEntry,
  EntryDetail as EntryDetailType,
  ChatMessage,
  EntriesListResponse,
  GetEntriesParams,
  UpdateEntryRequest,
} from './types';
