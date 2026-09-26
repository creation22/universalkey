"use client";

import { motion } from "motion/react";
import { Check, Doc } from "./icons";
import { EASE_OUT, Reveal, StaggerWords, useTilt } from "./motion-primitives";

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
  const tilt = useTilt(4);
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
        {...tilt.handlers}
        style={{ ...tilt.style, background: cardBg }}
        variants={{ show: { y: 0, transition: hoverSpring }, hover: { y: -5, transition: hoverSpring } }}
        className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-white/80 shadow-[0_30px_60px_-35px_rgba(92,62,25,0.55),0_2px_6px_rgba(92,62,25,0.08)] transition-shadow duration-300 hover:shadow-[0_40px_70px_-35px_rgba(92,62,25,0.65),0_2px_6px_rgba(92,62,25,0.08)]"
      >
        {/* Cursor spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{ background: tilt.spotlight }}
          variants={{ show: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
        />
        <h3 className="absolute left-6 top-5 z-10 font-serif text-[1.65rem] leading-[1.05] tracking-[-0.01em] text-ink">
          {title}
        </h3>
        {children}
      </motion.article>
    </motion.div>
  );
}

/* ---------- Card 1: a row of kiss-lock coin purses ---------- */

const PURSES = [
  { base: "#7f7b4b", dark: "#4a4726" },
  { base: "#c38c4a", dark: "#7a4f20" },
  { base: "#744326", dark: "#3b200e" },
  { base: "#dcc6a2", dark: "#a2855b" },
  { base: "#a9582c", dark: "#652c10" },
  { base: "#727849", dark: "#404524" },
];

const PURSE_BODY = "M-22 10 C-31 26 -33 52 -24 66 Q0 79 24 66 C33 52 31 26 22 10 Z";
const PURSE_STITCH = "M-19 14 C-27 28 -29 50 -21 62 Q0 73 21 62 C29 50 27 28 19 14";

function Purses() {
  return (
    <>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {PURSES.map((p, i) => (
            <radialGradient key={i} id={`purse-${i}`} cx="0.32" cy="0.28" r="0.95">
              <stop offset="0" stopColor={p.base} stopOpacity="0.8" />
              <stop offset="0.5" stopColor={p.base} />
              <stop offset="1" stopColor={p.dark} />
            </radialGradient>
          ))}
          <linearGradient id="purse-frame" x1="0" x2="1">
            <stop offset="0" stopColor="#7a4d18" />
            <stop offset="0.3" stopColor="#e9c67e" />
            <stop offset="0.5" stopColor="#fff0c2" />
            <stop offset="0.7" stopColor="#d9ac5c" />
            <stop offset="1" stopColor="#7a4d18" />
          </linearGradient>
          <radialGradient id="purse-ball" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fffbe6" />
            <stop offset="0.4" stopColor="#e8bd6a" />
            <stop offset="1" stopColor="#6e4515" />
          </radialGradient>
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
                  <ellipse cx="0" cy="75" rx="25" ry="4.5" fill="#5b3a17" opacity="0.24" />
                  <path d={PURSE_BODY} fill={`url(#purse-${i})`} />
                  {/* Gathered pleats under the frame */}
                  <g stroke="#000" strokeOpacity="0.14" strokeWidth="0.9" fill="none">
                    <path d="M-12 12 Q-13 20 -10 26" />
                    <path d="M-4 12 Q-4 19 -2 24" />
                    <path d="M5 12 Q5 19 3 24" />
                    <path d="M13 12 Q14 20 11 26" />
                  </g>
                  <path d={PURSE_STITCH} fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="0.8" strokeDasharray="2 2" />
                  <ellipse cx="-10" cy="36" rx="6" ry="15" fill="#fff" opacity="0.14" />
                  {/* Frame and kiss-lock clasp */}
                  <path d="M-23 11 Q-23 1 0 0 Q23 1 23 11" fill="none" stroke="#4a2c0b" strokeOpacity="0.45" strokeWidth="5.4" />
                  <path d="M-23 11 Q-23 1 0 0 Q23 1 23 11" fill="none" stroke="url(#purse-frame)" strokeWidth="4" />
                  <path d="M-21 9 Q-21 3 0 2.2 Q21 3 21 9" fill="none" stroke="#fff6d8" strokeOpacity="0.6" strokeWidth="0.8" />
                  <path d="M-3 0 L-1 -6" stroke="url(#purse-frame)" strokeWidth="1.6" />
                  <path d="M3 0 L1 -6" stroke="url(#purse-frame)" strokeWidth="1.6" />
                  <circle cx="-2.4" cy="-7" r="3.4" fill="url(#purse-ball)" />
                  <circle cx="2.4" cy="-7.6" r="3.4" fill="url(#purse-ball)" />
                  {/* Price tag on a string */}
                  <g transform={tagRight ? "translate(6 -2)" : "translate(-6 -2) scale(-1 1)"}>
                    <path d="M0 0 Q12 8 16 20" fill="none" stroke="#6e5130" strokeWidth="0.8" />
                    <g transform="translate(16 20) rotate(62)">
                      <rect x="0" y="-6" width="26" height="12" rx="2" fill="#fbf4e4" stroke="#d8c3a0" strokeWidth="0.6" />
                      <circle cx="3.5" cy="0" r="1.3" fill="#fff" stroke="#c2a57a" strokeWidth="0.5" />
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
        className="absolute inset-x-3 bottom-3 z-10 flex flex-wrap justify-center gap-1.5"
      >
        {["Cursor credits", "Cline credits", "API credits", "Model credits"].map((c) => (
          <span
            key={c}
            className="rounded-full border border-white bg-white/85 px-2.5 py-1 text-[10.5px] text-ink-soft shadow-[0_2px_6px_rgba(92,62,25,0.12)] backdrop-blur-sm"
          >
            {c}
          </span>
        ))}
      </motion.div>
    </>
  );
}

/* ---------- Card 2: a heavy split ring of ornate keys ---------- */

const RING = { x: 214, y: 100, r: 26 };
type Bow = "ring" | "trefoil" | "clover" | "diamond";
const KEYS: { angle: number; tone: 0 | 1 | 2; bow: Bow; len: number }[] = [
  { angle: 58, tone: 0, bow: "ring", len: 100 },
  { angle: 40, tone: 1, bow: "clover", len: 112 },
  { angle: 22, tone: 2, bow: "trefoil", len: 104 },
  { angle: 6, tone: 1, bow: "diamond", len: 116 },
  { angle: -10, tone: 0, bow: "clover", len: 108 },
  { angle: -26, tone: 2, bow: "ring", len: 100 },
  { angle: -44, tone: 1, bow: "trefoil", len: 106 },
];
const TAGS = [
  { x: 262, y: 108, r: 4, label: "OPENAI_API_KEY", w: 108 },
  { x: 258, y: 146, r: 18, label: "ANTHROPIC_API_KEY", w: 128 },
  { x: 244, y: 184, r: 36, label: "GROQ_API_KEY", w: 96 },
  { x: 176, y: 172, r: 78, label: "GEMINI_API_KEY", w: 108 },
];
// Pivot where the ring hangs from its hook, as a fraction of the 400×300 card.
const PIVOT = { x: RING.x / 400, y: (RING.y - RING.r) / 300 };

function KeyBow({ kind, tone }: { kind: Bow; tone: number }) {
  const stroke = `url(#brass-${tone})`;
  const common = { fill: "none", stroke, strokeWidth: 3.2 } as const;
  switch (kind) {
    case "ring":
      return <circle cx="0" cy="13" r="8.5" {...common} />;
    case "trefoil":
      return (
        <g {...common} strokeWidth={2.6}>
          <circle cx="0" cy="8" r="5" />
          <circle cx="-5.5" cy="15" r="5" />
          <circle cx="5.5" cy="15" r="5" />
        </g>
      );
    case "clover":
      return (
        <g {...common} strokeWidth={2.4}>
          <circle cx="0" cy="7.5" r="4.4" />
          <circle cx="-6" cy="13.5" r="4.4" />
          <circle cx="6" cy="13.5" r="4.4" />
          <circle cx="0" cy="19" r="3.6" />
        </g>
      );
    case "diamond":
      return <path d="M0 3 L9 13 L0 23 L-9 13 Z M0 8 L4.5 13 L0 18 L-4.5 13 Z" fill={stroke} fillRule="evenodd" />;
  }
}

function MiniKey({ angle, tone, bow, len, i }: (typeof KEYS)[number] & { i: number }) {
  return (
    <g transform={`translate(${RING.x} ${RING.y + RING.r - 4}) rotate(${angle})`}>
      <motion.g
        style={{ originX: "50%", originY: "0%" }}
        variants={{
          show: { rotate: 0, transition: hoverSpring },
          hover: {
            rotate: [0, i % 2 ? 7 : -7, i % 2 ? -4 : 4, 0],
            transition: { duration: 1.1, ease: "easeOut", delay: i * 0.04 },
          },
        }}
      >
        {/* Jump ring linking the key to the split ring */}
        <circle cx="0" cy="0" r="3.4" fill="none" stroke="url(#ring-metal)" strokeWidth="1.6" />
        <g transform="translate(0 2)">
          <KeyBow kind={bow} tone={tone} />
          <rect x="-3.8" y="21" width="7.6" height="4" rx="2" fill={`url(#brass-${tone})`} />
          <rect x="-2.6" y="24" width="5.2" height={len - 24} rx="2" fill={`url(#brass-${tone})`} />
          <rect x="-2.6" y="24" width="1.4" height={len - 24} fill="#fff1c4" opacity="0.45" />
          <rect x="-3.4" y={len - 30} width="6.8" height="3" rx="1.5" fill={`url(#brass-${tone})`} />
          <path
            d={`M2 ${len - 20} H14 V${len - 14} H9 V${len - 9} H15 V${len - 2} H2 Z`}
            fill={`url(#brass-${tone})`}
          />
        </g>
      </motion.g>
    </g>
  );
}

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
          hover: { rotate: [0, -4, 3, -1.5, 0], transition: { duration: 1, ease: "easeOut" } },
        }}
      >
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="ring-metal" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#fff0c2" />
              <stop offset="0.3" stopColor="#dcae5c" />
              <stop offset="0.55" stopColor="#8f5f24" />
              <stop offset="0.8" stopColor="#efcb82" />
              <stop offset="1" stopColor="#7a4d18" />
            </linearGradient>
            {[
              ["#5e4526", "#b99356", "#7a5a30"],
              ["#6d4d22", "#d4a85c", "#8a6230"],
              ["#4f3a20", "#a88449", "#6a4e2a"],
            ].map(([a, b, c], t) => (
              <linearGradient key={t} id={`brass-${t}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor={a} />
                <stop offset="0.45" stopColor={b} />
                <stop offset="1" stopColor={c} />
              </linearGradient>
            ))}
            <filter id="ring-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#4a2f10" floodOpacity="0.35" />
            </filter>
          </defs>
          <g filter="url(#ring-shadow)">
            {/* Hook and chain */}
            <path d={`M${RING.x} 22 V${RING.y - RING.r - 6}`} stroke="#b89560" strokeWidth="2" />
            <ellipse cx={RING.x} cy={RING.y - RING.r - 4} rx="3" ry="5" fill="none" stroke="url(#ring-metal)" strokeWidth="1.6" />

            {KEYS.map((k, i) => (
              <MiniKey key={i} {...k} i={i} />
            ))}

            {/* Split ring: two coils, with the overlap visible at the top */}
            <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke="#4a2c0b" strokeOpacity="0.5" strokeWidth="4.2" />
            <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke="url(#ring-metal)" strokeWidth="3" />
            <circle cx={RING.x} cy={RING.y} r={RING.r - 3.2} fill="none" stroke="#4a2c0b" strokeOpacity="0.45" strokeWidth="3.6" />
            <circle cx={RING.x} cy={RING.y} r={RING.r - 3.2} fill="none" stroke="url(#ring-metal)" strokeWidth="2.6" />
            <circle cx={RING.x} cy={RING.y} r={RING.r + 0.6} fill="none" stroke="#fff6d8" strokeOpacity="0.55" strokeWidth="0.7" strokeDasharray="30 12 8 60" />
            <path
              d={`M${RING.x - 8} ${RING.y - RING.r + 1.4} Q${RING.x} ${RING.y - RING.r - 2.5} ${RING.x + 9} ${RING.y - RING.r + 3.6}`}
              fill="none"
              stroke="url(#ring-metal)"
              strokeWidth="2.8"
            />

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
                  <rect x="1.5" y="-9.5" width={t.w - 3} height="19" rx="2" fill="none" stroke="#e0c08a" strokeWidth="0.5" />
                  <circle cx="7" cy="0" r="2.8" fill="none" stroke="url(#ring-metal)" strokeWidth="1.3" />
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
        <g stroke="#d8c7a8" strokeWidth="0.5" opacity="0.8">
          <path d="M366 160 L374 156" />
          <path d="M362 170 L372 164" />
          <path d="M358 180 L369 174" />
          <path d="M355 190 L366 184" />
        </g>
        <path d="M322 262 C318 246 326 236 344 234 C362 236 370 246 366 262 C360 276 328 276 322 262 Z" fill="url(#ink-glass)" />
        <ellipse cx="344" cy="236" rx="16" ry="5" fill="url(#brass)" />
        <path d="M334 246 C333 254 336 262 342 266" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
      </svg>
      <div className="absolute right-4 top-[18%] z-10 flex flex-col items-end gap-1.5 md:right-5">
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
