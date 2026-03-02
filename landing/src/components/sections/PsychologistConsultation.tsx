"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";

const stats = [
  { value: "15", label: "years of experience" },
  { value: "3", label: "years on crisis hotline" },
  { value: "2", label: "psychology specializations" },
];

export function PsychologistConsultation() {
  return (
    <Section id="psychologist-consultation" className="!py-0">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] font-[family-name:var(--font-dancing-script)] leading-tight">
          Psychologist Consultation
        </h2>
        <p className="mt-3 text-sm text-[var(--app-text-secondary-color)] max-w-lg mx-auto leading-relaxed">
          Before a single line of code was written, we sat down with a professional.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        {/* Main row: photo + text */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left: photo + identity */}
          <motion.div
            className="flex flex-col items-center lg:items-start gap-4 shrink-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-52 h-64 rounded-3xl overflow-hidden">
              <Image
                src="/team/aldghgbljhvberoub.webp"
                alt="Viktoria Taranenko"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center lg:text-left">
              <p className="text-sm font-semibold text-[var(--app-text-primary-color)]">
                Viktoria Taranenko
              </p>
              <p className="text-xs text-[var(--app-text-secondary-color)] mt-0.5">
                Professional Psychologist
              </p>
            </div>
          </motion.div>

          {/* Right: story */}
          <motion.div
            className="flex-1 flex flex-col justify-center gap-5 pt-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
              The first thing we did was go straight to a professional psychologist who worked 3 years on an emergency hotline. We discussed how to work with people facing mental health challenges, methods for handling critical cases, stress relief techniques, and a framework for communicating with people prone to self-harm. Key questions were also drafted to accurately assess each individual&apos;s situation.
            </p>
            <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
              As a result of the consultation, we dropped several features that could potentially — and unintentionally — harm the user in a critical moment.
            </p>
          </motion.div>

        </div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--app-border-primary-color)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="px-8 py-5 first:pl-0 last:pr-0 flex flex-col gap-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            >
              <p className="text-3xl font-semibold text-[var(--app-text-primary-color)]">
                {stat.value}
              </p>
              <p className="text-xs text-[var(--app-text-secondary-color)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </Section>
  );
}
