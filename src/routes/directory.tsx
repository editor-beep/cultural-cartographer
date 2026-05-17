import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ARTIFACTS, type Metrics } from "@/data/artifacts";
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
        content: "An alphabetical directory of all media in the Artifact Index.",
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
  reading: string;
  medium?: string;
  metrics: Metrics;
};

// Returns the title with leading articles ("a", "an", "the") stripped for sorting.
function sortKey(title: string): string {
  return title.replace(/^(the|an?)\s+/i, "").trim();
}

function FilterBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border border-border bg-umber/30 px-4 py-3">
      {children}
    </div>
  );
}

function Directory() {
  const { userFilms } = useUserFilms();
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [directorFilter, setDirectorFilter] = useState<string>("all");
  const [actorFilter, setActorFilter] = useState<string>("");
  const [musicianFilter, setMusicianFilter] = useState<string>("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const allArtifacts = useMemo(() => {
    const known = new Set(ARTIFACTS.map((a) => a.slug));
    return [...ARTIFACTS, ...userFilms.filter((u) => !known.has(u.slug))];
  }, [userFilms]);

  const sorted = useMemo(
    () =>
      [...allArtifacts]
        .map(
          (a): ArtifactListItem => ({
            slug: a.slug,
            title: a.title,
            year: a.year,
            director: a.director,
            catalogue: a.catalogue,
            reading: a.reading,
            medium: a.medium,
            metrics: a.metrics,
          }),
        )
        .sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title))),
    [allArtifacts],
  );

  const uniqueYears = useMemo(
    () => Array.from(new Set(sorted.map((a) => a.year))).sort((a, b) => a - b),
    [sorted],
  );

  const uniqueDirectors = useMemo(
    () => Array.from(new Set(sorted.map((a) => a.director))).sort(),
    [sorted],
  );

  const filtered = useMemo(() => {
    return sorted.filter((a) => {
      if (yearFilter !== "all" && a.year !== parseInt(yearFilter)) return false;
      if (directorFilter !== "all" && a.director !== directorFilter) return false;
      if (actorFilter.trim()) {
        const term = actorFilter.toLowerCase();
        if (!a.reading.toLowerCase().includes(term)) return false;
      }
      if (musicianFilter.trim()) {
        const term = musicianFilter.toLowerCase();
        const matchesArtist = a.medium === "album" && a.director.toLowerCase().includes(term);
        const matchesReading = a.reading.toLowerCase().includes(term);
        if (!matchesArtist && !matchesReading) return false;
      }
      return true;
    });
  }, [sorted, yearFilter, directorFilter, actorFilter, musicianFilter]);

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, ArtifactListItem[]>>((acc, item) => {
        const first = sortKey(item.title).charAt(0).toUpperCase();
        const key = /^[A-Z]$/.test(first) ? first : "#";
        acc[key] ??= [];
        acc[key].push(item);
        return acc;
      }, {}),
    [filtered],
  );

  const letters = Object.keys(grouped).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  const hasFilters =
    yearFilter !== "all" ||
    directorFilter !== "all" ||
    actorFilter.trim() !== "" ||
    musicianFilter.trim() !== "";

  function clearFilters() {
    setYearFilter("all");
    setDirectorFilter("all");
    setActorFilter("");
    setMusicianFilter("");
  }

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <section className="relative z-10 mx-auto mt-16 max-w-[1100px] px-8">
        <div className="font-mono text-[10px] smallcaps text-oxblood">Catalogue directory</div>
        <h1 className="mt-3 font-display text-6xl leading-[1.02] text-vellum">A–Z Directory</h1>
        <p className="mt-6 max-w-2xl font-display text-xl italic text-vellum-dim">
          All media currently in the database, grouped alphabetically.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          <FilterBox>
            <label className="font-mono text-[10px] smallcaps text-vellum-dim">Year</label>
            <select
              className="bg-transparent font-mono text-[11px] text-vellum outline-none"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="all">All years</option>
              {uniqueYears.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </FilterBox>

          <FilterBox>
            <label className="font-mono text-[10px] smallcaps text-vellum-dim">Director</label>
            <select
              className="bg-transparent font-mono text-[11px] text-vellum outline-none"
              value={directorFilter}
              onChange={(e) => setDirectorFilter(e.target.value)}
            >
              <option value="all">All</option>
              {uniqueDirectors.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </FilterBox>

          <FilterBox>
            <label className="font-mono text-[10px] smallcaps text-vellum-dim">Actor</label>
            <input
              className="bg-transparent font-mono text-[11px] text-vellum outline-none placeholder:text-vellum-dim/50"
              placeholder="Search by actor…"
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
            />
          </FilterBox>

          <FilterBox>
            <label className="font-mono text-[10px] smallcaps text-vellum-dim">Musician</label>
            <input
              className="bg-transparent font-mono text-[11px] text-vellum outline-none placeholder:text-vellum-dim/50"
              placeholder="Search by musician…"
              value={musicianFilter}
              onChange={(e) => setMusicianFilter(e.target.value)}
            />
          </FilterBox>
        </div>

        {hasFilters && (
          <div className="mt-4 flex items-center gap-6">
            <span className="font-mono text-[10px] smallcaps text-vellum-dim">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
            <button
              onClick={clearFilters}
              className="font-mono text-[10px] smallcaps text-oxblood hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="rule mt-8" />

        {filtered.length === 0 ? (
          <p className="mt-12 font-display text-xl italic text-vellum-dim">
            No entries match the current filters.
          </p>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-mono text-[10px] smallcaps text-vellum-dim">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => setOpenItems(letters)}
                  className="font-mono text-[10px] smallcaps text-vellum-dim hover:text-vellum transition-colors"
                >
                  Expand all
                </button>
                <button
                  onClick={() => setOpenItems([])}
                  className="font-mono text-[10px] smallcaps text-vellum-dim hover:text-vellum transition-colors"
                >
                  Collapse all
                </button>
              </div>
            </div>

            <Accordion
              type="multiple"
              value={openItems}
              onValueChange={setOpenItems}
              className="mt-4 w-full"
            >
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
                            className="group flex items-center gap-4 py-3 transition-colors hover:bg-umber/40"
                          >
                            <div className="shrink-0 w-9 h-9 opacity-80 group-hover:opacity-100 transition-opacity">
                              <Sigil metrics={a.metrics} size={36} animate={false} uid={a.slug} />
                            </div>
                            <div className="grid flex-1 grid-cols-12 items-baseline gap-4">
                              <div className="col-span-3 font-mono text-[10px] text-vellum-dim smallcaps">
                                {a.catalogue}
                              </div>
                              <div className="col-span-9 font-display text-xl text-vellum group-hover:text-oxblood">
                                {a.title}
                                <span className="ml-3 font-body text-xs text-vellum-dim">
                                  {a.year} · {a.director}
                                </span>
                              </div>
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
