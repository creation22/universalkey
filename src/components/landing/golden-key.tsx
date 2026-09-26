import { useId } from "react";

type GoldenKeyProps = {
  /** Total height of the key in viewBox units (width is fixed at 120). Longer = slimmer key. */
  length?: number;
  className?: string;
  style?: React.CSSProperties;
};

const BOW = { x: 60, y: 56, r: 32 };

// Beads around the outer ring, skipping the finial at the top and the collar at the bottom.
const BEADS = Array.from({ length: 28 }, (_, i) => (i / 28) * Math.PI * 2)
  .filter((a) => {
    const deg = ((a * 180) / Math.PI + 360) % 360;
    return !(deg > 245 && deg < 295) && !(deg > 65 && deg < 115);
  })
  .map((a) => ({
    x: Math.round((BOW.x + Math.cos(a) * (BOW.r + 5)) * 100) / 100,
    y: Math.round((BOW.y + Math.sin(a) * (BOW.r + 5)) * 100) / 100,
  }));

const PETALS = Array.from({ length: 8 }, (_, i) => i * 45);

/** Ornate antique gold key, drawn as SVG so it can be animated and scaled crisply. */
export function GoldenKey({ length = 400, className, style }: GoldenKeyProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;

  const L = length;
  const shaftTop = 118;
  const bitTop = L - 88;
  const bitBottom = L - 30;

  // A ring drawn in three passes: dark edge, metal body, bright bevel.
  const ring = (cx: number, cy: number, r: number, w: number, key: string) => (
    <g key={key}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#4a2c0b" strokeOpacity="0.55" strokeWidth={w + 1.6} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={url("metal")} strokeWidth={w} />
      <circle
        cx={cx}
        cy={cy}
        r={r - w * 0.18}
        fill="none"
        stroke={url("bevel")}
        strokeWidth={Math.max(0.6, w * 0.28)}
      />
    </g>
  );

  // Same three-pass treatment for open curves (scrollwork).
  const scroll = (d: string, w: number, key: string) => (
    <g key={key} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="#4a2c0b" strokeOpacity="0.5" strokeWidth={w + 1.4} />
      <path d={d} stroke={url("metal")} strokeWidth={w} />
      <path d={d} stroke="#fff4d2" strokeOpacity="0.55" strokeWidth={Math.max(0.5, w * 0.25)} />
    </g>
  );

  const collar = (x: number, y: number, w: number, h: number, key: string) => (
    <g key={key}>
      <rect x={x - 0.8} y={y - 0.8} width={w + 1.6} height={h + 1.6} rx={(h + 1.6) / 2} fill="#4a2c0b" fillOpacity="0.5" />
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={url("shaft")} />
      <rect x={x + 2} y={y + 0.8} width={w - 4} height={Math.max(0.8, h * 0.22)} rx="0.5" fill="#fff4d2" opacity="0.6" />
    </g>
  );

  const bitPath =
    `M64 ${bitTop} H97 V${bitTop + 10} H87 V${bitTop + 18} H99 V${bitTop + 30} H89 V${bitTop + 38} H97 V${bitBottom} H64 Z ` +
    `M81 ${bitTop + 24} a3.2 3.2 0 1 0 -6.4 0 a3.2 3.2 0 1 0 6.4 0 Z`;

  return (
    <svg viewBox={`0 0 120 ${L}`} className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={id("shaft")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5b3810" />
          <stop offset="0.2" stopColor="#b98536" />
          <stop offset="0.4" stopColor="#ffecb4" />
          <stop offset="0.55" stopColor="#e2ad57" />
          <stop offset="0.8" stopColor="#8a5a1c" />
          <stop offset="1" stopColor="#4d2f0c" />
        </linearGradient>
        <linearGradient id={id("metal")} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff3cc" />
          <stop offset="0.22" stopColor="#e7b862" />
          <stop offset="0.48" stopColor="#9a6423" />
          <stop offset="0.7" stopColor="#f4d088" />
          <stop offset="1" stopColor="#6e4515" />
        </linearGradient>
        <linearGradient id={id("bevel")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff8e0" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#fff8e0" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fff8e0" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id={id("jewel")} cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.35" stopColor="#f2c66e" />
          <stop offset="1" stopColor="#7a4a12" />
        </radialGradient>
        <clipPath id={id("shaft-clip")}>
          <rect x="55" y={shaftTop} width="10" height={L - shaftTop - 30} rx="4" />
        </clipPath>
        <filter id={id("shadow")} x="-50%" y="-10%" width="200%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#5c3a12" floodOpacity="0.38" />
        </filter>
      </defs>

      <g filter={url("shadow")}>
        {/* Fleur-de-lis finial */}
        <path d="M60 -2 C65 5 67 11 60 21 C53 11 55 5 60 -2 Z" fill={url("metal")} stroke="#4a2c0b" strokeOpacity="0.45" strokeWidth="0.8" />
        <path d="M59 20 C50 19 43 12 46 5 C50 10 54 14 60 19 Z" fill={url("metal")} stroke="#4a2c0b" strokeOpacity="0.45" strokeWidth="0.8" />
        <path d="M61 20 C70 19 77 12 74 5 C70 10 66 14 60 19 Z" fill={url("metal")} stroke="#4a2c0b" strokeOpacity="0.45" strokeWidth="0.8" />
        <rect x="52" y="19" width="16" height="4" rx="2" fill={url("shaft")} />

        {/* Side scrollwork with curled ends */}
        {scroll("M31 42 C16 36 5 48 10 60 C14 70 26 68 26 60 C26 54 19 53 17 58", 3.2, "sl")}
        {scroll("M89 42 C104 36 115 48 110 60 C106 70 94 68 94 60 C94 54 101 53 103 58", 3.2, "sr")}
        {scroll("M40 82 C33 92 38 101 47 100", 2.6, "bl")}
        {scroll("M80 82 C87 92 82 101 73 100", 2.6, "br")}
        <circle cx="17" cy="58" r="2.6" fill={url("jewel")} />
        <circle cx="103" cy="58" r="2.6" fill={url("jewel")} />
        <circle cx="47" cy="100" r="2" fill={url("jewel")} />
        <circle cx="73" cy="100" r="2" fill={url("jewel")} />

        {/* Beaded outer rim */}
        {BEADS.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r="1.7" fill={url("jewel")} />
        ))}

        {/* Rings: outer band, engraved inner line, quatrefoil */}
        {ring(BOW.x, BOW.y, BOW.r, 5, "outer")}
        <circle cx={BOW.x} cy={BOW.y} r={BOW.r - 6} fill="none" stroke="#b8863f" strokeOpacity="0.8" strokeWidth="1" />
        {ring(BOW.x - 12, BOW.y, 10, 3.2, "q1")}
        {ring(BOW.x + 12, BOW.y, 10, 3.2, "q2")}
        {ring(BOW.x, BOW.y - 12, 10, 3.2, "q3")}
        {ring(BOW.x, BOW.y + 12, 10, 3.2, "q4")}

        {/* Rosette at the heart of the bow */}
        {PETALS.map((deg) => (
          <ellipse
            key={deg}
            cx={BOW.x}
            cy={BOW.y - 6.5}
            rx="1.9"
            ry="4"
            fill={url("metal")}
            transform={`rotate(${deg} ${BOW.x} ${BOW.y})`}
          />
        ))}
        <circle cx={BOW.x} cy={BOW.y} r="4.4" fill={url("jewel")} stroke="#4a2c0b" strokeOpacity="0.4" strokeWidth="0.6" />

        {/* Knot and stacked collars */}
        <circle cx="60" cy="94" r="6.2" fill={url("jewel")} stroke="#4a2c0b" strokeOpacity="0.45" strokeWidth="0.8" />
        {collar(49, 101, 22, 6, "c1")}
        {collar(52, 108.5, 16, 4.5, "c2")}
        {collar(54, 114, 12, 4, "c3")}

        {/* Twisted shaft */}
        <rect x="55" y={shaftTop} width="10" height={L - shaftTop - 30} rx="4" fill={url("shaft")} />
        <g clipPath={url("shaft-clip")} stroke="#fff2c8" strokeOpacity="0.32" strokeWidth="1">
          {Array.from({ length: Math.floor((L - shaftTop - 40) / 7) }, (_, i) => (
            <line key={i} x1="54" y1={shaftTop + 6 + i * 7} x2="66" y2={shaftTop + 12 + i * 7} />
          ))}
        </g>
        {collar(51.5, 150, 17, 6, "s1")}
        {collar(51.5, bitTop - 22, 17, 6, "s2")}
        {collar(53, bitTop - 13, 14, 4, "s3")}

        {/* Bit with notched wards and a pierced hole */}
        <path d={bitPath} fillRule="evenodd" fill={url("shaft")} stroke="#4a2c0b" strokeOpacity="0.45" strokeWidth="0.8" />
        <path d={`M66 ${bitTop + 1.5} H95`} stroke="#fff1c4" strokeOpacity="0.65" strokeWidth="1.2" />
        <circle cx="60" cy={L - 24} r="7" fill={url("jewel")} stroke="#4a2c0b" strokeOpacity="0.45" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
