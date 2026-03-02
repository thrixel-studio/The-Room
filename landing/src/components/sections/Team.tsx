"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";

const members = [
  {
    name: "Dmitriy Volynov",
    role: "ML Engineer",
    image: "/team/oyvr6cv2c5vvyqunkte5.webp",
  },
  {
    name: "Artyom Ostrikov",
    role: "Backend Developer",
    image: "/team/qfzssuxt1qsdovvrvye6.webp",
  },
  {
    name: "Viktoria Taranenko",
    role: "Professional Psychologist",
    image: "/team/aldghgbljhvberoub.webp",
  },
  {
    name: "Rasul Kusainov",
    role: "Web Developer",
    image: "/team/ebqidvxmk1f7dfbxukgc.webp",
  },
];

export function Team() {
  return (
    <Section id="team" className="!py-0">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] font-[family-name:var(--font-dancing-script)] leading-tight">
          The Team
        </h2>
        <p className="mt-3 text-sm text-[var(--app-text-secondary-color)] max-w-md mx-auto leading-relaxed">
          A team of professional developers and a certified psychologist, united by a shared belief in accessible mental wellness.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-8">
        {members.map((member, i) => (
          <motion.div
            key={member.name}
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
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
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
