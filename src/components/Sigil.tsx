import { AXES, type Metrics } from "@/data/artifacts";

type Props = {
  metrics: Metrics;
  size?: number;
  showLabels?: boolean;
  animate?: boolean;
  /** unique id for clip / filter ids */
  uid?: string;
};

/**
 * Hand-rolled radial sigil. Nine axes, hairline radials, oxblood perimeter,
 * vellum fill at low opacity. Inner ritual marks at the perimeter so the
 * shape reads as glyph first, chart second.
 */
export function Sigil({
  metrics,
  size = 320,
  showLabels = false,
  animate = true,
  uid = "sigil",
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.42;
  const innerR = size * 0.06;

  const points = AXES.map((axis, i) => {
    const angle = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
    const v = Math.max(0, Math.min(100, metrics[axis.key])) / 100;
    const r = innerR + (R - innerR) * v;
    return {
      axis,
      angle,
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      // outer perimeter point for axis line
      ox: cx + Math.cos(angle) * R,
      oy: cy + Math.sin(angle) * R,
      // ritual tick at perimeter
      tx1: cx + Math.cos(angle) * (R + 4),
      ty1: cy + Math.sin(angle) * (R + 4),
      tx2: cx + Math.cos(angle) * (R + 10),
      ty2: cy + Math.sin(angle) * (R + 10),
      // label position
      lx: cx + Math.cos(angle) * (R + 24),
      ly: cy + Math.sin(angle) * (R + 24),
      v,
    };
  });

  const pathD =
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    " Z";

  const ringRs = [0.25, 0.5, 0.75, 1].map((f) => innerR + (R - innerR) * f);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      role="img"
      aria-label="Pressure sigil"
      style={{ overflow: "visible" }}
    >
      {/* outer ritual circle */}
      <circle
        cx={cx}
        cy={cy}
        r={R + 16}
        fill="none"
        stroke="var(--vellum)"
        strokeOpacity="0.18"
        strokeWidth="0.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={R + 14}
        fill="none"
        stroke="var(--vellum)"
        strokeOpacity="0.1"
        strokeWidth="0.5"
        strokeDasharray="1 4"
      />

      {/* concentric reading rings */}
      {ringRs.map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--vellum)"
          strokeOpacity={0.08 + i * 0.02}
          strokeWidth="0.5"
        />
      ))}

      {/* axes */}
      {points.map((p, i) => (
        <line
          key={`axis-${i}`}
          x1={cx}
          y1={cy}
          x2={p.ox}
          y2={p.oy}
          stroke="var(--vellum)"
          strokeOpacity="0.14"
          strokeWidth="0.5"
        />
      ))}

      {/* perimeter ritual ticks */}
      {points.map((p, i) => (
        <line
          key={`tick-${i}`}
          x1={p.tx1}
          y1={p.ty1}
          x2={p.tx2}
          y2={p.ty2}
          stroke="var(--vellum)"
          strokeOpacity="0.5"
          strokeWidth="0.6"
        />
      ))}

      {/* shape — fill */}
      <path
        d={pathD}
        fill="var(--oxblood)"
        fillOpacity="0.18"
        stroke="none"
      />

      {/* shape — perimeter, animated draw */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--oxblood)"
        strokeWidth="1.25"
        strokeLinejoin="miter"
        style={
          animate
            ? {
                strokeDasharray: 2000,
                strokeDashoffset: 2000,
                animation: `sigil-draw-${uid} 1.6s cubic-bezier(0.6,0,0.4,1) forwards`,
              }
            : undefined
        }
      />

      {/* vertex marks */}
      {points.map((p, i) => (
        <g key={`v-${i}`}>
          <circle cx={p.x} cy={p.y} r={1.6} fill="var(--vellum)" />
          <circle cx={p.x} cy={p.y} r={3} fill="none" stroke="var(--vellum)" strokeOpacity="0.4" strokeWidth="0.5" />
        </g>
      ))}

      {/* inner seal */}
      <circle cx={cx} cy={cy} r={innerR} fill="var(--ink)" stroke="var(--vellum)" strokeOpacity="0.4" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={innerR * 0.45} fill="var(--oxblood)" />

      {/* labels */}
      {showLabels &&
        points.map((p, i) => (
          <text
            key={`l-${i}`}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--vellum-dim)"
            style={{ letterSpacing: "0.18em" }}
          >
            {p.axis.short}
          </text>
        ))}

      <style>{`
        @keyframes sigil-draw-${uid} {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
