import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ARTIFACTS, AXES, type Artifact, type AxisKey, type Metrics } from "@/data/artifacts";
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
          "Enter your ten favorite films. The Index will derive your viewer shape and return the artifacts whose pressure most closely answers your own.",
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

const MAX_FAVORITES = 10;

const AXIS_LABELS: Record<AxisKey, string> = AXES.reduce(
  (acc, axis) => ({ ...acc, [axis.key]: axis.label }),
  {} as Record<AxisKey, string>,
);

const SHAPE_BY_AXIS: Record<AxisKey, { name: string; description: string }> = {
  consensus: {
    name: "The Harmonizer",
    description: "You seek works that hold a stable shared reading across audiences.",
  },
  friction: {
    name: "The Contrarian",
    description: "You gravitate toward unresolved interpretive conflict and durable disagreement.",
  },
  obsession: {
    name: "The Archivist",
    description: "You return to works that can be lived with over long periods of time.",
  },
  haunting: {
    name: "The Revenant",
    description: "You value films that linger and recur long after the credits.",
  },
  symbolic: {
    name: "The Mapper",
    description: "You read films as territories of meaning to chart and decode.",
  },
  cult: {
    name: "The Acolyte",
    description: "You are drawn to devotion arcs and communal reclamation rituals.",
  },
  formal: {
    name: "The Insurgent",
    description: "You prioritize formal risk and structural refusal over convention.",
  },
  voltage: {
    name: "The Conduit",
    description: "You pursue high-intensity works that move the body before the thesis.",
  },
  accessibility: {
    name: "The Guide",
    description: "You prefer works that invite entry without demanding prior initiation.",
  },
};

// Short match descriptions for the resonance breakdown
const AXIS_MATCH_GLOSS: Record<AxisKey, string> = {
  consensus: "shared stability of reading",
  friction: "shared interpretive conflict",
  obsession: "shared long-term dwelling",
  haunting: "shared residual presence",
  symbolic: "shared density of meaning",
  cult: "shared devotion pattern",
  formal: "shared formal risk",
  voltage: "shared emotional intensity",
  accessibility: "shared ease of entry",
};

function normalizeTitle(value: string) {
  return value.trim().toLowerCase();
}

function aggregateMetrics(favorites: Artifact[]): Metrics {
  if (favorites.length === 0) return DEFAULTS;
  const out = {} as Metrics;
  for (const axis of AXES) {
    const total = favorites.reduce((sum, film) => sum + film.metrics[axis.key], 0);
    out[axis.key] = Math.round(total / favorites.length);
  }
  return out;
}

function describeViewerShape(metrics: Metrics) {
  if (metrics.accessibility <= 35 && metrics.symbolic >= 70) {
    return {
      name: "The Mapper",
      description:
        "Low accessibility with high symbolic density: you view film as territory to be conquered, not merely narrated.",
    };
  }
  if (metrics.friction >= 70 && metrics.formal >= 70) {
    return {
      name: "The Insurgent",
      description:
        "You choose works that resist consensus and reward structural risk over comfort.",
    };
  }
  if (metrics.cult >= 80 && metrics.obsession >= 80) {
    return {
      name: "The Devotee",
      description:
        "Your center of gravity sits in films that generate communities of long-term devotion.",
    };
  }
  const dominantAxis = AXES.map((axis) => axis.key).reduce((bestKey, key) =>
    metrics[key] > metrics[bestKey] ? key : bestKey,
  AXES[0].key);
  return SHAPE_BY_AXIS[dominantAxis];
}

function centerOfGravity(metrics: Metrics) {
  const top = [...AXES]
    .sort((a, b) => metrics[b.key] - metrics[a.key])
    .slice(0, 3)
    .map((axis) => `${AXIS_LABELS[axis.key]} ${metrics[axis.key]}`);
  return top.join(" · ");
}

function distance(a: Metrics, b: Metrics) {
  let s = 0;
  for (const ax of AXES) {
    const d = (a[ax.key] - b[ax.key]) / 100;
    s += d * d;
  }
  return Math.sqrt(s / AXES.length);
}

function topMatchAxes(viewer: Metrics, film: Metrics, count = 3) {
  return [...AXES]
    .map((ax) => ({ key: ax.key as AxisKey, label: ax.label, delta: Math.abs(viewer[ax.key] - film[ax.key]) }))
    .sort((a, b) => a.delta - b.delta)
    .slice(0, count);
}

