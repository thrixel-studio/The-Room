import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LandingLoader } from "@/components/ui/LandingLoader";

const outfit = localFont({
  src: [
    {
      path: "../../public/fonts/outfit-latin-ext.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/outfit-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
  display: "swap",
});

const dancingScript = localFont({
  src: [
    {
      path: "../../public/fonts/dancing-script-vietnamese.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../../public/fonts/dancing-script-latin-ext.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../../public/fonts/dancing-script-latin.woff2",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-dancing-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Room",
    template: "%s | The Room",
  },
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
        <LandingLoader />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
