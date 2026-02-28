"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Brain,
  Shield,
  Users,
  Sparkles,
  Target,
  ArrowRight,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const values = [
  {
    icon: Heart,
    title: "Empathy First",
    description:
      "Every feature we build starts with understanding the human experience. We design for real emotions, real struggles, and real growth.",
  },
  {
    icon: Shield,
    title: "Privacy Always",
    description:
      "Your mental health journey is deeply personal. We've built our entire platform around protecting your privacy and earning your trust.",
  },
  {
    icon: Brain,
    title: "Science-Backed",
    description:
      "Our approaches are grounded in evidence-based therapeutic methods, developed in collaboration with licensed mental health professionals.",
  },
  {
    icon: Users,
    title: "Inclusive Design",
    description:
      "Mental wellness looks different for everyone. We build tools that adapt to your unique needs, background, and goals.",
  },
];

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Science Officer",
    credential: "PhD Psychology, Stanford",
    avatar: "SC",
  },
  {
    name: "Marcus Williams",
    role: "Co-Founder & CEO",
    credential: "Former Google Health",
    avatar: "MW",
  },
  {
    name: "Elena Rodriguez",
    role: "Head of AI",
    credential: "ML Lead, DeepMind",
    avatar: "ER",
  },
  {
    name: "Dr. James Park",
    role: "Clinical Director",
    credential: "Licensed Psychologist",
    avatar: "JP",
  },
];

const advisors = [
  { name: "Dr. Amanda Foster", credential: "Psychiatry, Johns Hopkins" },
  { name: "Dr. Michael Chang", credential: "Behavioral Psychology Expert" },
  { name: "Lisa Thompson", credential: "Mental Health Advocate" },
  { name: "Dr. Rachel Green", credential: "AI Ethics Researcher" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial opacity-20" />

        <Container>
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block mb-4 px-4 py-2 rounded-full text-sm font-medium bg-violet-600/15 text-violet-400">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--app-text-primary-color)] mb-6">
              Building a World Where
              <br />
              <span className="text-gradient">Everyone Can Thrive</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--app-text-secondary-color)] max-w-2xl mx-auto">
              We believe everyone deserves access to mental wellness support.
              The Room combines cutting-edge AI with human compassion to make
              that vision a reality.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Mission Section */}
      <Section background="secondary">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-violet-400">
              <Target className="w-4 h-4" />
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--app-text-primary-color)] mb-6">
              A Judgment-Free Space That Grows With You
            </h2>
            <p className="text-[var(--app-text-secondary-color)] mb-6 leading-relaxed">
              Mental health support shouldn't be limited by time, location, or
              stigma. We created The Room to be the supportive companion
              everyone deserves - available 24/7, completely private, and
              endlessly patient.
            </p>
            <p className="text-[var(--app-text-secondary-color)] leading-relaxed">
              Our AI isn't here to replace human connection or professional
              help. Instead, it's designed to complement your wellness journey -
              helping you reflect, understand yourself better, and build healthy
              habits one conversation at a time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card variant="gradient" padding="lg">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--app-text-primary-color)] mb-1">
                      AI Designed for Mental Health
                    </h3>
                    <p className="text-sm text-[var(--app-text-secondary-color)]">
                      Not a general-purpose chatbot - specifically trained for
                      emotional support and wellness conversations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--app-text-primary-color)] mb-1">
                      Guided by Specialists
                    </h3>
                    <p className="text-sm text-[var(--app-text-secondary-color)]">
                      Developed and continuously refined with input from
                      licensed therapists and psychologists.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--app-text-primary-color)] mb-1">
                      Unique for You
                    </h3>
                    <p className="text-sm text-[var(--app-text-secondary-color)]">
                      Learns from your conversations to provide increasingly
                      personalized support and insights.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            <div className="absolute -inset-4 bg-violet-600/5 rounded-3xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </Section>

      {/* Values Section */}
      <Section>
        <SectionHeader
          badge="Our Values"
          title="What We Stand For"
          subtitle="These principles guide every decision we make, from product features to how we treat your data."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="bordered" hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-7 h-7 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--app-text-primary-color)] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-[var(--app-text-secondary-color)] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team Section */}
      <Section background="secondary">
        <SectionHeader
          badge="Our People"
          title="The Team Behind The Room"
          subtitle="A diverse group of technologists, mental health experts, and designers united by a shared mission."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="bordered" className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-[var(--app-text-primary-color)]">
                  {member.name}
                </h3>
                <p className="text-violet-400 text-sm mb-1">{member.role}</p>
                <p className="text-[var(--app-text-tertiary-color)] text-xs">
                  {member.credential}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Advisors */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-[var(--app-text-primary-color)] text-center mb-8">
            Our Experts & Advisors
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {advisors.map((advisor) => (
              <div
                key={advisor.name}
                className="px-4 py-3 rounded-xl bg-[var(--app-bg-primary-color)] border border-[var(--app-border-primary-color)]"
              >
                <span className="text-[var(--app-text-primary-color)] font-medium">
                  {advisor.name}
                </span>
                <span className="text-[var(--app-text-tertiary-color)] text-sm ml-2">
                  {advisor.credential}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Careers CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-[var(--app-text-secondary-color)] mb-4">
            Interested in joining our mission?
          </p>
          <Button
            variant="outline"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            See Open Positions
          </Button>
        </motion.div>
      </Section>
    </>
  );
}
