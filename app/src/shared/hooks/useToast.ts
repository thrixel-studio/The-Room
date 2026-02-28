/**
 * Toast notifications hook
 * Simple toast notification system
 */

export function useToast() {
  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    // TODO: Implement proper toast system or integrate with shared/ui/toast
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  return {
    showInfo: (message: string) => showToast(message, 'info'),
    showSuccess: (message: string) => showToast(message, 'success'),
    showError: (message: string) => showToast(message, 'error'),
  };
}
