import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const GENERATED_DIR = path.join(DATA_DIR, "generated");
const SEED_CSV_PATH = path.join(DATA_DIR, "seed", "movies.csv");
const CONFIG_PATH = path.join(DATA_DIR, "pipeline", "config", "sources.json");
const BASELINE_PATH = path.join(GENERATED_DIR, "baseline-movies.json");
const CURSORS_PATH = path.join(GENERATED_DIR, "collect-cursors.json");
const MENTIONS_PATH = path.join(GENERATED_DIR, "mentions.json");
const ENRICHMENT_PATH = path.join(GENERATED_DIR, "enrichments.json");
const SNAPSHOTS_PATH = path.join(GENERATED_DIR, "metric-snapshots.json");
const FRONTEND_PATH = path.join(GENERATED_DIR, "frontend-artifacts.json");
const EVIDENCE_PATH = path.join(GENERATED_DIR, "evidence-store.json");
const RUN_LOGS_PATH = path.join(GENERATED_DIR, "pipeline-run-logs.json");

const AXES = [
  "consensus",
  "friction",
  "obsession",
  "haunting",
  "symbolic",
  "cult",
  "formal",
  "voltage",
  "accessibility",
];

const STOPWORDS = new Set(
  "the a an and or but if then with from into onto of in on to for this that these those is are was were be been being it its they them by as at not no yes very really just over under out up down off can cannot could should would about after before still more most some any all".split(
    /\s+/,
  ),
);

async function ensureDirs() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      cell = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((fields) => {
    const obj = {};
    header.forEach((key, index) => {
      obj[key] = fields[index] ?? "";
    });
    return obj;
  });
}

function blankMetrics() {
  return Object.fromEntries(
    AXES.map((axis) => [
      axis,
      {
        value: null,
        confidence: 0,
        components: {},
        evidence: [],
      },
    ]),
  );
}

async function convertSeedCsv() {
  await ensureDirs();
  const config = await readJson(CONFIG_PATH, { methodVersion: "v1" });
  const raw = await fs.readFile(SEED_CSV_PATH, "utf8");
  const rows = parseCsv(raw);
  const now = new Date().toISOString();

  const baseline = {
    schemaVersion: "1.0.0",
    methodVersion: config.methodVersion,
    generatedAt: now,
    movies: rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      year: Number(row.year),
      director: row.director,
      runtime: Number(row.runtime),
      catalogue: row.catalogue,
      metrics: blankMetrics(),
      reviewGate: {
        status: "needs_review",
        reasons: ["insufficient_evidence", "not_computed"],
      },
      freshness: {
        lastCollectedAt: null,
        lastComputedAt: null,
      },
    })),
  };

  await writeJson(BASELINE_PATH, baseline);
  console.log(`Converted ${baseline.movies.length} seed rows into ${BASELINE_PATH}`);
}

