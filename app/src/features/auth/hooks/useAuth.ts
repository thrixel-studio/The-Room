"use client";

import { useLoginMutation, useRegisterMutation } from '../api/auth.endpoints';
import { useUpdateUserMutation } from '@/features/settings/api/profile.endpoints';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/shared/lib/storage';
import { useUserData } from '@/shared/contexts/UserDataContext';

export function useAuth() {
  const router = useRouter();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();

  // Use shared user data from context (loaded once at app startup)
  const { user, isLoading: isLoadingUser, refetch } = useUserData();

  // Update user mutation
  const [updateUserMutation, { isLoading: isUpdating }] = useUpdateUserMutation();

  const login = async (email: string, password: string, keepLoggedIn: boolean = true) => {
    try {
      const tokens = await loginMutation({ email, password }).unwrap();
      tokenStorage.setTokens(tokens.access_token, tokens.refresh_token, keepLoggedIn);
      await refetch(); // Fetch user data after login
      router.push('/chat');
    } catch (error: any) {
      throw new Error(error.data?.detail || 'Login failed');
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    keepLoggedIn: boolean = true
  ) => {
    try {
      await registerMutation({ email, password, first_name: firstName, last_name: lastName }).unwrap();
      // After registration, log in automatically
      await login(email, password, keepLoggedIn);
    } catch (error: any) {
      throw new Error(error.data?.detail || 'Registration failed');
    }
  };

  const updateUser = async (updates: any) => {
    try {
      const result = await updateUserMutation(updates).unwrap();
      return result;
    } catch (error: any) {
      throw new Error(error.data?.detail || 'Update failed');
    }
  };

  const logout = () => {
    tokenStorage.clearTokens();
    router.push('/signin');
  };

  return {
    user,
    isLoadingUser,
    login,
    register,
    updateUser,
    logout,
    isLoggingIn,
    isRegistering,
    isUpdating,
  };
}
