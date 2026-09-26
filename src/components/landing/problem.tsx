"use client";

import { motion } from "motion/react";
import { Check, Doc } from "./icons";
import { EASE_OUT, Reveal, StaggerWords } from "./motion-primitives";

const cardBg =
  "radial-gradient(120% 95% at 72% 8%, #fffaf1 0%, #f4e7d2 55%, #e7d4b5 100%)";

const hoverSpring = { type: "spring", duration: 0.5, bounce: 0.25 } as const;

/*
 * Each card owns three variant states that propagate to its children:
 *   hidden → show (once, on scroll) and show ↔ hover.
 * Entrance and hover live on separate nested elements so the entrance delay
 * never slows down the hover-out.
 */
function ProblemCard({
  title,
  children,
  index,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      whileHover="hover"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay: index * 0.1 } },
      }}
    >
      <motion.article
        variants={{ show: { y: 0, transition: hoverSpring }, hover: { y: -4, transition: hoverSpring } }}
        className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-white/80 shadow-[0_30px_60px_-35px_rgba(92,62,25,0.55),0_2px_6px_rgba(92,62,25,0.08)]"
        style={{ background: cardBg }}
      >
        <h3 className="absolute left-6 top-5 z-10 font-serif text-[1.65rem] leading-[1.05] tracking-[-0.01em] text-ink">
          {title}
        </h3>
        {children}
      </motion.article>
    </motion.div>
  );
}

/* ---------- Card 1: a row of coin purses ---------- */

const PURSES = [
  { base: "#7f7b4b", dark: "#4d4a2a" },
  { base: "#c38c4a", dark: "#7f5423" },
  { base: "#744326", dark: "#3f2210" },
  { base: "#dcc6a2", dark: "#a88c63" },
  { base: "#a9582c", dark: "#6a2f12" },
  { base: "#727849", dark: "#434827" },
];

function Purses() {
  return (
    <>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {PURSES.map((p, i) => (
            <radialGradient key={i} id={`purse-${i}`} cx="0.35" cy="0.3" r="0.9">
              <stop offset="0" stopColor={p.base} stopOpacity="0.85" />
              <stop offset="0.55" stopColor={p.base} />
              <stop offset="1" stopColor={p.dark} />
            </radialGradient>
          ))}
          <linearGradient id="purse-frame" x1="0" x2="1">
            <stop offset="0" stopColor="#8a5a1c" />
            <stop offset="0.5" stopColor="#f6d58f" />
            <stop offset="1" stopColor="#8a5a1c" />
          </linearGradient>
        </defs>
        {PURSES.map((_, i) => {
          const x = 48 + i * 61;
          const tagRight = i % 2 === 0;
          return (
            <motion.g
              key={i}
              variants={{
                hidden: { opacity: 0, y: -26 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", duration: 0.8, bounce: 0.35, delay: 0.25 + i * 0.07 },
                },
              }}
            >
              <motion.g
                variants={{
                  show: { y: 0, transition: hoverSpring },
                  hover: { y: -7, transition: { type: "spring", duration: 0.45, bounce: 0.4, delay: i * 0.035 } },
                }}
              >
                <g transform={`translate(${x} 150)`}>
                  <ellipse cx="0" cy="74" rx="24" ry="4.5" fill="#5b3a17" opacity="0.22" />
                  <path
                    d="M-24 10 C-31 32 -31 60 -18 70 Q0 78 18 70 C31 60 31 32 24 10 Z"
                    fill={`url(#purse-${i})`}
                  />
                  <ellipse cx="-9" cy="34" rx="6" ry="15" fill="#fff" opacity="0.16" />
                  <path d="M-25 11 Q-24 1 0 0 Q24 1 25 11" fill="none" stroke="url(#purse-frame)" strokeWidth="4" />
                  <circle cx="-4" cy="-4" r="3.6" fill="url(#purse-frame)" />
                  <circle cx="4" cy="-4" r="3.6" fill="url(#purse-frame)" />
                  {/* Price tag on a string */}
                  <g transform={tagRight ? "translate(6 -2)" : "translate(-6 -2) scale(-1 1)"}>
                    <path d="M0 0 Q12 8 16 20" fill="none" stroke="#6e5130" strokeWidth="0.8" />
                    <g transform="translate(16 20) rotate(62)">
                      <rect x="0" y="-6" width="26" height="12" rx="2" fill="#fbf4e4" stroke="#d8c3a0" strokeWidth="0.6" />
                      <circle cx="3.5" cy="0" r="1.3" fill="#d8c3a0" />
                      <path d="M8 -1.5 H22 M8 1.8 H18" stroke="#b39b76" strokeWidth="0.8" />
                    </g>
                  </g>
                </g>
              </motion.g>
            </motion.g>
          );
        })}
      </svg>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 8 },
          show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.75 } },
        }}
        className="absolute inset-x-3 bottom-3 flex flex-wrap justify-center gap-1.5"
      >
        {["Cursor credits", "Cline credits", "API credits", "Model credits"].map((c) => (
          <span
            key={c}
            className="rounded-full border border-white bg-white/85 px-2.5 py-1 text-[10.5px] text-ink-soft shadow-[0_2px_6px_rgba(92,62,25,0.12)]"
          >
            {c}
          </span>
        ))}
      </motion.div>
    </>
  );
}

