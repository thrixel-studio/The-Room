import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { setFramework } from '../slices/frameworksSlice';
import { useUpdateUserFrameworkMutation } from '../api/frameworks.endpoints';
import { frameworks, getFrameworkByKey } from '../types';
import type { FrameworkKey } from '../types';

export function useFrameworks() {
  const dispatch = useAppDispatch();
  const selectedFramework = useAppSelector((state) => state.frameworks.selectedFramework);
  const [updateFramework, { isLoading }] = useUpdateUserFrameworkMutation();

  const setSelectedFramework = async (
    key: FrameworkKey,
    showError?: (message: string) => void
  ) => {
    try {
      // Update Redux state and localStorage immediately
      dispatch(setFramework(key));
      
      // Update on server (fire and forget with error handling)
      await updateFramework(key).unwrap();
    } catch (error) {
      if (showError) {
        showError('Failed to update framework preference');
      }
    }
  };

  return {
    selectedFramework,
    setSelectedFramework,
    frameworks,
    getFrameworkByKey,
    isUpdating: isLoading,
  };
}
