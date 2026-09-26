import { Builders } from "@/components/landing/builders";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { MotionProvider } from "@/components/landing/motion-primitives";
import { Problem } from "@/components/landing/problem";
import { Solution } from "@/components/landing/solution";
import { StickyNav } from "@/components/landing/sticky-nav";
import { TurnBand } from "@/components/landing/turn-band";

export default function Home() {
  return (
    <MotionProvider>
      <StickyNav />
      <main id="top" className="flex-1 overflow-x-clip">
        <Hero />
        <Problem />
        <TurnBand />
        <Solution />
        <Builders />
        <Cta />
      </main>
      <Footer />
    </MotionProvider>
  );
}