/* ---------- Card 2: a heavy key ring with labelled keys ---------- */

const RING = { x: 214, y: 100 };
const KEYS = [
  { angle: 58, tone: "#6f5530" },
  { angle: 40, tone: "#9b7640" },
  { angle: 22, tone: "#7d5f33" },
  { angle: 6, tone: "#b18a4d" },
  { angle: -10, tone: "#8b6a3a" },
  { angle: -26, tone: "#a3803f" },
  { angle: -44, tone: "#76592f" },
];
const TAGS = [
  { x: 262, y: 108, r: 4, label: "OPENAI_API_KEY", w: 108 },
  { x: 258, y: 146, r: 18, label: "ANTHROPIC_API_KEY", w: 128 },
  { x: 244, y: 184, r: 36, label: "GROQ_API_KEY", w: 96 },
  { x: 176, y: 172, r: 78, label: "GEMINI_API_KEY", w: 108 },
];
// Pivot where the ring hangs from its hook, as a fraction of the 400×300 card.
const PIVOT = { x: RING.x / 400, y: (RING.y - 26) / 300 };

function KeyRing() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ originX: PIVOT.x, originY: PIVOT.y }}
      variants={{
        hidden: { rotate: -9, opacity: 0 },
        show: { rotate: 0, opacity: 1, transition: { type: "spring", duration: 1.2, bounce: 0.45, delay: 0.3 } },
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ originX: PIVOT.x, originY: PIVOT.y }}
        variants={{
          show: { rotate: 0, transition: hoverSpring },
          hover: { rotate: [0, -5, 4, -2.5, 1, 0], transition: { duration: 0.9, ease: "easeOut" } },
        }}
      >
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="ring-metal" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f8dfa0" />
              <stop offset="0.5" stopColor="#9d6c2b" />
              <stop offset="1" stopColor="#e8c37b" />
            </linearGradient>
            <filter id="ring-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#4a2f10" floodOpacity="0.35" />
            </filter>
          </defs>
          <g filter="url(#ring-shadow)">
            <path d={`M${RING.x} 30 V${RING.y - 26}`} stroke="#b89560" strokeWidth="2" />
            {KEYS.map((k, i) => (
              <g key={i} transform={`translate(${RING.x} ${RING.y + 22}) rotate(${k.angle})`}>
                <circle cx="0" cy="12" r="9" fill="none" stroke={k.tone} strokeWidth="4.5" />
                <rect x="-2.6" y="20" width="5.2" height="108" rx="2" fill={k.tone} />
                <rect x="-2.6" y="20" width="1.6" height="108" fill="#f3d9a3" opacity="0.45" />
                <path d="M2 104 H14 V110 H9 V116 H15 V124 H2 Z" fill={k.tone} />
              </g>
            ))}
            <circle cx={RING.x} cy={RING.y} r="26" fill="none" stroke="url(#ring-metal)" strokeWidth="5" />
            {TAGS.map((t) => (
              <g key={t.label}>
                <path
                  d={`M${RING.x + 10} ${RING.y + 22} Q${(RING.x + t.x) / 2 + 6} ${(RING.y + t.y) / 2 + 20} ${t.x} ${t.y}`}
                  fill="none"
                  stroke="#8a6a3e"
                  strokeWidth="0.9"
                />
                <g transform={`translate(${t.x} ${t.y}) rotate(${t.r})`}>
                  <rect x="0" y="-11" width={t.w} height="22" rx="3" fill="#f6e3bd" stroke="#caa66b" strokeWidth="0.8" />
                  <circle cx="7" cy="0" r="2.2" fill="#fff8e8" stroke="#b89560" strokeWidth="0.7" />
                  <text
                    x="15"
                    y="3.2"
                    fontSize="8.6"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    fontWeight="600"
                    fill="#3b2a18"
                    letterSpacing="0.2"
                  >
                    {t.label}
                  </text>
                </g>
              </g>
            ))}
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Card 3: a fresh stack of paper and a checklist ---------- */

