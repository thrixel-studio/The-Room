"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  BarChart3,
  Brain,
  Shield,
  Clock,
} from "lucide-react";
import { Section } from "@/components/ui/Section";

const features = [
  { icon: MessageSquare, label: "AI Conversations", accent: "primary" },
  { icon: BookOpen, label: "Private Journaling", accent: "secondary" },
  { icon: BarChart3, label: "Emotional Insights", accent: "primary" },
  { icon: Brain, label: "Wellness Frameworks", accent: "secondary" },
  { icon: Shield, label: "End-to-End Encrypted", accent: "primary" },
  { icon: Clock, label: "Available 24/7", accent: "secondary" },
];

const stats = [
  { value: "4", label: "Wellness Frameworks", accent: "primary", sub: "CBT · DBT · ACT · Mindfulness" },
  { value: "6", label: "Core Features", accent: "secondary", sub: "All in one place" },
  { value: "24/7", label: "Always Available", accent: "primary", sub: "No appointments needed" },
  { value: "100%", label: "Private & Secure", accent: "secondary", sub: "End-to-end encrypted" },
  { value: "<1s", label: "AI Response Time", accent: "primary", sub: "Instant, never waiting" },
  { value: "0", label: "Data Shared", accent: "secondary", sub: "Your thoughts stay yours" },
];

export function Features() {
  return (
    <Section id="features">
      <motion.div
        className="flex flex-col gap-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--app-border-primary-color)]">

          {/* Gradient top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[var(--app-accent-color)] via-[var(--app-accent-secondary-color)] to-[var(--app-accent-color)] z-10" />

          <div className="flex flex-col lg:flex-row">

            {/* Left panel */}
            <div className="flex-1 bg-[var(--app-bg-secondary-color)] p-8 sm:p-10 lg:p-12 relative overflow-hidden">
              {/* Decorative ring */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-[var(--app-accent-color)]/10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-[var(--app-accent-color)]/8 pointer-events-none" />
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--app-accent-color)]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row h-full gap-8 sm:gap-10">

                {/* Text */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full border border-[var(--app-accent-color)]/25 bg-[var(--app-accent-color)]/8">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--app-accent-color)]" />
                    <span className="text-xs font-medium tracking-wide text-[var(--app-accent-color)]">
                      Powered by Advanced AI
                    </span>
                  </div>

                  <h3 className="text-4xl sm:text-5xl font-medium text-[var(--app-text-primary-color)] mb-6 font-[family-name:var(--font-dancing-script)] leading-tight">
                    Everything You Need,<br />Nothing You Don&apos;t
                  </h3>

                  <p className="text-[var(--app-text-secondary-color)] text-sm sm:text-base leading-relaxed">
                    The Room isn&apos;t a generic wellness app. Every feature is built around how your mind actually works — adapting to your patterns, your language, and your pace. Fully private, always available, never judgmental.
                  </p>
                </div>

                {/* Vertical divider */}
                <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-[var(--app-border-primary-color)] to-transparent shrink-0" />

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 shrink-0 content-center">
                  {stats.map((s) => (
                    <div key={s.label} className="flex flex-col gap-0.5">
                      <div
                        className="text-2xl font-bold"
                        style={{
                          color: s.accent === "primary"
                            ? "var(--app-accent-color)"
                            : "var(--app-accent-secondary-color)",
                        }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs font-medium text-[var(--app-text-primary-color)]">
                        {s.label}
                      </div>
                      <div className="text-[10px] text-[var(--app-text-tertiary-color)]">
                        {s.sub}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Right panel — feature list */}
            <div className="lg:w-60 xl:w-68 bg-[var(--app-bg-tertiary-color)] border-t lg:border-t-0 lg:border-l border-[var(--app-border-primary-color)] flex flex-col shrink-0">
              {/* Panel header */}
              <div className="px-6 py-4 border-b border-[var(--app-border-primary-color)]">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--app-text-tertiary-color)]">
                  What&apos;s Inside
                </span>
              </div>

              {/* Feature rows */}
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 px-6 py-4 border-b border-[var(--app-border-primary-color)] last:border-0 group hover:bg-[var(--app-bg-secondary-color)] transition-colors duration-150"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: f.accent === "primary"
                        ? "rgba(83,85,200,0.1)"
                        : "rgba(199,152,112,0.1)",
                    }}
                  >
                    <f.icon
                      className="w-3.5 h-3.5"
                      style={{
                        color: f.accent === "primary"
                          ? "var(--app-accent-color)"
                          : "var(--app-accent-secondary-color)",
                      }}
                    />
                  </div>
                  <span className="text-sm text-[var(--app-text-secondary-color)] group-hover:text-[var(--app-text-primary-color)] transition-colors duration-150">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>


      </motion.div>
    </Section>
  );
}
