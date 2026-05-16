import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useState } from "react";
import type { MovieRecord, FilmVariant } from "@/lib/green";
import { useUserFilms } from "@/lib/user-films-context";

export const Route = createFileRoute("/submit")({
  component: Submit,
  head: () => ({
    meta: [
      { title: "Submit a Film — The Artifact Index" },
      {
        name: "description",
        content: "Send a film to the green for a cultural reading.",
      },
    ],
  }),
});

type Status = "idle" | "resolving" | "variants" | "loading" | "done" | "error";

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

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function Submit() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [variants, setVariants] = useState<FilmVariant[]>([]);
  const [result, setResult] = useState<MovieRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { addUserFilm, getUserFilm } = useUserFilms();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setStatus("resolving");
    setVariants([]);
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const list = data as FilmVariant[];

      if (list.length === 1) {
        await analyzeVariant(list[0]);
      } else {
        setVariants(list);
        setStatus("variants");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  async function analyzeVariant(variant: FilmVariant) {
    setStatus("loading");

    const slug = toSlug(`${variant.title}-${variant.year}`);
    const existing = getUserFilm(slug);
    if (existing) {
      setResult(existing);
      setStatus("done");
      return;
    }

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: variant.title, hint: variant }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const record = data as MovieRecord;
      addUserFilm(record);
      setResult(record);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setVariants([]);
    setTitle("");
    setErrorMsg("");
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
              Send a film{" "}
              <em className="text-oxblood">to the green.</em>
            </h1>
            <p className="mt-6 max-w-xl font-display text-lg italic leading-relaxed text-vellum-dim">
              The green scrapes the open record of how a film is actually
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
            Film title
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inland Empire"
              disabled={status === "resolving" || status === "loading" || status === "variants"}
              className={
                "flex-1 border border-border bg-transparent px-4 py-3 font-display text-xl text-vellum placeholder:text-vellum-dim/40 " +
                "focus:border-oxblood focus:outline-none disabled:opacity-40"
              }
            />
            <button
              type="submit"
              disabled={
                status === "resolving" ||
                status === "loading" ||
                status === "variants" ||
                !title.trim()
              }
              className={
                "border border-oxblood px-6 py-3 font-mono text-[11px] smallcaps text-oxblood " +
                "transition-colors hover:bg-oxblood hover:text-umber disabled:opacity-40 disabled:cursor-not-allowed"
              }
            >
              {status === "resolving" || status === "loading" ? "Reading…" : "Submit"}
            </button>
          </div>

          {status === "resolving" && (
            <p className="mt-4 font-mono text-[10px] text-vellum-dim smallcaps animate-pulse">
              Locating film —
            </p>
          )}
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

      {/* Variant selection */}
      {status === "variants" && variants.length > 0 && (
        <section className="relative z-10 mx-auto mt-12 max-w-[1400px] px-8">
          <div className="rule mb-6" />
          <div className="font-mono text-[10px] smallcaps text-oxblood mb-4">
            Which film?
          </div>
          <ul className="max-w-2xl divide-y divide-border">
            {variants.map((v, i) => (
              <li key={i}>
                <button
                  onClick={() => analyzeVariant(v)}
                  className="w-full text-left py-4 group hover:bg-oxblood/5 transition-colors px-2 -mx-2"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-lg text-vellum group-hover:text-oxblood transition-colors">
                      {v.title}
                    </span>
                    <span className="font-mono text-[10px] text-vellum-dim">
                      {v.year}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] smallcaps text-vellum-dim">
                    dir. {v.director} · {v.leadActor}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={reset}
            className="mt-6 font-mono text-[11px] smallcaps text-vellum-dim hover:text-vellum transition-colors"
          >
            ← Start over
          </button>
        </section>
      )}

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
                <span className="text-oxblood">Added to the index ·</span>
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

              {/* Map position */}
              {result.pos && (
                <div className="mt-6">
                  <div className="font-mono text-[10px] smallcaps text-oxblood mb-2">
                    Map position
                  </div>
                  <div className="font-mono text-[10px] text-vellum-dim">
                    x · {result.pos.x.toFixed(2)} &nbsp; y · {result.pos.y.toFixed(2)}
                  </div>
                  <div
                    className="relative mt-3 border border-border"
                    style={{ width: 120, height: 120 }}
                  >
                    <div
                      className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-oxblood"
                      style={{
                        left: `${result.pos.x * 100}%`,
                        top: `${result.pos.y * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
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

            {/* Submit another */}
            <div className="col-span-12">
              <div className="rule mt-4 mb-6" />
              <button
                onClick={reset}
                className="font-mono text-[11px] smallcaps text-vellum-dim hover:text-vellum transition-colors"
              >
                ← Submit another film
              </button>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
