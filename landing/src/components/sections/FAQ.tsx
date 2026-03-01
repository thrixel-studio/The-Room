"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";

const faqs = [
  {
    question: "What can The Room do?",
    answer:
      "The Room is your personal mental wellness companion that offers AI-powered conversations, reflective journaling, emotional pattern recognition, and personalized insights. You can chat about anything on your mind, journal your thoughts, track your emotional patterns over time, and receive evidence-based recommendations for improving your mental wellbeing.",
  },
  {
    question: "Is The Room a replacement for professional therapy?",
    answer:
      "No, The Room is not a replacement for professional mental health care. It's designed to be a complementary tool that supports your mental wellness journey between therapy sessions or as a starting point for self-reflection. If you're experiencing serious mental health issues, we always recommend consulting with a licensed mental health professional.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. Your privacy is our top priority. All your conversations and journal entries are encrypted end-to-end. We never share, sell, or use your personal data for advertising. You have full control over your data and can delete it at any time. Our security practices comply with industry standards for health data protection.",
  },
  {
    question: "Who created The Room?",
    answer:
      "The Room was created by a team of mental health professionals, AI researchers, and wellness experts. Our AI is trained on evidence-based therapeutic approaches and is continuously refined with guidance from licensed therapists and psychologists to ensure helpful, appropriate responses.",
  },
  {
    question: "Is The Room appropriate for all ages?",
    answer:
      "The Room is designed for adults 18 and older. The app contains features and discussions about mental health topics that are best suited for mature users. If you're a parent interested in mental wellness tools for your teen, please contact us for recommendations.",
  },
  {
    question: "What if I'm experiencing a mental health crisis?",
    answer:
      "The Room is not designed for crisis intervention. If you are experiencing a mental health emergency, please contact your local emergency services (911 in the US), call the National Suicide Prevention Lifeline (988), or visit findahelpline.com for resources in your country. Your safety is our primary concern.",
  },
  {
    question: "How does the AI learn about me?",
    answer:
      "Our AI learns from your conversations and journal entries to provide personalized insights. It identifies patterns in your emotions, tracks themes over time, and tailors recommendations to your unique needs. The more you interact with The Room, the better it understands your wellness journey.",
  },
  {
    question: "Can I use The Room offline?",
    answer:
      "Some features like reviewing your journal entries and insights are available offline. However, AI conversations require an internet connection. We're working on expanding offline capabilities in future updates.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-[var(--app-border-primary-color)] last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-[var(--app-text-primary-color)] group-hover:text-[var(--app-accent-secondary-color)] transition-colors pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            isOpen
              ? "bg-[var(--app-accent-color)] text-white"
              : "bg-[var(--app-bg-tertiary-color)] text-[var(--app-text-secondary-color)]"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-[var(--app-text-secondary-color)] leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" className="!py-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left column - Header */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-[var(--app-accent-secondary-color)]/15">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--app-accent-secondary-color)]" />
              <span className="text-sm font-medium text-[var(--app-accent-secondary-color)]">FAQs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] mb-4 font-[family-name:var(--font-dancing-script)] leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[var(--app-text-secondary-color)] mb-6 leading-relaxed">
              Everything you need to know about The Room. Can&apos;t find what
              you&apos;re looking for?
            </p>
            <a
              href="mailto:support@theroom.ai"
              className="inline-flex items-center gap-2 text-sm text-[var(--app-accent-secondary-color)] hover:underline font-medium"
            >
              Contact our support team
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Right column - FAQ List */}
        <div className="lg:col-span-8">
          <div className="bg-[var(--app-bg-secondary-color)] rounded-2xl border border-[var(--app-border-primary-color)] p-6 sm:p-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
