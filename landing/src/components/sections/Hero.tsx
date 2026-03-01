"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app-the-room.vercel.app";

const images = [
  { src: "/demo/1.webp", alt: "The Room - Screen 1" },
  { src: "/demo/2.webp", alt: "The Room - Screen 2" },
  { src: "/demo/3.webp", alt: "The Room - Screen 3" },
  { src: "/demo/4.webp", alt: "The Room - Screen 4" },
  { src: "/demo/5.webp", alt: "The Room - Screen 5" },
  { src: "/demo/6.webp", alt: "The Room - Screen 6" },
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-10 overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--app-accent-secondary-color)]/10 rounded-full blur-3xl" />

      <Container>
        <div className="relative z-10 max-w-7xl mx-auto text-center">

          {/* Badge */}
          <div className="mb-8 hero-fade-in">
            <Badge variant="light" color="secondary" size="md" icon={<ShieldCheck className="w-3.5 h-3.5" />} className="!bg-[var(--app-accent-secondary-color)]/15 !border-0 !text-[var(--app-accent-secondary-color)]">
              Expert-Guided & Completely Private
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-[family-name:var(--font-dancing-script)] hero-fade-in hero-delay-1">
            <span className="font-bold text-[var(--app-text-primary-color)]">Master Your Mental Wellness</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-[var(--app-text-secondary-color)] max-w-2xl mx-auto hero-fade-in hero-delay-2">
            Journal. Reflect. Transform. — talk through anything with an AI that adapts to how your mind actually works. No judgment. No waiting. Just clarity.
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

          {/* Hero Gallery */}
          <div
            ref={galleryRef}
            className="mt-16 relative hero-fade-in-lg hero-delay-4"
          >
            {/* Image carousel — dissolve */}
            <div className="relative rounded-2xl overflow-hidden border-[1.5px] border-[var(--app-border-primary-color)] max-w-4xl mx-auto aspect-[1400/876] shadow-lg">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    zIndex: i === activeIndex ? 1 : 0,
                    transition: "opacity 500ms ease",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    priority={i < 2}
                  />
                </div>
              ))}
            </div>

            {/* Numbered navigation */}
            <div className="flex items-center justify-center gap-2 mt-5 pb-8">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                    i === activeIndex
                      ? "bg-white text-[var(--app-bg-primary-color)] scale-110"
                      : "bg-[var(--app-bg-secondary-color)] text-[var(--app-text-secondary-color)] hover:brightness-125"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-[var(--app-accent-color)]/5 rounded-3xl blur-3xl -z-10" />
          </div>
        </div>
      </Container>
    </section>
  );
}
