# Systematic movie data pipeline

This pipeline creates auditable JSON records for the film catalog using these stages:

1. `data:convert` — Convert `data/seed/movies.csv` into `data/generated/baseline-movies.json`.
2. `data:collect` — Collect mentions from approved sources with rate-limit + resumable cursors.
3. `data:enrich` — Extract symbols, discourse clusters, and afterlife event summaries (no invented ratings).
4. `data:compute` — Deterministically compute all thirteen metrics with intermediate components and confidence.
5. `data:export` — Export frontend-ready artifacts and a separate evidence store.
6. `data:refresh` — Run all stages and append run metadata/logs.

## Outputs

- `data/generated/baseline-movies.json`
- `data/generated/mentions.json`
- `data/generated/enrichments.json`
- `data/generated/metric-snapshots.json`
- `data/generated/frontend-artifacts.json`
- `data/generated/evidence-store.json`
- `data/generated/pipeline-run-logs.json`

## Notes

- Quality controls include dedupe, language filtering, source weighting, outlier clamps, and minimum evidence thresholds.
- Records failing minimum confidence/evidence are marked `reviewGate.status = "needs_review"`.
- Schedule automation is defined in `.github/workflows/movie-data-refresh.yml`.
