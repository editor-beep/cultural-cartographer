
# The Artifact Index — Build Plan

A film analysis engine that reads cultural pressure, not consumer approval. Each work renders as a **radial sigil** whose shape encodes thirteen metrics. No scores. No ranks.

---

## Phase 1 — Foundation (visible end of phase)

**Goal:** the site exists, the aesthetic is locked, the sigil renders from data — even if data is hand-curated for ~12 seed films. Nothing about the frontend will need to change once ingestion is wired in.

### Aesthetic system
- Palette: ink black `#0d0a08`, vellum `#d4c5a0`, oxblood `#6b1f1a`, deep umber `#1a1410`. Defined as oklch tokens in `src/styles.css`.
- Typography: a high-contrast serif display (Cormorant or Instrument Serif) for titles + axis labels; a tight grotesque (Inter Tight or Söhne fallback) for body; one monospace for numerics.
- Texture: subtle grain overlay, hairline dividers, occasional rule marks. No drop shadows, no rounded corners above 2px, no gradients except radial vignette.
- Tone copy: archival, not corporate. "Reading dated 2026.05.11" instead of "Last updated".

### Routes
```text
/                        index — drifting field of sigils (the Atlas)
/artifact/$slug          single work — the full sigil + dossier
/lexicon                 the thirteen metrics, defined as language not formulas
/colophon                what this is, what it isn't ("not a score")
/compare                 side-by-side metric shape comparison for multiple films
/directory               browsable film catalog with filtering
/submit                  user-curated film suggestions
/evidence                source trails and citations for metric computations
```

### The Sigil component
SVG, asymmetric polar plot, thirteen axes:
Consensus · Friction · Obsession · Residual Haunting · Symbolic Density · Cult Formation · Formal Risk · Emotional Voltage · Accessibility (inverted) · Reach · Progeny · Cultural Arc · Transgression

- Each axis a hairline; the metric value pushes a vertex outward.
- The shape is closed with a single oxblood stroke, vellum fill at low opacity.
- Inner glyph marks (small ticks, ritual-seal motifs) at the perimeter so every sigil reads as occult sigil first, chart second.
- Animates in by drawing the perimeter (stroke-dasharray), no bouncy easing.

### The Atlas (index page)
Sigils float on a dark field at varying scales. Hover reveals title + year in vellum serif. Click → dossier. No grid — positions seeded from the work's own metric vector so similar pressure-shapes cluster spatially.

### Artifact dossier page
- Large sigil left, axis legend right with prose for each value ("Obsession 94 — discussion persistence stays elevated 14 years after release").
- **Cultural Afterlife** timeline below: horizontal band, events plotted (release, critical rejection, rediscovery, meme resurrection, Criterion release, academic adoption). Hover for source quotes.
- **Discourse factions**: 2–4 named clusters with representative language samples.
- **Recurring symbols**: a small list of motifs surfaced from text.

### Seed data (current catalog)
Over sixty curated films spanning the metric space, seeded from `data/seed/movies.csv` and extended with hand-authored artifact data in `src/data/artifacts.ts`. The original twelve (Fire Walk with Me, Mulholland Dr., Hereditary, Synecdoche NY, In the Mood for Love, Stalker, Killers of the Flower Moon, The Master, Annihilation, Possession, Eyes Wide Shut, Tár) established the aesthetic range; subsequent additions cover 1957–2026 across prestige art cinema, cult horror, experimental film, and high-friction blockbusters.

---

## Phase 2 — Ingestion architecture

**Goal:** real signal flowing into Postgres, sigils stop being hand-tuned.

### Storage (Lovable Cloud / Postgres)
```text
artifacts            id, slug, title, year, director, tmdb_id, poster_url, ...
metric_snapshots     artifact_id, axis, value, computed_at, method_version
mentions             artifact_id, source, source_id, posted_at, body, score, lang
afterlife_events     artifact_id, occurred_at, kind, label, evidence_url
discourse_clusters   artifact_id, label, summary, share, sample_quotes[]
symbols              artifact_id, term, weight, examples[]
```

### Ingestion workers (TanStack server functions + cron via `/api/public/cron/*`)
Each source is a worker writing to `mentions`. Workers are idempotent and resumable.

