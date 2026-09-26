"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";

/*
 * The hero backdrop: a sunlit marble arcade receding toward a vanishing point
 * behind the key, drawn once for the left side and mirrored for the right.
 * Composed on a 1440×640 canvas, anchored to the bottom so the floor and
 * boulders stay put on wide screens.
 */

const W = 1440;
const H = 640;
const VX = W / 2;
const VY = 318;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const wallTop = (x: number) => lerp(-70, VY, x / VX);
const wallFloor = (x: number) => lerp(650, VY, x / VX);
const springAt = (x: number) => wallFloor(x) - (wallFloor(x) - wallTop(x)) * 0.56;
const depth = (x: number) => (wallFloor(x) - wallTop(x)) / 720;
const r = (n: number) => Math.round(n * 10) / 10;

// Column edges from the viewer's side toward the vanishing point, compressing with distance.
const COLUMNS: [number, number][] = [
  [-20, 46],
  [228, 270],
  [356, 380],
  [420, 434],
  [456, 464],
  [477, 482],
  [490, 493],
];
const WALL_END = 495;

const archPath = (xl: number, xr: number, close = true) => {
  const rx = (xr - xl) / 2;
  return `M${r(xl)} ${r(wallFloor(xl))} V${r(springAt(xl))} A${r(rx)} ${r(rx * 1.05)} 0 0 1 ${r(xr)} ${r(springAt(xr))} V${r(wallFloor(xr))}${close ? " Z" : ""}`;
};

const OPENINGS = COLUMNS.slice(0, -1).map(([, xl], i) => [xl, COLUMNS[i + 1][0]] as const);

const WALL =
  `M-20 ${r(wallTop(-20))} L${WALL_END} ${r(wallTop(WALL_END))} L${WALL_END} ${r(wallFloor(WALL_END))} L-20 ${r(wallFloor(-20))} Z ` +
  OPENINGS.map(([xl, xr]) => archPath(xl, xr)).join(" ");

const quad = (a: number, b: number, fa: (x: number) => number, fb: (x: number) => number) =>
  `M${a} ${r(fa(a))} L${b} ${r(fa(b))} L${b} ${r(fb(b))} L${a} ${r(fb(a))} Z`;

const FLOOR_TOP = wallFloor(WALL_END);
const FLOOR = `M-20 ${r(wallFloor(-20))} L${WALL_END} ${r(FLOOR_TOP)} L${W - WALL_END} ${r(FLOOR_TOP)} L${W + 20} ${r(wallFloor(-20))} L${W + 20} ${H + 40} L-20 ${H + 40} Z`;

const CLOUD_PUFFS: [number, number, number][] = [
  [520, 250, 55],
  [575, 205, 75],
  [650, 170, 92],
  [740, 150, 104],
  [835, 175, 86],
  [905, 215, 66],
  [955, 255, 46],
  [610, 255, 70],
  [700, 245, 90],
  [800, 250, 84],
  [880, 268, 56],
];
const HIGH_CLOUDS: [number, number, number][] = [
  [380, 70, 90],
  [470, 40, 70],
  [1000, 60, 100],
  [1090, 95, 70],
  [720, 20, 130],
];

