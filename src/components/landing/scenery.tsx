"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

/** A receding marble arcade, drawn for the left edge. Mirror it for the right. */
export function Colonnade({
  side = "left",
  className = "",
}: {
  side?: "left" | "right";
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const wall = `wall-${uid}`;
  const pillar = `pillar-${uid}`;
  const soffit = `soffit-${uid}`;

  const openings =
    "M60 800 V300 A80 80 0 0 1 220 300 V800 Z M262 800 V385 A45 45 0 0 1 352 385 V800 Z M384 800 V440 A28 28 0 0 1 440 440 V800 Z";

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} ${className}`}
      style={{
        maskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, #000 45%, transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, #000 45%, transparent 100%)`,
      }}
    >
      <svg
        viewBox="0 0 420 800"
        preserveAspectRatio={side === "left" ? "xMinYMax slice" : "xMaxYMax slice"}
        className="h-full w-full"
        style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={wall} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f4e8d4" />
            <stop offset="0.6" stopColor="#ead9bd" />
            <stop offset="1" stopColor="#dfc8a4" />
          </linearGradient>
          <linearGradient id={pillar} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#dcc39c" />
            <stop offset="0.45" stopColor="#fbf3e3" />
            <stop offset="1" stopColor="#e2cba7" />
          </linearGradient>
          <linearGradient id={soffit} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#caa97a" stopOpacity="0.7" />
            <stop offset="1" stopColor="#f6ead6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Far wall, seen through the openings */}
        <path
          d={`M0 0 H420 V800 H0 Z ${openings}`}
          fillRule="evenodd"
          fill={`url(#${wall})`}
          opacity="0.35"
          transform="translate(90 70) scale(0.82)"
        />

        {/* Near wall */}
        <path d={`M0 0 H420 V800 H0 Z ${openings}`} fillRule="evenodd" fill={`url(#${wall})`} />

        {/* Pillars catching the light */}
        <rect x="0" y="0" width="60" height="800" fill={`url(#${pillar})`} />
        <rect x="220" y="160" width="42" height="640" fill={`url(#${pillar})`} />
        <rect x="352" y="260" width="32" height="540" fill={`url(#${pillar})`} opacity="0.9" />

        {/* Arch soffits: the depth of each opening */}
        <g fill="none" strokeLinecap="round">
          <path d="M60 800 V300 A80 80 0 0 1 220 300 V800" stroke={`url(#${soffit})`} strokeWidth="12" />
          <path d="M262 800 V385 A45 45 0 0 1 352 385 V800" stroke={`url(#${soffit})`} strokeWidth="8" />
          <path d="M52 800 V300 A88 88 0 0 1 228 300" stroke="#fffaf0" strokeOpacity="0.7" strokeWidth="2" />
          <path d="M256 800 V385 A51 51 0 0 1 358 385" stroke="#fffaf0" strokeOpacity="0.6" strokeWidth="1.5" />
        </g>

        {/* Capitals */}
        <g fill="#f8eedc" stroke="#d8bf97" strokeWidth="1">
          <rect x="44" y="292" width="24" height="10" rx="2" />
          <rect x="212" y="292" width="58" height="10" rx="2" />
          <rect x="346" y="380" width="44" height="8" rx="2" />
        </g>
        {/* Cornice */}
        <rect x="0" y="120" width="420" height="10" fill="#f9f0e0" opacity="0.8" />
        <rect x="0" y="130" width="420" height="3" fill="#d6bd96" opacity="0.6" />
      </svg>
    </div>
  );
}

/** Slowly turning god-rays with a hot core. */
export function LightRays({
  className = "",
  size = 1500,
  strength = 1,
}: {
  className?: string;
  size?: number;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          opacity: 0.75 * strength,
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,246,222,0.9) 0deg 3deg, rgba(255,246,222,0) 3deg 11deg)",
          maskImage: "radial-gradient(circle, #000 0%, rgba(0,0,0,0.5) 25%, transparent 58%)",
          WebkitMaskImage: "radial-gradient(circle, #000 0%, rgba(0,0,0,0.5) 25%, transparent 58%)",
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 240, ease: "linear", repeat: Infinity }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          opacity: strength,
          background:
            "radial-gradient(circle, rgba(255,253,245,1) 0%, rgba(255,247,228,0.85) 12%, rgba(255,240,210,0.35) 28%, transparent 50%)",
        }}
      />
    </div>
  );
}

const CLOUDS = [
  { left: "8%", top: "6%", w: 520, h: 180, o: 0.75, d: 70, dx: 40 },
  { left: "55%", top: "2%", w: 620, h: 200, o: 0.7, d: 90, dx: -50 },
  { left: "28%", top: "22%", w: 420, h: 140, o: 0.55, d: 80, dx: 30 },
  { left: "70%", top: "24%", w: 380, h: 130, o: 0.5, d: 65, dx: -30 },
];

/** Soft cumulus haze that drifts behind everything. */
export function Clouds({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: c.left,
            top: c.top,
            width: c.w,
            height: c.h,
            opacity: c.o,
            filter: "blur(38px)",
          }}
          animate={reduce ? undefined : { x: [0, c.dx, 0] }}
          transition={{ duration: c.d, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/** Deterministic PRNG so particle layouts match between server and client renders. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeMotes(count: number, seed: number) {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    left: Math.round(rand() * 1000) / 10,
    top: Math.round(rand() * 1000) / 10,
    size: 1.5 + Math.round(rand() * 25) / 10,
    rise: 30 + Math.round(rand() * 60),
    drift: Math.round((rand() - 0.5) * 40),
    duration: 7 + Math.round(rand() * 80) / 10,
    delay: Math.round(rand() * 60) / 10,
  }));
}

/** Specks of dust drifting up through the light. */
export function DustMotes({
  count = 28,
  seed = 7,
  className = "",
}: {
  count?: number;
  seed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const motes = makeMotes(count, seed);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#fff6dc]"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            boxShadow: "0 0 6px 1px rgba(255,236,190,0.9)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [0, -m.rise], x: [0, m.drift] }}
          transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/** Broken marble boulder with veins, for the corners of the scene. */
export function MarbleRock({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const face = `face-${uid}`;
  const side = `side-${uid}`;
  return (
    <svg
      viewBox="0 0 300 170"
      className={`pointer-events-none absolute ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={face} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f3ece0" />
          <stop offset="1" stopColor="#d9c9ae" />
        </linearGradient>
        <linearGradient id={side} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#e9dcc6" />
          <stop offset="1" stopColor="#c4ab86" />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="164" rx="150" ry="10" fill="#7a5a30" opacity="0.18" />
      <path d="M0 170 L0 70 L38 38 L92 28 L118 52 L152 44 L170 80 L140 110 L60 118 Z" fill={`url(#${face})`} />
      <path d="M152 44 L206 60 L248 96 L290 140 L300 170 L0 170 L60 118 L140 110 L170 80 Z" fill={`url(#${side})`} />
      <path d="M170 80 L206 60 L248 96 L220 118 Z" fill="#f6efe3" opacity="0.8" />
      <g fill="none" stroke="#bfa785" strokeWidth="0.9" opacity="0.55">
        <path d="M14 90 C40 84 52 100 80 92 S120 70 146 76" />
        <path d="M60 60 C72 70 90 64 104 74" />
        <path d="M180 120 C200 110 220 130 250 124" />
        <path d="M120 150 C150 136 170 146 200 140" />
      </g>
    </svg>
  );
}
