"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <Section padding="xl" className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-amber-500 mb-8"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--app-text-primary-color)] mb-6">
          Ready to Transform Your
          <br />
          <span className="text-gradient">Mental Wellness Journey?</span>
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-[var(--app-text-secondary-color)] mb-10 max-w-2xl mx-auto">
          Join thousands who have discovered the power of AI-supported
          self-reflection. Your journey to better mental health starts with a
          single conversation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            Start Free Today
          </Button>
          <Button variant="outline" size="lg">
            Schedule a Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-10 flex items-center justify-center gap-6 text-[var(--app-text-tertiary-color)]">
          <span className="text-sm">No credit card required</span>
          <span className="w-1 h-1 rounded-full bg-[var(--app-text-tertiary-color)]" />
          <span className="text-sm">Cancel anytime</span>
          <span className="w-1 h-1 rounded-full bg-[var(--app-text-tertiary-color)]" />
          <span className="text-sm">14-day free trial</span>
        </div>
      </div>
    </Section>
  );
}