function Arcade({ id }: { id: string }) {
  return (
    <g mask={`url(#${id}-fade)`}>
      <path d={WALL} fillRule="evenodd" fill={`url(#${id}-wall)`} />

      {/* Arch soffits: the thickness of the wall inside each opening */}
      {OPENINGS.map(([xl, xr], i) => (
        <g key={i} fill="none">
          <path
            d={archPath(xl, xr, false)}
            stroke="#c9a978"
            strokeOpacity="0.55"
            strokeWidth={r(14 * depth(xl))}
          />
          <path
            d={archPath(xl - 5 * depth(xl), xr + 5 * depth(xr), false)}
            stroke="#fffaf0"
            strokeOpacity="0.85"
            strokeWidth={r(Math.max(1, 2.4 * depth(xl)))}
          />
        </g>
      ))}

      {/* Columns catching the light */}
      {COLUMNS.map(([a, b], i) => {
        const s = depth(a);
        return (
          <g key={i}>
            <path d={quad(a, b, wallTop, wallFloor)} fill={`url(#${id}-pillar)`} />
            {/* Capital */}
            <path
              d={quad(
                a - 6 * s,
                b + 6 * s,
                (x) => springAt(x) - 9 * depth(x),
                (x) => springAt(x) + 3 * depth(x),
              )}
              fill="#fbf4e6"
              stroke="#d5ba90"
              strokeWidth={r(Math.max(0.5, s))}
            />
            {/* Plinth */}
            <path
              d={quad(a - 5 * s, b + 5 * s, (x) => wallFloor(x) - 26 * depth(x), wallFloor)}
              fill="#efe1c8"
              stroke="#d8c09a"
              strokeWidth={r(Math.max(0.5, s))}
            />
          </g>
        );
      })}

      {/* Entablature line */}
      <path
        d={`M-20 ${r(lerp(wallTop(-20), wallFloor(-20), 0.08))} L${WALL_END} ${r(lerp(wallTop(WALL_END), wallFloor(WALL_END), 0.08))}`}
        stroke="#fff8ea"
        strokeOpacity="0.8"
        strokeWidth="3"
      />
      <path
        d={`M-20 ${r(lerp(wallTop(-20), wallFloor(-20), 0.1))} L${WALL_END} ${r(lerp(wallTop(WALL_END), wallFloor(WALL_END), 0.1))}`}
        stroke="#cfb286"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
    </g>
  );
}

function Boulders({ id }: { id: string }) {
  return (
    <g>
      <ellipse cx="120" cy="642" rx="170" ry="14" fill="#6b4a22" opacity="0.18" filter={`url(#${id}-soft)`} />
      {/* Broken marble block: lit top plane, a bright side facet and a shaded front */}
      <path
        d="M-30 645 L-30 522 L8 496 L56 490 L92 474 L140 482 L178 504 L212 542 L232 590 L240 645 Z"
        fill={`url(#${id}-rock-side)`}
      />
      <path
        d="M-30 522 L8 496 L56 490 L92 474 L140 482 L178 504 L150 516 L98 518 L42 524 L-30 534 Z"
        fill={`url(#${id}-rock-top)`}
      />
      <path d="M178 504 L212 542 L232 590 L198 572 L166 532 Z" fill="#fbf7ef" />
      <path d="M166 532 L198 572 L232 590 L240 645 L150 645 L156 580 Z" fill="#e2d4bd" opacity="0.8" />
      <path d="M-30 534 L42 524 L98 518 L150 516 L166 532 L156 580 L90 560 L20 566 L-30 578 Z" fill="#f6f0e6" opacity="0.7" />
      {/* Fallen chip */}
      <path d="M196 645 L204 620 L234 606 L262 614 L280 645 Z" fill={`url(#${id}-rock-side)`} />
      <path d="M204 620 L234 606 L262 614 L246 624 L214 628 Z" fill="#fffdf8" />
      {/* Veins */}
      <g fill="none" stroke="#b8a07c" strokeWidth="0.9" opacity="0.55">
        <path d="M-20 556 C14 548 44 566 80 556 S140 534 170 548" />
        <path d="M10 610 C50 596 84 614 120 604 S178 590 210 600" />
        <path d="M70 492 C88 500 110 494 128 502" />
        <path d="M184 528 C196 546 204 560 222 574" />
      </g>
    </g>
  );
}

