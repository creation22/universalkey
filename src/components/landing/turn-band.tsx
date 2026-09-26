"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { GoldenKey } from "./golden-key";
import { EASE_OUT } from "./motion-primitives";
import { Clouds, Colonnade, LightRays, MarbleRock } from "./scenery";

function ArchPortal() {
  return (
    <svg viewBox="0 0 260 360" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="arch-stone" x1="0" x2="1">
          <stop offset="0" stopColor="#d9c09a" />
          <stop offset="0.18" stopColor="#f8efdf" />
          <stop offset="0.5" stopColor="#efe2cb" />
          <stop offset="0.82" stopColor="#f8efdf" />
          <stop offset="1" stopColor="#d6bb92" />
        </linearGradient>
        <radialGradient id="arch-light" cx="0.5" cy="0.45" r="0.65">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#fff8e8" />
          <stop offset="1" stopColor="#f1dcb5" />
        </radialGradient>
      </defs>
      {/* Frame */}
      <path
        d="M8 360 V128 A122 122 0 0 1 252 128 V360 Z M44 360 V136 A86 86 0 0 1 216 136 V360 Z"
        fillRule="evenodd"
        fill="url(#arch-stone)"
      />
      {/* Opening */}
      <path d="M44 360 V136 A86 86 0 0 1 216 136 V360 Z" fill="url(#arch-light)" />
      {/* Mouldings */}
      <g fill="none" strokeLinecap="round">
        <path d="M18 360 V128 A112 112 0 0 1 242 128 V360" stroke="#fffaf0" strokeOpacity="0.8" strokeWidth="1.5" />
        <path d="M30 360 V132 A100 100 0 0 1 230 132 V360" stroke="#cdb189" strokeOpacity="0.7" strokeWidth="1.2" />
        <path d="M44 360 V136 A86 86 0 0 1 216 136 V360" stroke="#c9a877" strokeOpacity="0.55" strokeWidth="3" />
      </g>
      <path d="M122 6 H138 L135 22 H125 Z" fill="#f4e7d0" stroke="#cdb189" strokeWidth="1" />
    </svg>
  );
}

export function TurnBand() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // The key makes one full turn as the band crosses the viewport; the portal brightens as it does.
  const rawTurn = useTransform(scrollYProgress, [0.15, 0.6], [-360, 0]);
  const turn = useSpring(rawTurn, { stiffness: 90, damping: 24, mass: 0.6 });
  const glow = useTransform(scrollYProgress, [0.1, 0.55], [0.35, 1]);
  const glowScale = useTransform(scrollYProgress, [0.1, 0.55], [0.85, 1.1]);

  return (
    <section
      ref={ref}
      className="relative isolate h-[380px] overflow-hidden md:h-[400px]"
      aria-label="Turn it once. The rest follows."
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(90% 120% at 50% 40%, #fffaf0 0%, #f4e6cd 45%, #e8d3b0 100%)",
        }}
      />
      <Clouds className="-z-10 opacity-70" />
      <Colonnade side="left" className="-z-10 w-[40%] md:w-[30%]" />
      <Colonnade side="right" className="-z-10 w-[40%] md:w-[30%]" />
      <MarbleRock className="-bottom-4 -left-12 -z-10 w-[220px] md:w-[280px]" />
      <MarbleRock flip className="-bottom-4 -right-14 -z-10 w-[200px] md:w-[270px]" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-24"
        style={{ background: "linear-gradient(180deg, transparent, rgba(236,220,193,0.9))" }}
      />

      {/* Portal */}
      <div className="absolute bottom-0 left-1/2 h-[330px] w-[240px] -translate-x-1/2 md:h-[360px] md:w-[260px]">
        <motion.div style={{ opacity: glow, scale: glowScale }} className="absolute inset-0">
          <LightRays className="top-[45%]" size={900} strength={0.9} />
        </motion.div>
        <ArchPortal />
        <div className="absolute inset-x-0 top-[16%] flex justify-center" style={{ perspective: 800 }}>
          <motion.div style={reduce ? undefined : { rotateY: turn }}>
            <GoldenKey length={360} className="h-[180px] w-auto md:h-[200px]" />
          </motion.div>
        </div>
        <motion.div
          style={{ opacity: glow }}
          className="absolute -bottom-6 left-1/2 h-16 w-[320px] -translate-x-1/2 rounded-[50%] bg-white blur-2xl"
        />
      </div>

      {/* Copy either side of the portal */}
      <div className="relative mx-auto flex h-full max-w-[1100px] items-center justify-between px-5 pb-10 md:pb-0">
        <motion.h2
          initial={{ opacity: 0, x: -24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE_OUT }}
          className="w-[36%] text-right font-serif text-3xl tracking-[-0.015em] md:w-auto md:pl-[10%] md:text-left md:text-5xl"
        >
          Turn it once.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.25 }}
          className="w-[36%] font-serif text-3xl tracking-[-0.015em] md:w-auto md:pr-[8%] md:text-5xl"
        >
          The rest follows.
        </motion.p>
      </div>

      <p className="side-caps absolute left-8 top-1/2 hidden -translate-y-1/2 lg:block xl:left-12">
        Same you.
        <br />
        Further
        <br />
        everywhere.
      </p>
      <p className="side-caps absolute right-8 top-1/2 hidden -translate-y-1/2 text-right lg:block xl:right-12">
        One key.
        <br />
        A brighter
        <br />
        AI tomorrow.
      </p>
    </section>
  );
}
