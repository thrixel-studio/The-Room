import { useGetEntriesQuery, useGetEntryQuery, useUpdateEntryMutation, useDeleteEntryMutation } from '../api/journal.endpoints';
import type { GetEntriesParams } from '../types';

export function useJournal(params?: GetEntriesParams) {
  const { data, isLoading, error, refetch } = useGetEntriesQuery(params);

  return {
    entries: data?.items || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.page_size || 20,
    isLoading,
    error,
    refetch,
  };
}

export function useEntry(id: string) {
  const { data: entry, isLoading, error, refetch } = useGetEntryQuery(id);
  const [updateEntry, { isLoading: isUpdating }] = useUpdateEntryMutation();
  const [deleteEntry, { isLoading: isDeleting }] = useDeleteEntryMutation();

  return {
    entry,
    isLoading,
    error,
    refetch,
    updateEntry,
    isUpdating,
    deleteEntry,
    isDeleting,
  };
}
