import Link from "next/link";
import { Sparkles, Mail, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/#pricing" },
    { name: "FAQ", href: "/#faq" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Resources", href: "/resources" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[var(--app-bg-tertiary-color)] border-t border-[var(--app-border-primary-color)]">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[var(--app-bg-secondary-color)] via-[var(--app-bg-primary-color)] to-[var(--app-bg-secondary-color)]">
        <Container>
          <div className="py-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[var(--app-text-primary-color)]">
              Begin Your Journey
            </h2>
            <p className="text-lg text-[var(--app-text-secondary-color)] mb-8 max-w-2xl mx-auto">
              Take the first step toward better mental wellness today. The Room
              is here to support you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer */}
      <Container>
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[var(--app-text-primary-color)]">
                  The Room
                </span>
              </Link>
              <p className="text-[var(--app-text-secondary-color)] text-sm mb-6">
                Your AI-powered mental wellness companion. Available 24/7 to
                support your journey.
              </p>
              <a
                href="mailto:support@theroom.ai"
                className="inline-flex items-center gap-2 text-[var(--app-text-secondary-color)] hover:text-violet-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                support@theroom.ai
              </a>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-[var(--app-text-primary-color)] font-semibold mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-[var(--app-text-primary-color)] font-semibold mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-[var(--app-text-primary-color)] font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] transition-colors text-sm"
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
        <div className="py-6 border-t border-[var(--app-border-primary-color)]">
          <p className="text-xs text-[var(--app-text-tertiary-color)] text-center max-w-4xl mx-auto">
            <strong>Important:</strong> The Room is not designed to be used in
            crisis situations. If you are experiencing a mental health
            emergency, please contact your local emergency services or visit{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline"
            >
              findahelpline.com
            </a>{" "}
            for immediate support resources.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[var(--app-border-primary-color)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--app-text-tertiary-color)]">
            &copy; {new Date().getFullYear()} The Room. All rights reserved.
          </p>
          <p className="text-sm text-[var(--app-text-tertiary-color)] flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> for your
            wellness
          </p>
        </div>
      </Container>
    </footer>
  );
}
