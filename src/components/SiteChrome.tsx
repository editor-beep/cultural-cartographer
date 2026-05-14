import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

const NAV = [
  { to: "/", label: "Atlas" },
  { to: "/directory", label: "Directory" },
  { to: "/attune", label: "Attune" },
  { to: "/lexicon", label: "Lexicon" },
  { to: "/evidence", label: "Evidence" },
  { to: "/colophon", label: "Colophon" },
] as const;

export function SiteHeader() {
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const mobileNavRef = useRef<HTMLElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  // Close on Escape or outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: MouseEvent) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <header className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between px-8 pt-8">
      <Link to="/" className="group block">
        <div className="smallcaps text-[10px] text-vellum-dim">The</div>
        <div className="-mt-1 font-display text-2xl tracking-tight text-vellum">
          Artifact Index
        </div>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-8 md:flex" aria-label="Site navigation">
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

      {/* Mobile nav */}
      <nav ref={mobileNavRef} className="relative md:hidden" aria-label="Site navigation">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="flex flex-col items-end gap-[5px] p-2 text-vellum-dim transition-colors hover:text-vellum"
        >
          <span
            className="block h-px bg-current transition-all duration-300"
            style={{
              width: 20,
              transform: open ? "translateY(6px) rotate(45deg)" : undefined,
            }}
          />
          <span
            className="block h-px bg-current transition-all duration-200"
            style={{
              width: open ? 0 : 12,
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block h-px bg-current transition-all duration-300"
            style={{
              width: 20,
              transform: open ? "translateY(-8px) rotate(-45deg)" : undefined,
            }}
          />
        </button>

        {open && (
          <div
            id="mobile-nav-menu"
            role="menu"
            className="absolute right-0 top-full z-30 mt-1 min-w-[160px] border border-border bg-ink/95 backdrop-blur-sm"
          >
            {NAV.map((n, i) => {
              const active = loc.pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  role="menuitem"
                  className={
                    "block border-b border-border px-5 py-3.5 last:border-0 smallcaps text-[11px] transition-colors " +
                    (active
                      ? "bg-umber/40 text-vellum"
                      : "text-vellum-dim hover:bg-umber/20 hover:text-vellum")
                  }
                  style={{
                    animation: "nav-cascade 220ms ease both",
                    animationDelay: `${i * 45}ms`,
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        )}
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
          "Some works are not consumed. They are inhabited."
        </div>
      </div>
    </footer>
  );
}
