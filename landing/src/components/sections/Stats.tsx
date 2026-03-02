"use client";

import { Users, MessageCircle, Star, TrendingUp } from "lucide-react";
import { Section } from "@/components/ui/Section";

const stats = [
  {
    icon: Star,
    value: "4.9",
    label: "App Store Rating",
    suffix: "/5",
    colorClass: "primary",
  },
  {
    icon: MessageCircle,
    value: "15.7M",
    label: "Messages Exchanged",
    suffix: "+",
    colorClass: "secondary",
  },
  {
    icon: Users,
    value: "250K",
    label: "People Helped",
    suffix: "+",
    colorClass: "primary",
  },
  {
    icon: TrendingUp,
    value: "89",
    label: "Report Better Wellbeing",
    suffix: "%",
    colorClass: "secondary",
  },
];

const getIconContainerClass = (colorClass: string) => {
  if (colorClass === "primary") {
    return "bg-violet-600/10";
  }
  return "bg-amber-500/10";
};

const getIconClass = (colorClass: string) => {
  if (colorClass === "primary") {
    return "text-violet-400";
  }
  return "text-amber-400";
};

const getValueClass = (colorClass: string) => {
  if (colorClass === "primary") {
    return "text-violet-400";
  }
  return "text-amber-400";
};

export function Stats() {
  return (
    <Section padding="md">
      <div className="relative rounded-3xl bg-gradient-to-r from-[var(--app-bg-secondary-color)] via-[var(--app-bg-tertiary-color)] to-[var(--app-bg-secondary-color)] p-8 sm:p-12 border border-[var(--app-border-primary-color)] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--app-text-primary-color)] mb-2">
              Trusted by Thousands
            </h2>
            <p className="text-[var(--app-text-secondary-color)]">
              Join a growing community prioritizing mental wellness
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${getIconContainerClass(stat.colorClass)} flex items-center justify-center mx-auto mb-4`}
                >
                  <stat.icon className={`w-7 h-7 ${getIconClass(stat.colorClass)}`} />
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl sm:text-5xl font-bold ${getValueClass(stat.colorClass)}`}>
                    {stat.value}
                  </span>
                  <span className="text-xl text-[var(--app-text-secondary-color)]">
                    {stat.suffix}
                  </span>
                </div>
                <p className="text-[var(--app-text-secondary-color)] text-sm mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Review ticker */}
          <div
            className="mt-10 pt-8 border-t border-[var(--app-border-primary-color)]"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[var(--app-text-primary-color)] font-medium">
                  1,000+ Reviews
                </span>
              </div>
              <span className="text-[var(--app-text-tertiary-color)]">|</span>
              <span className="text-[var(--app-text-secondary-color)] text-sm">
                &quot;Best mental wellness app I&apos;ve ever used&quot; - Recent Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
