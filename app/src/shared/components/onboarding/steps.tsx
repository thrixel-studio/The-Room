import React from "react";
import { ChatIllustration } from "./ChatIllustration";
import { FrameworkIllustration } from "./FrameworkIllustration";
import { ProgressIllustration } from "./ProgressIllustration";
import { Step5Illustration } from "./Step5Illustration";
import { Step6Illustration } from "./Step6Illustration";

export type OnboardingStepId = 'welcome' | 'chat' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6';

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
  description: string;
  illustration?: React.ReactNode;
  primaryLabel: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to The Room',
    description:
      'Clarity of thought is the world\'s most valuable skill. How to get it? Journal.\n\nLet\'s introduce you to the main features by guiding you through your first entry.',
    primaryLabel: 'Next',
  },
  {
    id: 'chat',
    title: 'Familiar Interface',
    description:
      'The Room feels like a messenger you already know. Type in the input at the bottom, press Enter, and your AI responds.\n\nNo commands, no prompts to craft. Just write what\'s on your mind — and the conversation takes care of itself.',
    primaryLabel: 'Get started',
    illustration: <ChatIllustration />,
  },
  {
    id: 'step2',
    title: 'Four Frameworks Available',
    description:
      'Each framework shapes how your AI thinks and responds. Psychologist supports emotional clarity. Strategist drives goal-focused action. Advisor helps with decisions. Mediator untangles complex problems.\n\nSwitch anytime from the badge in the bottom right corner.',
    primaryLabel: 'Continue',
    illustration: <FrameworkIllustration />,
  },
  {
    id: 'step3',
    title: 'Switch Suggestion',
    description:
      'As the conversation unfolds, your AI reads the context. When it senses a better framework would serve you — it suggests switching.\n\nOne tap to change the lens. The conversation continues, now sharper.',
    primaryLabel: 'Continue',
    illustration: <FrameworkIllustration inputAlreadyHidden showStrategistSwitch />,
  },
  {
    id: 'step4',
    title: 'Chat to Get an Insight',
    description:
      'As you journal, a progress ring tracks how much your AI has learned about your state of mind.\n\nWhen the session feels complete, hit Analyze — and your AI turns the whole conversation into a personal reflection card.',
    primaryLabel: 'Analyze',
    illustration: <ProgressIllustration />,
  },
  {
    id: 'step5',
    title: 'Watch Your Insights Grow',
    description:
      'Every insight becomes a moment of clarity. Over time, patterns emerge.\n\nYour Insights dashboard collects these reflections, revealing trends in your thoughts and feelings. See how you\'re changing, growing, and understanding yourself better.',
    primaryLabel: 'Continue',
    illustration: <Step5Illustration />,
  },
  {
    id: 'step6',
    title: 'Your Personal Growth Hub',
    description:
      'Journal your thoughts without judgment. Build your emotional map to understand your patterns. Get personalized suggestions tailored to your mind.\n\nEvery entry strengthens your clarity. Every insight brings you closer to who you want to be.',
    primaryLabel: 'Finish',
    illustration: <Step6Illustration />,
  },
];
