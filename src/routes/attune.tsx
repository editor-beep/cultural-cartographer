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
  reach: 50,
  progeny: 50,
  arc: 50,
  transgression: 50,
};

const PRESETS: { name: string; gloss: string; metrics: Metrics }[] = [
  {
    name: "The Wound",
    gloss: "Low consensus, high haunting, high voltage.",
    metrics: { consensus: 25, friction: 90, obsession: 88, haunting: 96, symbolic: 80, cult: 90, formal: 85, voltage: 95, accessibility: 18, reach: 30, progeny: 55, arc: 85, transgression: 70 },
  },
  {
    name: "The Cathedral",
    gloss: "Settled, dense, slow-burning.",
    metrics: { consensus: 88, friction: 30, obsession: 70, haunting: 78, symbolic: 92, cult: 60, formal: 88, voltage: 60, accessibility: 35, reach: 45, progeny: 75, arc: 50, transgression: 20 },
  },
  {
    name: "The Fever",
    gloss: "Cult-shaped, accessible, loud.",
    metrics: { consensus: 55, friction: 60, obsession: 92, haunting: 65, symbolic: 60, cult: 95, formal: 55, voltage: 90, accessibility: 70, reach: 80, progeny: 45, arc: 40, transgression: 35 },
  },
];

const MAX_FAVORITES = 10;

const AXIS_LABELS: Record<AxisKey, string> = AXES.reduce(
  (acc, axis) => ({ ...acc, [axis.key]: axis.label }),
  {} as Record<AxisKey, string>,
);

