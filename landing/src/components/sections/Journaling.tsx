"use client";

import Image from "next/image";
import { PenLine, Sparkles, BookOpen } from "lucide-react";
import { Section } from "@/components/ui/Section";

const highlights = [
  {
    icon: PenLine,
    title: "Guided prompts",
    description: "Never stare at a blank page. The Room offers thoughtful prompts tailored to your mood and recent conversations.",
  },
  {
    icon: Sparkles,
    title: "AI-enriched entries",
    description: "After you write, the AI reflects your thoughts back as a visual card — giving each moment its own identity.",
  },
  {
    icon: BookOpen,
    title: "A living record",
    description: "Every card becomes part of your personal timeline, making it easy to revisit, search, and spot long-term patterns.",
  },
];

export function Journaling() {
  return (
    <Section id="journaling" className="!py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Image */}
        <div
          className="flex items-center justify-center"
        >
          <Image
            src="/assets/cards.webp"
            alt="The Room journal cards"
            width={480}
            height={360}
            className="w-full max-w-sm lg:max-w-md object-contain drop-shadow-2xl"
          />
        </div>

        {/* Text */}
        <div>

          <h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] mb-4 font-[family-name:var(--font-dancing-script)] leading-tight">
            Your Thoughts, Made Beautiful
          </h2>

          <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed mb-8">
            Journaling in The Room isn&apos;t just writing — it&apos;s crafting a visual story of your inner life. Each entry becomes a card with its own scene, title, and emotional context, turning everyday reflections into something you&apos;ll want to revisit.
          </p>

          <div className="flex flex-col gap-6">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[var(--app-accent-secondary-color)]/15"
                >
                  <item.icon className="w-4 h-4" style={{ color: "var(--app-accent-secondary-color)" }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--app-text-primary-color)] mb-0.5">{item.title}</p>
                  <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
}
