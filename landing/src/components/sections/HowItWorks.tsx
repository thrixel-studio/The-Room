"use client";

import { motion } from "framer-motion";
import { Sparkles, PenLine, LineChart, Target } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const steps = [
  {
    number: "01",
    icon: Sparkles,
    title: "Start a Conversation",
    description:
      "Open up to The Room about anything on your mind. Our AI listens without judgment and responds with empathy and understanding.",
    colorClass: "primary",
  },
  {
    number: "02",
    icon: PenLine,
    title: "Journal Your Thoughts",
    description:
      "Capture your daily experiences, emotions, and reflections. Writing helps process feelings and creates a record of your growth.",
    colorClass: "secondary",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Discover Patterns",
    description:
      "Our AI analyzes your conversations and journal entries to identify emotional patterns, triggers, and opportunities for growth.",
    colorClass: "primary",
  },
  {
    number: "04",
    icon: Target,
    title: "Grow & Thrive",
    description:
      "Receive personalized recommendations and guided exercises based on your unique patterns. Track your progress and celebrate wins.",
    colorClass: "secondary",
  },
];

const getStepCircleClass = (colorClass: string) => {
  if (colorClass === "primary") {
    return "bg-violet-600";
  }
  return "bg-amber-500";
};

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

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        badge="How It Works"
        title="Your Path to Better Mental Wellness"
        subtitle="Four simple steps to start your journey with The Room. No complicated setup, just meaningful support."
      />

      <div className="relative">
        {/* Connection Line - Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 via-amber-500 to-violet-600 -translate-y-1/2" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Step Card */}
              <div className="relative bg-[var(--app-bg-secondary-color)] rounded-2xl p-6 border border-[var(--app-border-primary-color)] h-full">
                {/* Step Number Circle */}
                <div
                  className={`absolute -top-6 left-6 w-12 h-12 rounded-full ${getStepCircleClass(step.colorClass)} flex items-center justify-center shadow-lg z-10`}
                >
                  <span className="text-white font-bold">{step.number}</span>
                </div>

                <div className="pt-6">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${getIconContainerClass(step.colorClass)} flex items-center justify-center mb-4`}
                  >
                    <step.icon className={`w-7 h-7 ${getIconClass(step.colorClass)}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[var(--app-text-primary-color)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[var(--app-text-secondary-color)] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                  <div className="w-6 h-6 rounded-full bg-[var(--app-bg-primary-color)] border-2 border-[var(--app-border-primary-color)]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo/Preview Section */}
      <motion.div
        className="mt-16 sm:mt-20 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-[var(--app-text-primary-color)] mb-4">
            See The Room in Action
          </h3>
          <p className="text-[var(--app-text-secondary-color)]">
            A glimpse into how The Room helps you understand your emotions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Journal Entry Preview */}
          <div className="bg-[var(--app-bg-secondary-color)] rounded-2xl border border-[var(--app-border-primary-color)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--app-border-primary-color)] flex items-center gap-3">
              <PenLine className="w-5 h-5 text-violet-400" />
              <span className="font-medium text-[var(--app-text-primary-color)]">
                Today&apos;s Journal
              </span>
              <span className="text-sm text-[var(--app-text-tertiary-color)] ml-auto">
                Just now
              </span>
            </div>
            <div className="p-6">
              <p className="text-[var(--app-text-secondary-color)] leading-relaxed mb-4">
                &quot;Had a challenging day at work today. The project deadline
                moved up unexpectedly, and I felt the familiar knot of anxiety
                in my stomach. But this time, I tried the breathing technique
                The Room suggested...&quot;
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">
                  Anxiety
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                  Work Stress
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                  Coping Strategy
                </span>
              </div>
            </div>
          </div>

          {/* Insights Preview */}
          <div className="bg-[var(--app-bg-secondary-color)] rounded-2xl border border-[var(--app-border-primary-color)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--app-border-primary-color)] flex items-center gap-3">
              <LineChart className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-[var(--app-text-primary-color)]">
                Weekly Insight
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--app-text-primary-color)] mb-2">
                    Pattern Discovered
                  </h4>
                  <p className="text-[var(--app-text-secondary-color)] text-sm leading-relaxed">
                    I noticed your anxiety levels tend to spike on Sunday
                    evenings. This is often related to anticipation of the work
                    week. Would you like to explore some Sunday evening
                    routines?
                  </p>
                </div>
              </div>
              <button className="w-full py-3 rounded-xl bg-violet-600/10 text-violet-400 font-medium hover:bg-violet-600/20 transition-colors">
                Explore Recommendations
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