const CHECKLIST = [
  { label: "Instructions", icon: "check" },
  { label: "Default tools", icon: "check" },
  { label: ".cursorrules", icon: "doc" },
  { label: "Privacy settings", icon: "check" },
] as const;

const SHEET_JITTER = [0, 3, -2, 4, 1, -3, 2, 0, -1, 3, -2, 1, 4, -1, 2, 0];

function PaperStack() {
  return (
    <>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="ink-glass" x1="0" x2="1">
            <stop offset="0" stopColor="#2a1c10" />
            <stop offset="0.4" stopColor="#5a3d22" />
            <stop offset="1" stopColor="#1f140a" />
          </linearGradient>
          <linearGradient id="brass" x1="0" x2="1">
            <stop offset="0" stopColor="#8a5a1c" />
            <stop offset="0.5" stopColor="#f3cf83" />
            <stop offset="1" stopColor="#8a5a1c" />
          </linearGradient>
        </defs>
        <ellipse cx="130" cy="292" rx="130" ry="10" fill="#6b4a22" opacity="0.18" />
        {SHEET_JITTER.map((jitter, i) => (
          <motion.g
            key={i}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.2 + i * 0.025 } },
            }}
          >
            <motion.g
              variants={{
                show: { x: 0, transition: hoverSpring },
                hover: { x: i > 11 ? (i - 11) * 2.5 : 0, transition: hoverSpring },
              }}
            >
              <rect
                x={10 + jitter}
                y={286 - i * 5.2}
                width="228"
                height="6"
                rx="1"
                fill={i % 2 ? "#fbf6ec" : "#efe5d3"}
                stroke="#dccdb3"
                strokeWidth="0.5"
              />
            </motion.g>
          </motion.g>
        ))}
        {/* Top sheet */}
        <motion.g
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.65 } } }}
        >
          <motion.path
            d="M14 202 L240 198 L252 204 L24 208 Z"
            fill="#fffdf8"
            stroke="#e2d4bb"
            strokeWidth="0.6"
            variants={{
              show: { x: 0, rotate: 0, transition: hoverSpring },
              hover: { x: 12, rotate: -1.5, transition: hoverSpring },
            }}
          />
        </motion.g>
        {/* Inkwell and quill */}
        <path d="M370 150 C352 180 344 212 342 250" fill="none" stroke="#e9dcc3" strokeWidth="2" />
        <path d="M370 150 C360 170 354 186 350 206 C362 190 372 172 376 152 Z" fill="#f7efe0" opacity="0.95" />
        <path d="M370 150 C358 166 350 184 346 200 C352 186 358 170 368 156 Z" fill="#e3d4b8" />
        <path d="M322 262 C318 246 326 236 344 234 C362 236 370 246 366 262 C360 276 328 276 322 262 Z" fill="url(#ink-glass)" />
        <ellipse cx="344" cy="236" rx="16" ry="5" fill="url(#brass)" />
        <path d="M334 246 C333 254 336 262 342 266" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
      </svg>
      <div className="absolute right-4 top-[18%] flex flex-col items-end gap-1.5 md:right-5">
        {CHECKLIST.map((item, i) => (
          <motion.div
            key={item.label}
            variants={{
              hidden: { opacity: 0, x: 18 },
              show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.45 + i * 0.09 } },
            }}
          >
            <motion.div
              variants={{
                show: { x: 0, transition: hoverSpring },
                hover: { x: -4, transition: { ...hoverSpring, delay: i * 0.03 } },
              }}
              className="flex w-[118px] items-center gap-1.5 rounded-md border border-white bg-white/90 px-2 py-1.5 text-[10.5px] text-ink-soft shadow-[0_4px_10px_-4px_rgba(92,62,25,0.25)]"
            >
              {item.icon === "check" ? (
                <Check className="h-3 w-3 text-gold-600" />
              ) : (
                <Doc className="h-3 w-3 text-gold-600" />
              )}
              {item.label}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export function Problem() {
  return (
    <section className="relative bg-paper px-5 pb-16 pt-14 md:pb-20 md:pt-16">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="text-center">
          <p className="eyebrow">The problem</p>
        </Reveal>
        <h2 className="mt-3 text-center font-serif text-[2.1rem] leading-tight tracking-[-0.015em] md:text-5xl">
          <StaggerWords text="Every AI app makes you start again." inView stagger={0.05} />
        </h2>

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          <ProblemCard index={0} title={<>Too many<br />subscriptions.</>}>
            <Purses />
          </ProblemCard>
          <ProblemCard index={1} title={<>Too many<br />API keys.</>}>
            <KeyRing />
          </ProblemCard>
          <ProblemCard index={2} title={<>Another<br />blank slate.</>}>
            <PaperStack />
          </ProblemCard>
        </div>
      </div>
    </section>
  );
}
