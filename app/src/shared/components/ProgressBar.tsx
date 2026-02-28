import { Sparkles } from "lucide-react";

interface ProgressBarProps {
  progress?: number;
  unfilledColor?: string;
}

export default function ProgressBar({ progress = 65, unfilledColor = "var(--app-text-secondary-color)" }: ProgressBarProps) {
  const isFull = progress >= 100;

  // Circle parameters for SVG
  const size = 46;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed top-3 right-3 z-50 animate-modal-fade-in">
      <div className="relative w-12 h-12">
        {/* Background circle */}
        <svg
          className="absolute top-0 left-0 transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={unfilledColor}
            strokeWidth={strokeWidth}
            opacity={unfilledColor === "var(--app-bg-tertiary-color)" ? "1" : "0.3"}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--app-accent-secondary-color)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        {/* Icon in the center */}
        <div className="absolute -top-0.5 -left-0.5 inset-0 flex items-center justify-center">
          <Sparkles
            size={20}
            className={isFull ? "text-[var(--app-accent-secondary-color)]" : "text-[var(--app-text-secondary-color)]"}
            style={{ transition: 'color 0.3s ease' }}
          />
        </div>
      </div>
    </div>
  );
}
