'use client';

import { useEffect } from 'react';
import { useUserData } from '@/shared/contexts/UserDataContext';
import { useNavigation } from '@/shared/contexts/NavigationContext';

/**
 * Component that watches for user data to be initialized and signals
 * the navigation context when it's ready. This ensures the loading
 * screen waits for user data on initial app load.
 */
export function UserDataInitializer() {
  const { isInitialized } = useUserData();
  const { markUserDataLoaded, isUserDataLoaded } = useNavigation();

  useEffect(() => {
    if (isInitialized && !isUserDataLoaded) {
      markUserDataLoaded();
    }
  }, [isInitialized, isUserDataLoaded, markUserDataLoaded]);

  return null;
}
