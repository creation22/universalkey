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
import { Check, Chevron, Doc, Gear, Lock, Pen, Plus, Target } from "./icons";
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

const TAB_ROWS: Record<TabId, { icon: typeof Gear; label: string; options: string[] }[]> = {
  prefs: [
    { icon: Pen, label: "Writing style", options: ["Concise", "Detailed", "Casual"] },
    { icon: Gear, label: "Default tools", options: ["Auto", "Manual", "Ask first"] },
    { icon: Target, label: "Personal context", options: ["Enabled", "Disabled"] },
    { icon: Doc, label: "Rules (.cursorrules)", options: ["Synced", "Local only"] },
  ],
  instr: [
    { icon: Pen, label: "Tone", options: ["Direct", "Friendly", "Formal"] },
    { icon: Doc, label: "Output format", options: ["Markdown", "Plain text", "JSON"] },
    { icon: Target, label: "Language", options: ["English", "Español", "Deutsch"] },
    { icon: Gear, label: "Code style", options: ["TypeScript", "Python", "Go"] },
  ],
  ctx: [
    { icon: Doc, label: "Linked projects", options: ["3 linked", "5 linked", "None"] },
    { icon: Target, label: "Memory", options: ["On", "Off"] },
    { icon: Doc, label: "Shared files", options: ["12 files", "All files", "None"] },
    { icon: Gear, label: "Sync", options: ["Live", "Hourly", "Manual"] },
  ],
  privacy: [
    { icon: Lock, label: "Model training", options: ["Opted out", "Opted in"] },
    { icon: Doc, label: "History", options: ["30 days", "7 days", "Forever"] },
    { icon: Target, label: "App sharing", options: ["Ask first", "Always", "Never"] },
    { icon: Lock, label: "Encryption", options: ["On", "Off"] },
  ],
};

/** A setting value that cycles through its options on click, sliding the new value in. */
function CycleValue({ options }: { options: string[] }) {
  const [i, setI] = useState(0);
  const value = options[i];
  return (
    <button
      type="button"
      onClick={() => setI((n) => (n + 1) % options.length)}
      className="flex items-center gap-1.5 rounded px-1 text-ink-soft transition-colors hover:text-gold-800"
      aria-label={`Change value, currently ${value}`}
    >
      <span className="relative inline-flex overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 10, opacity: 0, filter: "blur(3px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -10, opacity: 0, filter: "blur(3px)" }}
            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
            className="whitespace-nowrap"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <Chevron className="h-3 w-3 text-muted" />
    </button>
  );
}

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
                  className="flex items-center justify-between py-1.5 pl-3 pr-2 text-[11.5px] transition-colors hover:bg-[#fcf8f1]"
                >
                  <span className="flex items-center gap-2 text-ink-soft">
                    <Icon className="h-3.5 w-3.5 text-muted" />
                    {row.label}
                  </span>
                  <CycleValue options={row.options} />
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

