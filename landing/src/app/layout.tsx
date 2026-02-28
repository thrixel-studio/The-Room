import type { Metadata } from "next";
import { Outfit, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Room - Your AI-Powered Mental Wellness Companion",
  description:
    "24/7 emotional support through AI-powered journaling, insights, and personalized guidance. Begin your journey to better mental wellness today.",
  keywords: [
    "mental wellness",
    "AI therapy",
    "journaling",
    "emotional support",
    "mental health",
    "self-care",
    "mindfulness",
  ],
  openGraph: {
    title: "The Room - Your AI-Powered Mental Wellness Companion",
    description:
      "24/7 emotional support through AI-powered journaling, insights, and personalized guidance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dancingScript.variable}`}>
      <body className="font-[family-name:var(--font-outfit)] antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
