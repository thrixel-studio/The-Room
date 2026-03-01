import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Journaling } from "@/components/sections/Journaling";
import { Frameworks } from "@/components/sections/Frameworks";
import { Gallery } from "@/components/sections/Gallery";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
export default function Home() {
  return (
    <div className="flex flex-col gap-25 pt-20">
      <Hero />
      <Journaling />
      <Features />
      <Frameworks />
      <Gallery />
      <HowItWorks />
      <FAQ />
    </div>
  );
}
