"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";

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
  const [direction, setDirection] = useState(1);

  const goTo = (i: number) => {
    setDirection(i > activeIndex ? 1 : -1);
    setActiveIndex(i);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
    center: { x: 0 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--app-accent-secondary-color)]/10 rounded-full blur-3xl" />

      <Container>
        <div className="relative z-10 max-w-7xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Badge variant="light" color="secondary" size="md" icon={<ShieldCheck className="w-3.5 h-3.5" />} className="!bg-transparent border border-[var(--app-accent-secondary-color)] !text-[var(--app-accent-secondary-color)]">
              Expert-Guided & Completely Private
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-[family-name:var(--font-dancing-script)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="font-bold text-[var(--app-text-primary-color)]">Master Your Mental Wellness</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="mt-6 text-lg sm:text-xl text-[var(--app-text-secondary-color)] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Journal. Reflect. Transform. — talk through anything with an AI that adapts to how your mind actually works. No judgment. No waiting. Just clarity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a href={appUrl}>
              <Button
                variant="accent"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Go to Application
              </Button>
            </a>
            <Button
              variant="ghost"
              size="lg"
              icon={<Play className="w-5 h-5" />}
              className="bg-white/5 !text-white/90 hover:bg-white/10 hover:!text-white/90"
            >
              Watch a Demo
            </Button>
          </motion.div>

          {/* Hero Gallery */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {/* Image carousel */}
            <div className="relative rounded-xl overflow-hidden border-[1.5px] border-[var(--app-border-primary-color)] shadow-2xl max-w-4xl mx-auto aspect-[1400/876]">
              <AnimatePresence mode="sync" initial={false} custom={direction}>
                <motion.div
                  key={activeIndex}
                  className="absolute inset-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.8, ease: "linear" }}
                >
                  <Image
                    src={images[activeIndex].src}
                    alt={images[activeIndex].alt}
                    fill
                    className="object-cover"
                    priority={activeIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Numbered navigation */}
            <div className="flex items-center justify-center gap-2 mt-5 pb-8">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
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
            <div className="absolute -inset-4 bg-violet-600/10 rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
