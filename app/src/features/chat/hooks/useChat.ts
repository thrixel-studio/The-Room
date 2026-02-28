import { useGetChatSessionQuery, useSendMessageMutation, useFinishSessionMutation } from '../api/chat.endpoints';

export function useChat(sessionId: string | null) {
  const { data: session, isLoading, error, refetch } = useGetChatSessionQuery(sessionId!, {
    skip: !sessionId,
  });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [finishSession, { isLoading: isFinishing }] = useFinishSessionMutation();

  return {
    session,
    messages: session?.messages || [],
    isLoading,
    error,
    refetch,
    sendMessage,
    isSending,
    finishSession,
    isFinishing,
  };
}
