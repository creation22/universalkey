"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { GoldenKey } from "./golden-key";
import { ArrowRight } from "./icons";
import { EASE_OUT, StaggerWords } from "./motion-primitives";
import { Clouds, Colonnade, LightRays, MarbleRock } from "./scenery";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Depth: pillars drift slower than the content, the key lifts away, copy fades out.
  const pillarsY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const keyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[640px] flex-col overflow-hidden md:h-[88svh] md:max-h-[860px]"
    >
      {/* Sky */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 18%, #fffbf2 0%, #f8ecd6 38%, #efdcbd 70%, #e6cfab 100%)",
        }}
      />
      <Clouds className="-z-10" />
      <LightRays className="-z-10 top-[22%]" size={1600} />

      <motion.div style={{ y: pillarsY }} className="absolute inset-0 -z-10">
        <Colonnade side="left" className="w-[46%] md:w-[38%]" />
        <Colonnade side="right" className="w-[46%] md:w-[38%]" />
      </motion.div>

      {/* Floor and boulders */}
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(246,236,219,0) 0%, rgba(240,226,202,0.85) 60%, #efe0c6 100%)",
        }}
      />
      <MarbleRock className="-bottom-2 -left-10 -z-10 w-[240px] md:w-[320px]" />
      <MarbleRock flip className="-bottom-3 -right-12 -z-10 w-[220px] md:w-[300px]" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.9 }}
        className="relative z-10 flex items-center justify-between px-5 pt-5 md:px-8 md:pt-6"
      >
        <span className="font-serif text-lg text-gold-800 md:invisible">Universal Key</span>
        <div className="flex items-center gap-4 text-[13px] text-ink-soft md:gap-7">
          <a href="#builders" className="hidden transition-colors hover:text-gold-700 sm:inline">
            For Builders
          </a>
          <a href="#solution" className="hidden transition-colors hover:text-gold-700 sm:inline">
            About
          </a>
          <motion.a
            href="#cta"
            whileTap={{ scale: 0.97 }}
            className="btn-gold rounded-full px-4 py-2 text-[13px] font-medium"
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
        className="side-caps absolute left-8 top-[44%] hidden lg:block xl:left-12"
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
        className="side-caps absolute right-8 top-[44%] hidden text-right lg:block xl:right-12"
      >
        A more
        <br />
        open AI
        <br />
        tomorrow.
      </motion.p>

      {/* Key + copy */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-2 text-center">
        <motion.div style={{ y: keyY }}>
          <motion.div
            initial={{ opacity: 0, y: -36, scale: 0.94, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0], rotate: [0, 1.2, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1.4 }}
            >
              <GoldenKey length={330} className="h-[170px] w-auto md:h-[230px]" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="mt-5 md:mt-6">
          <h1 className="font-serif text-[2.6rem] leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl md:text-[4.4rem]">
            <StaggerWords text="One key for every AI app." delay={0.45} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.95 }}
            className="mt-4 text-lg text-ink-soft md:text-xl"
          >
            Fund once. Stay in control. Bring yourself.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.1 }}
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <motion.a
              href="#cta"
              whileTap={{ scale: 0.97 }}
              className="btn-gold inline-flex min-w-[168px] items-center justify-center gap-2 rounded-lg px-7 py-3 text-sm font-medium"
            >
              Get your key
              <ArrowRight className="btn-arrow h-4 w-4" />
            </motion.a>
            <motion.a
              href="#builders"
              whileTap={{ scale: 0.97 }}
              className="btn-ghost inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium"
            >
              Build with Universal Key
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
