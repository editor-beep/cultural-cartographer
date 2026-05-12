import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ARTIFACTS, AXES, type AxisKey, type Metrics } from "@/data/artifacts";
import { Sigil } from "@/components/Sigil";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const Route = createFileRoute("/attune")({
  component: Attune,
  head: () => ({
    meta: [
      { title: "Attunement — The Artifact Index" },
      {
        name: "description",
        content:
          "Inscribe a shape across the nine axes. The Index will return the artifacts whose pressure most closely answers your own.",
      },
    ],
  }),
});

const DEFAULTS: Metrics = {
  consensus: 50,
  friction: 50,
  obsession: 50,
  haunting: 50,
  symbolic: 50,
  cult: 50,
  formal: 50,
  voltage: 50,
  accessibility: 50,
};

const PRESETS: { name: string; gloss: string; metrics: Metrics }[] = [
  {
    name: "The Wound",
    gloss: "Low consensus, high haunting, high voltage.",
    metrics: { consensus: 25, friction: 90, obsession: 88, haunting: 96, symbolic: 80, cult: 90, formal: 85, voltage: 95, accessibility: 18 },
  },
  {
    name: "The Cathedral",
    gloss: "Settled, dense, slow-burning.",
    metrics: { consensus: 88, friction: 30, obsession: 70, haunting: 78, symbolic: 92, cult: 60, formal: 88, voltage: 60, accessibility: 35 },
  },
  {
    name: "The Fever",
    gloss: "Cult-shaped, accessible, loud.",
    metrics: { consensus: 55, friction: 60, obsession: 92, haunting: 65, symbolic: 60, cult: 95, formal: 55, voltage: 90, accessibility: 70 },
  },
];

function distance(a: Metrics, b: Metrics) {
  let s = 0;
  for (const ax of AXES) {
    const d = (a[ax.key] - b[ax.key]) / 100;
    s += d * d;
  }
  return Math.sqrt(s / AXES.length); // 0..1
}

function Attune() {
  const [m, setM] = useState<Metrics>(DEFAULTS);

  const ranked = useMemo(() => {
    return ARTIFACTS.map((a) => ({ a, d: distance(m, a.metrics) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, 8);
  }, [m]);

  function set(k: AxisKey, v: number) {
    setM((prev) => ({ ...prev, [k]: v }));
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-[1400px] px-8 pt-12">
        <div className="mb-12 max-w-3xl">
          <div className="smallcaps text-[10px] text-vellum-dim">Procedure 04</div>
          <h1 className="mt-2 font-display text-4xl text-vellum md:text-5xl">Attunement</h1>
          <p className="mt-4 font-display italic text-vellum-dim">
            Inscribe a shape. The Index will answer with the artifacts whose
            pressure most closely resembles your own — not by genre, not by year,
            but by the geometry of how they are held.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Inscription panel */}
          <section>
            <div className="rule mb-6" />
            <div className="smallcaps mb-6 text-[10px] text-vellum-dim">
              Inscription · nine axes · 0 to 100
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-full border border-vellum/10 bg-ink-deep/40 p-4">
                <Sigil metrics={m} size={300} showLabels uid="attune-sigil" animate={false} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {AXES.map((ax) => (
                <div key={ax.key}>
                  <div className="flex items-baseline justify-between">
                    <label className="smallcaps text-[10px] text-vellum">
                      {ax.label}
                    </label>
                    <span className="font-mono text-[11px] text-vellum-dim">
                      {String(m[ax.key]).padStart(2, "0")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={m[ax.key]}
                    onChange={(e) => set(ax.key, Number(e.target.value))}
                    className="mt-1 w-full accent-[var(--oxblood)]"
                    aria-label={ax.label}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10">
              <div className="smallcaps mb-3 text-[10px] text-vellum-dim">
                Recognised shapes
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setM(p.metrics)}
                    title={p.gloss}
                    className="border border-vellum/20 px-3 py-1.5 font-display text-sm text-vellum hover:bg-vellum/5"
                  >
                    {p.name}
                  </button>
                ))}
                <button
                  onClick={() => setM(DEFAULTS)}
                  className="smallcaps border border-vellum/10 px-3 py-1.5 text-[10px] text-vellum-dim hover:text-vellum"
                >
                  Neutral
                </button>
              </div>
            </div>
          </section>

          {/* Resonance panel */}
          <section>
            <div className="rule mb-6" />
            <div className="smallcaps mb-6 text-[10px] text-vellum-dim">
              Resonance · nearest by axis-geometry
            </div>

            <ol className="space-y-4">
              {ranked.map(({ a, d }, i) => {
                const sim = Math.round((1 - d) * 100);
                return (
                  <li key={a.slug}>
                    <Link
                      to="/artifact/$slug"
                      params={{ slug: a.slug }}
                      className="group grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 border border-vellum/10 bg-ink-deep/40 p-3 hover:border-vellum/30"
                    >
                      <div className="opacity-90">
                        <Sigil metrics={a.metrics} size={64} animate={false} uid={`r-${a.slug}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[10px] text-vellum-dim">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate font-display text-lg text-vellum group-hover:text-vellum">
                            {a.title}
                          </span>
                        </div>
                        <div className="smallcaps mt-0.5 text-[10px] text-vellum-dim">
                          {a.director} · {a.year} · {a.catalogue}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[11px] text-[var(--oxblood-bright,theme(colors.vellum))] text-vellum">
                          {sim}
                        </div>
                        <div className="smallcaps text-[9px] text-vellum-dim">
                          resonance
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>

            <p className="mt-8 max-w-prose font-display italic text-sm text-vellum-dim">
              Resonance is the inverse of axis distance — a measure of how
              similarly two shapes are held, not of agreement, quality, or worth.
              A neutral shape returns the centre of the catalogue; an extreme
              one returns its outliers.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
