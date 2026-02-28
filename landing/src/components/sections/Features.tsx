"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  BookOpen,
  BarChart3,
  Sparkles,
  Shield,
  Clock,
  Brain,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Conversations",
    description:
      "Engage in meaningful conversations with an AI that truly listens. Our conversational AI provides thoughtful responses and gentle guidance whenever you need it.",
    colorClass: "primary",
  },
  {
    icon: BookOpen,
    title: "Reflective Journaling",
    description:
      "Document your thoughts, feelings, and experiences in a private space. Our AI analyzes your entries to uncover patterns and provide personalized insights.",
    colorClass: "secondary",
  },
  {
    icon: BarChart3,
    title: "Emotional Insights Dashboard",
    description:
      "Track your emotional patterns over time with beautiful visualizations. Understand your triggers, celebrate progress, and identify areas for growth.",
    colorClass: "primary",
  },
  {
    icon: Brain,
    title: "Personalized Frameworks",
    description:
      "Access evidence-based mental wellness frameworks tailored to your needs. From CBT techniques to mindfulness practices, find what works for you.",
    colorClass: "secondary",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your mental health journey is deeply personal. We use end-to-end encryption and never share your data. Your thoughts stay yours alone.",
    colorClass: "primary",
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description:
      "Whether it's 3 AM anxiety or a midday moment of stress, The Room is always here for you. No appointments needed, no waiting rooms.",
    colorClass: "secondary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const getIconContainerClass = (colorClass: string) => {
  if (colorClass === "primary") {
    return "bg-violet-600/10";
  }
  return "bg-amber-500/10";
};

const getIconClass = (colorClass: string) => {
  if (colorClass === "primary") {
    return "text-violet-400";
  }
  return "text-amber-400";
};

export function Features() {
  return (
    <Section id="features" background="secondary">
      <SectionHeader
        badge="Features"
        title="Everything You Need for Mental Wellness"
        subtitle="The Room combines the latest in AI technology with evidence-based mental health practices to support your journey."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card variant="bordered" hover className="h-full">
              <div
                className={`w-14 h-14 rounded-2xl ${getIconContainerClass(feature.colorClass)} flex items-center justify-center mb-5`}
              >
                <feature.icon className={`w-7 h-7 ${getIconClass(feature.colorClass)}`} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--app-text-primary-color)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[var(--app-text-secondary-color)] leading-relaxed">
                {feature.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom highlight section */}
      <motion.div
        className="mt-16 sm:mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card
          variant="gradient"
          className="relative overflow-hidden"
          padding="lg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-medium text-violet-400">
                  Powered by Advanced AI
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--app-text-primary-color)] mb-4">
                Different by Design
              </h3>
              <p className="text-[var(--app-text-secondary-color)] max-w-xl">
                The Room isn&apos;t just another chatbot. Our AI is specifically
                trained on mental wellness principles, guided by specialists,
                and designed to grow with you over time.
              </p>
            </div>

            <div className="flex gap-6 sm:gap-10">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-violet-400 mb-1">
                  50+
                </div>
                <div className="text-sm text-[var(--app-text-secondary-color)]">
                  Wellness
                  <br />
                  Frameworks
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1">
                  24/7
                </div>
                <div className="text-sm text-[var(--app-text-secondary-color)]">
                  Always
                  <br />
                  Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-violet-400 mb-1">
                  100%
                </div>
                <div className="text-sm text-[var(--app-text-secondary-color)]">
                  Private &<br />
                  Secure
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Section>
  );
}
