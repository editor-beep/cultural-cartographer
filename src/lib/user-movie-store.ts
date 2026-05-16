import { kv } from "@vercel/kv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { MovieRecord } from "./green";

const PRIMARY_STORE_PATH = join(process.cwd(), "data/generated/user-movies.json");
const FALLBACK_STORE_PATH = join(tmpdir(), "cultural-cartographer", "user-movies.json");
const FRONTEND_ARTIFACTS_PATH = join(process.cwd(), "data/generated/frontend-artifacts.json");
const KV_HASH_KEY = "user-films";

type FrontendArtifactsFile = {
  generatedAt?: string;
  methodVersion?: string;
  artifacts?: MovieRecord[];
};

function kvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// --- KV (production) ---

async function loadFromKv(): Promise<MovieRecord[]> {
  const all = await kv.hgetall<Record<string, MovieRecord>>(KV_HASH_KEY);
  if (!all) return [];
  return Object.values(all);
}

async function saveToKv(record: MovieRecord): Promise<void> {
  await kv.hset(KV_HASH_KEY, { [record.slug]: record });
}

// --- File-based fallback (local dev) ---

function ensureParentDirectory(path: string): boolean {
  try {
    mkdirSync(dirname(path), { recursive: true });
    return true;
  } catch {
    return false;
  }
}

function loadFromPath(path: string): MovieRecord[] {
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as MovieRecord[];
  } catch {
    return [];
  }
}

function loadFromFile(): MovieRecord[] {
  if (existsSync(PRIMARY_STORE_PATH)) return loadFromPath(PRIMARY_STORE_PATH);
  if (existsSync(FALLBACK_STORE_PATH)) return loadFromPath(FALLBACK_STORE_PATH);
  return [];
}

function saveToFile(record: MovieRecord): void {
  const movies = loadFromFile();
  const idx = movies.findIndex((m) => m.slug === record.slug);
  if (idx >= 0) {
    movies[idx] = record;
  } else {
    movies.push(record);
  }

  const serialized = JSON.stringify(movies, null, 2);
  let saved = false;

  const primaryReady = ensureParentDirectory(PRIMARY_STORE_PATH);
  try {
    if (primaryReady) {
      writeFileSync(PRIMARY_STORE_PATH, serialized);
      saved = true;
    }
  } catch (err) {
    console.warn("Primary user movie store write failed, using fallback path", err);
  }

  if (!saved) {
    try {
      if (ensureParentDirectory(FALLBACK_STORE_PATH)) {
        writeFileSync(FALLBACK_STORE_PATH, serialized);
      }
    } catch {
      // Silently ignore — persistence is unavailable in this environment.
    }
  }

  try {
    persistToFrontendArtifacts(record);
  } catch {
    // Silently ignore — persistence is unavailable in this environment.
  }
}

function persistToFrontendArtifacts(record: MovieRecord): void {
  if (!ensureParentDirectory(FRONTEND_ARTIFACTS_PATH)) return;

  let frontend: FrontendArtifactsFile = {};
  if (existsSync(FRONTEND_ARTIFACTS_PATH)) {
    try {
      frontend = JSON.parse(
        readFileSync(FRONTEND_ARTIFACTS_PATH, "utf-8"),
      ) as FrontendArtifactsFile;
    } catch {
      frontend = {};
    }
  }

  const artifacts = Array.isArray(frontend.artifacts) ? [...frontend.artifacts] : [];
  const existing = artifacts.findIndex((item) => item.slug === record.slug);
  if (existing >= 0) {
    artifacts[existing] = { ...artifacts[existing], ...record };
  } else {
    artifacts.push(record);
  }

  const output: FrontendArtifactsFile = {
    ...frontend,
    generatedAt: frontend.generatedAt ?? new Date().toISOString(),
    artifacts,
  };

  writeFileSync(FRONTEND_ARTIFACTS_PATH, JSON.stringify(output, null, 2));
}

// --- Public API ---

export async function loadUserMovies(): Promise<MovieRecord[]> {
  if (kvConfigured()) {
    try {
      return await loadFromKv();
    } catch (err) {
      console.warn("KV load failed, falling back to file store", err);
    }
  }
  return loadFromFile();
}

export async function saveUserMovie(record: MovieRecord): Promise<void> {
  if (kvConfigured()) {
    try {
      await saveToKv(record);
      return;
    } catch (err) {
      console.warn("KV save failed, falling back to file store", err);
    }
  }
  saveToFile(record);
}
