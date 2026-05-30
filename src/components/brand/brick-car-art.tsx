import { useId } from "react";

/* ── hex shade helpers ─────────────────────────────────────── */
function clamp(n: number) {
  return Math.max(0, Math.min(255, n));
}
function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const f = (c: number) => clamp(Math.round(c + (amt > 0 ? (255 - c) * amt : c * amt))).toString(16).padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}

/**
 * Premium studded brick-car illustration.
 * A clean 3/4-profile model car built from bricks, with sheen, stud row,
 * brick seams, wheels and a soft ground shadow. Fully driven by `color`.
 * Used anywhere a product appears (cards, cart, category tiles, community).
 */
export function BrickCarArt({
  color = "#E11D2A",
  className,
  shadow = true,
}: {
  color?: string;
  className?: string;
  shadow?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const light = shade(color, 0.32);
  const dark = shade(color, -0.28);
  const deep = shade(color, -0.48);
  const stud = shade(color, 0.18);

  // stud positions along the bonnet + roof
  const studs = [54, 78, 102, 168, 192, 216, 240];

  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Brick-built car model"
    >
      <defs>
        <linearGradient id={`body-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cfe3ff" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#2b3a55" />
          <stop offset="1" stopColor="#0c1320" />
        </linearGradient>
        <radialGradient id={`floor-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      {shadow && <ellipse cx="160" cy="176" rx="120" ry="16" fill={`url(#floor-${id})`} />}

      {/* lower chassis / side skirt */}
      <path
        d="M40 132 q-6 0 -6 -8 l0 -6 q0 -6 8 -6 l232 0 q10 0 10 8 l0 6 q0 6 -8 6 z"
        fill={deep}
      />

      {/* main body */}
      <path
        d="M44 124
           C 44 112 50 104 64 100
           L 96 90
           C 104 76 118 70 140 70
           L 196 70
           C 214 70 226 78 240 96
           L 270 102
           C 282 106 286 112 286 124
           L 286 128
           Q 286 134 278 134
           L 52 134
           Q 44 134 44 128 Z"
        fill={`url(#body-${id})`}
        stroke={deep}
        strokeWidth="1.5"
      />

      {/* cabin / windscreen */}
      <path
        d="M112 92 C 118 80 128 76 142 76 L 190 76 C 204 76 214 82 224 96 L 178 96 Z"
        fill={`url(#glass-${id})`}
        opacity="0.96"
      />
      {/* A-pillar + roof rim */}
      <path d="M150 76 L 150 96" stroke={dark} strokeWidth="3" strokeLinecap="round" />

      {/* brick seam lines (subtle) */}
      <g stroke={deep} strokeWidth="1" opacity="0.4">
        <line x1="44" y1="112" x2="286" y2="112" />
        <line x1="120" y1="100" x2="120" y2="134" />
        <line x1="178" y1="96" x2="178" y2="134" />
        <line x1="232" y1="104" x2="232" y2="134" />
      </g>

      {/* stud row */}
      {studs.map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={i < 3 ? 70 : 70} rx="7.5" ry="3.2" fill={stud} />
          <ellipse cx={x} cy={i < 3 ? 67.5 : 67.5} rx="7.5" ry="3.2" fill={light} />
        </g>
      ))}
      {/* bonnet studs (lower) */}
      {[60, 84].map((x, i) => (
        <g key={`b${i}`}>
          <ellipse cx={x} cy="101" rx="6.5" ry="2.8" fill={stud} />
          <ellipse cx={x} cy="99" rx="6.5" ry="2.8" fill={light} />
        </g>
      ))}

      {/* headlight + taillight */}
      <rect x="276" y="110" width="10" height="9" rx="2" fill="#fff4d6" opacity="0.95" />
      <rect x="44" y="110" width="9" height="9" rx="2" fill="#ff3b2f" />

      {/* wheels */}
      {[104, 224].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="134" r="27" fill="#0c0c0c" />
          <circle cx={cx} cy="134" r="27" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx={cx} cy="134" r="13" fill={shade(color, 0.05)} />
          <circle cx={cx} cy="134" r="13" fill="none" stroke={light} strokeWidth="1.5" />
          {/* spokes */}
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={cx}
                y1="134"
                x2={cx + Math.cos(rad) * 12}
                y2={134 + Math.sin(rad) * 12}
                stroke={dark}
                strokeWidth="2"
              />
            );
          })}
          <circle cx={cx} cy="134" r="3.5" fill={light} />
        </g>
      ))}

      {/* body top sheen */}
      <path
        d="M64 100 C 104 76 118 72 140 72 L 150 72 C 126 74 112 82 100 98 Z"
        fill="#fff"
        opacity="0.14"
      />
    </svg>
  );
}
