"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";

const credentials = [
  "15 years of experience",
  "3 years of practice working on a suicide hotline",
  "Social psychology & clinical psychology",
];

export function PsychologistConsultation() {
  return (
    <Section id="psychologist-consultation" className="!py-0">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-2xl"
      >

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1px_300px]">
          {/* Left: Story */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] font-[family-name:var(--font-dancing-script)] leading-tight mb-6"
            >
              Psychologist Consultation
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
                The first thing we did was go straight to a professional psychologist who worked 3 years on an emergency hotline. We discussed how to work with people facing mental health challenges, methods for handling critical cases, stress relief techniques, and a framework for communicating with people prone to self-harm. Key questions were also drafted to accurately assess each individual&apos;s situation.
              </p>
              <p className="text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
                As a result of the consultation, we dropped several features that could potentially — and unintentionally — harm the user in a critical moment.
              </p>
            </motion.div>
          </div>

          {/* Vertical divider */}
          <div className="hidden lg:block self-stretch my-10 bg-gradient-to-b from-transparent via-[var(--app-border-primary-color)] to-transparent" />

          {/* Right: Psychologist card */}
          <div className="px-8 py-10 lg:px-10 flex flex-col items-center justify-center gap-6">
            {/* Photo with glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden border border-[var(--app-border-primary-color)]">
                <Image
                  src="/team/aldghgbljhvberoub.webp"
                  alt="Viktoria Taranenko"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Name & role */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <p className="text-base font-semibold text-[var(--app-text-primary-color)]">
                Viktoria Taranenko
              </p>
              <p className="text-xs text-[var(--app-text-secondary-color)] mt-0.5">
                Professional Psychologist
              </p>
            </motion.div>

            {/* Credentials */}
            <div className="flex flex-col gap-3 w-full">
              {credentials.map((cred, i) => (
                <motion.div
                  key={cred}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.08 }}
                >
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: "var(--app-accent-color)" }}
                  />
                  <span className="text-xs font-medium text-[var(--app-text-primary-color)] leading-snug">
                    {cred}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
