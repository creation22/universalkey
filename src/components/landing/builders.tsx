"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Bars, Layers, Users } from "./icons";
import { EASE_OUT } from "./motion-primitives";

const FEATURES = [
  { icon: Layers, title: "Skip payments", body: "We handle billing." },
  { icon: Bars, title: "Make money", body: "Reach funded users." },
  { icon: Users, title: "Meet funded users", body: "Real people, ready to build." },
];

/** Feature tile whose 1px border lights up with a travelling gold sweep on hover. */
function FeatureTile({ icon: Icon, title, body }: (typeof FEATURES)[number]) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
      }}
    >
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hover"
        variants={{ rest: { y: 0 }, hover: { y: -3 } }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
        className="group relative overflow-hidden rounded-xl p-px shadow-[0_10px_24px_-18px_rgba(92,62,25,0.5)]"
      >
        {/* Static hairline border */}
        <div className="absolute inset-0 rounded-xl bg-[#f1e7d8]" />
        {/* Rotating gold sweep, revealed on hover */}
        <motion.div
          className="absolute inset-0"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, #e9c37a 310deg, #fff3d0 340deg, transparent 360deg)",
            }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
          />
        </motion.div>
        <div className="relative flex items-center gap-3 rounded-[11px] bg-white/95 px-4 py-3.5">
          <motion.span
            variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -8, scale: 1.1 } }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fbf3e3] text-gold-700"
          >
            <Icon className="h-5 w-5" />
          </motion.span>
          <div>
            <p className="font-serif text-[15px] leading-tight text-ink">{title}</p>
            <p className="mt-0.5 text-[11.5px] text-muted">{body}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Builders() {
  return (
    <section id="builders" className="bg-paper px-5 pb-14 md:pb-16">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: 24 },
          show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, staggerChildren: 0.08, delayChildren: 0.2 } },
        }}
        className="card-surface mx-auto flex max-w-[1180px] flex-col gap-5 rounded-2xl p-6 lg:flex-row lg:items-center lg:gap-4 lg:px-7 lg:py-6"
      >
        <div className="lg:mr-2 lg:shrink-0">
          <p className="eyebrow !text-[0.62rem]">For builders</p>
          <h2 className="mt-2 whitespace-nowrap font-serif text-[1.7rem] leading-tight tracking-[-0.01em]">
            Building an AI app?
          </h2>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureTile key={f.title} {...f} />
          ))}
        </div>

        <div className="hidden h-14 w-px bg-line lg:mx-3 lg:block" />

        <motion.a
          href="#cta"
          variants={{
            hidden: { opacity: 0, x: 10 },
            show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
          }}
          whileTap={{ scale: 0.97 }}
          className="btn-gold inline-flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium lg:self-auto"
        >
          For app builders
          <ArrowRight className="btn-arrow h-4 w-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}
