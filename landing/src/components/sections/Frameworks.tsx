"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Target, Zap, Lightbulb, CircleCheck, Circle } from "lucide-react";
import { Section } from "@/components/ui/Section";

const cards = [
  {
    key: "psychologist",
    icon: Heart,
    title: "Psychologist",
    tagline: "Boost wellbeing, energy, purpose",
    image: "/assets/psychologist.webp",
  },
  {
    key: "advisor",
    icon: Target,
    title: "Advisor",
    tagline: "Sharpen judgment, decide better",
    image: "/assets/advisor.webp",
  },
  {
    key: "strategist",
    icon: Zap,
    title: "Strategist",
    tagline: "Hit goals, stay effective, focused",
    image: "/assets/strategist.webp",
  },
  {
    key: "mediator",
    icon: Lightbulb,
    title: "Mediator",
    tagline: "Innovate, overcome challenges",
    image: "/assets/mediator.webp",
  },
];

const frameworks = [
  {
    icon: Heart,
    title: "Psychologist",
    description: "Helps you understand your emotions, process experiences, and build lasting mental resilience.",
  },
  {
    icon: Target,
    title: "Advisor",
    description: "Like a trusted mentor. Helps you think through decisions clearly, weigh options without bias, and act with confidence.",
  },
  {
    icon: Zap,
    title: "Strategist",
    description: "Cuts through distraction. Helps you prioritize what matters, build momentum, and stay on track even when motivation fades.",
  },
  {
    icon: Lightbulb,
    title: "Mediator",
    description: "Reframes obstacles as opportunities. Helps you break through mental blocks and find creative paths forward.",
  },
];

export function Frameworks() {
  const [selected, setSelected] = useState("psychologist");

  return (
    <Section id="frameworks" className="!py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center max-w-4xl mx-auto w-full">

        {/* Text */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] mb-4 font-[family-name:var(--font-dancing-script)] leading-tight">
            Choose Your Framework
          </h2>

          <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed mb-8">
            The Room adapts to what you need most right now. Pick a framework that matches your goal — each one shapes how the AI listens, responds, and guides you. Switch any time as your needs evolve.
          </p>

          <div className="flex flex-col gap-6">
            {frameworks.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[var(--app-accent-secondary-color)]/15">
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

        {/* Cards Grid */}
        <div
          className="grid grid-cols-2 gap-3 max-w-sm mx-auto mt-10 lg:mt-0 lg:ml-auto lg:mr-0"
        >
          {cards.map((card) => {
            const isSelected = selected === card.key;
            return (
              <div
                key={card.key}
                onClick={() => setSelected(card.key)}
                className="rounded-2xl flex flex-col cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: "var(--app-bg-tertiary-color)",
                  border: `1.5px solid ${isSelected ? "var(--app-accent-secondary-color)" : "var(--app-bg-primary-color)"}`,
                  boxShadow: isSelected ? "inset 0 2px 4px 0 rgb(0 0 0 / 0.4)" : "inset 0 2px 4px 0 rgb(0 0 0 / 0.2)",
                }}
              >
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    {isSelected
                      ? <CircleCheck className="w-4 h-4" style={{ color: "var(--app-accent-secondary-color)" }} />
                      : <Circle className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                    }
                  </div>
                  <div className="w-full overflow-hidden p-2.5">
                    <Image src={card.image} alt={card.title} width={400} height={240} className="w-full h-auto rounded-xl" />
                  </div>
                </div>
                <div className="px-2.5 pb-2.5">
                  <h3
                    className="text-xs font-semibold flex items-center gap-1.5 mb-0.5"
                    style={{ color: isSelected ? "var(--app-accent-secondary-color)" : "rgba(255,255,255,0.9)" }}
                  >
                    <card.icon className="w-3.5 h-3.5" style={{ color: isSelected ? "var(--app-accent-secondary-color)" : "rgba(255,255,255,0.4)" }} />
                    {card.title}
                  </h3>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{card.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Section>
  );
}
