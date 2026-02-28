// Components
export { default as ChatWindow } from './components/ChatWindow';
export { default as MessageList } from './components/MessageList';
export { default as MessageInput } from './components/MessageInput';
export { TypingMessage } from './components/TypingMessage';
export { GeneratingCardModal } from './components/GeneratingModal';
// Re-export for backward compatibility
export { GeneratingCardModal as GeneratingModal } from './components/GeneratingModal';
// New components
export { EmptyStatePrompt } from './components/EmptyStatePrompt';
export { MessageRenderer } from './components/MessageRenderer';
export { ChatProgress } from './components/ChatProgress';
export { LoadingIndicator } from './components/LoadingIndicator';
export { SwitchFrameworkButton } from './components/SwitchFrameworkButton';
export { FrameworkSwitchDivider } from './components/FrameworkSwitchDivider';

// Hooks
export { useChat } from './hooks/useChat';
// New hooks
export { useAutoScroll } from './hooks/useAutoScroll';
export { useFrameworkBadgeVisibility } from './hooks/useFrameworkBadgeVisibility';
export { useInputFocus } from './hooks/useInputFocus';
export { useMessageAnimations } from './hooks/useMessageAnimations';
export { useSessionInitialization } from './hooks/useSessionInitialization';
export { useChatMessages } from './hooks/useChatMessages';
export { useSessionFinish } from './hooks/useSessionFinish';
export { useUnsavedChangesNotification } from './hooks/useUnsavedChangesNotification';

// API
export {
  chatApi,
  useGetActiveSessionsQuery,
  useCreateChatSessionMutation,
  useGetChatSessionQuery,
  useSendMessageMutation,
  useFinishSessionMutation,
  useSwitchSessionFrameworkMutation,
} from './api/chat.endpoints';

// Stream
export { createSummaryStream } from './api/stream/summaryStream';
export type { SummaryStreamEvent } from './api/stream/summaryStream';

// Types
export type { ChatMessage, ChatSession, SendMessageRequest } from './types';

// Utilities
export { isAuthError } from './utils/auth';
export { updateUrlWithSession } from './utils/session';
