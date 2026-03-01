import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";

const footerLinks = {
  product: [
    { name: "Journaling", href: "/#journaling" },
    { name: "Frameworks", href: "/#frameworks" },
    { name: "Demo", href: "/#demo" },
    { name: "Team", href: "/#team" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[var(--app-bg-tertiary-color)] border-t border-[var(--app-border-primary-color)]">
      <Container>
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">

            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center mb-5 group">
                <Image
                  src="/logo/logo-full.svg"
                  alt="The Room"
                  width={210}
                  height={70}
                  className="h-10 w-auto transition-opacity group-hover:opacity-80"
                />
              </Link>
              <p className="text-sm text-[var(--app-text-secondary-color)] mb-5 leading-relaxed">
                Your AI-powered mental wellness companion. Available 24/7 to
                support your journey.
              </p>
              <a
                href="mailto:dvolynov@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-[var(--app-text-secondary-color)] hover:text-[var(--app-accent-secondary-color)] transition-colors"
              >
                <Mail className="w-4 h-4" />
                dvolynov@gmail.com
              </a>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-medium text-[var(--app-text-primary-color)] mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-medium text-[var(--app-text-primary-color)] mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Crisis Disclaimer */}
        <div className="py-5 border-t border-[var(--app-border-primary-color)]">
          <p className="text-xs text-[var(--app-text-tertiary-color)] text-center max-w-4xl mx-auto leading-relaxed">
            <strong className="text-[var(--app-text-secondary-color)]">Important:</strong> The Room is not designed to be used in
            crisis situations. If you are experiencing a mental health
            emergency, please contact your local emergency services or visit{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--app-accent-secondary-color)] hover:underline"
            >
              findahelpline.com
            </a>{" "}
            for immediate support resources.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-[var(--app-border-primary-color)]">
          <p className="text-xs text-[var(--app-text-tertiary-color)] text-center">
            &copy; {new Date().getFullYear()} The Room. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
