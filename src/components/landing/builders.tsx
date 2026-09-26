"use client";

import { motion } from "motion/react";
import { ArrowRight, Bars, Layers, Users } from "./icons";
import { EASE_OUT } from "./motion-primitives";

const FEATURES = [
  { icon: Layers, title: "Skip payments", body: "We handle billing." },
  { icon: Bars, title: "Make money", body: "Reach funded users." },
  { icon: Users, title: "Meet funded users", body: "Real people, ready to build." },
];

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
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
                }}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 rounded-xl border border-[#f1e7d8] bg-white/90 px-4 py-3.5 shadow-[0_10px_24px_-18px_rgba(92,62,25,0.5)]"
              >
                <Icon className="h-6 w-6 shrink-0 text-gold-700" />
                <div>
                  <p className="font-serif text-[15px] leading-tight text-ink">{f.title}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted">{f.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="hidden h-14 w-px bg-line lg:mx-3 lg:block" />

        <motion.a
          href="#cta"
          variants={{
            hidden: { opacity: 0, x: 10 },
            show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
          }}
          whileTap={{ scale: 0.97 }}
          className="btn-gold inline-flex items-center justify-center gap-2 self-start rounded-lg px-5 py-3 text-sm font-medium lg:self-auto"
        >
          For app builders
          <ArrowRight className="btn-arrow h-4 w-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}
