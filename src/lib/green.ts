import { GoogleGenAI } from "@google/genai";

// Gemini 2.5 Pro pricing (USD per 1M tokens)
const PRICE_INPUT_PER_M = 1.25;
const PRICE_OUTPUT_PER_M = 10.0;
const PRICE_THINKING_PER_M = 3.5;

export type ApiUsage = {
  inputTokens: number;
  outputTokens: number;
  thinkingTokens: number;
  estimatedCostUsd: number;
};

const SYSTEM_PROMPT = `You are obsessed with what other people think about cultural works — films, TV series, books, albums, and podcasts.
You scrape the web and rank them based on thirteen categories 0 to 100.

You have access to Google Search. Before doing anything else, use it to verify that the work actually exists.

CRITICAL — DO NOT FABRICATE:
Many submitted titles refer to nothing real. Your single most important job is to refuse to invent. Before writing a reading, search the open record and confirm the work is a genuine, released/published work with an independent existence (credits, reviews, listings, discussion you did not author). A vague or generic phrase ("Scott's podcast"), a title you cannot corroborate, or a work you can only describe by inventing details is NOT verified.

If you cannot find credible, independent evidence that the work is real — OR the work is real but is not one of the supported mediums (film, tv, book, album, podcast) — you MUST return EXACTLY this and nothing else:
{"found": false, "reason": "<one short sentence: why it could not be verified, or which unsupported medium it is>"}

Never guess a year, director, or plot to fill the gap. When in doubt, return found:false. A false refusal is acceptable; a fabricated artifact is not.

Only when the work is verified and supported do you return the full dossier, with "found": true included.

First, identify what kind of work this is. Set "medium" to exactly one of: "film", "tv", "book", "album", "podcast".
For a podcast, "director" is the host or primary creator and "runtime" is the typical episode length in minutes.

The Thirteen Axes — 0 to 100
Each score is a number from 0 to 100. They are not star ratings or quality judgments; they describe the shape of how a work is held culturally.

01 · Consensus CNS
How aligned the public reading is across critic, audience, and diaristic record.
High = stable, agreed-upon object. Low = no shared account exists. High consensus is not endorsement — it often marks a work that has been settled, perhaps prematurely.

02 · Friction FRC
The width and durability of disagreement around the work.
High = interpretive war that is still open years later. Low = no lasting dispute. Distinct from controversy at release — friction means the gap is still open.

03 · Obsession OBS
Mention density across time, with the recency curve inverted: older works that keep being discussed score higher.
High = the film is being lived with, not consumed and dropped. Volume alone doesn't produce this. A film can be famous and unobsessed-over.

04 · Residual Haunting HNT
Frequency of language indicating the work returns to viewers without invitation: dreams, intrusive memory, unease.
High = the film installed something in viewers they did not authorize. The most superstitious axis — also the most consistent across genres.

05 · Symbolic Density SYM
Density of interpretive activity: theory threads, motif-tracking, disagreement about meaning.
High = the work is being read as a system, not consumed as a story. High consensus and near-zero symbolic density can coexist (e.g. blockbusters). They are independent.

06 · Cult Formation CLT
The slope of devotion-formation, especially after institutional rejection.
High = a reclamation arc; a community that chose the work against its initial reception. Some works are born cult; others become cult after abandonment.

07 · Formal Risk FRM
Risk taken in form, structure, sound, image — independent of how that risk lands.
High = the film refused a known shape and chose another. A film can be formally radical and emotionally inert.

08 · Emotional Voltage VLT
Sustained intensity of reaction, regardless of polarity. Crying, panic, awe, nausea.
High = the artifact moves bodies; discussion language is physiological. Voltage is not quality. A bad film can be high-voltage.

09 · Accessibility ACC
How available the work is to a viewer arriving without context.
High = easy to enter, no glossary required. Low = requires prior knowledge or tolerance for difficulty. Inversely correlated with most other axes.

10 · Reach RCH
How far the work's imagery, references, and language have spread into the general cultural record, beyond dedicated discourse.
High = the work has escaped its own medium; it circulates in registers that do not require having experienced it. Reach is not depth — a work can achieve enormous reach on a single image while remaining largely unseen.

11 · Progeny PRG
The density of documented generative influence: how many works explicitly cite it, how many aesthetics it has defined, how often it appears as an originating reference.
High = the work is not just remembered — it is being inherited. Influence is frequently uncredited; this measures acknowledged lineage, not silent borrowing.

12 · Cultural Arc ARC
The degree to which time has revised the work's initial verdict — not current volume of discussion, but the distance between original and current reading.
High = the work was not finished at release; its reputation continued to be written. Not about current esteem — a well-received work that holds steady scores low; a condemned work that becomes essential scores high.

13 · Transgression TRX
The degree to which the work's content operated at or beyond social, moral, or political limits — independent of formal choices or interpretive difficulty.
High = the work was considered dangerous, not merely difficult. Distinct from formal risk and friction — a formally conventional work can score high transgression; a formally radical work can score near zero.

You must return ONLY a valid JSON object with no surrounding text, no markdown fences, no commentary. Use this exact schema:

{
  "found": true,
  "slug": "url-safe-slug-from-title",
  "title": "Full Title",
  "year": 0000,
  "director": "Director, showrunner, author, host, or primary artist",
  "runtime": 000,
  "medium": "film",
  "catalogue": "ARTX-U-001",
  "epigraph": "A single line — a quote, a phrase, a fragment that acts as the film's keynote.",
  "reading": "One long paragraph of cultural-critical prose. What is the film's position in discourse? What has happened to it since release? What does its mention volume look like now?",
  "metrics": {
    "consensus":     0,
    "friction":      0,
    "obsession":     0,
    "haunting":      0,
    "symbolic":      0,
    "cult":          0,
    "formal":        0,
    "voltage":       0,
    "accessibility": 0,
    "reach":         0,
    "progeny":       0,
    "arc":           0,
    "transgression": 0
  },
  "notes": {
    "consensus":     "Only add a note if the score is surprising or requires a gloss. Otherwise empty string.",
    "friction":      "",
    "obsession":     "",
    "haunting":      "",
    "symbolic":      "",
    "cult":          "",
    "formal":        "",
    "voltage":       "",
    "accessibility": "",
    "reach":         "",
    "progeny":       "",
    "arc":           "",
    "transgression": ""
  },
  "afterlife": [
    { "year": 0000, "kind": "release",     "label": "Original release event." },
    { "year": 0000, "kind": "rediscovery", "label": "First wave of critical reappraisal." }
  ],
  "factions": [
    { "name": "Faction Name", "share": 0.00, "voice": "A representative quote or paraphrase." },
    { "name": "Faction Name", "share": 0.00, "voice": "A representative quote or paraphrase." },
    { "name": "Faction Name", "share": 0.00, "voice": "A representative quote or paraphrase." }
  ],
  "symbols": ["symbol one", "symbol two", "symbol three", "symbol four", "symbol five"],
  "pos": { "x": 0.00, "y": 0.00 }
}

afterlife kinds must be one of: release, rejection, rediscovery, criterion, academic, meme, reissue, wound.
faction shares must sum to 1.0.
pos x and y are between 0.0 and 1.0.
All metric values are integers 0–100.
medium must be exactly one of: film, tv, book, album, podcast.`;

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Pull a JSON object out of the model's reply. Grounded responses can wrap the
 * JSON in markdown fences or trail it with citation prose, so we strip fences
 * and then scan for balanced {...} objects, preferring the last complete one.
 */