export const SHAPE_BY_AXIS: Record<AxisKey, { name: string; description: string }> = {
  consensus: {
    name: "The Harmonizer",
    description:
      "You are drawn to works whose reading has stabilized — where the interpretive argument has concluded and a settled, shared sense of the film exists across critics, audiences, and time. This is not passivity; it is a preference for the communal object, the work that has achieved a stable resting temperature in the culture. You trust consensus as a form of collective intelligence, and you find something clarifying in a film that everyone arrives at together.",
  },
  friction: {
    name: "The Contrarian",
    description:
      "You live in the interpretive gap. What draws you is not the film that provoked at release, but the film whose argument is still running years on — where the disagreement is structural, not superficial, and no reading has yet won. You are not interested in being contrary; you are interested in the wound that will not close, the work that resists assimilation and remains alive precisely because it refuses to settle.",
  },
  obsession: {
    name: "The Archivist",
    description:
      "You form long-term relationships with films. What you are after is not the first viewing but the fifth, the tenth — the work that reveals itself slowly and accumulates meaning over years of returning. A film that exhausts itself on first contact does not hold you. You are drawn to the ones that remain generative, that have something new to show you each time, that reward the patience of dwelling.",
  },
  haunting: {
    name: "The Revenant",
    description:
      "The films you value are the ones that return to you uninvited — arriving in dreams, surfacing during unrelated experiences, installing themselves without your permission. You do not pursue this effect; you recognize it after the fact, often long after. The test of a film for you is whether it stays in the body, whether it becomes part of the perceptual texture of daily life long after the credits have ended.",
  },
  symbolic: {
    name: "The Mapper",
    description:
      "For you, a film is a system first — a territory with a logic, a grammar, and a set of internal claims that can be traced and contested. You read films the way a cartographer reads unfamiliar ground: noting the landmarks, measuring the distances, looking for the places where the map contradicts itself. The film is not something to be felt and moved on from. It is something to be understood, annotated, and returned to as evidence.",
  },
  cult: {
    name: "The Acolyte",
    description:
      "You are drawn not just to the film itself but to the community that forms around it — the devotion arc, the reclamation story. What interests you is the work that was rejected or ignored, that found its people anyway, that became a site of collective rescue. The history of the film's reception is part of its meaning. To love it is to participate in something larger than a personal taste: the ongoing argument that the initial verdict was wrong.",
  },
  formal: {
    name: "The Insurgent",
    description:
      "What you are drawn to is the refusal — the work that chose a form no one had used, or used a known form against its intended purpose. Technical virtuosity interests you only when it is in the service of rupture. You are looking for evidence that a filmmaker chose to make things differently, knew exactly what conventions they were abandoning, and accepted the consequences. The form is the argument; everything else is decoration.",
  },
  voltage: {
    name: "The Conduit",
    description:
      "You go to film for the physical experience first. Crying, panic, awe, nausea — these are not side effects but the event itself. You are drawn to works where the emotional current is sustained and unambiguous, where the body responds before the mind has had time to construct a thesis. The analysis comes later, if at all. The work has to move you before it has the right to mean anything.",
  },
  accessibility: {
    name: "The Guide",
    description:
      "You are drawn to works that are genuinely available — that do not require a glossary, a cultural history, or prior initiation to enter and feel something. This is not a preference for simplicity; it is a preference for generosity. You value the film that earns its emotional effects without demanding preparation, that treats the arriving viewer as a full participant rather than an unprepared student. Cinema as open door.",
  },
  reach: {
    name: "The Emissary",
    description:
      "The films you gravitate toward have escaped their own medium. Their images, phrases, and gestures circulate in registers that do not require having seen the source — they are part of the shared furniture of the culture, references available to people who have never encountered the original. You are drawn to the work that achieved this crossing, that became a common language, that entered the general record as something more than a film.",
  },
  progeny: {
    name: "The Ancestor",
    description:
      "You are interested in the source — the films that made other films possible, that defined an aesthetic or an approach before it had a name. What draws you is the originating work, the one that later filmmakers are in dialogue with whether they acknowledge it or not. You read influence backward, tracing the current film to the upstream work that generated it, and you find the ancestor more interesting than the inheritance.",
  },
  arc: {
    name: "The Revisionist",
    description:
      "What you prefer is the rehabilitated work — the one that was wrong initially, and that time had to correct. Not the film whose esteem held steady, but the one that was dismissed or misread at release and whose current reputation required an act of deliberate critical revision. The distance between the original verdict and the current one is the measure of the film's depth, and you are drawn to the distance, not the destination.",
  },
  transgression: {
    name: "The Limit-Tester",
    description:
      "You are drawn to films that operated at or beyond the limits of what the culture was willing to permit — not because of formal difficulty, but because of what the film was willing to say, show, or do. The work that was considered genuinely dangerous, not merely provocative or difficult. You are interested in the edges of permissibility, in what it costs to make something at those edges, and in what survives the making.",
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
  reach: "shared cultural permeation",
  progeny: "shared generative lineage",
  arc: "shared reversal of reception",
  transgression: "shared proximity to social limits",
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
  // 3-axis composites first (most specific)
  if (metrics.haunting >= 70 && metrics.voltage >= 70 && metrics.consensus <= 40) {
    return {
      name: "The Wound-Dweller",
      description:
        "You live in the films that left a mark nobody else quite agreed on — high-intensity works that haven't settled, that keep returning to you whether you seek them out or not. The lack of consensus is part of it: you don't want the work confirmed, you want it alive. These are the films that installed something in you and then refused to explain what it was.",
    };
  }
  if (metrics.formal >= 70 && metrics.symbolic >= 70 && metrics.accessibility <= 40) {
    return {
      name: "The Initiate",
      description:
        "You are drawn to cinema that makes no concessions to the unprepared — formally demanding, symbolically dense, and entirely unconcerned with whether a new viewer can find their footing. You arrived ready for this. What you are looking for is a film that takes its own logic seriously enough to exclude those who haven't done the work, and rewards those who have with something that cannot be unlocked any other way.",
    };
  }
  if (metrics.obsession >= 70 && metrics.haunting >= 70 && metrics.consensus <= 40) {
    return {
      name: "The Cultist",
      description:
        "You re-watch films that most people either missed or moved on from — not out of loyalty to a community, but because something in the work will not release you. These are films that operate outside the settled record, whose meaning hasn't been agreed upon, whose presence in your life is more like a recurring symptom than a preference. You are not chasing novelty. You are returning to the same unresolved thing.",
    };
  }
  if (metrics.reach >= 70 && metrics.consensus >= 70 && metrics.accessibility >= 70) {
    return {
      name: "The Bridge",
      description:
        "You gravitate toward works that crossed into the general culture and held — films that are genuinely for everyone and earned that reach, rather than merely achieving it. The broad consensus here is not a warning sign but evidence: these are the works that managed to be accessible and resonant simultaneously, that entered the shared record without losing their integrity. You find value in the commonly held object.",
    };
  }
  // 2-axis composites
  if (metrics.accessibility <= 35 && metrics.symbolic >= 70) {
    return {
      name: "The Mapper",
      description:
        "You treat film as territory to be studied, not stories to be received. Low accessibility doesn't deter you — it signals that the work has a logic requiring effort to enter, and the symbolic density means there is enough there to justify the effort. You are less interested in being moved than in understanding how the system works, what it claims, where its internal argument breaks down or holds.",
    };
  }
  if (metrics.friction >= 70 && metrics.formal >= 70) {
    return {
      name: "The Insurgent",
      description:
        "What draws you is the double refusal: works that resist settled readings and also resist conventional form. You are not looking for difficulty for its own sake, but for films where structural risk and interpretive conflict reinforce each other — where the way the thing is made produces the argument it refuses to resolve. These are the films that stay combative long after their release.",
    };
  }
  if (metrics.cult >= 80 && metrics.obsession >= 80) {
    return {
      name: "The Devotee",
      description:
        "Your center of gravity is in the films that generate long-term communities of attention — works that people return to not casually but ritually, that accumulate meaning through repeated collective engagement. You are drawn to the devotion itself as a signal: when a film sustains this kind of commitment across years, something in it is worth investigating beyond the initial viewing.",
    };
  }
  if (metrics.transgression >= 70 && metrics.voltage >= 70) {
    return {
      name: "The Nerve",
      description:
        "You seek the films that pushed against what the culture was willing to permit and registered that pressure in the body — extreme cinema as felt experience, where the transgression is not an intellectual category but a physical one. You are not looking for provocation as a pose. You are looking for the works that cost something to make and cost something to watch, and where those two costs are related.",
    };
  }
  if (metrics.progeny >= 70 && metrics.arc >= 70) {
    return {
      name: "The Excavator",
      description:
        "You are drawn to originating works that were not recognized as such until later — films that defined an aesthetic or opened a formal possibility before anyone had named it, whose foundational status required time to become visible. The combination of high progeny and a revised arc tells a particular story: the work mattered enormously, and we had to be corrected before we could see it.",
    };
  }
  if (metrics.arc >= 70 && metrics.consensus <= 40) {
    return {
      name: "The Vindicator",
      description:
        "You are specifically drawn to films that time had to correct — works where the initial reception was wrong, where the rehabilitation is not just a pleasant revision but the essential fact about the film. The low consensus tells you the correction is incomplete; the high arc tells you the distance is real. You are interested in the gap itself, and in what it says about the conditions that produced the original verdict.",
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
