import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ARTIFACTS, type Artifact, type Medium } from "@/data/artifacts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo, useState } from "react";
import { useUserFilms } from "@/lib/user-films-context";
import { Sigil } from "@/components/Sigil";

export const Route = createFileRoute("/directory")({
  component: Directory,
  head: () => ({
    meta: [
      { title: "Directory — The Artifact Index" },
      {
        name: "description",
        content: "Browse and search all artifacts in the Artifact Index by title, director, actor, year, or medium.",
      },
    ],
  }),
});

type ArtifactListItem = {
  slug: string;
  title: string;
  year: number;
  director: string;
  catalogue: string;
  cast?: string[];
  medium?: Medium;
  metrics: Artifact["metrics"];
};

const MEDIUM_LABEL: Record<Medium, string> = {
  film: "Film",
  tv: "Television",
  book: "Book",
  album: "Album",
};

const ALL_MEDIA: Medium[] = ["film", "tv", "book", "album"];

function normalize(s: string) {
  return s.toLowerCase().trim();
}

// Returns the title with leading articles ("a", "an", "the") stripped for sorting.
function sortKey(title: string): string {
  return title.replace(/^(the|an?)\s+/i, "").trim();
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

function matchesCast(cast: string[] | undefined, q: string): string | null {
  if (!cast || !q) return null;
  const match = cast.find((c) => normalize(c).includes(q));
  return match ?? null;
}

function Directory() {
  const { userFilms } = useUserFilms();
  const [query, setQuery] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [activeMedia, setActiveMedia] = useState<Set<Medium>>(new Set());

  const allArtifacts = useMemo(() => {
    const known = new Set(ARTIFACTS.map((a) => a.slug));
    return [...ARTIFACTS, ...userFilms.filter((u) => !known.has(u.slug))];
  }, [userFilms]);

  const items = useMemo(
    () =>
      allArtifacts.map(
        (a): ArtifactListItem => ({
          slug: a.slug,
          title: a.title,
          year: a.year,
          director: a.director,
          catalogue: a.catalogue,
          cast: a.cast,
          medium: a.medium,
          metrics: a.metrics,
        }),
      ),
    [allArtifacts],
  );

  const isFiltered = query.trim() !== "" || yearInput.trim() !== "" || activeMedia.size > 0;

  const filteredItems = useMemo(() => {
    if (!isFiltered) return items;

    const q = normalize(query);
    const yearNum = yearInput.trim() !== "" ? parseInt(yearInput.trim(), 10) : null;

    return items.filter((a) => {
      // Medium filter
      if (activeMedia.size > 0 && !activeMedia.has((a.medium ?? "film") as Medium)) return false;

      // Year filter
      if (yearNum !== null && !isNaN(yearNum) && a.year !== yearNum) return false;

      // Text query: match title, director, or cast
      if (q) {
        const titleMatch = normalize(a.title).includes(q);
        const directorMatch = normalize(a.director).includes(q);
        const castMatch = matchesCast(a.cast, q) !== null;
        if (!titleMatch && !directorMatch && !castMatch) return false;
      }

      return true;
    });
  }, [items, isFiltered, query, yearInput, activeMedia]);

  // Sorted for A-Z view
  const sorted = useMemo(
    () => [...items].sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title))),
    [items],
  );

  const grouped = useMemo(
    () =>
      sorted.reduce<Record<string, ArtifactListItem[]>>((acc, item) => {
        const first = sortKey(item.title).charAt(0).toUpperCase();
        const key = /^[A-Z]$/.test(first) ? first : "#";
        acc[key] ??= [];
        acc[key].push(item);
        return acc;
      }, {}),
    [sorted],
  );

  const letters = Object.keys(grouped).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  const q = normalize(query);

  function toggleMedium(m: Medium) {
    setActiveMedia((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  }

  function clearAll() {
    setQuery("");
    setYearInput("");
    setActiveMedia(new Set());
  }

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <section className="relative z-10 mx-auto mt-16 max-w-[1100px] px-8">
        <div className="font-mono text-[10px] smallcaps text-oxblood">Catalogue directory</div>
        <h1 className="mt-3 font-display text-6xl leading-[1.02] text-vellum">A–Z Directory</h1>
        <p className="mt-6 max-w-2xl font-display text-xl italic text-vellum-dim">
          Search by title, director, actor, or year. Filter by medium. All {items.length} artifacts.
        </p>
        <div className="rule mt-12" />

        {/* ── Filter bar ── */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Text search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, director, or actor…"
                className="w-full border border-border bg-transparent px-4 py-2 font-body text-sm text-vellum placeholder:text-vellum-dim focus:border-oxblood focus:outline-none"
              />
            </div>

            {/* Year input */}
            <div className="relative w-full sm:w-28">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value.replace(/\D/g, ""))}
                placeholder="Year"
                className="w-full border border-border bg-transparent px-4 py-2 font-mono text-sm text-vellum placeholder:text-vellum-dim focus:border-oxblood focus:outline-none"
              />
            </div>

            {/* Clear */}
            {isFiltered && (
              <button
                onClick={clearAll}
                className="font-mono text-[10px] text-vellum-dim smallcaps hover:text-oxblood transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Medium toggles */}
          <div className="flex flex-wrap gap-2">
            {ALL_MEDIA.map((m) => {
              const active = activeMedia.has(m);
              return (
                <button
                  key={m}
                  onClick={() => toggleMedium(m)}
                  className={
                    "border px-3 py-1 font-mono text-[10px] smallcaps transition-colors " +
                    (active
                      ? "border-oxblood bg-oxblood/20 text-oxblood"
                      : "border-border text-vellum-dim hover:border-oxblood/50 hover:text-vellum")
                  }
                >
                  {MEDIUM_LABEL[m]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Results / Directory ── */}
        {isFiltered ? (
          <FilteredResults items={filteredItems} q={q} yearInput={yearInput} />
        ) : (
          <>
            <Accordion type="multiple" className="mt-8 w-full">
              {letters.map((letter) => (
                <AccordionItem key={letter} value={letter} className="border-border">
                  <AccordionTrigger className="font-display text-2xl text-vellum hover:no-underline">
                    <span>{letter}</span>
                    <span className="mr-3 font-mono text-[10px] text-vellum-dim smallcaps">
                      {grouped[letter].length} entries
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="divide-y divide-border">
                      {grouped[letter].map((a) => (
                        <li key={a.slug}>
                          <Link
                            to="/artifact/$slug"
                            params={{ slug: a.slug }}
                            className="group grid grid-cols-12 items-baseline gap-4 py-4 transition-colors hover:bg-umber/40"
                          >
                            <div className="col-span-3 font-mono text-[10px] text-vellum-dim smallcaps">
                              {a.catalogue}
                            </div>
                            <div className="col-span-9 font-display text-xl text-vellum group-hover:text-oxblood">
                              {a.title}
                              <span className="ml-3 font-body text-xs text-vellum-dim">
                                {a.year} · {a.director}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}

function FilteredResults({
  items,
  q,
  yearInput,
}: {
  items: ArtifactListItem[];
  q: string;
  yearInput: string;
}) {
  const label = buildLabel(items.length, q, yearInput);

  if (items.length === 0) {
    return (
      <div className="mt-12 py-16 text-center">
        <div className="font-mono text-[10px] text-vellum-dim smallcaps">No results</div>
        <p className="mt-3 font-display text-xl italic text-vellum-dim">
          Nothing in the index matches those filters.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6 font-mono text-[10px] text-vellum-dim smallcaps">{label}</div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((a) => (
          <SigilCard key={a.slug} item={a} q={q} />
        ))}
      </div>
    </div>
  );
}

function SigilCard({ item, q }: { item: ArtifactListItem; q: string }) {
  const matchedActor = q ? matchesCast(item.cast, q) : null;
  const trait = dominantTrait(item.metrics);
  const medium = item.medium ?? "film";

  return (
    <Link
      to="/artifact/$slug"
      params={{ slug: item.slug }}
      className="group flex flex-col items-center border border-border p-4 transition-colors hover:border-oxblood/60 hover:bg-umber/20"
    >
      {/* Sigil */}
      <div className="w-full max-w-[120px]">
        <Sigil metrics={item.metrics} size={120} animate={false} uid={item.slug} />
      </div>

      {/* Meta */}
      <div className="mt-3 w-full text-center">
        <div className="font-mono text-[9px] text-vellum-dim smallcaps">{item.catalogue}</div>
        <div className="mt-1 font-display text-base leading-tight text-vellum group-hover:text-oxblood">
          {item.title}
        </div>
        <div className="mt-1 font-body text-[11px] text-vellum-dim">
          {item.year} · {item.director}
        </div>

        {/* Matched actor callout */}
        {matchedActor && (
          <div className="mt-2 font-mono text-[9px] text-oxblood smallcaps">
            ↳ {matchedActor}
          </div>
        )}

        {/* Medium + dominant trait */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="font-mono text-[8px] text-vellum-dim smallcaps">
            {MEDIUM_LABEL[medium as Medium]}
          </span>
          <span className="text-vellum-dim/40">·</span>
          <span className="font-mono text-[8px] text-vellum-dim smallcaps">{trait}</span>
        </div>
      </div>
    </Link>
  );
}

function buildLabel(count: number, q: string, yearInput: string): string {
  const parts: string[] = [];
  if (yearInput.trim()) parts.push(`year ${yearInput.trim()}`);
  if (q) parts.push(`"${q}"`);
  const qualifier = parts.length > 0 ? ` for ${parts.join(", ")}` : "";
  return `${count} ${count === 1 ? "result" : "results"}${qualifier}`;
}
