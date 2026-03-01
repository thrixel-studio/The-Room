"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app-the-room.vercel.app";


export function Hero() {
  const scrollToGallery = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="relative flex items-center overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern" />

      <Container>
        <div className="relative z-10 max-w-7xl mx-auto text-center">

          {/* Badge */}
          <div className="mb-8 hero-fade-in">
            <Badge variant="light" color="secondary" size="md" icon={<ShieldCheck className="w-3.5 h-3.5" />} className="!bg-[var(--app-accent-secondary-color)]/15 !border-0 !text-[var(--app-accent-secondary-color)]">
              Expert-Guided & Completely Private
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight font-[family-name:var(--font-dancing-script)] hero-fade-in hero-delay-1">
            <span className="font-medium text-[var(--app-text-primary-color)]">Master Your Mental Wellness</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-[var(--app-text-secondary-color)] max-w-3xl mx-auto hero-fade-in hero-delay-2">
            Your private space to think, feel, and grow — with an AI that listens without judgment, helps you understand your patterns, and supports you at any hour of the day.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center hero-fade-in hero-delay-3">
            <a href={appUrl}>
              <Button
                variant="accent"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Go to Application
              </Button>
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/5 !text-white/90 hover:bg-white/10 hover:!text-white/90 !py-2.5"
              onClick={scrollToGallery}
            >
              Watch a Demo
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
}