// Last 14 days of spend, drawn as a sparkline under the balance.
const SPEND = [22, 26, 24, 31, 28, 35, 30, 38, 34, 41, 37, 44, 40, 47];
const SPARK_W = 150;
const SPARK_H = 30;
const sparkPoints = SPEND.map((v, i) => {
  const x = (i / (SPEND.length - 1)) * SPARK_W;
  const y = SPARK_H - ((v - 18) / 32) * SPARK_H;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
});
const SPARK_LINE = sparkPoints.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const SPARK_AREA = `${SPARK_LINE} L${SPARK_W} ${SPARK_H} L0 ${SPARK_H} Z`;

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
      <div className="relative overflow-hidden rounded-xl border border-[#efe4d2] bg-white/95 p-4 pb-3 shadow-[0_18px_36px_-24px_rgba(92,62,25,0.45)]">
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
        <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} preserveAspectRatio="none" className="mt-3 h-7 w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#d6a552" stopOpacity="0.35" />
              <stop offset="1" stopColor="#d6a552" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={SPARK_AREA}
            fill="url(#spark-fill)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.8, delay: 1 }}
          />
          <motion.path
            d={SPARK_LINE}
            fill="none"
            stroke="#b8863f"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.2 }}
          />
        </svg>
        <p className="mt-1 text-[10px] text-muted">Spend across 4 apps · last 14 days</p>
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

      <div className="flex flex-col items-center justify-center rounded-xl border border-[#d6e6cf] bg-sage-100 p-4 text-center shadow-[0_18px_36px_-24px_rgba(60,107,63,0.45)]">
        {/* Savings ring */}
        <div className="relative mb-2 h-12 w-12">
          <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="19" fill="none" stroke="#c9dcc1" strokeWidth="4" />
            <circle cx="24" cy="24" r="13.5" fill="none" stroke="#d6e6cf" strokeWidth="1" strokeDasharray="1.5 2.5" />
            <motion.circle
              cx="24"
              cy="24"
              r="19"
              fill="none"
              stroke="#3c6b3f"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 0.42 } : undefined}
              transition={{ duration: 1.8, ease: EASE_OUT }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sage-700">
            <Check className="h-4 w-4" strokeWidth={2.4} />
          </span>
        </div>
        <p className="font-serif text-[1.55rem] leading-none text-sage-700">
          Saved <motion.span className="tabular-nums">{savedText}</motion.span>
        </p>
        <p className="mt-1.5 text-[10.5px] text-[#5c7a5d]">vs. individual pricing</p>
      </div>
    </div>
  );
}

/* ---------- Row 3: the same you, in any app ---------- */

const BURST = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const p = (n: number) => Math.round(n * 100) / 100;
  return { x1: p(12 + Math.cos(a) * 2), y1: p(12 + Math.sin(a) * 2), x2: p(12 + Math.cos(a) * 8), y2: p(12 + Math.sin(a) * 8) };
});

const APPS = [
  // Generic glyphs standing in for AI apps.
  { name: "Code editor", glyph: <path d="M9 6.5v11l9-5.5z" fill="#111" /> },
  {
    name: "Chat assistant",
    glyph: (
      <g stroke="#d9774b" strokeWidth="2.2" strokeLinecap="round">
        {BURST.map((l, i) => (
          <line key={i} {...l} />
        ))}
      </g>
    ),
  },
  {
    name: "Model API",
    glyph: (
      <g fill="none" stroke="#111" strokeWidth="1.5">
        {[0, 60, 120].map((r) => (
          <ellipse key={r} cx="12" cy="12" rx="7.5" ry="3.8" transform={`rotate(${r} 12 12)`} />
        ))}
      </g>
    ),
  },
  {
    name: "Research agent",
    glyph: (
      <path
        d="M12 3.5l2 5.2 5.5-1.7-3.5 4.5 3.5 4.5-5.5-1.7-2 5.2-2-5.2-5.5 1.7 3.5-4.5-3.5-4.5 5.5 1.7z"
        fill="none"
        stroke="#1f8a8a"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "More coming",
    glyph: (
      <g fill="#8a7d6c">
        <circle cx="7" cy="12" r="1.4" />
        <circle cx="12" cy="12" r="1.4" />
        <circle cx="17" cy="12" r="1.4" />
      </g>
    ),
  },
];

function AppsCard() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
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
        {APPS.map((app, i) => (
          <motion.div
            key={app.name}
            className="relative"
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered((h) => (h === i ? null : h))}
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
                {app.glyph}
              </svg>
            </motion.div>
            {/* "Synced" badge pops in after the icon lands */}
            {i < APPS.length - 1 && (
              <motion.span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-sage-700 text-white"
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  show: {
                    scale: 1,
                    opacity: 1,
                    transition: { type: "spring", duration: 0.5, bounce: 0.5, delay: 0.7 + i * 0.12 },
                  },
                }}
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </motion.span>
            )}
            <AnimatePresence>
              {hovered === i && (
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] text-white shadow-lg"
                >
                  {app.name}
                </motion.span>
              )}
            </AnimatePresence>
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
