"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Marketing Professional",
    avatar: "S",
    content:
      "The Room has become my nightly ritual. After stressful days, I open the app and just let everything out. It's like having a wise friend who's always there, never judges, and actually remembers what I've been through.",
    highlight: "Helped me process work anxiety",
  },
  {
    id: 2,
    name: "James T.",
    role: "Software Engineer",
    avatar: "J",
    content:
      "I was skeptical about AI for mental health, but The Room changed my mind. The patterns it discovered in my journaling helped me realize my weekend habits were affecting my Monday mood. Game changer.",
    highlight: "Discovered hidden patterns",
  },
  {
    id: 3,
    name: "Elena R.",
    role: "Graduate Student",
    avatar: "E",
    content:
      "The 24/7 availability is huge for me. When anxiety hits at 2 AM, I can't call my therapist. But The Room is there, helping me work through racing thoughts with calming exercises.",
    highlight: "Available when I need it most",
  },
  {
    id: 4,
    name: "Michael K.",
    role: "Small Business Owner",
    avatar: "M",
    content:
      "I've tried journaling apps before but never stuck with them. The Room's AI prompts and insights keep me engaged. Seeing my emotional growth over 6 months has been incredibly motivating.",
    highlight: "Actually stuck with it",
  },
  {
    id: 5,
    name: "Priya S.",
    role: "Healthcare Worker",
    avatar: "P",
    content:
      "After long shifts, I needed somewhere to decompress without burdening family. The Room gives me that space. The frameworks for processing difficult experiences have been invaluable.",
    highlight: "Safe space to decompress",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <Section id="testimonials" background="secondary">
      <SectionHeader
        badge="Testimonials"
        title="Stories from Our Community"
        subtitle="Hear from real people who have transformed their mental wellness journey with The Room"
      />

      {/* Main Testimonial Carousel */}
      <div className="relative max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <div
            key={currentIndex}
            className="relative bg-[var(--app-bg-primary-color)] rounded-3xl p-8 sm:p-12 border border-[var(--app-border-primary-color)]"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
              <Quote className="w-12 h-12 text-violet-600/20" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Highlight Badge */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-violet-600/20 text-violet-400 mb-6">
                {testimonials[currentIndex].highlight}
              </span>

              {/* Quote */}
              <blockquote className="text-xl sm:text-2xl text-[var(--app-text-primary-color)] leading-relaxed mb-8">
                &quot;{testimonials[currentIndex].content}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center text-white text-lg font-bold">
                  {testimonials[currentIndex].avatar}
                </div>
                <div>
                  <div className="font-semibold text-[var(--app-text-primary-color)]">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-[var(--app-text-secondary-color)] text-sm">
                    {testimonials[currentIndex].role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full bg-[var(--app-bg-secondary-color)] border border-[var(--app-border-primary-color)] flex items-center justify-center text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] hover:border-violet-600 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-violet-600 w-8"
                    : "bg-[var(--app-border-primary-color)] w-2.5 hover:bg-[var(--app-text-tertiary-color)]"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-12 h-12 rounded-full bg-[var(--app-bg-secondary-color)] border border-[var(--app-border-primary-color)] flex items-center justify-center text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] hover:border-violet-600 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mini Reviews Grid */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { text: "Life changing app!", rating: 5, date: "2 days ago" },
          {
            text: "Finally an AI that gets me",
            rating: 5,
            date: "1 week ago",
          },
          { text: "Better than journaling alone", rating: 5, date: "3 days ago" },
          {
            text: "The insights are incredible",
            rating: 5,
            date: "5 days ago",
          },
          { text: "My daily mental gym", rating: 5, date: "1 day ago" },
          { text: "Wish I found this sooner", rating: 5, date: "4 days ago" },
        ].map((review, index) => (
          <div
            key={index}
            className="bg-[var(--app-bg-primary-color)] rounded-xl p-4 border border-[var(--app-border-primary-color)]"
          >
            <div className="flex gap-0.5 mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-[var(--app-text-primary-color)] text-sm font-medium">
              {review.text}
            </p>
            <p className="text-[var(--app-text-tertiary-color)] text-xs mt-1">{review.date}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
