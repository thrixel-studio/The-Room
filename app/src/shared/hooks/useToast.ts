import { useToastContext } from '@/shared/contexts/ToastContext';

export function useToast() {
  const { showToast } = useToastContext();

  return {
    showInfo: (message: string) =>
      showToast({ variant: 'info', title: message, message: '', duration: 5000 }),
    showSuccess: (message: string) =>
      showToast({ variant: 'success', title: message, message: '', duration: 5000 }),
    showError: (message: string) =>
      showToast({ variant: 'error', title: message, message: '', duration: 5000 }),
  };
}
