import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AXES, getArtifact, ARTIFACTS, type AfterlifeEvent, type Faction, type Metrics, type AxisKey } from "@/data/artifacts";
import { Sigil } from "@/components/Sigil";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

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
  const others = ARTIFACTS.filter((x) => x.slug !== a.slug)
    .sort((x, y) => metricsDistance(a.metrics, x.metrics) - metricsDistance(a.metrics, y.metrics))
    .slice(0, 3);

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      {/* Header strip */}
      <section className="relative z-10 mx-auto mt-16 max-w-[1400px] px-8">
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
      <section className="relative z-10 mx-auto mt-24 max-w-[1400px] px-8">
        <div className="rule mb-6" />
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-vellum">The Reading</h2>
          <Link to="/lexicon" className="smallcaps text-[10px] text-vellum-dim hover:text-vellum">
            Lexicon ↗
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2">
          {AXES.map((axis) => {
            const v = a.metrics[axis.key];
            const note = a.notes[axis.key];
            return (
              <div key={axis.key} className="border-b border-border py-5">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-lg text-vellum">{axis.label}</div>
                  <div className="font-mono text-2xl tabular-nums text-oxblood">
                    {String(v).padStart(2, "0")}
                  </div>
                </div>
                <div className="mt-2 h-px w-full bg-vellum/10">
                  <div
                    className="h-px bg-oxblood"
                    style={{ width: `${v}%` }}
                  />
                </div>
                {note && (
                  <p className="mt-3 font-display text-sm italic text-vellum-dim">{note}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cultural Afterlife timeline */}
      <section className="relative z-10 mx-auto mt-24 max-w-[1400px] px-8">
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
      <section className="relative z-10 mx-auto mt-24 max-w-[1400px] px-8">
        <div className="rule mb-6" />
        <div className="grid grid-cols-12 gap-12">
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
      <section className="relative z-10 mx-auto mt-24 max-w-[1400px] px-8">
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

function AfterlifeTimeline({ events }: { events: AfterlifeEvent[] }) {
  const minY = events[0].year;
  const maxY = 2026;
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

  return (
    <div className="relative">
      <div className="relative h-40 w-full border border-border bg-umber/30">
        {/* axis */}
        <div className="absolute inset-x-8 top-1/2 h-px bg-vellum/20" />
        {/* decades */}
        {Array.from({ length: Math.ceil(span / 5) + 1 }).map((_, i) => {
          const y = minY + i * 5;
          if (y > maxY) return null;
          const left = ((y - minY) / span) * 100;
          return (
            <div
              key={y}
              className="absolute top-1/2 -translate-x-1/2"
              style={{ left: `calc(${left}% * 0.94 + 2rem)` }}
            >
              <div className="h-2 w-px bg-vellum/30" />
              <div className="mt-1 font-mono text-[9px] text-vellum-dim smallcaps">{y}</div>
            </div>
          );
        })}

        {/* events */}
        {events.map((e, i) => {
          const left = ((e.year - minY) / span) * 100;
          const above = i % 2 === 0;
          return (
            <div
              key={i}
              className="absolute top-1/2"
              style={{ left: `calc(${left}% * 0.94 + 2rem)` }}
            >
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                style={{ width: 8, height: 8, background: colorByKind[e.kind] }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: above ? -64 : 16,
                  width: 180,
                }}
              >
                <div
                  className="mx-auto h-8 w-px"
                  style={{
                    background: "var(--vellum-dim)",
                    opacity: 0.5,
                  }}
                />
                <div
                  className={
                    "absolute left-1/2 -translate-x-1/2 " +
                    (above ? "bottom-8" : "top-8")
                  }
                  style={{ width: 180 }}
                >
                  <div className="font-mono text-[9px] smallcaps text-oxblood">
                    {e.year} · {e.kind}
                  </div>
                  <div className="mt-1 font-display text-[13px] italic leading-snug text-vellum">
                    {e.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
