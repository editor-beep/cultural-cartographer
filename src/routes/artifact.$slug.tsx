import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AXES, getArtifact, ARTIFACTS, type AfterlifeEvent, type Faction, type Metrics, type AxisKey } from "@/data/artifacts";
import { Sigil } from "@/components/Sigil";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { shareArtifactImage } from "@/lib/screenshot";
import { useUserFilms } from "@/lib/user-films-context";
import { mergeByIdentity } from "@/lib/media-identity";

type AxisBands = [string, string, string, string]; // subdued, present, elevated, extreme

const AXIS_BANDS: Record<AxisKey, AxisBands> = {
  consensus: [
    "Fractured — no stable reading has formed across populations.",
    "Contested — a dominant reading exists but is regularly challenged.",
    "Settled — broad alignment with pockets of dissent.",
    "Resolved — wide, durable agreement across critic and audience record.",
  ],
  friction: [
    "Quiet — the interpretive gap has closed or never opened.",
    "Simmering — disagreement exists but has not hardened.",
    "Active — the gap is current, unresolved, and generating heat.",
    "Contested — the work refuses every attempt at assimilation.",
  ],
  obsession: [
    "Inert — the work has receded from active discourse.",
    "Present — being referenced, but not dwelt upon.",
    "Persistent — returning regularly to cultural attention.",
    "Consumed — being lived with over time, not filed away.",
  ],
  haunting: [
    "Quiet — the work does not follow viewers beyond the screening.",
    "Occasional — some residual presence reported, but not systematic.",
    "Recurring — viewers report unwilled return across the years.",
    "Installed — the work recurs without invitation; it has moved in.",
  ],
  symbolic: [
    "Transparent — read as story rather than system.",
    "Legible — some motif-tracking, but not theory-heavy.",
    "Layered — sustained interpretive activity; the film is being decoded.",
    "Dense — read as territory to map; multiple competing frameworks.",
  ],
  cult: [
    "Mainstream — no distinct devotional community has formed.",
    "Emerging — pockets of strong attachment, but no unified identity.",
    "Formed — a distinct custodial community exists and is active.",
    "Entrenched — deep devotion, often shaped by initial rejection and reclamation.",
  ],
  formal: [
    "Conventional — works within accepted shapes and structures.",
    "Deviating — notable formal choices, but within legible tradition.",
    "Risky — sustained formal experimentation that tests viewer tolerance.",
    "Radical — the work refused every known shape and chose another.",
  ],
  voltage: [
    "Cool — measured emotional register; no extreme physiological reports.",
    "Engaged — notable response, contained within normal range.",
    "Charged — physiological reactions documented: tears, tension, unease.",
    "Extreme — the work moves bodies; crying, panic, awe, nausea in the record.",
  ],
  accessibility: [
    "Demanding — requires prior context, tolerance, or significant preparation.",
    "Selective — available to prepared viewers; rewards prior knowledge.",
    "Open — most viewers can enter without special context.",
    "Universal — no glossary required; the work provides its own entry.",
  ],
  reach: [
    "Contained — circulates primarily within dedicated film discourse.",
    "Spreading — occasional reference outside film culture; some imagery in wider circulation.",
    "Permeating — imagery and language used by people who have not seen the work.",
    "Saturated — a shared reference in the general cultural vocabulary.",
  ],
  progeny: [
    "Terminal — no documented lineage; no works cite it as formative.",
    "Acknowledged — named as an influence by a handful of subsequent filmmakers.",
    "Generative — a clear aesthetic lineage can be traced through subsequent work.",
    "Foundational — a genre, subgenre, or movement traces its origin here.",
  ],
  arc: [
    "Stable — arrived at roughly its current standing and has remained.",
    "Revised — time has shifted the reading somewhat; the initial verdict has softened or hardened.",
    "Overturned — the work's cultural position is substantially different from its initial reception.",
    "Transformed — near-complete reversal in standing since release.",
  ],
  transgression: [
    "Safe — the work's content operates well within accepted social limits.",
    "Uncomfortable — touches sensitive territory but does not breach social limits.",
    "Provocative — content was considered transgressive; controversy around what it showed or said.",
    "Prohibited — banned, censored, or formally classified as socially harmful in one or more contexts.",
  ],
};

function getAxisBand(key: AxisKey, value: number): { label: string; description: string } {
  const bands = AXIS_BANDS[key];
  const labels = ["Subdued", "Present", "Elevated", "Extreme"];
  const idx = value <= 25 ? 0 : value <= 50 ? 1 : value <= 75 ? 2 : 3;
  return { label: labels[idx], description: bands[idx] };
}

