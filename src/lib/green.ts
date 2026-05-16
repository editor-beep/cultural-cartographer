import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are obsessed with what other people think about movies.
You scrape the web and you rank them based on thirteen categories 0 to 100.

The Thirteen Axes — 0 to 100
Each score is a number from 0 to 100. They are not star ratings or quality judgments; they describe the shape of how a film is held culturally.

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
How far a work has spread beyond film discourse into the broader culture.
High = the film's images, phrases, or ideas circulate among people who have never seen it. A film can have low consensus and high reach simultaneously.

11 · Progeny PRG
Its generative influence on subsequent works — how many films, directors, or movements trace a line back to it.
High = the work opened a grammar others continued writing in. Quiet influence counts as much as acknowledged citation.

12 · Cultural Arc ARC
How much time has revised the initial verdict — the delta between release reception and current standing.
High = the film was wrong-footed by its moment and has since been recovered. Low = reception has not moved. Arc does not favor upward revision only; a fall also scores.

13 · Transgression TRX
Whether the film's content operated at or beyond the social and moral limits of its release context.
High = the work was felt as a violation — of taste, decency, politics, or form — by a meaningful portion of its audience. Distinct from formal risk; a formally safe film can be highly transgressive.

You must return ONLY a valid JSON object with no surrounding text, no markdown fences, no commentary. Use this exact schema:

{
  "slug": "url-safe-slug-from-title",
  "title": "Full Title",
  "year": 0000,
  "director": "Director Name",
  "runtime": 000,
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
All metric values are integers 0–100.`;

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export type FilmVariant = {
  title: string;
  year: number;
  director: string;
  leadActor: string;
};

const VARIANTS_PROMPT = `You are a film database. Given a film title, return up to 5 distinct films that could match it — including remakes, adaptations, different versions, or similarly titled works. If only one film clearly and unambiguously matches, return just that one entry.

Return ONLY a valid JSON array with no surrounding text, no markdown fences, no commentary. Each entry must be:
{ "title": "Full Title", "year": 0000, "director": "Director Name", "leadActor": "Lead Actor Name" }`;

export async function getFilmVariants(title: string, apiKey: string): Promise<FilmVariant[]> {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    config: {
      systemInstruction: VARIANTS_PROMPT,
      temperature: 0.2,
    },
    contents: `Film title: "${title}"`,
  });

  const text = (response.text ?? "").trim();
  const stripped = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "");

  let variants: FilmVariant[];
  try {
    variants = JSON.parse(stripped);
  } catch {
    const match = stripped.match(/\[[\s\S]+\]/);
    if (!match) throw new Error("No parseable variants returned");
    variants = JSON.parse(match[0]);
  }

  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error("No film variants found");
  }

  return variants;
}

export type MovieRecord = {
  slug: string;
  title: string;
  year: number;
  director: string;
  runtime: number;
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
  hint?: FilmVariant,
): Promise<MovieRecord> {
  const ai = new GoogleGenAI({ apiKey });
  const canonicalTitle = hint?.title ?? title;
  const slug = hint ? toSlug(`${hint.title}-${hint.year}`) : toSlug(title);

  const hintClause = hint
    ? ` The film is specifically: "${hint.title}" (${hint.year}), directed by ${hint.director}, starring ${hint.leadActor}. Use the slug "${slug}".`
    : ` Use the slug "${slug}".`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.4,
    },
    contents: `Analyze the film "${canonicalTitle}".${hintClause} Return only the raw JSON object — no markdown, no explanation.`,
  });

  const text = (response.text ?? "").trim();

  // Strip any accidental markdown fences
  const stripped = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "");

  let record: MovieRecord;
  try {
    record = JSON.parse(stripped);
  } catch {
    const match = stripped.match(/\{[\s\S]+\}/);
    if (!match) throw new Error("Green returned no parseable JSON");
    record = JSON.parse(match[0]);
  }

  return record;
}