// Searchable film picker dropdown
function FilmPicker({
  onSelect,
  excludeSlugs,
  disabled,
}: {
  onSelect: (slug: string) => void;
  excludeSlugs: string[];
  disabled: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = normalizeTitle(query);
    if (!q) return [];
    return ARTIFACTS.filter(
      (a) => !excludeSlugs.includes(a.slug) && normalizeTitle(a.title).includes(q),
    ).slice(0, 10);
  }, [query, excludeSlugs]);

  function select(slug: string) {
    onSelect(slug);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={disabled ? `Maximum ${MAX_FAVORITES} films reached` : "Search by title…"}
        disabled={disabled}
        className="w-full border border-vellum/20 bg-transparent px-3 py-2.5 text-sm text-vellum placeholder:text-vellum-dim disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Search for a film"
        aria-autocomplete="list"
        aria-expanded={open && filtered.length > 0}
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-30 max-h-72 overflow-y-auto border border-t-0 border-vellum/20 bg-[#0e0b09]">
          {filtered.map((a) => (
            <button
              key={a.slug}
              onMouseDown={() => select(a.slug)}
              className="flex w-full items-baseline gap-3 px-3 py-2 text-left hover:bg-vellum/5"
            >
              <span className="font-display text-sm text-vellum">{a.title}</span>
              <span className="font-mono text-[10px] text-vellum-dim">{a.director} · {a.year}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Attune() {
  const [m, setM] = useState<Metrics>(DEFAULTS);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const selectedFilms = useMemo(
    () =>
      selectedSlugs
        .map((slug) => ARTIFACTS.find((artifact) => artifact.slug === slug))
        .filter((artifact): artifact is Artifact => Boolean(artifact)),
    [selectedSlugs],
  );

  const fingerprint = useMemo(
    () => (selectedFilms.length > 0 ? aggregateMetrics(selectedFilms) : null),
    [selectedFilms],
  );

  const viewerShape = useMemo(
    () => (fingerprint ? describeViewerShape(fingerprint) : null),
    [fingerprint],
  );

  // Active shape: fingerprint if films selected, else manual sliders
  const activeShape = fingerprint ?? m;

  const ranked = useMemo(() => {
    return ARTIFACTS
      .filter((a) => !selectedSlugs.includes(a.slug))
      .map((a) => ({ a, d: distance(activeShape, a.metrics) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, 8);
  }, [activeShape, selectedSlugs]);

  function addFilm(slug: string) {
    if (selectedSlugs.length >= MAX_FAVORITES) return;
    if (selectedSlugs.includes(slug)) return;
    setSelectedSlugs((prev) => [...prev, slug]);
  }

  function removeFilm(slug: string) {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-[1400px] px-8 pt-12">

        {/* Page header */}
        <div className="mb-12 max-w-3xl">
          <div className="smallcaps text-[10px] text-vellum-dim">Procedure 04</div>
          <h1 className="mt-2 font-display text-4xl text-vellum md:text-5xl">Attunement</h1>
          <p className="mt-4 font-display italic text-vellum-dim">
            Enter your ten favorite films. The Index will derive the shape they share —
            the geometry of how you hold cinema — and return the artifacts whose
            pressure most closely answers your own.
          </p>
        </div>

        {/* ── TASTE PROFILE (primary) ── */}
        <section className="mb-16">
          <div className="rule mb-6" />
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-2xl text-vellum">Your Taste Profile</h2>
            <div className="smallcaps text-[10px] text-vellum-dim">
              {selectedSlugs.length} / {MAX_FAVORITES} films
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Left: film picker + selected cards */}
            <div>
              <FilmPicker
                onSelect={addFilm}
                excludeSlugs={selectedSlugs}
                disabled={selectedSlugs.length >= MAX_FAVORITES}
              />
              <p className="mt-2 text-[11px] text-vellum/40">
                Type any title from the catalogue. Select up to {MAX_FAVORITES} films.
              </p>

              {selectedFilms.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                  {selectedFilms.map((film) => (
                    <div
                      key={film.slug}
                      className="group relative border border-vellum/10 bg-ink-deep/40 p-3"
                    >
                      <div className="flex justify-center">
                        <Sigil metrics={film.metrics} size={72} animate={false} uid={`fav-${film.slug}`} />
                      </div>
                      <div className="mt-2 font-display text-xs leading-tight text-vellum line-clamp-2">
                        {film.title}
                      </div>
                      <div className="mt-0.5 font-mono text-[9px] text-vellum-dim">
                        {film.year}
                      </div>
                      <button
                        onClick={() => removeFilm(film.slug)}
                        className="absolute right-1.5 top-1.5 font-mono text-[10px] text-vellum-dim opacity-0 transition-opacity group-hover:opacity-100 hover:text-vellum"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedFilms.length === 0 && (
                <div className="mt-6 border border-vellum/5 bg-ink-deep/20 px-5 py-8 text-center">
                  <p className="font-display text-sm italic text-vellum-dim">
                    Add your first film to begin deriving your shape.
                  </p>
                </div>
              )}
            </div>

            {/* Right: composite sigil + archetype */}
            <div>
              {fingerprint && viewerShape ? (
                <div className="sticky top-8 border border-vellum/10 bg-ink-deep/40 p-6">
                  <div className="smallcaps text-[10px] text-vellum-dim">Derived viewer shape</div>
                  <div className="mt-4 flex justify-center">
                    <Sigil metrics={fingerprint} size={240} showLabels uid="taste-composite" animate={false} />
                  </div>
                  <div className="mt-5">
                    <div className="font-display text-2xl text-vellum">{viewerShape.name}</div>
                    <p className="mt-2 text-sm text-vellum/80">{viewerShape.description}</p>
                    <p className="mt-4 font-mono text-[10px] text-vellum-dim">
                      Center of gravity · {centerOfGravity(fingerprint)}
                    </p>
                  </div>
                  <button
                    onClick={() => setM(fingerprint)}
                    className="mt-5 w-full border border-vellum/20 py-2 font-display text-sm text-vellum-dim hover:bg-vellum/5 hover:text-vellum"
                  >
                    Transfer to manual inscription →
                  </button>
                </div>
              ) : (
                <div className="sticky top-8 border border-vellum/5 bg-ink-deep/20 p-6">
                  <div className="smallcaps text-[10px] text-vellum-dim">Derived viewer shape</div>
                  <div className="mt-4 flex justify-center opacity-20">
                    <Sigil metrics={DEFAULTS} size={240} showLabels uid="taste-placeholder" animate={false} />
                  </div>
                  <p className="mt-5 text-center font-display text-sm italic text-vellum-dim">
                    Your shape will appear here as you add films.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── RESONANCE + INSCRIPTION (secondary) ── */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">

          {/* Manual inscription — now secondary */}
          <section>
            <div className="rule mb-6" />
            <div className="smallcaps mb-1 text-[10px] text-vellum-dim">
              Manual Inscription · advanced
            </div>
            <p className="mb-6 font-display text-xs italic text-vellum-dim">
              Adjust the nine axes by hand to inscribe an arbitrary shape. Ignored when films are selected above.
            </p>

            <div className="flex items-center justify-center">
              <div className="rounded-full border border-vellum/10 bg-ink-deep/40 p-4">
                <Sigil metrics={fingerprint ?? m} size={280} showLabels uid="attune-sigil" animate={false} />
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
                      {String((fingerprint ?? m)[ax.key]).padStart(2, "0")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={m[ax.key]}
                    onChange={(e) => setM((prev) => ({ ...prev, [ax.key]: Number(e.target.value) }))}
                    disabled={fingerprint !== null}
                    className="mt-1 w-full accent-[var(--oxblood)] disabled:opacity-30"
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
                    onClick={() => { setM(p.metrics); setSelectedSlugs([]); }}
                    title={p.gloss}
                    className="border border-vellum/20 px-3 py-1.5 font-display text-sm text-vellum hover:bg-vellum/5"
                  >
                    {p.name}
                  </button>
                ))}
                <button
                  onClick={() => { setM(DEFAULTS); setSelectedSlugs([]); }}
                  className="smallcaps border border-vellum/10 px-3 py-1.5 text-[10px] text-vellum-dim hover:text-vellum"
                >
                  Neutral
                </button>
              </div>
            </div>
          </section>

          {/* Resonance results */}
          <section>
            <div className="rule mb-6" />
            <div className="smallcaps mb-1 text-[10px] text-vellum-dim">
              Resonance · nearest by axis-geometry
            </div>
            {fingerprint ? (
              <p className="mb-6 font-display text-xs italic text-vellum-dim">
                Derived from your {selectedFilms.length} selected film{selectedFilms.length !== 1 ? "s" : ""}.
                Films already in your profile are excluded.
              </p>
            ) : (
              <p className="mb-6 font-display text-xs italic text-vellum-dim">
                Derived from the manually inscribed shape above.
              </p>
            )}

            <ol className="space-y-3">
              {ranked.map(({ a, d }, i) => {
                const sim = Math.round((1 - d) * 100);
                const matchAxes = topMatchAxes(activeShape, a.metrics);
                return (
                  <li key={a.slug}>
                    <Link
                      to="/artifact/$slug"
                      params={{ slug: a.slug }}
                      className="group block border border-vellum/10 bg-ink-deep/40 p-3 hover:border-vellum/30"
                    >
                      <div className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3">
                        <div className="opacity-90">
                          <Sigil metrics={a.metrics} size={56} animate={false} uid={`r-${a.slug}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono text-[10px] text-vellum-dim">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate font-display text-lg text-vellum">
                              {a.title}
                            </span>
                          </div>
                          <div className="smallcaps mt-0.5 text-[10px] text-vellum-dim">
                            {a.director} · {a.year}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xl tabular-nums text-oxblood">{sim}</div>
                          <div className="smallcaps text-[9px] text-vellum-dim">resonance</div>
                        </div>
                      </div>
                      {/* Axis match breakdown */}
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-vellum/5 pt-3">
                        {matchAxes.map((ax) => (
                          <div key={ax.key} className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] text-oxblood/80 smallcaps">{ax.label}</span>
                            <span className="font-mono text-[9px] text-vellum-dim">
                              {AXIS_MATCH_GLOSS[ax.key]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>

            <p className="mt-8 max-w-prose font-display text-sm italic text-vellum-dim">
              Resonance is the inverse of axis distance — how similarly two shapes are held,
              not agreement, quality, or worth. The three axis labels per result name the
              dimensions where your shape and the film's shape are most aligned.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
