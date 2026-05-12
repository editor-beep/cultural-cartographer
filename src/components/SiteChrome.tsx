import { Link, useLocation } from "@tanstack/react-router";

const NAV = [
  { to: "/", label: "Atlas" },
  { to: "/attune", label: "Attune" },
  { to: "/lexicon", label: "Lexicon" },
  { to: "/colophon", label: "Colophon" },
] as const;

export function SiteHeader() {
  const loc = useLocation();
  return (
    <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-8 pt-8">
      <Link to="/" className="group block">
        <div className="smallcaps text-[10px] text-vellum-dim">The</div>
        <div className="-mt-1 font-display text-2xl tracking-tight text-vellum">
          Artifact Index
        </div>
      </Link>
      <nav className="flex items-center gap-8">
        {NAV.map((n) => {
          const active = loc.pathname === n.to;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={
                "smallcaps text-[11px] transition-colors " +
                (active ? "text-vellum" : "text-vellum-dim hover:text-vellum")
              }
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto mt-32 max-w-[1400px] px-8 pb-12">
      <div className="rule mb-6" />
      <div className="flex flex-wrap items-end justify-between gap-6 text-vellum-dim">
        <div className="font-mono text-[10px] smallcaps">
          Reading dated 2026.05.11 · Catalogue in revision · Not a score
        </div>
        <div className="font-display italic text-sm">
          “Some works are not consumed. They are inhabited.”
        </div>
      </div>
    </footer>
  );
}
