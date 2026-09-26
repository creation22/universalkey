"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { GoldenKey } from "./golden-key";
import { Chevron, Doc, Gear, Lock, Pen, Plus, Target } from "./icons";
import { EASE_OUT, Reveal } from "./motion-primitives";
import { LightRays } from "./scenery";

/* ---------- Hanging tag on the key ---------- */

function KeyTag({ label, delay = 0 }: { label: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="absolute left-[calc(50%+4px)] top-1/2 z-20 hidden md:block"
      style={{ originX: 0, originY: 0 }}
      initial={{ rotate: -70, opacity: 0 }}
      whileInView={{ rotate: 0, opacity: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ type: "spring", duration: 1.4, bounce: 0.5, delay }}
    >
      <motion.div
        style={{ originX: 0, originY: 0 }}
        animate={reduce ? undefined : { rotate: [0, 3, 0, -2, 0] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, delay: delay + 1.4 }}
      >
        <svg width="34" height="22" className="absolute -left-1 -top-2 overflow-visible" aria-hidden="true">
          <path d="M0 0 Q14 4 26 18" fill="none" stroke="#8a6a3e" strokeWidth="1" />
        </svg>
        <div
          className="absolute left-5 top-2 flex h-[28px] w-[64px] rotate-[20deg] items-center rounded-[5px] border border-[#caa66b] pl-[18px] font-serif text-[14px] italic text-[#3b2a18] shadow-[0_8px_14px_-8px_rgba(80,50,15,0.55)]"
          style={{ background: "linear-gradient(160deg, #fbecc8 0%, #f0d49c 60%, #e2bd78 100%)" }}
        >
          <span className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-[#b89560] bg-[#fff8e8]" />
          {label}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Row 1: personalization panel ---------- */

const TABS = [
  { id: "prefs", label: "Preferences", icon: Gear },
  { id: "instr", label: "Instructions", icon: Doc },
  { id: "ctx", label: "Context", icon: Target },
  { id: "privacy", label: "Privacy", icon: Lock },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_ROWS: Record<TabId, { icon: typeof Gear; label: string; value: string }[]> = {
  prefs: [
    { icon: Pen, label: "Writing style", value: "Concise" },
    { icon: Gear, label: "Default tools", value: "Auto" },
    { icon: Target, label: "Personal context", value: "Enabled" },
    { icon: Doc, label: "Rules (.cursorrules)", value: "Synced" },
  ],
  instr: [
    { icon: Pen, label: "Tone", value: "Direct" },
    { icon: Doc, label: "Output format", value: "Markdown" },
    { icon: Target, label: "Language", value: "English" },
    { icon: Gear, label: "Code style", value: "TypeScript" },
  ],
  ctx: [
    { icon: Doc, label: "Linked projects", value: "3 linked" },
    { icon: Target, label: "Memory", value: "On" },
    { icon: Doc, label: "Shared files", value: "12 files" },
    { icon: Gear, label: "Sync", value: "Live" },
  ],
  privacy: [
    { icon: Lock, label: "Model training", value: "Opted out" },
    { icon: Doc, label: "History", value: "30 days" },
    { icon: Target, label: "App sharing", value: "Ask first" },
    { icon: Lock, label: "Encryption", value: "On" },
  ],
};

function PreferencesPanel() {
  const [tab, setTab] = useState<TabId>("prefs");
  return (
    <div className="rounded-xl border border-[#efe4d2] bg-white/95 p-2.5 shadow-[0_18px_36px_-24px_rgba(92,62,25,0.45)]">
      <div role="tablist" className="flex gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`relative flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] transition-colors ${
                active ? "text-gold-800" : "text-muted hover:text-ink-soft"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="prefs-tab"
                  className="absolute inset-0 border border-[#ead9b9] bg-[#fbf3e3]"
                  style={{ borderRadius: 6 }}
                  transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                />
              )}
              <Icon className="relative h-3.5 w-3.5" />
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="relative mt-2 overflow-hidden rounded-lg border border-[#f1e8d9]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.ul
            key={tab}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="divide-y divide-[#f3ebdd]"
          >
            {TAB_ROWS[tab].map((row) => {
              const Icon = row.icon;
              return (
                <li
                  key={row.label}
                  className="flex items-center justify-between px-3 py-2 text-[11.5px] transition-colors hover:bg-[#fcf8f1]"
                >
                  <span className="flex items-center gap-2 text-ink-soft">
                    <Icon className="h-3.5 w-3.5 text-muted" />
                    {row.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-ink-soft">
                    {row.value}
                    <Chevron className="h-3 w-3 text-muted" />
                  </span>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Row 2: balance + savings ---------- */

function useCountUp(to: number, inView: boolean, duration = 1.6) {
  const value = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, to, duration, value]);
  return value;
}

function BalanceCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [target, setTarget] = useState(41.2);
  const balance = useCountUp(target, inView, target === 41.2 ? 1.6 : 0.8);
  const balanceText = useTransform(balance, (v) => `$${v.toFixed(2)}`);
  const saved = useCountUp(42, inView, 1.8);
  const savedText = useTransform(saved, (v) => `${Math.round(v)}%`);
  const [bumps, setBumps] = useState<number[]>([]);

  const addFunds = () => {
    setTarget((t) => Math.round((t + 10) * 100) / 100);
    const id = Date.now();
    setBumps((b) => [...b, id]);
    setTimeout(() => setBumps((b) => b.filter((x) => x !== id)), 900);
  };

  return (
    <div ref={ref} className="grid grid-cols-[1.35fr_1fr] gap-3">
      <div className="relative rounded-xl border border-[#efe4d2] bg-white/95 p-4 shadow-[0_18px_36px_-24px_rgba(92,62,25,0.45)]">
        <p className="font-serif text-[15px] text-ink-soft">Your balance</p>
        <div className="mt-1 flex items-end justify-between gap-2">
          <motion.p className="font-serif text-[2rem] leading-none tabular-nums text-ink">{balanceText}</motion.p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={addFunds}
            className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-[#ecd9b3] bg-[#fbf1dc] px-2 py-1 text-[10.5px] font-medium text-gold-800 transition-colors hover:bg-[#f7e7c6]"
          >
            <Plus className="h-3 w-3" />
            Add funds
          </motion.button>
        </div>
        <AnimatePresence>
          {bumps.map((id) => (
            <motion.span
              key={id}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -18 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="pointer-events-none absolute right-5 top-3 text-[11px] font-medium text-sage-700"
            >
              +$10.00
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex flex-col justify-center rounded-xl border border-[#d6e6cf] bg-sage-100 p-4 text-center shadow-[0_18px_36px_-24px_rgba(60,107,63,0.45)]">
        <p className="font-serif text-[1.65rem] leading-none text-sage-700">
          Saved <motion.span className="tabular-nums">{savedText}</motion.span>
        </p>
        <p className="mt-1.5 text-[10.5px] text-[#5c7a5d]">vs. individual pricing</p>
      </div>
    </div>
  );
}

/* ---------- Row 3: the same you, in any app ---------- */

const APP_GLYPHS = [
  // Generic glyphs standing in for AI apps.
  <path key="play" d="M9 6.5v11l9-5.5z" fill="#111" />,
  <g key="burst" stroke="#d9774b" strokeWidth="2.2" strokeLinecap="round">
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      return <line key={i} x1={12 + Math.cos(a) * 2} y1={12 + Math.sin(a) * 2} x2={12 + Math.cos(a) * 8} y2={12 + Math.sin(a) * 8} />;
    })}
  </g>,
  <g key="knot" fill="none" stroke="#111" strokeWidth="1.5">
    {[0, 60, 120].map((r) => (
      <ellipse key={r} cx="12" cy="12" rx="7.5" ry="3.8" transform={`rotate(${r} 12 12)`} />
    ))}
  </g>,
  <path
    key="star"
    d="M12 3.5l2 5.2 5.5-1.7-3.5 4.5 3.5 4.5-5.5-1.7-2 5.2-2-5.2-5.5 1.7 3.5-4.5-3.5-4.5 5.5 1.7z"
    fill="none"
    stroke="#1f8a8a"
    strokeWidth="1.6"
    strokeLinejoin="round"
  />,
  <g key="more" fill="#8a7d6c">
    <circle cx="7" cy="12" r="1.4" />
    <circle cx="12" cy="12" r="1.4" />
    <circle cx="17" cy="12" r="1.4" />
  </g>,
];

function AppsCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className="relative rounded-xl border border-[#efe4d2] bg-white/95 px-4 pb-3 pt-7 shadow-[0_18px_36px_-24px_rgba(92,62,25,0.45)]"
    >
      <span className="absolute right-3 top-2.5 flex items-center gap-1.5 rounded-full border border-[#f0d9a8] bg-[#fdf1d8] px-2 py-0.5 text-[10.5px] text-gold-800">
        <span className="relative flex h-2 w-2">
          {!reduce && (
            <motion.span
              className="absolute inset-0 rounded-full bg-[#e39b2d]"
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className="relative h-2 w-2 rounded-full bg-[#e39b2d]" />
        </span>
        Coming
      </span>
      <div className="flex justify-center gap-2.5">
        {APP_GLYPHS.map((glyph, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 10, scale: 0.9 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", duration: 0.6, bounce: 0.35, delay: 0.15 + i * 0.07 },
              },
            }}
          >
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.3 }}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#eee4d4] bg-white shadow-[0_4px_10px_-6px_rgba(92,62,25,0.35)]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                {glyph}
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <p className="mt-2.5 text-center text-[11px] text-muted">Same you. Any app.</p>
    </motion.div>
  );
}

/* ---------- Section ---------- */

// Shared column track so the key overlay, glow and each row's tag column line up exactly.
const KEY_TRACK = "md:grid-cols-[1fr_190px_1.25fr] md:pl-7 md:pr-4";

const ROWS = [
  {
    title: (
      <>
        One clean
        <br />
        personalization UI.
      </>
    ),
    body: "Set it once. Carry it everywhere.",
    tag: "Rules",
    ui: <PreferencesPanel />,
  },
  {
    title: <>Discounted by default.</>,
    body: "One balance. Real savings.",
    tag: "Balance",
    ui: <BalanceCards />,
  },
  {
    title: (
      <>
        Your preferences.
        <br />
        Everywhere.
      </>
    ),
    body: "Your rules, settings and context travel with you.",
    tag: "You",
    ui: <AppsCard />,
  },
];

export function Solution() {
  return (
    <section id="solution" className="relative overflow-hidden bg-paper px-5 pb-16 pt-12 md:pb-20">
      <Reveal className="relative z-20 text-center">
        <p className="eyebrow">The solution</p>
      </Reveal>

      <div className="relative mx-auto mt-8 max-w-[1020px] md:mt-12">
        {/* Glow behind the bow, under the cards */}
        <div className={`${KEY_TRACK} pointer-events-none absolute inset-0 hidden md:grid`}>
          <div className="relative col-start-2">
            <LightRays className="top-0" size={680} strength={0.9} />
          </div>
        </div>

        <div className="relative flex flex-col gap-4">
          {ROWS.map((row, i) => (
            <Reveal key={row.tag} delay={i * 0.08} y={26}>
              <div className={`card-surface ${KEY_TRACK} grid items-center gap-5 rounded-2xl p-5 md:gap-0 md:py-6`}>
                <div>
                  <h3 className="font-serif text-[1.55rem] leading-[1.12] tracking-[-0.01em] md:text-[1.7rem]">
                    {row.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{row.body}</p>
                </div>
                <div className="relative hidden h-full md:block">
                  <KeyTag label={row.tag} delay={0.3 + i * 0.1} />
                </div>
                <div className="min-w-0">{row.ui}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* The key that threads every row, placed in the same middle column the tags hang from */}
        <div
          className={`${KEY_TRACK} pointer-events-none absolute -top-12 bottom-2 left-0 right-0 z-10 hidden md:grid`}
        >
          <motion.div
            className="col-start-2 h-full justify-self-center"
            initial={{ opacity: 0, y: -40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.3, ease: EASE_OUT }}
          >
            <GoldenKey length={640} className="h-full w-auto" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
