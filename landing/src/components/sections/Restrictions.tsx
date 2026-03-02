"use client";

import Image from "next/image";
import { ExternalLink, Phone } from "lucide-react";
import { Section } from "@/components/ui/Section";

const severityColors = [
  "#4ade80", // 1
  "#86efac", // 2
  "#fde68a", // 3
  "#fcd34d", // 4
  "#fbbf24", // 5
  "#fb923c", // 6
  "#f97316", // 7
  "#ef4444", // 8
  "#dc2626", // 9
  "#b91c1c", // 10
];

const emergency = [
  { region: "America", number: "911", tel: "tel:911" },
  { region: "Europe", number: "112", tel: "tel:112" },
  { region: "Russia", number: "112", tel: "tel:112" },
];

const resources = [
  { name: "Complicated Life", desc: "Mental health support platform", href: "https://complicated.life" },
  { name: "International Therapist Directory", desc: "Find professional therapists worldwide", href: "https://internationaltherapistdirectory.com" },
];


// Severity level → color
function levelColor(level: number) {
  return severityColors[level - 1] ?? "#b91c1c";
}

interface AiMessageProps {
  text: string;
  delay: number;
}

function AiMessage({ text }: AiMessageProps) {
  return (
    <div
      className="flex flex-col"
    >
      <div
        className="px-2.5 py-1.5"
        style={{ borderLeft: "2px solid var(--app-accent-color)" }}
      >
        <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}

interface UserMessageProps {
  text: string;
  level: number;
  delay: number;
}

function UserMessage({ text, level }: UserMessageProps) {
  const color = levelColor(level);
  return (
    <div
      className="flex justify-end items-center gap-2.5"
    >
      <div className="max-w-[80%]">
        <div className="py-1.5 px-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md shadow-sm" style={{ backgroundColor: `${color}22` }}>
          <p className="text-sm text-[var(--app-text-primary-color)] leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        </div>
      </div>
      {/* Severity badge */}
      <div
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
        style={{ backgroundColor: `${color}22`, border: `1.5px solid ${color}55`, color }}
      >
        {level}
      </div>
    </div>
  );
}

export function Restrictions() {
  return (
    <Section id="restrictions" className="!py-0">
      {/* Header */}
      <div
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] font-[family-name:var(--font-dancing-script)] leading-tight">
          ML-Ranking
        </h2>
        <p className="mt-3 text-sm text-[var(--app-text-secondary-color)] max-w-lg mx-auto leading-relaxed">
          When the bot recognizes it cannot safely help, it steps aside — and connects the person to real professionals.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-0 items-start max-w-5xl mx-auto">

        {/* Left: Severity scale */}
        <div
          className="flex-1 lg:max-w-[46%] flex flex-col gap-6 lg:pr-10 justify-center"
        >
          <div className="flex flex-col gap-6">

            {/* Logos */}
            <div className="flex items-center justify-center gap-5 w-full">
              <Image
                src="/assets/huggingface_logo-noborder.svg"
                alt="Hugging Face"
                width={72}
                height={72}
                className="shrink-0"
              />
              <span className="text-3xl font-light text-[var(--app-text-tertiary-color)]">+</span>
              <Image
                src="/assets/ChatGPT_logo.svg.png"
                alt="ChatGPT"
                width={72}
                height={72}
                className="shrink-0 rounded-xl"
              />
            </div>

            {/* First paragraph */}
            <div>
              <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
                We use <a href="https://huggingface.co/sentinet/suicidality" target="_blank" rel="noopener noreferrer" className="text-[var(--app-text-primary-color)] font-medium underline underline-offset-2">sentinet/suicidality</a> — an ELECTRA-based transformer fine-tuned on crisis-language datasets from Reddit, Twitter, and clinical suicide notes. It classifies every message in real time with 93.9% accuracy, 93.2% F1 score, and flags suicidal intent before a human ever has to.
              </p>
            </div>

            {/* Scale */}
            <div>
              <div className="flex justify-between text-[10px] text-[var(--app-text-tertiary-color)] px-0.5 mb-2">
                <span>Safe</span>
                <span>Moderate</span>
                <span>Critical</span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                {severityColors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: `${color}22`,
                        border: `1.5px solid ${color}55`,
                        color,
                        ...(i === 9 ? { backgroundColor: `${color}33`, border: `1.5px solid ${color}` } : {}),
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second paragraph */}
            <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
              Every message is scored 1–10. Low scores keep the bot in supportive mode. As the score rises, it shifts tone — asking more direct questions and checking in on safety. At level 10, it steps back entirely and hands off to emergency resources and real professionals.
            </p>

          </div>

        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block self-stretch w-px bg-gradient-to-b from-transparent via-[var(--app-border-primary-color)] to-transparent shrink-0" />

        {/* Right: Chat window */}
        <div
          className="flex-1 lg:max-w-[49%] overflow-hidden"
        >
          {/* Messages */}
          <div className="lg:pl-10 flex flex-col gap-5">

            {/* Exchange 1 — level 1 */}
            <UserMessage
              text="I've been feeling really low lately, like nothing matters anymore"
              level={1}
              delay={0.1}
            />
            <AiMessage
              text="I hear you. That kind of emptiness can feel really heavy. I'm here — would you like to tell me more about what's been going on?"
              delay={0.2}
            />

            {/* Exchange 2 — level 10 */}
            <UserMessage
              text="I'm standing at the window right now"
              level={10}
              delay={0.5}
            />
            <AiMessage
              text="Right now, your safety is what matters most. Please step away from the window and take one slow breath. Here are people who can help you immediately:"
              delay={0.6}
            />

            {/* Resource cards — inline */}
            <div
              className="grid grid-cols-2 gap-2"
            >
              {resources.map((r) => (
                <a
                  key={r.name}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 px-3 py-2.5 rounded-xl border border-[var(--app-border-primary-color)] hover:border-[var(--app-text-tertiary-color)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-[var(--app-text-primary-color)] leading-snug">{r.name}</p>
                    <ExternalLink className="w-3 h-3 shrink-0 text-[var(--app-text-tertiary-color)]" />
                  </div>
                  <p className="text-[10px] text-[var(--app-text-tertiary-color)]">{r.desc}</p>
                </a>
              ))}
            </div>

            {/* Emergency contacts */}
            <div
              className="flex items-center justify-center gap-10 px-1 py-1"
            >
              {emergency.map((e) => (
                <a
                  key={e.region}
                  href={e.tel}
                  className="flex items-center gap-1 text-[11px] text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors"
                >
                  <Phone className="w-3 h-3 shrink-0 text-[var(--app-text-tertiary-color)]" />
                  {e.region} <span className="font-semibold text-[var(--app-text-primary-color)]">{e.number}</span>
                </a>
              ))}
            </div>

          </div>
        </div>

      </div>
    </Section>
  );
}