export function HeroScene({
  arcadeY,
  cloudsY,
}: {
  arcadeY: MotionValue<number>;
  cloudsY: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const id = "hero";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-sky`} cx={VX} cy="150" r="980" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="0.3" stopColor="#fcf3e3" />
          <stop offset="0.7" stopColor="#f3e2c5" />
          <stop offset="1" stopColor="#e9d3ae" />
        </radialGradient>
        <linearGradient id={`${id}-wall`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6ecdb" />
          <stop offset="0.55" stopColor="#efe0c6" />
          <stop offset="1" stopColor="#e3cca6" />
        </linearGradient>
        <linearGradient id={`${id}-pillar`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#d6ba8f" />
          <stop offset="0.35" stopColor="#fbf4e6" />
          <stop offset="0.6" stopColor="#fffbf3" />
          <stop offset="1" stopColor="#dcc39c" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" x2="0" y1={FLOOR_TOP} y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#faf1e2" />
          <stop offset="0.5" stopColor="#f2e3ca" />
          <stop offset="1" stopColor="#e8d5b5" />
        </linearGradient>
        <linearGradient id={`${id}-rock-top`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f1e9dc" />
        </linearGradient>
        <linearGradient id={`${id}-rock-side`} x1="0" x2="0.4" y1="0" y2="1">
          <stop offset="0" stopColor="#f5eee3" />
          <stop offset="0.6" stopColor="#e6d8c2" />
          <stop offset="1" stopColor="#d3bd9b" />
        </linearGradient>
        <linearGradient id={`${id}-fade-grad`} x1="0" x2={WALL_END + 20} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
        <mask id={`${id}-fade`} maskUnits="userSpaceOnUse" x="-40" y="-100" width={WALL_END + 80} height={H + 200}>
          <rect x="-40" y="-100" width={WALL_END + 80} height={H + 200} fill={`url(#${id}-fade-grad)`} />
        </mask>
        <clipPath id={`${id}-floor-clip`}>
          <path d={FLOOR} />
        </clipPath>
        <filter id={`${id}-cloud`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <filter id={`${id}-soft`} x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>

      <rect x="-20" y="-20" width={W + 40} height={H + 60} fill={`url(#${id}-sky)`} />

      {/* Cumulus behind the key */}
      <motion.g style={{ y: cloudsY }}>
        <motion.g
          animate={reduce ? undefined : { x: [0, 26, 0] }}
          transition={{ duration: 40, ease: "easeInOut", repeat: Infinity }}
          filter={`url(#${id}-cloud)`}
        >
          {HIGH_CLOUDS.map(([cx, cy, rad], i) => (
            <circle key={`h${i}`} cx={cx} cy={cy} r={rad} fill="#fff" opacity="0.55" />
          ))}
          {CLOUD_PUFFS.map(([cx, cy, rad], i) => (
            <circle key={i} cx={cx} cy={cy} r={rad} fill="#fff" opacity="0.88" />
          ))}
        </motion.g>
      </motion.g>

      {/* Marble floor with converging joints and a pool of reflected light */}
      <path d={FLOOR} fill={`url(#${id}-floor)`} />
      <g clipPath={`url(#${id}-floor-clip)`}>
        <g stroke="#c8ab80" strokeOpacity="0.22" strokeWidth="1">
          {[-900, -420, -40, 300, 560, 880, 1140, 1480, 1860, 2340].map((x) => (
            <line key={x} x1={VX} y1={VY} x2={x} y2={H + 40} />
          ))}
        </g>
        <g stroke="#c8ab80" strokeOpacity="0.14" strokeWidth="1">
          {[448, 478, 520, 578].map((y) => (
            <line key={y} x1="0" y1={y} x2={W} y2={y} />
          ))}
        </g>
        <ellipse cx={VX} cy="560" rx="300" ry="90" fill="#fffdf6" opacity="0.8" filter={`url(#${id}-glow)`} />
      </g>

      {/* Arcades */}
      <motion.g style={{ y: arcadeY }}>
        <Arcade id={id} />
        <g transform={`translate(${W} 0) scale(-1 1)`}>
          <Arcade id={id} />
        </g>
      </motion.g>

      {/* Boulders in the corners */}
      <Boulders id={id} />
      <g transform={`translate(${W} 6) scale(-1 1)`}>
        <Boulders id={id} />
      </g>
    </svg>
  );
}
