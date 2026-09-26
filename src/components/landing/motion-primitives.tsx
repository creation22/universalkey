"use client";

import { MotionConfig, motion, type HTMLMotionProps } from "motion/react";

/** Strong ease-out: fast start, long settle. Used for every entrance on the page. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Under prefers-reduced-motion, Motion drops transform/layout animation and keeps opacity.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

/** Fades content up once as it scrolls into view. */
export function Reveal({ delay = 0, y = 22, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Splits a line into words that rise in one after another. */
export function StaggerWords({
  text,
  delay = 0,
  stagger = 0.06,
  inView = false,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const words = text.split(" ");
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, amount: 0.6 } }
    : { animate: "show" };

  return (
    <motion.span
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
      className="inline"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
            show: {
              opacity: 1,
              y: "0em",
              filter: "blur(0px)",
              transition: { duration: 0.9, ease: EASE_OUT },
            },
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