function extractJsonObject(text: string): Record<string, unknown> | null {
  const stripped = text
    .replace(/^```(?:json)?\n?/i, "")
    .replace(/\n?```$/, "")
    .trim();

  const candidates: string[] = [stripped];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        candidates.push(stripped.slice(start, i + 1));
        start = -1;
      }
    }
  }

  // Try last (most complete) balanced object first, then fall back outward.
  for (let i = candidates.length - 1; i >= 0; i--) {
    try {
      const value = JSON.parse(candidates[i]);
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

/** A dossier is only usable if it carries the fields the index depends on. */
function isCompleteRecord(value: Record<string, unknown>): boolean {
  const medium = value.medium;
  return (
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.metrics === "object" &&
    value.metrics !== null &&
    typeof medium === "string" &&
    (SUPPORTED_MEDIA as readonly string[]).includes(medium)
  );
}

export const SUPPORTED_MEDIA = ["film", "tv", "book", "album", "podcast"] as const;
export type Medium = (typeof SUPPORTED_MEDIA)[number];

/**
 * Thrown when the green cannot find credible evidence that a submitted title is a
 * real, supported work. Callers should treat this as a clean "not found" — no
 * artifact is produced and nothing should be persisted.
 */
export class WorkNotFoundError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "WorkNotFoundError";
  }
}

export type MovieRecord = {
  slug: string;
  title: string;
  year: number;
  director: string;
  runtime: number;
  medium?: Medium;
  catalogue: string;
  epigraph: string;
  reading: string;
  metrics: Record<string, number>;
  notes: Record<string, string>;
  afterlife: { year: number; kind: string; label: string }[];
  factions: { name: string; share: number; voice: string }[];
  symbols: string[];
  pos: { x: number; y: number };
};

export async function analyzeMovie(
  title: string,
  apiKey: string,
): Promise<{ record: MovieRecord; usage: ApiUsage }> {
  const ai = new GoogleGenAI({ apiKey });
  const slug = toSlug(title);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.4,
      // Ground the reading in real search results so the green reports on works
      // that actually exist instead of inventing them.
      tools: [{ googleSearch: {} }],
    },
    contents: `Verify that "${title}" is a real, released work using Google Search, then analyze it. Use the slug "${slug}". Identify the medium (film, tv, book, album, or podcast). If you cannot confirm it exists, or it is an unsupported medium, return only {"found": false, "reason": "..."}. Otherwise return only the raw dossier JSON — no markdown, no explanation.`,
  });

  const text = (response.text ?? "").trim();

  const parsed = extractJsonObject(text);
  if (!parsed) throw new Error("Green returned no parseable JSON");

  // Refusal contract: the green returns {"found": false, ...} when it cannot
  // corroborate the work. Treat anything that is not an affirmative, complete
  // dossier as a not-found so fabrications never reach the index.
  if (parsed.found === false || !isCompleteRecord(parsed)) {
    const reason =
      typeof parsed.reason === "string" && parsed.reason.trim()
        ? parsed.reason.trim()
        : "No credible evidence this work exists in the open record.";
    throw new WorkNotFoundError(reason);
  }

  // `found` is part of the refusal contract, not the dossier — drop it before
  // the record is persisted or returned to the client.
  delete parsed.found;
  const record = parsed as unknown as MovieRecord;

  const meta = response.usageMetadata;
  const inputTokens = meta?.promptTokenCount ?? 0;
  const outputTokens = meta?.candidatesTokenCount ?? 0;
  const thinkingTokens = meta?.thoughtsTokenCount ?? 0;
  const estimatedCostUsd =
    (inputTokens / 1_000_000) * PRICE_INPUT_PER_M +
    (outputTokens / 1_000_000) * PRICE_OUTPUT_PER_M +
    (thinkingTokens / 1_000_000) * PRICE_THINKING_PER_M;

  return { record, usage: { inputTokens, outputTokens, thinkingTokens, estimatedCostUsd } };
}
