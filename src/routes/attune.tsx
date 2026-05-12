import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

const MAX_FAVORITES = 8;

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

function normalizeTitle(value: string) {
  return value.trim().toLowerCase();
}

function aggregateMetrics(favorites: Artifact[]): Metrics {
  if (favorites.length === 0) {
    return DEFAULTS;
  }

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
  return Math.sqrt(s / AXES.length); // 0..1
}

function Attune() {
  const [m, setM] = useState<Metrics>(DEFAULTS);
  const [filmQuery, setFilmQuery] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [filmError, setFilmError] = useState<string | null>(null);

  const ranked = useMemo(() => {
    return ARTIFACTS.map((a) => ({ a, d: distance(m, a.metrics) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, 8);
  }, [m]);

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

  function set(k: AxisKey, v: number) {
    setM((prev) => ({ ...prev, [k]: v }));
  }

  function addFavoriteFilm() {
    const query = normalizeTitle(filmQuery);
    if (!query) {
      setFilmError("Enter a film title from the catalogue.");
      return;
    }

    const exact = ARTIFACTS.find((artifact) => normalizeTitle(artifact.title) === query);
    const partial = ARTIFACTS.find((artifact) => normalizeTitle(artifact.title).includes(query));
    const match = exact ?? partial;

    if (!match) {
      setFilmError("Film not found in the catalogue.");
      return;
    }

    if (selectedSlugs.includes(match.slug)) {
      setFilmError("Film already added.");
      return;
    }

    if (selectedSlugs.length >= MAX_FAVORITES) {
      setFilmError(`You can add up to ${MAX_FAVORITES} films.`);
      return;
    }

    setSelectedSlugs((prev) => [...prev, match.slug]);
    setFilmQuery("");
    setFilmError(null);
  }

  function removeFavoriteFilm(slug: string) {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
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

        <section className="mb-12 max-w-4xl border border-vellum/10 bg-ink-deep/40 p-5">
          <div className="smallcaps text-[10px] text-vellum-dim">
            Cultural Fingerprint · favorite films
          </div>
          <p className="mt-2 max-w-3xl font-display italic text-vellum-dim">
            Add films from the catalogue and aggregate their nine-axis profile into a deterministic viewer shape.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              list="catalogue-film-titles"
              value={filmQuery}
              onChange={(e) => setFilmQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFavoriteFilm();
                }
              }}
              placeholder="Enter a favorite film title"
              className="min-w-[260px] flex-1 border border-vellum/20 bg-transparent px-3 py-2 text-sm text-vellum placeholder:text-vellum-dim"
              aria-label="Favorite film title"
            />
            <button
              onClick={addFavoriteFilm}
              className="border border-vellum/20 px-4 py-2 font-display text-sm text-vellum hover:bg-vellum/5"
            >
              Add film
            </button>
            <button
              onClick={() => {
                if (fingerprint) setM(fingerprint);
              }}
              disabled={!fingerprint}
              className="border border-vellum/20 px-4 py-2 font-display text-sm text-vellum disabled:cursor-not-allowed disabled:opacity-40 hover:bg-vellum/5"
            >
              Determine my shape
            </button>
            <datalist id="catalogue-film-titles">
              {ARTIFACTS.map((artifact) => (
                <option key={artifact.slug} value={artifact.title} />
              ))}
            </datalist>
          </div>
          {filmError ? <p className="mt-2 text-xs text-[var(--oxblood)]">{filmError}</p> : null}

          {selectedFilms.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedFilms.map((film) => (
                <button
                  key={film.slug}
                  onClick={() => removeFavoriteFilm(film.slug)}
                  className="border border-vellum/20 px-2 py-1 font-mono text-[10px] text-vellum hover:bg-vellum/5"
                  title="Remove film"
                >
                  {film.title} ×
                </button>
              ))}
            </div>
          ) : null}

          {fingerprint && viewerShape ? (
            <div className="mt-5 border border-vellum/10 bg-ink/40 p-4">
              <div className="smallcaps text-[10px] text-vellum-dim">Viewer shape</div>
              <h2 className="mt-1 font-display text-2xl text-vellum">{viewerShape.name}</h2>
              <p className="mt-2 text-sm text-vellum/90">{viewerShape.description}</p>
              <p className="mt-3 font-mono text-[10px] text-vellum-dim">
                Center of gravity · {centerOfGravity(fingerprint)}
              </p>
            </div>
          ) : null}
        </section>

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
