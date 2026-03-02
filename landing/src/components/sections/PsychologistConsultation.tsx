"use client";

import Image from "next/image";
import { Heart, PhoneCall, Wind, Bot, ShieldCheck, SlidersHorizontal, ClipboardList, Trash2, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";

const credentials = [
  { value: "15 yrs", label: "experience" },
  { value: "3 yrs", label: "crisis hotline" },
  { value: "2", label: "specializations" },
];

const topics: { text: string; icon: LucideIcon }[] = [
  { text: "Working with people facing mental health challenges", icon: Heart },
  { text: "Handling critical cases and crisis communication", icon: PhoneCall },
  { text: "Stress relief technique recommendations", icon: Wind },
  { text: "Scope and limits of AI in mental health support", icon: Bot },
];

const outcomes: { text: string; icon: LucideIcon }[] = [
  { text: "Safe AI communication with vulnerable users", icon: ShieldCheck },
  { text: "Crisis tone calibration per severity level", icon: SlidersHorizontal },
  { text: "Emotional state assessment methodology", icon: ClipboardList },
  { text: "Features removed to protect high-risk users", icon: Trash2 },
];

export function PsychologistConsultation() {
  return (
    <Section id="psychologist-consultation" className="!py-0">

      {/* Section header */}
      <div
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] font-[family-name:var(--font-dancing-script)] leading-tight">
          Expert-Guided
        </h2>
        <p className="mt-3 text-sm text-[var(--app-text-secondary-color)] max-w-lg mx-auto leading-relaxed">
          Before writing any code, we consulted a licensed specialist to make sure The Room supports — and never harms.
        </p>
      </div>

      {/* Content row */}
      <div
        className="flex flex-col lg:flex-row"
      >

        {/* Left: topics covered */}
        <div className="flex-1 flex flex-col items-end gap-4 pr-0 lg:pr-14 pb-10 lg:pb-0 justify-center text-right">
          <p className="text-xs font-medium text-[var(--app-text-tertiary-color)] uppercase tracking-wider">
            Topics covered
          </p>
          <div className="flex flex-col gap-3">
            {topics.map(({ text, icon: Icon }) => (
              <div key={text} className="flex items-start gap-2.5 flex-row-reverse">
                <Icon
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "var(--app-accent-secondary-color)" }}
                />
                <span className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
                  {text}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Divider */}
        <div className="hidden lg:block self-stretch w-px bg-gradient-to-b from-transparent via-[var(--app-border-primary-color)] to-transparent shrink-0" />
        <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-[var(--app-border-primary-color)] to-transparent" />

        {/* Center: photo + identity + credentials */}
        <div className="flex flex-col items-center gap-5 px-14 py-10 lg:py-0 shrink-0 justify-center">
          <div className="relative">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--app-border-primary-color)]">
              <Image
                src="/team/aldghgbljhvberoub.webp"
                alt="Viktoria Taranenko"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-base font-semibold text-[var(--app-text-primary-color)]">
              Viktoria Taranenko
            </p>
            <p className="text-sm text-[var(--app-text-secondary-color)] mt-0.5">
              Professional Psychologist
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            {credentials.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--app-light-color-transparent)]"
              >
                <span
                  className="text-sm font-bold tabular-nums shrink-0"
                  style={{ color: "var(--app-accent-secondary-color)" }}
                >
                  {c.value}
                </span>
                <span className="text-sm text-[var(--app-text-secondary-color)]">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block self-stretch w-px bg-gradient-to-b from-transparent via-[var(--app-border-primary-color)] to-transparent shrink-0" />
        <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-[var(--app-border-primary-color)] to-transparent" />

        {/* Right: outcomes */}
        <div className="flex-1 flex flex-col gap-4 pl-0 lg:pl-14 pt-10 lg:pt-0 justify-center">
          <p className="text-xs font-medium text-[var(--app-text-tertiary-color)] uppercase tracking-wider">
            Consultation outcomes
          </p>
          <div className="flex flex-col gap-3">
            {outcomes.map(({ text, icon: Icon }) => (
              <div key={text} className="flex items-start gap-2.5">
                <Icon
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "var(--app-accent-secondary-color)" }}
                />
                <span className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
}
