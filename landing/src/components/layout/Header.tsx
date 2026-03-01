"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import clsx from "clsx";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Resources", href: "/resources" },
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
              src="/logo/logo-full.png"
              alt="The Room"
              width={210}
              height={70}
              className="h-16 w-auto transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href={`${appUrl}/signin`}>
              <Button variant="outline" size="md" className="!p-0 !border-0 !text-[var(--app-text-secondary-color)] hover:!opacity-70 hover:!bg-transparent">
                Login
              </Button>
            </a>
            <a href={`${appUrl}/signup`}>
              <Button variant="primary" size="md" className="!bg-[var(--app-accent-secondary-color)] border-0 !text-[#1e1f22] !px-3 !py-2 hover:brightness-90">
                Try it out
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
            <div className="py-4 space-y-4">
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
              <div className="pt-4 flex flex-col gap-2">
                <a href={`${appUrl}/signin`} className="w-full">
                  <Button variant="outline" size="md" fullWidth>
                    Login
                  </Button>
                </a>
                <a href={`${appUrl}/signup`} className="w-full">
                  <Button variant="primary" size="md" fullWidth className="!bg-[var(--app-accent-secondary-color)] border-0 !text-[#1e1f22] !px-3 !py-2 hover:brightness-90">
                    Try it out
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
