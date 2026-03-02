import { Container } from "@/components/ui/Container";
import { Shield, Lock, Eye, Trash2 } from "lucide-react";

const privacyHighlights = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All your data is encrypted in transit and at rest.",
  },
  {
    icon: Eye,
    title: "No Data Selling",
    description: "We never sell your personal information to third parties.",
  },
  {
    icon: Trash2,
    title: "Data Deletion",
    description: "You can delete your data at any time from your settings.",
  },
  {
    icon: Shield,
    title: "HIPAA Aligned",
    description: "We follow healthcare industry privacy best practices.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <Container size="md">
          <h1 className="text-3xl sm:text-4xl font-medium text-[var(--app-text-primary-color)] mb-3 font-[family-name:var(--font-dancing-script)] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--app-text-tertiary-color)]">
            Last updated: March 1, 2026
          </p>
        </Container>
      </section>

      <section className="pb-20">
        <Container size="md">

          {/* Privacy highlights card */}
          <div className="mb-10 rounded-2xl bg-[var(--app-bg-secondary-color)] border border-[var(--app-border-primary-color)] p-6">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4" style={{ color: "var(--app-accent-color)" }} />
              <h2 className="text-sm font-semibold text-[var(--app-text-primary-color)]">
                Privacy is Our Priority
              </h2>
            </div>
            <p className="text-xs text-[var(--app-text-secondary-color)] mb-6 leading-relaxed">
              Your mental health journey is deeply personal. Here&apos;s how we protect it:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {privacyHighlights.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--app-accent-color-transparent)" }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: "var(--app-accent-color)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--app-text-primary-color)]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[var(--app-text-tertiary-color)] mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
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
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly, including:</p>
            <ul>
              <li>Account information (email, name)</li>
              <li>Conversations and journal entries</li>
              <li>App usage data and preferences</li>
              <li>Device information for security purposes</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and improve the Service</li>
              <li>Generate personalized insights and recommendations</li>
              <li>Ensure the security of your account</li>
              <li>Communicate with you about the Service</li>
              <li>Conduct research to improve mental wellness support (anonymized)</li>
            </ul>

            <h2>3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul>
              <li>All data is encrypted in transit using TLS 1.3</li>
              <li>Data at rest is encrypted using AES-256</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and employee training</li>
            </ul>

            <h2>4. Data Sharing</h2>
            <p>
              We do not sell, rent, or share your personal information with
              third parties for marketing purposes. We may share data only:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>With service providers who assist in operating our Service</li>
              <li>When required by law or to protect rights and safety</li>
              <li>In anonymized, aggregated form for research purposes</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Export your data</li>
              <li>Opt out of certain data processing</li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. You can
              delete your account and all associated data at any time from your
              settings. Some data may be retained in backup systems for a
              limited period.
            </p>

            <h2>7. Children&apos;s Privacy</h2>
            <p>
              The Room is not intended for users under 18 years of age. We do
              not knowingly collect information from children under 18.
            </p>

            <h2>8. International Users</h2>
            <p>
              If you access the Service from outside the United States, your
              data may be transferred to and processed in the United States. By
              using the Service, you consent to this transfer.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes via email or through the Service.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact
              us at{" "}
              <a href="mailto:dvolynov@gmail.com">dvolynov@gmail.com</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
