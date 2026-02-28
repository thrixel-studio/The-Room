import { Heart, Target, Zap, Lightbulb, type LucideIcon } from 'lucide-react';
import type { FrameworkKey } from '@/features/frameworks';

const frameworkConfig: Record<FrameworkKey, { name: string; Icon: LucideIcon }> = {
  mental_wellness: { name: 'Psychologist', Icon: Heart },
  decision_making: { name: 'Advisor', Icon: Target },
  productivity_boost: { name: 'Strategist', Icon: Zap },
  problem_solving: { name: 'Mediator', Icon: Lightbulb },
};

export function FrameworkSwitchDivider({ frameworkKey }: { frameworkKey: FrameworkKey }) {
  const config = frameworkConfig[frameworkKey];
  if (!config) return null;
  const { Icon, name } = config;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1 h-px opacity-20" style={{ background: 'var(--app-accent-secondary-color)' }} />
      <span
        className="flex items-center gap-1.5 text-xs select-none"
        style={{ color: 'var(--app-accent-secondary-color)' }}
      >
        Switched to <Icon size={11} /> {name}
      </span>
      <div className="flex-1 h-px opacity-20" style={{ background: 'var(--app-accent-secondary-color)' }} />
    </div>
  );
}
