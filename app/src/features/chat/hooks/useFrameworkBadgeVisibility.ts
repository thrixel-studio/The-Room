import { FrameworkKey } from '@/features/frameworks';

/**
 * Controls the visibility of the framework badge
 * Shows the badge only if a framework is assigned
 *
 * @param isInitializing - Whether the session is still initializing (unused, kept for API compatibility)
 * @param sessionFramework - The framework key for the current session
 * @returns Object with showBadge boolean
 */
export function useFrameworkBadgeVisibility(
  isInitializing: boolean,
  sessionFramework: FrameworkKey | null
) {
  const showBadge = !!sessionFramework;

  return { showBadge };
}
