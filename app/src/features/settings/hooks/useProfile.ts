import { useUpdateUserMutation, useLogoutMutation } from '../api/profile.endpoints';
import { useUserData } from '@/shared/contexts/UserDataContext';

export function useProfile() {
  // Use shared user data from context (loaded once at app startup)
  const { user, isLoading, refetch } = useUserData();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  return {
    user,
    isLoading,
    error: undefined,
    refetch,
    updateUser,
    isUpdating,
    logout,
    isLoggingOut,
  };
}
