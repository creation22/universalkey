"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { GoldenKey } from "./golden-key";

/** Frosted bar that slides in once the hero's own nav has scrolled away. */
export function StickyNav() {
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setShown(y > 560);
  });

  return (
    <AnimatePresence>
      {shown && (
        <motion.header
          key="sticky-nav"
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="fixed inset-x-0 top-3 z-50 flex justify-center px-3"
        >
          <nav className="flex w-full max-w-[920px] items-center justify-between rounded-full border border-white/70 bg-[#fbf6ee]/75 py-2 pl-4 pr-2 shadow-[0_18px_40px_-24px_rgba(92,62,25,0.55),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-xl">
            <a href="#top" className="flex items-center gap-2 font-serif text-[17px] text-gold-800">
              <GoldenKey length={330} className="h-7 w-auto" />
              Universal Key
            </a>
            <div className="flex items-center gap-2 text-[13px] text-ink-soft sm:gap-6">
              <a href="#solution" className="hidden transition-colors hover:text-gold-700 sm:inline">
                How it works
              </a>
              <a href="#builders" className="hidden transition-colors hover:text-gold-700 sm:inline">
                For Builders
              </a>
              <motion.a
                href="#cta"
                whileTap={{ scale: 0.97 }}
                className="btn-gold rounded-full px-4 py-2 text-[13px] font-medium"
              >
                Get your key
              </motion.a>
            </div>
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
