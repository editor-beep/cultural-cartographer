import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useState, useRef } from "react";
import type { MovieRecord, ApiUsage } from "@/lib/green";
import { useUserFilms } from "@/lib/user-films-context";
import { Sigil } from "@/components/Sigil";
import { ARTIFACTS } from "@/data/artifacts";
import type { Artifact } from "@/data/artifacts";

export const Route = createFileRoute("/submit")({
  component: Submit,
  head: () => ({
    meta: [
      { title: "Submit Media — The Artifact Index" },
      {
        name: "description",
        content: "Send media to the green for a cultural reading.",
      },
    ],
  }),
});

type Status = "idle" | "loading" | "done" | "error";

const AXIS_LABELS: Record<string, string> = {
  consensus: "Consensus",
  friction: "Friction",
  obsession: "Obsession",
  haunting: "Haunting",
  symbolic: "Symbolic",
  cult: "Cult",
  formal: "Formal Risk",
  voltage: "Voltage",
  accessibility: "Accessibility",
  reach: "Reach",
  progeny: "Progeny",
  arc: "Arc",
  transgression: "Transgression",
};

function normalize(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function artifactToRecord(a: Artifact): MovieRecord {
  return {
    slug: a.slug,
    title: a.title,
    year: a.year,
    director: a.director,
    runtime: a.runtime,
    catalogue: a.catalogue,
    epigraph: a.epigraph,
    reading: a.reading,
    metrics: a.metrics,
    notes: (a.notes ?? {}) as Record<string, string>,
    afterlife: a.afterlife,
    factions: a.factions,
    symbols: a.symbols,
    medium: a.medium,
    pos: a.pos,
  };
}

function Submit() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<MovieRecord | null>(null);
  const [usage, setUsage] = useState<ApiUsage | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [suggestions, setSuggestions] = useState<Artifact[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addUserFilm } = useUserFilms();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    const q = normalize(val);
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const matches = ARTIFACTS.filter((a) => normalize(a.title).includes(q)).slice(0, 8);
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }

  function selectExisting(artifact: Artifact) {
    setTitle(artifact.title);
    setShowSuggestions(false);
    setSuggestions([]);
    setResult(artifactToRecord(artifact));
    setIsExisting(true);
    setUsage(null);
    setStatus("done");
  }

  function handleInputBlur() {
    // Delay so click on suggestion fires first
    setTimeout(() => setShowSuggestions(false), 150);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setShowSuggestions(false);

    // Surface exact match rather than re-submitting
    const q = normalize(title.trim());
    const exact = ARTIFACTS.find((a) => normalize(a.title) === q);
    if (exact) {
      selectExisting(exact);
      return;
    }

    setStatus("loading");
    setResult(null);
    setUsage(null);
    setErrorMsg("");
    setIsExisting(false);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const { _usage, ...record } = data as MovieRecord & { _usage?: ApiUsage };
      addUserFilm(record);
      setResult(record);
      setUsage(_usage ?? null);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      <section className="relative z-10 mx-auto mt-16 max-w-[1400px] px-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7">
            <div className="font-mono text-[10px] smallcaps text-oxblood">
              Submit · request a reading
            </div>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-vellum md:text-7xl">
              Send media{" "}
              <em className="text-oxblood">to the green.</em>
            </h1>
            <p className="mt-6 max-w-xl font-display text-lg italic leading-relaxed text-vellum-dim">
              The green scrapes the open record of how media is actually
              held — critic prose, audience admissions, diaristic residue —
              and returns a reading across the thirteen axes.
            </p>
          </div>

          <div className="col-span-12 md:col-span-5">
            <div className="rule mb-4" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[10px] text-vellum-dim smallcaps">
              <div>Method · green v1</div>
              <div>Model · Gemini 2.5 Pro</div>
              <div>Output · thirteen axes</div>
              <div>Storage · user-movies.json</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="relative z-10 mx-auto mt-20 max-w-[1400px] px-8">
        <div className="rule mb-8" />
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <label className="block font-mono text-[10px] smallcaps text-vellum-dim mb-3">
            Media title
          </label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleInputBlur}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="e.g. Inland Empire"
                disabled={status === "loading"}
                className={
                  "w-full border border-border bg-transparent px-4 py-3 font-display text-xl text-vellum placeholder:text-vellum-dim/40 " +
                  "focus:border-oxblood focus:outline-none disabled:opacity-40"
                }
              />
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 z-50 border border-border border-t-0 bg-umber shadow-lg"
                >
                  {suggestions.map((a) => (
                    <button
                      key={a.slug}
                      type="button"
                      onMouseDown={() => selectExisting(a)}
                      className="flex w-full items-baseline gap-3 px-4 py-2.5 text-left hover:bg-oxblood/10 transition-colors"
                    >
                      <span className="font-display text-base text-vellum">{a.title}</span>
                      <span className="font-mono text-[10px] text-vellum-dim smallcaps shrink-0">
                        {a.director} · {a.year}
                      </span>
                      <span className="ml-auto font-mono text-[9px] text-oxblood smallcaps shrink-0">
                        already indexed
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading" || !title.trim()}
              className={
                "border border-oxblood px-6 py-3 font-mono text-[11px] smallcaps text-oxblood " +
                "transition-colors hover:bg-oxblood hover:text-umber disabled:opacity-40 disabled:cursor-not-allowed"
              }
            >
              {status === "loading" ? "Reading…" : "Submit"}
            </button>
          </div>

          {status === "loading" && (
            <p className="mt-4 font-mono text-[10px] text-vellum-dim smallcaps animate-pulse">
              The green is scraping the open record —
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 font-mono text-[10px] text-oxblood smallcaps">
              Error · {errorMsg}
            </p>
          )}
        </form>
      </section>

      {/* Result */}
      {status === "done" && result && (
        <section className="relative z-10 mx-auto mt-16 max-w-[1400px] px-8 pb-8">
          <div className="rule mb-8" />

          <div className="grid grid-cols-12 gap-8">
            {/* Header */}
            <div className="col-span-12">
              <div className="font-mono text-[10px] smallcaps text-vellum-dim">
                {result.catalogue} · {result.year} · {result.director}
              </div>
              <h2 className="mt-2 font-display text-4xl text-vellum">{result.title}</h2>
              {result.epigraph && (
                <p className="mt-3 font-display text-lg italic text-vellum-dim">
                  "{result.epigraph}"
                </p>
              )}
              <div className="mt-4 flex gap-6 font-mono text-[10px] smallcaps">
                <span className="text-oxblood">
                  {isExisting ? "Already in the index ·" : "Added to the index ·"}
                </span>
                <Link to="/" className="text-vellum-dim hover:text-vellum transition-colors">
                  View on map →
                </Link>
                <Link to="/directory" className="text-vellum-dim hover:text-vellum transition-colors">
                  View in directory →
                </Link>
              </div>
            </div>

            {/* Reading */}
            {result.reading && (
              <div className="col-span-12 md:col-span-7">
                <div className="font-mono text-[10px] smallcaps text-oxblood mb-3">
                  Reading
                </div>
                <p className="font-display text-base leading-relaxed text-vellum-dim">
                  {result.reading}
                </p>
              </div>
            )}

            {/* Metrics */}
            <div className="col-span-12 md:col-span-5">
              <div className="flex justify-center mb-6">
                <Sigil metrics={result.metrics} size={220} uid={result.slug} />
              </div>
              <div className="font-mono text-[10px] smallcaps text-oxblood mb-3">
                Thirteen Axes
              </div>
              <ul className="space-y-2">
                {Object.entries(result.metrics).map(([key, val]) => (
                  <li key={key} className="flex items-center gap-3">
                    <span className="w-28 font-mono text-[10px] smallcaps text-vellum-dim">
                      {AXIS_LABELS[key] ?? key}
                    </span>
                    <div className="flex-1 h-px bg-border relative">
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-oxblood"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-[10px] text-vellum">
                      {val}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Factions */}
            {result.factions?.length > 0 && (
              <div className="col-span-12 md:col-span-7">
                <div className="font-mono text-[10px] smallcaps text-oxblood mb-3">
                  Factions
                </div>
                <ul className="space-y-4">
                  {result.factions.map((f, i) => (
                    <li key={i}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-mono text-[10px] smallcaps text-vellum">
                          {f.name}
                        </span>
                        <span className="font-mono text-[10px] text-vellum-dim">
                          {Math.round(f.share * 100)}%
                        </span>
                      </div>
                      <p className="font-display text-sm italic text-vellum-dim">
                        {f.voice}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Symbols */}
            {result.symbols?.length > 0 && (
              <div className="col-span-12 md:col-span-5">
                <div className="font-mono text-[10px] smallcaps text-oxblood mb-3">
                  Symbols
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.symbols.map((s, i) => (
                    <span
                      key={i}
                      className="border border-border px-2 py-1 font-mono text-[10px] smallcaps text-vellum-dim"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Afterlife */}
            {result.afterlife?.length > 0 && (
              <div className="col-span-12">
                <div className="font-mono text-[10px] smallcaps text-oxblood mb-3">
                  Afterlife
                </div>
                <ul className="flex flex-wrap gap-6">
                  {result.afterlife.map((ev, i) => (
                    <li key={i} className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] text-vellum-dim">
                        {ev.year}
                      </span>
                      <span className="font-mono text-[10px] smallcaps text-oxblood">
                        {ev.kind}
                      </span>
                      <span className="font-display text-sm italic text-vellum-dim">
                        {ev.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* API cost */}
            {usage && (
              <div className="col-span-12">
                <div className="rule mt-4 mb-4" />
                <div className="font-mono text-[10px] smallcaps text-oxblood mb-2">
                  API cost
                </div>
                <div className="flex items-end gap-6">
                  <div className="grid grid-cols-4 gap-4 max-w-lg">
                    <div>
                      <div className="font-mono text-[10px] smallcaps text-vellum-dim">Input</div>
                      <div className="font-mono text-[11px] text-vellum">
                        {usage.inputTokens.toLocaleString()} tok
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] smallcaps text-vellum-dim">Thinking</div>
                      <div className="font-mono text-[11px] text-vellum">
                        {usage.thinkingTokens.toLocaleString()} tok
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] smallcaps text-vellum-dim">Output</div>
                      <div className="font-mono text-[11px] text-vellum">
                        {usage.outputTokens.toLocaleString()} tok
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] smallcaps text-vellum-dim">Est. cost</div>
                      <div className="font-mono text-[11px] text-vellum">
                        ${usage.estimatedCostUsd.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://www.themeansofproduction.press/support-the-means-of-production"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] smallcaps text-oxblood border border-oxblood px-3 py-1 hover:bg-oxblood hover:text-vellum transition-colors whitespace-nowrap"
                  >
                    Support This Project
                  </a>
                </div>
              </div>
            )}

            {/* Submit another */}
            <div className="col-span-12">
              <div className="rule mt-4 mb-6" />
              <button
                onClick={() => {
                  setStatus("idle");
                  setResult(null);
                  setUsage(null);
                  setTitle("");
                  setIsExisting(false);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="font-mono text-[11px] smallcaps text-vellum-dim hover:text-vellum transition-colors"
              >
                ← Submit another media
              </button>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
