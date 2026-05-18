import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTIFACTS, type Medium } from "@/data/artifacts";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useState, useMemo } from "react";
import { useUserFilms } from "@/lib/user-films-context";

const MEDIUM_COLOR: Record<Medium, string> = {
  film: "var(--medium-film)",
  tv: "var(--medium-tv)",
  book: "var(--medium-book)",
  album: "var(--medium-album)",
};

const MEDIUM_LABEL: Record<Medium, string> = {
  film: "Film",
  tv: "Television",
  book: "Book",
  album: "Album",
};

const ALL_MEDIA: Medium[] = ["film", "tv", "book", "album"];

export const Route = createFileRoute("/")({
  component: Atlas,
  head: () => ({
    meta: [
      { title: "The Artifact Index — Atlas" },
      {
        name: "description",
        content:
          "A live reading of cultural pressure across media. Not a score. A field of sigils.",
      },
    ],
  }),
});

function Atlas() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { userFilms } = useUserFilms();
  const allArtifacts = useMemo(() => {
    const known = new Set(ARTIFACTS.map((a) => a.slug));
    return [...ARTIFACTS, ...userFilms.filter((u) => !known.has(u.slug))];
  }, [userFilms]);
  const active = hovered ? allArtifacts.find((a) => a.slug === hovered) : null;

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      {/* Manifesto */}
      <section className="relative z-10 mx-auto mt-16 max-w-[1400px] px-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7">
            <div className="font-mono text-[10px] smallcaps text-oxblood">
              Field reading · vol. I · media
            </div>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-vellum md:text-7xl">
              A map of <em className="text-oxblood">psychic pressure</em>,
              not a ledger of approval.
            </h1>
            <p className="mt-6 max-w-xl font-display text-lg italic leading-relaxed text-vellum-dim">
              Each work below is rendered as a sigil — a closed shape whose
              geometry encodes obsession, friction, residual haunting, and
              seven other readings drawn from the open record of how it is
              actually being lived with.
            </p>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="rule mb-4" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[10px] text-vellum-dim smallcaps">
              <div>Catalogue · {allArtifacts.length} entries</div>
              <div>Method · v0.1</div>
              <div>Sources · curated</div>
              <div>Refresh · manual</div>
              <div>Scores · none</div>
              <div>Rankings · none</div>
            </div>
          </div>
        </div>
      </section>

      {/* The dark field */}
      <section className="relative z-10 mx-auto mt-20 max-w-[1400px] px-8">
        <div className="rule mb-4" />
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-vellum">The Field</h2>
          <div className="font-mono text-[10px] text-vellum-dim smallcaps">
            {active ? `${active.catalogue} · ${active.title}` : "Hover an artifact"}
          </div>
        </div>

        {/*
          Two-layer map: background is clipped to the aspect-ratio frame;
          the sigil layer overflows so hover labels can escape below/above
          the chart boundary without being cut off.
        */}
        <div className="relative aspect-[16/10] w-full">
          {/* Background layer — clipped to frame */}
          <div className="absolute inset-0 overflow-hidden border border-border bg-umber/30">
            {/* faint cartographic gridlines */}
            <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
              <defs>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--vellum)" strokeOpacity="0.08" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* corner crosshairs */}
            {[
              { l: 12, t: 12 },
              { r: 12, t: 12 },
              { l: 12, b: 12 },
              { r: 12, b: 12 },
            ].map((p, i) => (
              <div
                key={i}
                className="pointer-events-none absolute"
                style={{ left: p.l, right: p.r, top: p.t, bottom: p.b }}
              >
                <div className="h-px w-4 bg-vellum/30" />
                <div className="-mt-px h-4 w-px bg-vellum/30" />
              </div>
            ))}
          </div>

          {/* Dot layer — overflow visible so labels escape the frame */}
          {allArtifacts.map((a) => {
            const dotSize = 6 + Math.round(a.metrics.obsession * 0.06);
            const labelAbove = a.pos.y > 0.55;
            const medium = a.medium ?? "film";
            return (
              <Link
                key={a.slug}
                to="/artifact/$slug"
                params={{ slug: a.slug }}
                onMouseEnter={() => setHovered(a.slug)}
                onMouseLeave={() => setHovered(null)}
                className="group absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 hover:scale-150"
                style={{
                  left: `${Math.max(0, Math.min(1, a.pos.x)) * 100}%`,
                  top: `${Math.max(0, Math.min(1, a.pos.y)) * 100}%`,
                  zIndex: hovered === a.slug ? 20 : 10,
                }}
              >
                <div
                  className="rounded-full opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ width: dotSize, height: dotSize, backgroundColor: MEDIUM_COLOR[medium] }}
                />
                <div
                  className={
                    "pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-opacity duration-200 " +
                    (labelAbove ? "bottom-full mb-2" : "top-full mt-2") +
                    " " +
                    (hovered === a.slug ? "opacity-100" : "opacity-0")
                  }
                >
                  <div className="font-display text-sm italic text-vellum">{a.title}</div>
                  <div className="font-mono text-[9px] text-vellum-dim smallcaps">
                    {a.year} · {a.director}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-vellum-dim smallcaps">
          <div>Position seeded by metric vector · clusters indicate shared pressure shape</div>
          <div className="flex items-center gap-4">
            {ALL_MEDIA.map((m) => (
              <div key={m} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: MEDIUM_COLOR[m] }}
                />
                <span>{MEDIUM_LABEL[m]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Index list */}
      <section className="relative z-10 mx-auto mt-24 max-w-[1400px] px-8">
        <div className="rule mb-4" />
        <h2 className="mb-8 font-display text-2xl text-vellum">Catalogue</h2>
        <ul className="divide-y divide-border">
          {allArtifacts.map((a) => (
            <li key={a.slug}>
              <Link
                to="/artifact/$slug"
                params={{ slug: a.slug }}
                className="group grid grid-cols-12 items-baseline gap-4 py-5 transition-colors hover:bg-umber/40"
              >
                <div className="col-span-2 font-mono text-[10px] text-vellum-dim smallcaps">
                  {a.catalogue}
                </div>
                <div className="col-span-7 font-display text-2xl text-vellum group-hover:text-oxblood">
                  {a.title}
                  <span className="ml-3 font-body text-xs text-vellum-dim">
                    {a.year} · {a.director}
                  </span>
                </div>
                <div className="col-span-3 text-right font-mono text-[10px] text-vellum-dim smallcaps">
                  {dominantTrait(a.metrics)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </div>
  );
}

function dominantTrait(m: Record<string, number>) {
  const entries = Object.entries(m).filter(([k]) => k !== "accessibility");
  entries.sort((a, b) => b[1] - a[1]);
  const map: Record<string, string> = {
    consensus: "consensus-stable",
    friction: "high-friction",
    obsession: "obsession-driven",
    haunting: "haunting object",
    symbolic: "symbolic dense",
    cult: "cult-formed",
    formal: "formally radical",
    voltage: "high-voltage",
  };
  return map[entries[0][0]] ?? "—";
}
