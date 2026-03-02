"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import clsx from "clsx";

const navigation = [
  { name: "Journaling", href: "#journaling" },
  { name: "Overview", href: "#features" },
  { name: "Frameworks", href: "#frameworks" },
  { name: "ML-Ranking", href: "#restrictions" },
  { name: "Demo", href: "#demo" },
  { name: "Expert-Guided", href: "#psychologist-consultation" },
  { name: "Team", href: "#team" },
];

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app-the-room.vercel.app";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full z-50 bg-transparent">
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo/logo-full.svg"
              alt="The Room"
              width={210}
              height={70}
              className="h-12 w-auto transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href={`${appUrl}/signup`}>
              <Button variant="outline" size="sm" className="!p-0 !border-0 !text-[var(--app-text-secondary-color)] hover:!opacity-70 hover:!bg-transparent">
                Sign up
              </Button>
            </a>
            <a href={`${appUrl}/signin`}>
              <Button variant="primary" size="sm" icon={<LogIn className="w-3.5 h-3.5" />} className="!bg-transparent !border !border-[var(--app-accent-secondary-color)] !rounded-lg !text-[var(--app-accent-secondary-color)] !px-3 !py-1.5 hover:!bg-[var(--app-accent-secondary-color)] hover:!text-[var(--app-bg-primary-color)]">
                Sign in
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "md:hidden transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-[var(--app-bg-primary-color)]/95 backdrop-blur-lg border-b border-[var(--app-border-primary-color)]">
          <Container>
            <div className="py-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="pt-4 mt-2 flex flex-col gap-2">
                <a href={`${appUrl}/signup`} className="w-full">
                  <Button variant="outline" size="md" fullWidth>
                    Sign up
                  </Button>
                </a>
                <a href={`${appUrl}/signin`} className="w-full">
                  <Button variant="primary" size="md" fullWidth className="!bg-transparent !border-[var(--app-accent-secondary-color)] !text-[var(--app-accent-secondary-color)] !px-4 !py-2 hover:!bg-[var(--app-accent-secondary-color)] hover:!text-[var(--app-bg-primary-color)]">
                    Sign in
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
