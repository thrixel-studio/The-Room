// Framework key values that match the backend
export type FrameworkKey = "mental_wellness" | "decision_making" | "productivity_boost" | "problem_solving";

export interface Framework {
  key: FrameworkKey;
  title: string;
  description: string;
  image: string;
}

export const frameworks: Framework[] = [
  {
    key: "mental_wellness",
    title: "Psychologist",
    description: "Boost wellbeing, energy, purpose",
    image: "/images/frameworks/wellness_gofo2n.webp",
  },
  {
    key: "decision_making",
    title: "Advisor",
    description: "Sharpen judgment, decide better",
    image: "/images/frameworks/decision-making_xkup16.webp",
  },
  {
    key: "productivity_boost",
    title: "Strategist",
    description: "Hit goals, stay effective, focused",
    image: "/images/frameworks/productivity_uvnfjg.webp",
  },
  {
    key: "problem_solving",
    title: "Mediator",
    description: "Innovate, overcome challenges",
    image: "/images/frameworks/problem-solving_afk445.webp",
  },
];

// Helper to validate framework key
export const isValidFrameworkKey = (key: string): key is FrameworkKey => {
  return frameworks.some(f => f.key === key);
};

// Helper to get framework by key
export const getFrameworkByKey = (key: FrameworkKey): Framework | undefined => {
  return frameworks.find(f => f.key === key);
};

// Default framework
export const DEFAULT_FRAMEWORK: FrameworkKey = "mental_wellness";