export const Route = createFileRoute("/artifact/$slug")({
  component: Dossier,
  loader: ({ params }) => {
    const a = getArtifact(params.slug);
    if (!a) throw notFound();
    return { artifact: a };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.artifact.title} — The Artifact Index` },
            {
              name: "description",
              content: loaderData.artifact.reading.slice(0, 160),
            },
          ],
        }
      : {},
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-8 py-32 text-center">
      <div className="font-mono text-[10px] text-vellum-dim smallcaps">Catalogue gap</div>
      <h1 className="mt-4 font-display text-5xl text-vellum">No such artifact.</h1>
      <Link to="/" className="mt-8 inline-block smallcaps text-[11px] text-oxblood">
        ← Return to the field
      </Link>
    </div>
  ),
});

function metricsDistance(a: Metrics, b: Metrics): number {
  let s = 0;
  for (const ax of AXES) {
    const d = (a[ax.key as AxisKey] - b[ax.key as AxisKey]) / 100;
    s += d * d;
  }
  return Math.sqrt(s / AXES.length);
}

function Dossier() {
  const { artifact: a } = Route.useLoaderData();
  const [sharing, setSharing] = useState(false);
  const { userFilms } = useUserFilms();
  const allArtifacts = useMemo(() => {
    return mergeByIdentity(ARTIFACTS, userFilms);
  }, [userFilms]);
  const others = allArtifacts
    .filter((x) => x.slug !== a.slug)
    .sort((x, y) => metricsDistance(a.metrics, x.metrics) - metricsDistance(a.metrics, y.metrics))
    .slice(0, 3);

  async function handleShare() {
    setSharing(true);
    try {
      await shareArtifactImage(a.metrics, a.title, a.director, a.year);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      {/* Header strip */}
      <section className="relative z-10 mx-auto mt-10 max-w-[1400px] px-4 md:mt-16 md:px-8">
        <div className="flex items-baseline justify-between">
          <Link to="/" className="smallcaps text-[10px] text-vellum-dim hover:text-vellum">
            ← Atlas
          </Link>
          <div className="flex items-baseline gap-6">
            <Link
              to="/compare"
              search={{ a: a.slug }}
              className="smallcaps text-[10px] text-vellum-dim hover:text-vellum"
            >
              Compare ↗
            </Link>
            <button
              onClick={handleShare}
              disabled={sharing}
              className="smallcaps text-[10px] text-vellum-dim hover:text-vellum disabled:opacity-40"
            >
              {sharing ? "saving…" : "Share ↗"}
            </button>
            <div className="font-mono text-[10px] text-vellum-dim smallcaps">
              {a.catalogue} · acquired {a.year} · running time {a.runtime}m
            </div>
          </div>
        </div>

        <div className="rule mt-4" />

        <div className="mt-8 grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-8">
            <div className="font-mono text-[10px] smallcaps text-oxblood">
              {a.director} · {a.year}
            </div>
            <h1 className="mt-3 font-display text-6xl leading-[1.02] text-vellum md:text-8xl">
              {a.title}
            </h1>
            <p className="mt-6 max-w-2xl font-display text-xl italic leading-relaxed text-vellum-dim">
              “{a.epigraph}”
            </p>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-vellum/90">
              {a.reading}
            </p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="aspect-square w-full">
              <Sigil metrics={a.metrics} size={420} showLabels uid={a.slug + "-hero"} />
            </div>
          </div>
        </div>
      </section>

      {/* Axis readings */}
      <section className="relative z-10 mx-auto mt-14 max-w-[1400px] px-4 md:mt-24 md:px-8">
        <div className="rule mb-6" />
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-vellum">The Reading</h2>
          <Link to="/lexicon" className="smallcaps text-[10px] text-vellum-dim hover:text-vellum">
            Lexicon ↗
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-12 gap-y-0 md:grid-cols-2">
          {AXES.map((axis) => {
            const v = a.metrics[axis.key];
            const note = a.notes[axis.key];
            const band = getAxisBand(axis.key, v);
            return (
              <div key={axis.key} className="border-b border-border py-6">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-lg text-vellum">{axis.label}</div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-vellum-dim smallcaps">{band.label}</span>
                    <span className="font-mono text-2xl tabular-nums text-oxblood">
                      {String(v).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-px w-full bg-vellum/10">
                  <div
                    className="h-px bg-oxblood"
                    style={{ width: `${v}%` }}
                  />
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-vellum/50">{band.description}</p>
                {note && (
                  <p className="mt-3 font-display text-sm italic text-vellum-dim">{note}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cultural Afterlife timeline */}
      <section className="relative z-10 mx-auto mt-14 max-w-[1400px] px-4 md:mt-24 md:px-8">
        <div className="rule mb-6" />
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-vellum">Cultural Afterlife</h2>
          <div className="font-mono text-[10px] text-vellum-dim smallcaps">
            {a.afterlife[0].year} → 2026
          </div>
        </div>
        <AfterlifeTimeline events={a.afterlife} />
      </section>

      {/* Discourse factions + symbols */}
      <section className="relative z-10 mx-auto mt-14 max-w-[1400px] px-4 md:mt-24 md:px-8">
        <div className="rule mb-6" />
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-7">
            <h2 className="mb-6 font-display text-2xl text-vellum">Discourse Factions</h2>
            <div className="space-y-4">
              {a.factions.map((f: Faction) => (
                <div key={f.name} className="border border-border bg-umber/30 p-5">
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-lg italic text-vellum">{f.name}</div>
                    <div className="font-mono text-[11px] tabular-nums text-vellum-dim">
                      {Math.round(f.share * 100)}%
                    </div>
                  </div>
                  <div className="mt-2 h-px w-full bg-vellum/10">
                    <div className="h-px bg-vellum/40" style={{ width: `${f.share * 100}%` }} />
                  </div>
                  <p className="mt-3 font-display text-base italic text-vellum-dim">
                    {f.voice}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <h2 className="mb-6 font-display text-2xl text-vellum">Recurring Symbols</h2>
            <ul className="space-y-2">
              {a.symbols.map((s: string) => (
                <li
                  key={s}
                  className="flex items-center justify-between border-b border-border py-2"
                >
                  <span className="font-display text-lg italic text-vellum">{s}</span>
                  <span className="font-mono text-[10px] text-vellum-dim smallcaps">
                    surfaced
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pressure neighbors */}
      <section className="relative z-10 mx-auto mt-14 max-w-[1400px] px-4 md:mt-24 md:px-8">
        <div className="rule mb-6" />
        <h2 className="mb-8 font-display text-2xl text-vellum">Adjacent Pressure</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              to="/artifact/$slug"
              params={{ slug: o.slug }}
              className="group block border border-border bg-umber/30 p-6 transition-colors hover:bg-umber/60"
            >
              <div className="aspect-square w-full">
                <Sigil metrics={o.metrics} size={220} animate={false} uid={"adj-" + o.slug} />
              </div>
              <div className="mt-4 font-mono text-[10px] text-vellum-dim smallcaps">
                {o.catalogue}
              </div>
              <div className="font-display text-xl text-vellum group-hover:text-oxblood">
                {o.title}
              </div>
              <div className="font-mono text-[10px] text-vellum-dim smallcaps">
                {o.year} · {o.director}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// Timeline label geometry (px)
const LABEL_WIDTH = 160;
const LABEL_GAP_X = 14; // min horizontal gap between two labels sharing a lane
const LANE_GAP_Y = 12; // vertical gap between stacked lanes
const CONNECTOR_MIN = 34; // distance from axis to the nearest lane
const EDGE_PAD = 8;
const TIMELINE_MIN_WIDTH = 560;
const TIMELINE_FALLBACK_WIDTH = 960; // used for SSR / first paint, before measuring

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Rough height of a label before it has been measured, so the first paint is close.
function estimateLabelHeight(label: string) {
  const lines = Math.max(1, Math.ceil(label.length / 26));
  return 15 + lines * 17;
}

// Map a year to a horizontal percentage, padded 4%–96% to keep edge dots visible
function yearToPercent(year: number, minY: number, span: number) {
  return 4 + ((year - minY) / span) * 92;
}

function AfterlifeTimeline({ events }: { events: AfterlifeEvent[] }) {
  const ordered = useMemo(
    () => events.map((e, i) => ({ ...e, key: i })).sort((a, b) => a.year - b.year),
    [events],
  );
  const minY = ordered[0].year;
  const maxY = Math.max(2026, ordered[ordered.length - 1].year);
  const span = Math.max(1, maxY - minY);

  const colorByKind: Record<AfterlifeEvent["kind"], string> = {
    release: "var(--vellum)",
    rejection: "var(--oxblood)",
    rediscovery: "var(--vellum)",
    criterion: "var(--vellum)",
    academic: "var(--vellum-dim)",
    meme: "var(--oxblood)",
    reissue: "var(--vellum)",
    wound: "var(--oxblood)",
  };

  const toLeft = (year: number) => yearToPercent(year, minY, span);

  const ticks = Array.from({ length: Math.ceil(span / 5) + 1 })
    .map((_, i) => minY + i * 5)
    .filter((y) => y <= maxY);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [boxWidth, setBoxWidth] = useState(0);
  const [heights, setHeights] = useState<number[]>([]);

  useIsomorphicLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setBoxWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Measure the rendered labels so lanes are stacked by real height, not a guess.
  useIsomorphicLayoutEffect(() => {
    const next = ordered.map((_, i) => labelRefs.current[i]?.offsetHeight ?? 0);
    setHeights((prev) =>
      prev.length === next.length && next.every((h, i) => h === prev[i]) ? prev : next,
    );
  });

  // Assign each label to a lane on its side of the axis so labels never overlap:
  // lane 0 sits closest to the axis, and a label only shares a lane when it clears
  // every label already in it horizontally.
  const layout = useMemo(() => {
    const width = Math.max(boxWidth || TIMELINE_FALLBACK_WIDTH, TIMELINE_MIN_WIDTH);
    const maxLeft = Math.max(EDGE_PAD, width - LABEL_WIDTH - EDGE_PAD);

    const items = ordered.map((e, i) => {
      const center = (yearToPercent(e.year, minY, span) / 100) * width;
      return {
        event: e,
        index: i,
        above: i % 2 === 0,
        center,
        left: Math.min(Math.max(center - LABEL_WIDTH / 2, EDGE_PAD), maxLeft),
        height: heights[i] || estimateLabelHeight(e.label),
        offset: CONNECTOR_MIN,
      };
    });

    const placeSide = (above: boolean) => {
      const side = items.filter((it) => it.above === above).sort((a, b) => a.left - b.left);
      const laneRight: number[] = [];
      const laneHeight: number[] = [];
      const laneOf = new Map<number, number>();

      for (const it of side) {
        let lane = 0;
        while (lane < laneRight.length && it.left < laneRight[lane] + LABEL_GAP_X) lane++;
        laneOf.set(it.index, lane);
        laneRight[lane] = it.left + LABEL_WIDTH;
        laneHeight[lane] = Math.max(laneHeight[lane] ?? 0, it.height);
      }

      const laneOffset: number[] = [];
      let acc = CONNECTOR_MIN;
      for (let lane = 0; lane < laneHeight.length; lane++) {
        laneOffset[lane] = acc;
        acc += laneHeight[lane] + LANE_GAP_Y;
      }

      let extent = 0;
      for (const it of side) {
        it.offset = laneOffset[laneOf.get(it.index) ?? 0];
        extent = Math.max(extent, it.offset + it.height);
      }
      return extent;
    };

    const aboveExtent = placeSide(true);
    const belowExtent = placeSide(false);
    const height = Math.max(260, aboveExtent + belowExtent + 24);
    const axisY = aboveExtent + (height - aboveExtent - belowExtent) / 2;

    return { items, height, axisY };
  }, [ordered, heights, boxWidth, minY, span]);

  return (
    <div>
      <div className="overflow-x-auto">
      <div
        ref={boxRef}
        data-timeline
        className="relative overflow-hidden border border-border bg-umber/30"
        style={{ height: layout.height, minWidth: TIMELINE_MIN_WIDTH }}
      >
        {/* axis */}
        <div className="absolute inset-x-0 h-px bg-vellum/20" style={{ top: layout.axisY }} />

        {/* 5-year ticks */}
        {ticks.map((y) => (
          <div
            key={y}
            className="absolute -translate-x-1/2"
            style={{ left: `${toLeft(y)}%`, top: layout.axisY }}
          >
            <div className="h-2 w-px bg-vellum/30" />
            <div className="mt-1 font-mono text-[9px] text-vellum-dim smallcaps">{y}</div>
          </div>
        ))}

        {/* events */}
        {layout.items.map((it) => {
          const e = it.event;
          const left = toLeft(e.year);
          const color = colorByKind[e.kind];

          return (
            <div key={e.key}>
              {/* dot on axis */}
              <div
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: layout.axisY,
                  transform: "translate(-50%, -50%)",
                  width: 8,
                  height: 8,
                  background: color,
                }}
              />
              {/* connector — runs from the axis to the label's inner edge */}
              <div
                className="absolute w-px"
                style={{
                  left: `${left}%`,
                  background: "var(--vellum-dim)",
                  opacity: 0.35,
                  height: it.offset,
                  top: it.above ? layout.axisY - it.offset : layout.axisY,
                }}
              />
              {/* label — clamped horizontally, lane-stacked vertically */}
              <div
                ref={(el) => {
                  labelRefs.current[it.index] = el;
                }}
                data-timeline-label
                className="absolute"
                style={{
                  left: it.left,
                  width: LABEL_WIDTH,
                  ...(it.above
                    ? { bottom: layout.height - (layout.axisY - it.offset) }
                    : { top: layout.axisY + it.offset }),
                }}
              >
                <div className="font-mono text-[9px] smallcaps" style={{ color }}>
                  {e.year} · {e.kind}
                </div>
                <div className="mt-0.5 font-display text-[12px] italic leading-snug text-vellum">
                  {e.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] text-vellum-dim smallcaps">
        <Legend color="var(--vellum)" label="release / rediscovery / criterion" />
        <Legend color="var(--oxblood)" label="rejection / meme / wound" />
        <Legend color="var(--vellum-dim)" label="academic adoption" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ width: 8, height: 8, background: color, display: "inline-block" }} />
      {label}
    </div>
  );
}
