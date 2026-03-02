"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";

const images = [
  { src: "/demo/2.webp", alt: "The Room - Screen 2" },
  { src: "/demo/1.webp", alt: "The Room - Screen 1" },
  { src: "/demo/0.webp", alt: "The Room - Screen 0" },
  { src: "/demo/3.webp", alt: "The Room - Screen 3" },
  { src: "/demo/4.webp", alt: "The Room - Screen 4" },
  { src: "/demo/5.webp", alt: "The Room - Screen 5" },
  { src: "/demo/6.webp", alt: "The Room - Screen 6" },
];

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleManualSelect = (i: number) => {
    setActiveIndex(i);
  };

  return (
    <Section id="demo" className="!py-0">
      <div ref={sectionRef}>
        {/* Header */}
        <div
          className="text-center mb-10"
        >
<h2 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] mb-3 font-[family-name:var(--font-dancing-script)] leading-tight">
            Product Demo
          </h2>
          <p className="text-sm text-[var(--app-text-secondary-color)] max-w-xl mx-auto leading-relaxed">
            A glimpse into how The Room helps you understand your emotions, reflect deeper, and grow with intention.
          </p>
        </div>

        {/* Gallery */}
        <div>
          <div className="relative rounded-2xl overflow-hidden border-[1.5px] border-[var(--app-border-primary-color)] max-w-4xl mx-auto aspect-[1400/876] shadow-xl">
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

          <div className="flex items-center justify-center gap-2 mt-5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManualSelect(i)}
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
        </div>
      </div>
    </Section>
  );
}
