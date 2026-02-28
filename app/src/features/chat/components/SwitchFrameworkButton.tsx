import { CornerDownRight, Heart, Target, Zap, Lightbulb, type LucideIcon } from 'lucide-react';
import type { FrameworkKey } from '@/features/frameworks';

const frameworkConfig: Record<FrameworkKey, { name: string; icon: LucideIcon }> = {
  mental_wellness: { name: 'Psychologist', icon: Heart },
  decision_making: { name: 'Advisor', icon: Target },
  productivity_boost: { name: 'Strategist', icon: Zap },
  problem_solving: { name: 'Mediator', icon: Lightbulb },
};

export function SwitchFrameworkButton({
  frameworkKey,
  onClick,
}: {
  frameworkKey: FrameworkKey;
  onClick: () => void;
}) {
  const config = frameworkConfig[frameworkKey];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className="relative mt-6 flex items-center gap-2">
      {/* "Switch to:" label — absolute above button, left-aligned with button */}
      <span
        className="absolute text-xs"
        style={{
          bottom: '100%',
          left: '22px',
          marginBottom: '3px',
          color: 'var(--app-text-secondary-color)',
        }}
      >
        Switch to:
      </span>
      {/* Arrow icon to the left of the button */}
      <CornerDownRight
        size={14}
        style={{ color: 'var(--app-accent-secondary-color)' }}
      />
      {/* Framework button */}
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors hover:opacity-80"
        style={{
          borderColor: 'var(--app-accent-secondary-color)',
          color: 'var(--app-accent-secondary-color)',
        }}
      >
        <Icon size={14} />
        <span>{config.name}</span>
      </button>
    </div>
  );
}
