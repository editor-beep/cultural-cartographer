import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ARTIFACTS, AXES, type Artifact, type Metrics } from "@/data/artifacts";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { shareOverlayImage } from "@/lib/screenshot";

const SLOT_COLORS = [
  { stroke: "var(--oxblood)", label: "A" },
  { stroke: "#5b8db8", label: "B" },
  { stroke: "#c9a84c", label: "C" },
] as const;

export const Route = createFileRoute("/compare")({
  validateSearch: (search: Record<string, unknown>) => ({
    a: typeof search.a === "string" ? search.a : undefined,
    b: typeof search.b === "string" ? search.b : undefined,
    c: typeof search.c === "string" ? search.c : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Overlay — The Artifact Index" },
      {
        name: "description",
        content:
          "Stack 2–3 sigils to read where pressures converge and where shapes diverge.",
      },
    ],
  }),
  component: Compare,
});

function Compare() {
  const { a, b, c } = Route.useSearch();
  const navigate = useNavigate();
  const [sharing, setSharing] = useState(false);

  const slugs = [a, b, c] as (string | undefined)[];
  const artifacts = slugs.map((slug) =>
    slug ? (ARTIFACTS.find((x) => x.slug === slug) ?? null) : null,
  );
  const [artA, artB] = artifacts;
  const activeArtifacts = artifacts.filter(Boolean) as Artifact[];

  function setSlot(index: number, slug: string | undefined) {
    const next = [...slugs] as (string | undefined)[];
    next[index] = slug || undefined;
    navigate({ to: "/compare", search: { a: next[0], b: next[1], c: next[2] } });
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href);
  }

  async function handleShareImage() {
    setSharing(true);
    try {
      await shareOverlayImage(activeArtifacts);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      <section className="relative z-10 mx-auto mt-16 max-w-[1400px] px-8">
        <div className="flex items-baseline justify-between">
          <Link to="/" className="smallcaps text-[10px] text-vellum-dim hover:text-vellum">
            ← Atlas
          </Link>
          <div className="font-mono text-[10px] text-vellum-dim smallcaps">Sigil Overlay</div>
        </div>
        <div className="rule mt-4" />
        <div className="mt-8">
          <h1 className="font-display text-6xl text-vellum">Overlay</h1>
          <p className="mt-3 max-w-xl font-display text-xl italic text-vellum-dim">
            Stack 2–3 sigils. Read where pressures converge, where shapes pull apart.
          </p>
        </div>
      </section>

      {/* Slot selectors */}
      <section className="relative z-10 mx-auto mt-10 max-w-[1400px] px-8">
        <div className="flex flex-wrap items-center gap-3">
          {[0, 1].map((i) => (
            <SlotSelector
              key={i}
              color={SLOT_COLORS[i]}
              value={slugs[i]}
              onChange={(v) => setSlot(i, v)}
              exclude={slugs.filter((_, j) => j !== i).filter(Boolean) as string[]}
            />
          ))}
          {artA && artB && (
            <SlotSelector
              color={SLOT_COLORS[2]}
              value={slugs[2]}
              onChange={(v) => setSlot(2, v)}
              exclude={[a, b].filter(Boolean) as string[]}
              placeholder="— add third —"
            />
          )}
        </div>
      </section>

      {activeArtifacts.length >= 2 ? (
        <section className="relative z-10 mx-auto mt-16 max-w-[1400px] px-8">
          <div className="grid grid-cols-12 gap-12">
            {/* Canvas + legend */}
            <div className="col-span-12 md:col-span-5">
              <div className="aspect-square w-full">
                <OverlayCanvas artifacts={activeArtifacts} size={480} />
              </div>
              <div className="mt-6 space-y-2">
                {activeArtifacts.map((art, i) => (
                  <div key={art.slug} className="flex items-center gap-3">
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        background: SLOT_COLORS[i].stroke,
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    <Link
                      to="/artifact/$slug"
                      params={{ slug: art.slug }}
                      className="font-display text-base text-vellum hover:text-oxblood"
                    >
                      {art.title}
                    </Link>
                    <span className="font-mono text-[10px] text-vellum-dim">{art.year}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-5">
                <button
                  onClick={copyLink}
                  className="smallcaps text-[10px] text-vellum-dim hover:text-vellum"
                >
                  Copy link ↗
                </button>
                <button
                  onClick={handleShareImage}
                  disabled={sharing}
                  className="smallcaps text-[10px] text-vellum-dim hover:text-vellum disabled:opacity-40"
                >
                  {sharing ? "saving…" : "Share image ↗"}
                </button>
              </div>
            </div>

            {/* Delta table */}
            <div className="col-span-12 md:col-span-7">
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-display text-2xl text-vellum">Axis Divergence</h2>
                <div className="font-mono text-[10px] text-vellum-dim smallcaps">
                  sorted by spread
                </div>
              </div>
              <DeltaTable artifacts={activeArtifacts} />
            </div>
          </div>
        </section>
      ) : (
        <section className="relative z-10 mx-auto mt-24 max-w-[1400px] px-8">
          <p className="font-display text-xl italic text-vellum-dim">
            Select two artifacts above to begin the overlay.
          </p>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function SlotSelector({
  color,
  value,
  onChange,
  exclude = [],
  placeholder = "Select artifact…",
}: {
  color: (typeof SLOT_COLORS)[number];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  exclude?: string[];
  placeholder?: string;
}) {
  const available = ARTIFACTS.filter((a) => !exclude.includes(a.slug));
  return (
    <div className="flex items-center gap-3 border border-border bg-umber/30 px-4 py-3">
      <span
        style={{
          width: 10,
          height: 10,
          background: color.stroke,
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      <select
        className="bg-transparent font-mono text-[11px] text-vellum outline-none"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">{placeholder}</option>
        {available.map((a) => (
          <option key={a.slug} value={a.slug}>
            {a.title} ({a.year})
          </option>
        ))}
      </select>
    </div>
  );
}

function OverlayCanvas({ artifacts, size }: { artifacts: Artifact[]; size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.42;
  const innerR = size * 0.06;
  const ringRs = [0.25, 0.5, 0.75, 1].map((f) => innerR + (R - innerR) * f);

  function getPoints(metrics: Metrics) {
    return AXES.map((axis, i) => {
      const angle = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
      const v = Math.max(0, Math.min(100, metrics[axis.key])) / 100;
      const r = innerR + (R - innerR) * v;
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        ox: cx + Math.cos(angle) * R,
        oy: cy + Math.sin(angle) * R,
        tx1: cx + Math.cos(angle) * (R + 4),
        ty1: cy + Math.sin(angle) * (R + 4),
        tx2: cx + Math.cos(angle) * (R + 10),
        ty2: cy + Math.sin(angle) * (R + 10),
        lx: cx + Math.cos(angle) * (R + 26),
        ly: cy + Math.sin(angle) * (R + 26),
        short: axis.short,
      };
    });
  }

  const chromePoints = getPoints(artifacts[0].metrics);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* outer ritual circles */}
      <circle cx={cx} cy={cy} r={R + 16} fill="none" stroke="var(--vellum)" strokeOpacity="0.18" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={R + 14} fill="none" stroke="var(--vellum)" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="1 4" />

      {/* concentric rings */}
      {ringRs.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="var(--vellum)" strokeOpacity={0.08 + i * 0.02} strokeWidth="0.5" />
      ))}

      {/* axes */}
      {chromePoints.map((p, i) => (
        <line key={`ax-${i}`} x1={cx} y1={cy} x2={p.ox} y2={p.oy} stroke="var(--vellum)" strokeOpacity="0.14" strokeWidth="0.5" />
      ))}

      {/* perimeter ticks */}
      {chromePoints.map((p, i) => (
        <line key={`tk-${i}`} x1={p.tx1} y1={p.ty1} x2={p.tx2} y2={p.ty2} stroke="var(--vellum)" strokeOpacity="0.5" strokeWidth="0.6" />
      ))}

      {/* fills first so strokes are crisp on top */}
      {artifacts.map((art, ai) => {
        const pts = getPoints(art.metrics);
        const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + " Z";
        return <path key={`fill-${ai}`} d={d} fill={SLOT_COLORS[ai].stroke} fillOpacity="0.10" stroke="none" />;
      })}

      {/* strokes */}
      {artifacts.map((art, ai) => {
        const pts = getPoints(art.metrics);
        const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + " Z";
        return <path key={`str-${ai}`} d={d} fill="none" stroke={SLOT_COLORS[ai].stroke} strokeWidth="1.5" strokeLinejoin="miter" />;
      })}

      {/* vertex marks */}
      {artifacts.map((art, ai) =>
        getPoints(art.metrics).map((p, i) => (
          <circle key={`v-${ai}-${i}`} cx={p.x} cy={p.y} r={2} fill={SLOT_COLORS[ai].stroke} fillOpacity="0.85" />
        )),
      )}

      {/* inner seal */}
      <circle cx={cx} cy={cy} r={innerR} fill="var(--ink)" stroke="var(--vellum)" strokeOpacity="0.4" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={innerR * 0.45} fill="var(--oxblood)" />

      {/* axis labels */}
      {chromePoints.map((p, i) => (
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
          {p.short}
        </text>
      ))}
    </svg>
  );
}

function DeltaTable({ artifacts }: { artifacts: Artifact[] }) {
  const rows = AXES.map((axis) => {
    const vals = artifacts.map((a) => a.metrics[axis.key]);
    const range = Math.max(...vals) - Math.min(...vals);
    return { axis, vals, range };
  }).sort((a, b) => b.range - a.range);

  return (
    <div>
      {rows.map(({ axis, vals, range }) => (
        <div key={axis.key} className="border-b border-border py-4">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="font-display text-lg text-vellum">{axis.label}</div>
            <div
              className="font-mono text-[11px] smallcaps"
              style={{ color: range > 30 ? "var(--oxblood)" : "var(--vellum-dim)" }}
            >
              Δ {range}
            </div>
          </div>
          <div className="space-y-1.5">
            {vals.map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: SLOT_COLORS[i].stroke,
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                <div className="h-px flex-1 bg-vellum/10">
                  <div
                    className="h-px"
                    style={{ width: `${v}%`, background: SLOT_COLORS[i].stroke, opacity: 0.65 }}
                  />
                </div>
                <div
                  className="w-6 text-right font-mono text-[11px] tabular-nums"
                  style={{ color: SLOT_COLORS[i].stroke }}
                >
                  {String(v).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
