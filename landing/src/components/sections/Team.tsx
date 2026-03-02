"use client";

import Image from "next/image";
import { Section } from "@/components/ui/Section";

const members = [
  {
    name: "Dmitriy Volynov",
    role: "ML Engineer",
    image: "/team/oyvr6cv2c5vvyqunkte5.webp",
  },
  {
    name: "Igor Sorokin",
    role: "Backend Developer",
    image: "/team/qfzssuxt1qsdovvrvye6.webp",
  },
  {
    name: "Amir Seitkali",
    role: "Web Developer",
    image: "/team/ebqidvxmk1f7dfbxukgc.webp",
  },
  {
    name: "Nikita Orekhov",
    role: "UX/UI Designer",
    image: "/team/wh9wf0se3oxhgfgdbqls.webp",
  },
];

export function Team() {
  return (
    <Section id="team" className="!py-0">
      <div
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] font-[family-name:var(--font-dancing-script)] leading-tight">
          The Team
        </h2>
        <p className="mt-3 text-sm text-[var(--app-text-secondary-color)] max-w-md mx-auto leading-relaxed">
          A team of professional developers and a certified psychologist, united by a shared belief in accessible mental wellness.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {members.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--app-border-primary-color)]">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--app-text-primary-color)]">
                {member.name}
              </p>
              <p className="text-xs text-[var(--app-text-secondary-color)] mt-0.5">
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
