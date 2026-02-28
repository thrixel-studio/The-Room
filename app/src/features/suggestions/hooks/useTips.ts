import { useGetEntryTipsQuery } from '../api/suggestions.endpoints';

export function useTips() {
  const { data, isLoading } = useGetEntryTipsQuery();
  return { tips: data?.tips || [], isLoading };
}
