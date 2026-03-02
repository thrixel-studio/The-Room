import { Container } from "@/components/ui/Container";
import { AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <Container size="md">
          <h1 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] mb-3 font-[family-name:var(--font-dancing-script)] leading-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--app-text-tertiary-color)]">
            Last updated: March 1, 2026
          </p>
        </Container>
      </section>

      <section className="pb-20">
        <Container size="md">

          {/* Crisis warning card */}
          <div className="mb-10 rounded-2xl bg-[var(--app-bg-secondary-color)] border border-[var(--app-danger-color-transparent)] p-6">
            <div className="flex items-start gap-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--app-danger-color-transparent)" }}
              >
                <AlertTriangle className="w-4 h-4" style={{ color: "var(--app-danger-color)" }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--app-text-primary-color)] mb-1">
                  Important Safety Information
                </h2>
                <p className="text-xs text-[var(--app-text-secondary-color)] leading-relaxed">
                  The Room is not a crisis service. If you are experiencing a
                  mental health emergency, please contact emergency services
                  (911), the National Suicide Prevention Lifeline (988), or
                  visit{" "}
                  <a
                    href="https://findahelpline.com"
                    className="text-[var(--app-accent-color)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    findahelpline.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Prose */}
          <div
            className="prose prose-lg prose-invert max-w-none
              prose-headings:text-[var(--app-text-primary-color)] prose-headings:font-semibold
              prose-h2:text-base prose-h2:mt-8 prose-h2:mb-3
              prose-p:text-[var(--app-text-secondary-color)] prose-p:leading-relaxed prose-p:mb-4 prose-p:text-sm
              prose-ul:text-[var(--app-text-secondary-color)] prose-ul:text-sm
              prose-li:my-1
              prose-a:text-[var(--app-accent-color)] prose-a:no-underline hover:prose-a:underline"
          >
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using The Room (&quot;the Service&quot;), you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              The Room provides AI-powered mental wellness support, including
              conversational AI, journaling features, and emotional pattern
              insights. The Service is designed to support general mental
              wellness and is not a substitute for professional medical advice,
              diagnosis, or treatment.
            </p>

            <h2>3. Not Medical Advice</h2>
            <p>
              The Service does not provide medical advice, mental health
              treatment, or therapy. Always seek the advice of your physician,
              mental health professional, or other qualified health provider
              with any questions you may have regarding a medical condition or
              mental health concern.
            </p>

            <h2>4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to notify us immediately of any
              unauthorized use of your account.
            </p>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use the Service to harm, threaten, or harass others</li>
              <li>Share your account with others</li>
            </ul>

            <h2>6. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy,
              which describes how we collect, use, and protect your information.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality
              are owned by The Room and are protected by international
              copyright, trademark, and other intellectual property laws.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, The Room shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of the Service.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify you of significant changes via email or through the Service.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:dvolynov@gmail.com">dvolynov@gmail.com</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
