import { useRouter } from 'next/navigation';
import {
  useGetActiveSuggestionsQuery,
  useCreateChatFromSuggestionMutation,
  useDismissSuggestionMutation,
} from '../api/suggestions.endpoints';

export function useSuggestions() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetActiveSuggestionsQuery();
  const [createChatFromSuggestion, { isLoading: isCreating }] =
    useCreateChatFromSuggestionMutation();
  const [dismissSuggestion, { isLoading: isDismissing }] =
    useDismissSuggestionMutation();

  const handleStartChat = async (suggestionId: string) => {
    try {
      const result = await createChatFromSuggestion({
        suggestion_id: suggestionId,
      }).unwrap();
      router.push(`/chat/${result.session_id}`);
    } catch (err) {
      console.error('Failed to create chat from suggestion:', err);
    }
  };

  const handleDismiss = async (suggestionId: string) => {
    try {
      await dismissSuggestion(suggestionId).unwrap();
    } catch (err) {
      console.error('Failed to dismiss suggestion:', err);
    }
  };

  return {
    suggestions: data?.suggestions || [],
    isLoading,
    error,
    refetch,
    handleStartChat,
    isCreating,
    handleDismiss,
    isDismissing,
  };
}
