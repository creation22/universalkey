"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useState } from "react";
import { GoldenKey } from "./golden-key";
import { ArrowRight } from "./icons";
import { EASE_OUT, StaggerWords } from "./motion-primitives";
import { LightRays, MarbleRock } from "./scenery";

/** Soft-focus olive branch in the foreground, top-left. */
function OliveBranch() {
  return (
    <svg
      viewBox="0 0 300 260"
      className="pointer-events-none absolute -left-10 -top-8 w-[260px] opacity-80 blur-[3px] md:w-[340px]"
      aria-hidden="true"
    >
      <path d="M-10 40 C60 70 120 110 200 200" fill="none" stroke="#6f6a3a" strokeWidth="3" />
      {[
        [30, 52, -30],
        [58, 66, 40],
        [84, 80, -20],
        [108, 98, 50],
        [130, 114, -10],
        [152, 136, 60],
        [170, 156, 0],
        [44, 58, 150],
        [96, 88, 140],
        [142, 124, 160],
      ].map(([x, y, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="28"
          ry="8"
          transform={`rotate(${r} ${x} ${y})`}
          fill={i % 3 === 0 ? "#8d8a52" : i % 3 === 1 ? "#a7a36a" : "#6d6b3c"}
        />
      ))}
    </svg>
  );
}

/** Tooled leather card-holder with an embossed gold key; tilts toward the pointer. */
function Wallet() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const glareX = useTransform(px, [0, 1], [20, 80]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% 30%, rgba(255,230,180,0.28), transparent 55%)`;
  const [open, setOpen] = useState(false);

  return (
    <div style={{ perspective: 1000 }} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 18 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        <motion.div
          onPointerMove={(e) => {
            if (reduce || e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            px.set((e.clientX - r.left) / r.width);
            py.set((e.clientY - r.top) / r.height);
          }}
          onPointerLeave={() => {
            px.set(0.5);
            py.set(0.5);
          }}
          onHoverStart={() => setOpen(true)}
          onHoverEnd={() => setOpen(false)}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="relative h-[170px] w-[250px] md:h-[190px] md:w-[280px]"
        >
          {/* Card peeking out of the slot; rises on hover */}
          <motion.div
            className="absolute inset-x-[12%] -top-5 h-[70px] rounded-[10px] border border-[#f3e2bf] shadow-[0_6px_14px_-6px_rgba(60,30,8,0.5)]"
            style={{ background: "linear-gradient(135deg, #fffaf0 0%, #f6e6c6 55%, #e9cf9c 100%)" }}
            animate={{ y: open ? -26 : 0 }}
            transition={{ type: "spring", duration: 0.55, bounce: 0.3 }}
          >
            <div className="absolute left-3 top-2.5 h-4 w-5 rounded-[3px] bg-[linear-gradient(135deg,#f6d58f,#b8863f)] shadow-[inset_0_0_0_1px_rgba(122,82,32,0.35)]" />
            <span className="absolute right-3 top-2 font-serif text-[10px] tracking-[0.2em] text-gold-700">UK · 4211</span>
          </motion.div>

          <div className="absolute inset-0 rounded-[18px] shadow-[0_40px_60px_-30px_rgba(60,30,8,0.75),0_12px_24px_-12px_rgba(60,30,8,0.5)]">
            <div
              className="absolute inset-0 rounded-[18px]"
              style={{
                background:
                  "radial-gradient(120% 90% at 30% 20%, #b77a41 0%, #8e5424 45%, #5f3313 100%)",
              }}
            />
            {/* Leather grain */}
            <div
              className="absolute inset-0 rounded-[18px] opacity-35 mix-blend-multiply"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>\")",
              }}
            />
            {/* Slot lip */}
            <div className="absolute inset-x-[10%] top-0 h-3 rounded-b-[8px] bg-[#4a2610]/60 shadow-[inset_0_-1px_0_rgba(255,210,150,0.25)]" />
            {/* Stitching and embossed double border */}
            <div className="absolute inset-[9px] rounded-[13px] border-2 border-dashed border-[#e3b777]/70" />
            <div className="absolute inset-[17px] rounded-[10px] border border-[#f0c98a]/35 shadow-[inset_0_2px_6px_rgba(40,18,4,0.45),0_1px_0_rgba(255,220,160,0.18)]" />
            <div className="absolute inset-[21px] rounded-[8px] border border-[#2e1606]/35" />
            {/* Corner ornaments */}
            {["left-[22px] top-[22px]", "right-[22px] top-[22px] rotate-90", "right-[22px] bottom-[22px] rotate-180", "left-[22px] bottom-[22px] -rotate-90"].map((pos) => (
              <svg key={pos} viewBox="0 0 16 16" className={`absolute h-4 w-4 ${pos}`} aria-hidden="true">
                <path d="M1 12 C1 5 5 1 12 1 M1 8 C3 8 8 3 8 1" fill="none" stroke="#e3b777" strokeOpacity="0.8" strokeWidth="1.1" />
                <circle cx="4" cy="4" r="1.2" fill="#e3b777" />
              </svg>
            ))}
            <motion.div className="absolute inset-0 rounded-[18px]" style={{ background: glare }} />
          </div>

          <div className="relative flex h-full flex-col items-center justify-center gap-2">
            <GoldenKey length={330} className="h-[62px] w-auto opacity-95 md:h-[70px]" />
            <span className="relative font-serif text-[1.35rem] tracking-[0.01em] md:text-[1.5rem]">
              <span className="gold-text">Universal Key</span>
              {!reduce && (
                // Same text, clipped to a moving highlight band: the sheen only ever lights the letters.
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(105deg, transparent 40%, rgba(255,248,225,0.95) 50%, transparent 60%)",
                    backgroundSize: "250% 100%",
                    WebkitBackgroundClip: "text",
                  }}
                  initial={{ backgroundPosition: "130% 0%" }}
                  animate={{ backgroundPosition: "-30% 0%" }}
                  transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 }}
                >
                  Universal Key
                </motion.span>
              )}
            </span>
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute -bottom-5 left-1/2 h-6 w-[80%] -translate-x-1/2 rounded-[50%] bg-[#6b4520]/25 blur-md" />
    </div>
  );
}

export function Cta() {
  return (
    <section id="cta" className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 120% at 60% 30%, #fffaf1 0%, #f5e8d2 45%, #e7d3b2 100%)",
        }}
      />
      <LightRays className="-z-10 top-[20%]" size={1100} strength={0.7} />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-[42%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(240,228,208,0) 0%, #eee1ca 30%, #e6d6ba 100%)",
        }}
      />
      <MarbleRock flip className="-bottom-6 -right-16 -z-10 w-[260px] opacity-90 md:w-[320px]" />
      <OliveBranch />

      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-12 px-5 py-16 md:flex-row md:justify-between md:gap-8 md:py-14">
        <div className="text-center md:pl-[8%]">
          <h2 className="font-serif text-[2.2rem] leading-[1.1] tracking-[-0.015em] md:text-[2.8rem]">
            <StaggerWords text="Start with your balance." inView stagger={0.05} />
            <br />
            <StaggerWords text="The rest follows." inView stagger={0.05} delay={0.25} />
          </h2>
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold mt-6 inline-flex min-w-[190px] items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-[15px] font-medium"
          >
            Get your key
            <ArrowRight className="btn-arrow h-4 w-4" />
          </motion.a>
        </div>

        <Wallet />

        <p className="side-caps hidden self-center md:block">
          Once.
          <br />
          Everywhere.
        </p>
      </div>
    </section>
  );
}