| Source | Pulls | Feeds |
|---|---|---|
| Reddit (public JSON, then PRAW via server fn) | post + comment text from r/truefilm, r/criterion, r/horror, r/movies, r/letterboxd | Obsession, Haunting, Symbolic Density, Friction |
| Letterboxd | review text + diary revisits + list inclusions (scrape, respectful rate-limit) | Obsession, Voltage, Cult Formation, Friction |
| Rotten Tomatoes + Metacritic | critic % + audience % + sample blurbs | Consensus, Friction (gap) |
| TMDb | metadata, posters, release dates | identity, Afterlife anchor events |
| Wikipedia + Criterion catalog | release/restoration/Criterion events | Afterlife |

Connectors needed: **Firecrawl** (Letterboxd, RT, Metacritic, Wikipedia), **Perplexity** (optional, for afterlife event surfacing). Reddit uses public endpoints first, OAuth app later.

### Metric computation
A nightly job rebuilds `metric_snapshots` from `mentions`:
- **Consensus** — 100 minus normalized variance across critic/audience/Letterboxd means.
- **Friction** — magnitude of critic↔audience gap + bimodality of Letterboxd histogram.
- **Obsession** — mention density per month, weighted by recency decay reversal (older + still-discussed scores higher).
- **Residual Haunting** — keyword/embedding match against a curated lexicon ("haunts me", "still thinking about", "dreamed about", "won't leave me") normalized per artifact.
- **Symbolic Density** — count of distinct interpretive terms + theory-post ratio (long posts asking "what does X mean").
- **Cult Formation** — slope of mention volume after a rejection event; list-inclusion growth on Letterboxd.
- **Formal Risk** — LLM classifier over critic blurbs + symbol diversity.
- **Emotional Voltage** — sentiment magnitude (not polarity) + emotion-word density.
- **Accessibility** — inverse of average review length and vocabulary complexity.
- **Reach** — total cross-platform footprint; TMDb popularity + Reddit subscriber overlap + Wikipedia view volume.
- **Progeny** — count of downstream works citing the artifact as influence; sequel/remake/homage density.
- **Cultural Arc** — trajectory of reception over time: rising, stable, declining, or resurgent (computed from mention-volume slope in rolling 3-year windows).
- **Transgression** — intensity of boundary-violation discourse: censorship events, content-warning prevalence, moral-panic indicators in critic blurbs.

### LLM use (Lovable AI Gateway, server-only)
Used **only** for: symbol extraction, faction clustering of comment embeddings, afterlife-event summarization. Never to invent ratings or write criticism in the system's own voice.

---

## Phase 3 — Atlas intelligence

- Spatial layout of the Atlas driven by UMAP over metric vectors (computed offline, stored as `x,y` on the artifact).
- "Pressure neighbors": dossier shows the three nearest sigils in the field — works that generate similar psychic pressure regardless of genre.
- Time scrubber on Atlas: drag to see how the field looked in 1995, 2010, 2024.
- Reading queue (browser-only, no auth required initially).

---

## Technical details

- **Stack:** TanStack Start (existing). Lovable Cloud for Postgres + storage. AI Gateway for LLM calls. Firecrawl connector for scraping. Recharts is **not** used — sigil is hand-rolled SVG; afterlife timeline uses D3 scales without React-D3 wrappers.
- **Server functions** in `src/lib/*.functions.ts` with `.server.ts` siblings for ingestion logic. Public cron endpoints under `src/routes/api/public/cron/` with shared-secret header check.
- **Rate-limit & politeness:** all scrapers honor robots.txt where applicable, cap concurrency, persist cursors so a re-run resumes.
- **Honesty surface:** every metric value on a dossier links to the `Lexicon` entry that defines it and the sample mentions it was computed from. The system is auditable, not oracular.

---

## What Phase 1 looks like when done
A dark, grain-washed homepage. A field of sigils drifting on a vellum-on-ink palette — each one a thirteen-pointed closed polygon encoding cultural pressure rather than consumer approval. Click Mulholland Dr. — its sigil expands, axes unfold into prose, the afterlife timeline traces from 2001 → 2026 with marked rediscoveries. Nothing says "8.2/10". Nothing says "you might also like". The page reads like a field report on an object that won't sit still.

Phase 2 then makes that report self-updating.
