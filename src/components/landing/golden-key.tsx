import { useId } from "react";

type GoldenKeyProps = {
  /** Total height of the key in viewBox units (width is fixed at 120). Longer = slimmer key. */
  length?: number;
  className?: string;
  style?: React.CSSProperties;
};

/** Ornate antique gold key, drawn as SVG so it can be animated and scaled crisply. */
export function GoldenKey({ length = 400, className, style }: GoldenKeyProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const shaft = `shaft-${uid}`;
  const metal = `metal-${uid}`;
  const rim = `rim-${uid}`;
  const shadow = `shadow-${uid}`;

  const L = length;
  const bitTop = L - 84;
  const bitBottom = L - 30;

  return (
    <svg
      viewBox={`0 0 120 ${L}`}
      className={className}
      style={style}
      aria-hidden="true"
      overflow="visible"
    >
      <defs>
        <linearGradient id={shaft} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5b3810" />
          <stop offset="0.22" stopColor="#b98536" />
          <stop offset="0.42" stopColor="#ffeab0" />
          <stop offset="0.58" stopColor="#d9a44f" />
          <stop offset="0.82" stopColor="#8a5a1c" />
          <stop offset="1" stopColor="#4d2f0c" />
        </linearGradient>
        <linearGradient id={metal} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff2c9" />
          <stop offset="0.25" stopColor="#e3b25e" />
          <stop offset="0.5" stopColor="#9a6423" />
          <stop offset="0.72" stopColor="#f2cd82" />
          <stop offset="1" stopColor="#6e4515" />
        </linearGradient>
        <linearGradient id={rim} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff7dc" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff7dc" stopOpacity="0" />
        </linearGradient>
        <filter id={shadow} x="-50%" y="-10%" width="200%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#5c3a12" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter={`url(#${shadow})`}>
        {/* Bow: finial, trefoil, scrolls, central ring */}
        <g fill="none" stroke={`url(#${metal})`} strokeLinecap="round">
          <circle cx="60" cy="31" r="15" strokeWidth="6" />
          <circle cx="37" cy="54" r="15" strokeWidth="6" />
          <circle cx="83" cy="54" r="15" strokeWidth="6" />
          <circle cx="60" cy="77" r="13" strokeWidth="5.5" />
          <circle cx="60" cy="54" r="9" strokeWidth="5" />
          <path d="M20 66 C8 60 10 42 22 40" strokeWidth="4" />
          <path d="M100 66 C112 60 110 42 98 40" strokeWidth="4" />
          <path d="M44 88 C48 98 72 98 76 88" strokeWidth="4" />
        </g>
        {/* Bevel highlights on the rings */}
        <g fill="none" stroke={`url(#${rim})`} strokeWidth="1.4">
          <circle cx="60" cy="31" r="17.5" />
          <circle cx="37" cy="54" r="17.5" />
          <circle cx="83" cy="54" r="17.5" />
          <circle cx="60" cy="77" r="15.2" />
        </g>
        <circle cx="60" cy="10" r="5.5" fill={`url(#${metal})`} />
        <path d="M60 2 L64 10 L60 18 L56 10 Z" fill={`url(#${metal})`} />
        <circle cx="60" cy="54" r="3.4" fill={`url(#${metal})`} />
        <circle cx="16" cy="46" r="3.2" fill={`url(#${metal})`} />
        <circle cx="104" cy="46" r="3.2" fill={`url(#${metal})`} />

        {/* Collar under the bow */}
        <rect x="47" y="96" width="26" height="9" rx="4.5" fill={`url(#${shaft})`} />
        <rect x="51" y="107" width="18" height="6" rx="3" fill={`url(#${shaft})`} />

        {/* Shaft */}
        <rect x="55" y="112" width="10" height={L - 142} rx="4" fill={`url(#${shaft})`} />
        <rect x="52" y="148" width="16" height="6" rx="3" fill={`url(#${shaft})`} />
        <rect x="52" y={bitTop - 20} width="16" height="6" rx="3" fill={`url(#${shaft})`} />

        {/* Bit with notched wards */}
        <path
          d={`M64 ${bitTop} H90 V${bitTop + 12} H82 V${bitTop + 20} H92 V${bitTop + 34} H80 V${bitTop + 42} H90 V${bitBottom} H64 Z`}
          fill={`url(#${shaft})`}
        />
        <path
          d={`M66 ${bitTop + 2} H88`}
          stroke="#fff1c4"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        <circle cx="60" cy={L - 24} r="7" fill={`url(#${metal})`} />
      </g>
    </svg>
  );
}