function normalizeBody(body) {
  return body
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateMentionScore(text) {
  const positive = ["masterpiece", "great", "excellent", "best", "love", "moving", "haunting"];
  const negative = ["bad", "boring", "weak", "awful", "hate", "overrated", "confusing"];

  const normalized = normalizeBody(text);
  let score = 50;
  for (const token of positive) if (normalized.includes(token)) score += 7;
  for (const token of negative) if (normalized.includes(token)) score -= 7;
  return clamp(score, 0, 100);
}

async function fetchWikipediaExtract(title) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("prop", "extracts");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("exintro", "1");
  url.searchParams.set("redirects", "1");
  url.searchParams.set("format", "json");
  url.searchParams.set("titles", title);

  const response = await fetch(url, {
    headers: {
      "user-agent": "cultural-cartographer-pipeline/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Wikipedia fetch failed (${response.status})`);
  }

  const payload = await response.json();
  const pages = payload?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || typeof page !== "object") return null;
  const extract = page.extract;
  if (typeof extract !== "string" || !extract.trim()) return null;

  return {
    sourceId: String(page.pageid ?? title),
    sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, "_"))}`,
    body: extract.slice(0, 2000),
  };
}

function curatedSeedMention(movie) {
  return {
    sourceId: `${movie.slug}-seed-curation`,
    sourceUrl: `seed://${movie.slug}`,
    body: `${movie.title} (${movie.year}) directed by ${movie.director}. Curated baseline artifact for metric calibration and systematic scoring initialization.`,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectSignals() {
  await ensureDirs();
  const config = await readJson(CONFIG_PATH, { sources: [] });
  const baseline = await readJson(BASELINE_PATH, null);
  if (!baseline?.movies?.length) {
    throw new Error("baseline-movies.json not found; run data:convert first");
  }

  const now = new Date().toISOString();
  const cursors = await readJson(CURSORS_PATH, {});
  const previousMentions = await readJson(MENTIONS_PATH, []);
  const mentionMap = new Map(previousMentions.map((m) => [m.id, m]));

  for (const source of config.sources ?? []) {
    if (!source.enabled) continue;

    for (const movie of baseline.movies) {
      const cursorKey = `${movie.slug}:${source.name}`;
      const lastCursor = cursors[cursorKey];
      const maxAgeMs = (source.maxAgeHours ?? 24) * 60 * 60 * 1000;
      if (lastCursor && Date.now() - new Date(lastCursor).getTime() < maxAgeMs) {
        continue;
      }

      let payload = null;
      try {
        if (source.name === "wikipedia") {
          payload = await fetchWikipediaExtract(movie.title);
        } else if (source.name === "seed-curation") {
          payload = curatedSeedMention(movie);
        }
      } catch (error) {
        console.warn(`collect: ${source.name} failed for ${movie.slug}:`, error.message);
      }

      if (payload?.body) {
        const id = `${movie.slug}:${source.name}:${payload.sourceId}`;
        mentionMap.set(id, {
          id,
          artifactSlug: movie.slug,
          source: source.name,
          sourceKind: source.kind,
          sourceUrl: payload.sourceUrl,
          sourceId: payload.sourceId,
          postedAt: now,
          fetchedAt: now,
          lang: "en",
          body: payload.body,
          score: estimateMentionScore(payload.body),
          sourceReliability: source.reliability ?? 0.5,
          metadata: {
            method: "systematic-movie-pipeline",
          },
        });
      }

      cursors[cursorKey] = now;
      await sleep(source.rateLimitMs ?? 300);
    }
  }

  const mentions = Array.from(mentionMap.values()).sort((a, b) => a.id.localeCompare(b.id));

  await writeJson(CURSORS_PATH, cursors);
  await writeJson(MENTIONS_PATH, mentions);
  console.log(`Collected mentions: ${mentions.length}`);
}

function topTerms(texts, limit = 10) {
  const counts = new Map();
  for (const text of texts) {
    const tokens = normalizeBody(text)
      .split(" ")
      .filter((token) => token.length >= 5 && !STOPWORDS.has(token));
    for (const token of tokens) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term, count]) => ({ term, weight: round2(count) }));
}

function classifyFaction(mention) {
  const text = normalizeBody(mention.body);
  if (/masterpiece|great|excellent|love|essential/.test(text)) return "devoted";
  if (/bad|boring|weak|awful|overrated/.test(text)) return "skeptical";
  return "analytical";
}

async function enrichWithAi() {
  await ensureDirs();
  const mentions = await readJson(MENTIONS_PATH, []);
  const byMovie = new Map();
  for (const mention of mentions) {
    if (!byMovie.has(mention.artifactSlug)) byMovie.set(mention.artifactSlug, []);
    byMovie.get(mention.artifactSlug).push(mention);
  }

  const enrichments = [];
  for (const [artifactSlug, movieMentions] of byMovie.entries()) {
    const texts = movieMentions.map((m) => m.body);
    const symbols = topTerms(texts, 8).map((s) => ({
      term: s.term,
      weight: s.weight,
      evidenceMentionIds: movieMentions
        .filter((m) => normalizeBody(m.body).includes(s.term))
        .map((m) => m.id)
        .slice(0, 5),
    }));

    const factionsRaw = new Map();
    for (const mention of movieMentions) {
      const label = classifyFaction(mention);
      const current = factionsRaw.get(label) ?? { count: 0, samples: [] };
      current.count += 1;
      if (current.samples.length < 3) current.samples.push(mention.body.slice(0, 180));
      factionsRaw.set(label, current);
    }

    const total = movieMentions.length || 1;
    const factions = Array.from(factionsRaw.entries()).map(([label, value]) => ({
      label,
      share: round2(value.count / total),
      summary: `${label} cluster derived from mention text classification`,
      sampleQuotes: value.samples,
    }));

    const afterlifeEvents = [];
    for (const mention of movieMentions) {
      const text = normalizeBody(mention.body);
      if (/release|premiere|cannes|award|criterion|restoration|rediscover/.test(text)) {
        afterlifeEvents.push({
          occurredAt: mention.postedAt,
          kind: /criterion|restoration/.test(text) ? "reissue" : "release",
          label: mention.body.slice(0, 120),
          evidenceUrl: mention.sourceUrl,
          evidenceMentionId: mention.id,
        });
      }
    }

    enrichments.push({
      artifactSlug,
      generatedAt: new Date().toISOString(),
      method: "heuristic-safe-extraction",
      guardrails: [
        "Extraction/classification/summarization only",
        "No invented ratings or criticism",
      ],
      confidence: round2(Math.min(1, 0.35 + movieMentions.length * 0.08)),
      symbols,
      discourseClusters: factions,
      afterlifeEvents: afterlifeEvents.slice(0, 8),
    });
  }

  await writeJson(ENRICHMENT_PATH, enrichments);
  console.log(`Enrichment records: ${enrichments.length}`);
}

