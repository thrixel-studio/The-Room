"use client";

import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppDispatch } from '@/shared/store/hooks';
import { initializeFramework } from '../slices/frameworksSlice';
import type { FrameworkKey } from '../types';

/**
 * Initializes the framework selection from user profile
 * This component should be mounted once at the root level
 */
export function FrameworkInitializer() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.selected_framework) {
      // Initialize from user profile
      dispatch(initializeFramework(user.selected_framework as FrameworkKey));
    } else {
      // Initialize from localStorage or default
      dispatch(initializeFramework(null));
    }
  }, [user?.selected_framework, dispatch]);

  return null;
}
