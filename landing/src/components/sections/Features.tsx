"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";

const stats = [
  { value: "4", label: "Wellness Frameworks", accent: "primary", sub: "Each with a unique approach" },
  { value: "30d", label: "Insights Window", accent: "secondary", sub: "Emotional pattern analysis" },
  { value: "24/7", label: "Always Available", accent: "primary", sub: "No appointments needed" },
  { value: "100%", label: "Private & Secure", accent: "secondary", sub: "End-to-end encrypted" },
  { value: "Auto", label: "Emotion Insights", accent: "primary", sub: "From your journal entries" },
  { value: "0", label: "Data Shared", accent: "secondary", sub: "Your thoughts stay yours" },
];

export function Features() {
  return (
    <Section id="features" className="!py-0">
      <motion.div
        className="flex flex-col gap-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl">

          <div className="flex flex-col lg:flex-row">

            {/* Left panel */}
            <div className="flex-1 px-8 sm:px-10 lg:px-12 relative overflow-hidden">

              <div className="relative z-10 flex flex-col sm:flex-row h-full gap-8 sm:gap-10">

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] mb-6 font-[family-name:var(--font-dancing-script)] leading-tight">
                    A Quick Overview
                  </h3>

                  <p className="text-[var(--app-text-secondary-color)] text-sm sm:text-base leading-relaxed">
                    Journal your thoughts, talk through them with an AI companion, and watch your emotional patterns emerge over time. Pick a framework that fits your goal — whether that&apos;s clarity, decisions, productivity, or problem-solving — and let The Room adapt to you.
                  </p>
                </div>

                {/* Vertical divider */}
                <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-[var(--app-border-primary-color)] to-transparent shrink-0" />

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-4 shrink-0 content-center">
                  {stats.map((s) => (
                    <div key={s.label} className="flex flex-col gap-0.5">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--app-accent-color)" }}
                      >
                        {s.value}
                      </div>
                      <div className="text-base font-medium text-[var(--app-text-primary-color)]">
                        {s.label}
                      </div>
                      <div className="text-sm text-[var(--app-text-tertiary-color)]">
                        {s.sub}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </Section>
  );
}
