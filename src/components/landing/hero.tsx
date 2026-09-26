"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { GoldenKey } from "./golden-key";
import { HeroScene } from "./hero-scene";
import { ArrowRight } from "./icons";
import { EASE_OUT, StaggerWords } from "./motion-primitives";
import { DustMotes, LightRays } from "./scenery";

/** Four-point star that flares on the key's bow every few seconds. */
function Glint({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute ${className}`}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 45, 90] }}
      transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 4.5, delay }}
      aria-hidden="true"
    >
      <path d="M12 0 C12.8 8 16 11.2 24 12 C16 12.8 12.8 16 12 24 C11.2 16 8 12.8 0 12 C8 11.2 11.2 8 12 0 Z" fill="#fffaf0" />
    </motion.svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Depth: arcades and clouds drift slower than the content, the key lifts away, copy fades out.
  const arcadeY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const cloudsY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const keyY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[680px] flex-col overflow-hidden md:h-[640px] md:min-h-0"
    >
      {/* Sky fill for the area above the scene on small screens */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(120% 70% at 50% 20%, #fffdf8 0%, #fcf3e3 45%, #f3e2c5 100%)" }}
      />
      {/* On phones the scene is scaled down and pinned to the bottom so the arcade stays in frame */}
      <div className="absolute bottom-0 left-1/2 -z-10 h-[460px] w-[1035px] -translate-x-1/2 md:inset-0 md:h-full md:w-full md:translate-x-0">
        <HeroScene arcadeY={arcadeY} cloudsY={cloudsY} />
      </div>

      {/* Sun behind the bow */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: EASE_OUT }}
      >
        <LightRays className="top-[13%]" size={1800} strength={1.35} />
        <DustMotes count={34} seed={11} className="left-[20%] right-[20%]" />
        {/* Hot core right behind the bow */}
        <div
          className="absolute left-1/2 top-[13%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,252,1) 0%, rgba(255,250,236,0.9) 22%, rgba(255,244,218,0.4) 45%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.9 }}
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5 md:px-9 md:pt-8"
      >
        <span className="font-serif text-lg text-gold-800 md:invisible">Universal Key</span>
        <div className="flex items-center gap-4 text-[13px] text-ink-soft md:gap-8">
          <a href="#builders" className="hidden transition-colors hover:text-gold-700 sm:inline">
            For Builders
          </a>
          <a href="#solution" className="hidden transition-colors hover:text-gold-700 sm:inline">
            About
          </a>
          <motion.a
            href="#cta"
            whileTap={{ scale: 0.97 }}
            className="btn-gold rounded-full px-5 py-2.5 text-[13px] font-medium"
          >
            Get your key
          </motion.a>
        </div>
      </motion.nav>

      {/* Side captions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.3 }}
        className="side-caps absolute left-10 top-[47%] hidden lg:block xl:left-[68px]"
      >
        One
        <br />
        Balance.
        <br />
        Everywhere.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.45 }}
        className="side-caps absolute right-10 top-[47%] hidden text-right lg:block xl:right-[68px]"
      >
        A more
        <br />
        open AI
        <br />
        tomorrow.
      </motion.p>

      {/* Key + copy */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-5 pb-14 pt-16 text-center md:pb-0 md:pt-6">
        <motion.div style={{ y: keyY }} className="relative">
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.94, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          >
            <motion.div
              className="relative"
              animate={reduce ? undefined : { y: [0, -7, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1.4 }}
            >
              <GoldenKey length={340} className="h-[230px] w-auto md:h-[300px]" />
              <Glint className="left-[58%] top-[3%] h-5 w-5 md:h-6 md:w-6" delay={2} />
              <Glint className="left-[18%] top-[16%] h-3 w-3" delay={2.5} />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="mt-4 md:mt-5">
          <h1 className="font-serif text-[2.6rem] leading-[1.05] tracking-[-0.022em] text-ink sm:text-6xl md:text-[4rem]">
            <StaggerWords text="One key for every AI app." delay={0.45} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.95 }}
            className="mt-3.5 text-lg text-ink-soft md:text-[1.3rem]"
          >
            Fund once. Stay in control. Bring yourself.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.1 }}
            className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-[18px]"
          >
            <motion.a
              href="#cta"
              whileTap={{ scale: 0.97 }}
              className="btn-gold inline-flex min-w-[212px] items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-medium"
            >
              Get your key
              <ArrowRight className="btn-arrow h-4 w-4" />
            </motion.a>
            <motion.a
              href="#builders"
              whileTap={{ scale: 0.97 }}
              className="btn-ghost inline-flex min-w-[226px] items-center justify-center rounded-lg px-6 py-3.5 text-[15px] font-medium"
            >
              Build with Universal Key
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