function stdev(values) {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function computeMovieMetrics(movieMentions, enrichment, config) {
  const languageApproved = new Set(config.quality?.approvedLanguages ?? ["en"]);
  const deduped = new Map();
  for (const mention of movieMentions) {
    if (!languageApproved.has(mention.lang)) continue;
    const normalized = normalizeBody(mention.body);
    if (!normalized) continue;
    if (!deduped.has(normalized)) deduped.set(normalized, mention);
  }

  const filtered = Array.from(deduped.values());
  const weightedScores = filtered
    .map((m) => ({
      score: clamp(Number(m.score ?? 50), 5, 95),
      weight: clamp(Number(m.sourceReliability ?? 0.5), 0.1, 1),
    }))
    .filter((x) => Number.isFinite(x.score) && Number.isFinite(x.weight));

  const mentionCount = filtered.length;
  const uniqueSources = new Set(filtered.map((m) => m.source)).size;
  const scores = weightedScores.map((s) => s.score);
  const meanScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 50;
  const spread = stdev(scores);

  const bodyText = filtered.map((m) => normalizeBody(m.body)).join(" ");
  const hauntingHits = (bodyText.match(/haunt|dream|cant stop thinking|wont leave|lingers/g) ?? [])
    .length;
  const theoryHits = (bodyText.match(/symbol|metaphor|allegory|meaning|interpret/g) ?? []).length;
  const emotionHits = (bodyText.match(/panic|cry|fear|anxious|devastat|nausea|shook/g) ?? [])
    .length;
  const avgLength =
    mentionCount > 0
      ? filtered.reduce((sum, m) => sum + m.body.split(/\s+/).length, 0) / mentionCount
      : 0;

  const symbolDensity = enrichment?.symbols?.length ?? 0;
  const factionDiversity = enrichment?.discourseClusters?.length ?? 0;

  const consensus = clamp(100 - spread * 4);
  const friction = clamp(spread * 6 + Math.abs(meanScore - 50) * 0.9);
  const obsession = clamp(mentionCount * 12 + uniqueSources * 4);
  const haunting = clamp(hauntingHits * 14 + symbolDensity * 2);
  const symbolic = clamp(theoryHits * 8 + symbolDensity * 9);
  const cult = clamp((mentionCount * 9 + factionDiversity * 14) * (meanScore < 70 ? 1.1 : 0.9));
  const formal = clamp(theoryHits * 6 + avgLength * 0.55);
  const voltage = clamp(emotionHits * 12 + Math.abs(meanScore - 50) * 1.1);
  const accessibility = clamp(100 - avgLength * 1.6);

  const evidenceMentionIds = filtered.map((m) => m.id);
  const confidenceBase = clamp((mentionCount / 10 + uniqueSources / 4) / 2, 0, 1);

  const metrics = {
    consensus: {
      value: round2(consensus),
      confidence: round2(confidenceBase),
      components: { spread: round2(spread), meanScore: round2(meanScore) },
      evidenceMentionIds,
    },
    friction: {
      value: round2(friction),
      confidence: round2(confidenceBase),
      components: {
        spread: round2(spread),
        distanceFromMidpoint: round2(Math.abs(meanScore - 50)),
      },
      evidenceMentionIds,
    },
    obsession: {
      value: round2(obsession),
      confidence: round2(confidenceBase),
      components: { mentionCount, uniqueSources },
      evidenceMentionIds,
    },
    haunting: {
      value: round2(haunting),
      confidence: round2(confidenceBase),
      components: { hauntingHits, symbolDensity },
      evidenceMentionIds,
    },
    symbolic: {
      value: round2(symbolic),
      confidence: round2(confidenceBase),
      components: { theoryHits, symbolDensity },
      evidenceMentionIds,
    },
    cult: {
      value: round2(cult),
      confidence: round2(confidenceBase),
      components: { mentionCount, factionDiversity, meanScore: round2(meanScore) },
      evidenceMentionIds,
    },
    formal: {
      value: round2(formal),
      confidence: round2(confidenceBase),
      components: { theoryHits, avgLength: round2(avgLength) },
      evidenceMentionIds,
    },
    voltage: {
      value: round2(voltage),
      confidence: round2(confidenceBase),
      components: { emotionHits, distanceFromMidpoint: round2(Math.abs(meanScore - 50)) },
      evidenceMentionIds,
    },
    accessibility: {
      value: round2(accessibility),
      confidence: round2(confidenceBase),
      components: { avgLength: round2(avgLength) },
      evidenceMentionIds,
    },
  };

  const reasons = [];
  const minEvidence = config.quality?.minimumEvidenceCount ?? 5;
  const minSourceDiversity = config.quality?.minimumSourceDiversity ?? 2;

  if (mentionCount < minEvidence)
    reasons.push(`evidence_below_threshold:${mentionCount}<${minEvidence}`);
  if (uniqueSources < minSourceDiversity)
    reasons.push(`source_diversity_below_threshold:${uniqueSources}<${minSourceDiversity}`);
  if (confidenceBase < 0.55)
    reasons.push(`confidence_below_threshold:${round2(confidenceBase)}<0.55`);

  const reviewGate = {
    status: reasons.length === 0 ? "approved" : "needs_review",
    reasons,
  };

  return { metrics, reviewGate, mentionCount, uniqueSources };
}

async function computeMetrics() {
  await ensureDirs();
  const config = await readJson(CONFIG_PATH, { methodVersion: "v1", quality: {} });
  const baseline = await readJson(BASELINE_PATH, null);
  const mentions = await readJson(MENTIONS_PATH, []);
  const enrichments = await readJson(ENRICHMENT_PATH, []);

  if (!baseline?.movies?.length) {
    throw new Error("baseline-movies.json not found; run data:convert first");
  }

  const enrichmentBySlug = new Map(enrichments.map((e) => [e.artifactSlug, e]));
  const snapshotTime = new Date().toISOString();

  const snapshots = {
    methodVersion: config.methodVersion,
    computedAt: snapshotTime,
    snapshots: [],
  };

  for (const movie of baseline.movies) {
    const movieMentions = mentions.filter((m) => m.artifactSlug === movie.slug);
    const enrichment = enrichmentBySlug.get(movie.slug);

    const computed = computeMovieMetrics(movieMentions, enrichment, config);
    movie.metrics = Object.fromEntries(
      Object.entries(computed.metrics).map(([axis, metric]) => [
        axis,
        {
          value: metric.value,
          confidence: metric.confidence,
          components: metric.components,
          evidence: metric.evidenceMentionIds.map((mentionId) => {
            const mention = mentions.find((m) => m.id === mentionId);
            return {
              mentionId,
              source: mention?.source ?? "unknown",
              sourceUrl: mention?.sourceUrl ?? "",
              timestamp: mention?.postedAt ?? snapshotTime,
            };
          }),
        },
      ]),
    );

    movie.reviewGate = computed.reviewGate;
    movie.freshness.lastCollectedAt =
      movieMentions.length > 0
        ? movieMentions
            .map((m) => m.fetchedAt)
            .sort()
            .at(-1)
        : movie.freshness.lastCollectedAt;
    movie.freshness.lastComputedAt = snapshotTime;

    snapshots.snapshots.push({
      artifactSlug: movie.slug,
      computedAt: snapshotTime,
      methodVersion: config.methodVersion,
      mentionCount: computed.mentionCount,
      sourceCount: computed.uniqueSources,
      metrics: computed.metrics,
      reviewGate: computed.reviewGate,
    });
  }

  baseline.generatedAt = snapshotTime;
  baseline.methodVersion = config.methodVersion;

  await writeJson(BASELINE_PATH, baseline);
  await writeJson(SNAPSHOTS_PATH, snapshots);
  console.log(`Computed metrics for ${baseline.movies.length} movies`);
}

async function exportFrontend() {
  await ensureDirs();
  const baseline = await readJson(BASELINE_PATH, null);
  const mentions = await readJson(MENTIONS_PATH, []);
  const enrichments = await readJson(ENRICHMENT_PATH, []);
  const snapshots = await readJson(SNAPSHOTS_PATH, { snapshots: [] });

  if (!baseline?.movies?.length) {
    throw new Error("baseline-movies.json not found; run data:convert first");
  }

  const enrichmentBySlug = new Map(enrichments.map((e) => [e.artifactSlug, e]));
  const frontend = {
    generatedAt: new Date().toISOString(),
    methodVersion: baseline.methodVersion,
    artifacts: baseline.movies.map((movie) => {
      const enrichment = enrichmentBySlug.get(movie.slug);
      const metricValues = Object.fromEntries(
        AXES.map((axis) => [axis, Math.round(movie.metrics?.[axis]?.value ?? 0)]),
      );

      return {
        slug: movie.slug,
        title: movie.title,
        year: movie.year,
        director: movie.director,
        runtime: movie.runtime,
        catalogue: movie.catalogue,
        metrics: metricValues,
        metricConfidence: Object.fromEntries(
          AXES.map((axis) => [axis, movie.metrics?.[axis]?.confidence ?? 0]),
        ),
        reviewGate: movie.reviewGate,
        symbols: enrichment?.symbols?.map((s) => s.term) ?? [],
        factions:
          enrichment?.discourseClusters?.map((cluster) => ({
            name: cluster.label,
            share: cluster.share,
            voice: cluster.sampleQuotes?.[0] ?? "",
          })) ?? [],
        afterlife: enrichment?.afterlifeEvents ?? [],
        freshness: movie.freshness,
      };
    }),
  };

  const evidenceStore = {
    generatedAt: frontend.generatedAt,
    methodVersion: baseline.methodVersion,
    mentions,
    enrichments,
    snapshots: snapshots.snapshots ?? [],
  };

  await writeJson(FRONTEND_PATH, frontend);
  await writeJson(EVIDENCE_PATH, evidenceStore);
  console.log(`Exported ${frontend.artifacts.length} frontend artifacts and evidence store`);
}

async function appendRunLog(entry) {
  const logs = await readJson(RUN_LOGS_PATH, []);
  logs.push(entry);
  await writeJson(RUN_LOGS_PATH, logs.slice(-100));
}

async function refreshAll() {
  const runId = `run-${Date.now()}`;
  const startedAt = new Date().toISOString();
  const steps = [];

  try {
    const wrap = async (name, fn) => {
      const start = Date.now();
      await fn();
      steps.push({ name, status: "ok", durationMs: Date.now() - start });
    };

    await wrap("convertSeedCsv", convertSeedCsv);
    await wrap("collectSignals", collectSignals);
    await wrap("enrichWithAi", enrichWithAi);
    await wrap("computeMetrics", computeMetrics);
    await wrap("exportFrontend", exportFrontend);

    const baseline = await readJson(BASELINE_PATH, { movies: [] });
    const completedAt = new Date().toISOString();

    await appendRunLog({
      runId,
      status: "ok",
      startedAt,
      completedAt,
      methodVersion: baseline.methodVersion,
      movieCount: baseline.movies.length,
      steps,
      freshness: {
        lastComputedAt: completedAt,
      },
    });

    console.log(`Refresh complete: ${runId}`);
  } catch (error) {
    const failedAt = new Date().toISOString();
    await appendRunLog({
      runId,
      status: "failed",
      startedAt,
      failedAt,
      steps,
      error: String(error?.stack ?? error),
    });
    throw error;
  }
}

async function main() {
  const command = process.argv[2] ?? "refresh";

  if (command === "convert") {
    await convertSeedCsv();
    return;
  }
  if (command === "collect") {
    await collectSignals();
    return;
  }
  if (command === "enrich") {
    await enrichWithAi();
    return;
  }
  if (command === "compute") {
    await computeMetrics();
    return;
  }
  if (command === "export") {
    await exportFrontend();
    return;
  }

  await refreshAll();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
