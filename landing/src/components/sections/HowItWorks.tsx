"use client";

import { motion } from "framer-motion";
import { Sparkles, PenLine, LineChart, Target } from "lucide-react";
import { Section } from "@/components/ui/Section";

const steps = [
  {
    number: "01",
    icon: Sparkles,
    title: "Start a Conversation",
    description:
      "Open up to The Room about anything on your mind. Our AI listens without judgment and responds with empathy and understanding.",
    accent: "primary",
  },
  {
    number: "02",
    icon: PenLine,
    title: "Journal Your Thoughts",
    description:
      "Capture your daily experiences, emotions, and reflections. Writing helps process feelings and creates a record of your growth.",
    accent: "secondary",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Discover Patterns",
    description:
      "Our AI analyzes your conversations and journal entries to identify emotional patterns, triggers, and opportunities for growth.",
    accent: "primary",
  },
  {
    number: "04",
    icon: Target,
    title: "Grow & Thrive",
    description:
      "Receive personalized recommendations and guided exercises based on your unique patterns. Track your progress and celebrate wins.",
    accent: "secondary",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="!py-0">

      {/* Steps */}
      <div className="relative">
        {/* Connection Line - Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-[var(--app-accent-color)] via-[var(--app-accent-secondary-color)] to-[var(--app-accent-color)] -translate-y-1/2 opacity-30" />

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
              <div className="relative bg-[var(--app-bg-secondary-color)] rounded-2xl p-6 border border-[var(--app-border-primary-color)] h-full">
                {/* Step Number Circle */}
                <div
                  className="absolute -top-5 left-6 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
                  style={{
                    backgroundColor: step.accent === "primary"
                      ? "var(--app-accent-color)"
                      : "var(--app-accent-secondary-color)",
                  }}
                >
                  <span className="text-white text-sm font-medium">{step.number}</span>
                </div>

                <div className="pt-5">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: step.accent === "primary"
                        ? "var(--app-accent-color-transparent)"
                        : "var(--app-accent-secondary-color-transparent)",
                      opacity: 0.8,
                    }}
                  >
                    <step.icon
                      className="w-5 h-5"
                      style={{
                        color: step.accent === "primary"
                          ? "var(--app-accent-color)"
                          : "var(--app-accent-secondary-color)",
                      }}
                    />
                  </div>

                  <h3 className="text-base font-medium text-[var(--app-text-primary-color)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Dot connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                  <div className="w-5 h-5 rounded-full bg-[var(--app-bg-primary-color)] border border-[var(--app-border-primary-color)]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* See The Room in Action */}
      <motion.div
        className="mt-16 sm:mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center mb-10">
          <h3 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] mb-3 font-[family-name:var(--font-dancing-script)] leading-tight">
            See The Room in Action
          </h3>
          <p className="text-sm text-[var(--app-text-secondary-color)]">
            A glimpse into how The Room helps you understand your emotions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Journal Entry Preview */}
          <div className="bg-[var(--app-bg-secondary-color)] rounded-2xl border border-[var(--app-border-primary-color)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--app-border-primary-color)] flex items-center gap-3">
              <PenLine className="w-4 h-4 text-[var(--app-accent-secondary-color)]" />
              <span className="text-sm font-medium text-[var(--app-text-primary-color)]">
                Today&apos;s Journal
              </span>
              <span className="text-xs text-[var(--app-text-tertiary-color)] ml-auto">
                Just now
              </span>
            </div>
            <div className="p-6">
              <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed mb-4">
                &quot;Had a challenging day at work today. The project deadline
                moved up unexpectedly, and I felt the familiar knot of anxiety
                in my stomach. But this time, I tried the breathing technique
                The Room suggested...&quot;
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs bg-[var(--app-accent-secondary-color)]/15 text-[var(--app-accent-secondary-color)]">
                  Anxiety
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-[var(--app-accent-color)]/15 text-[var(--app-accent-color)]">
                  Work Stress
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-[var(--app-light-color-transparent)] text-[var(--app-text-secondary-color)]">
                  Coping Strategy
                </span>
              </div>
            </div>
          </div>

          {/* Insights Preview */}
          <div className="bg-[var(--app-bg-secondary-color)] rounded-2xl border border-[var(--app-border-primary-color)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--app-border-primary-color)] flex items-center gap-3">
              <LineChart className="w-4 h-4 text-[var(--app-accent-color)]" />
              <span className="text-sm font-medium text-[var(--app-text-primary-color)]">
                Weekly Insight
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "var(--app-accent-color-transparent)" }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: "var(--app-accent-color)" }} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--app-text-primary-color)] mb-1.5">
                    Pattern Discovered
                  </h4>
                  <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
                    I noticed your anxiety levels tend to spike on Sunday
                    evenings. This is often related to anticipation of the work
                    week. Would you like to explore some Sunday evening routines?
                  </p>
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "var(--app-accent-color-transparent)",
                  color: "var(--app-accent-color)",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Explore Recommendations
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
