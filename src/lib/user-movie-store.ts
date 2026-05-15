import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { MovieRecord } from "./green";

const PRIMARY_STORE_PATH = join(process.cwd(), "data/generated/user-movies.json");
const FALLBACK_STORE_PATH = join(tmpdir(), "cultural-cartographer", "user-movies.json");

function ensureParentDirectory(path: string): boolean {
  try {
    mkdirSync(dirname(path), { recursive: true });
    return true;
  } catch {
    return false;
  }
}

function resolveStorePath(): string {
  if (ensureParentDirectory(PRIMARY_STORE_PATH)) {
    return PRIMARY_STORE_PATH;
  }
  ensureParentDirectory(FALLBACK_STORE_PATH);
  return FALLBACK_STORE_PATH;
}

function loadFromPath(path: string): MovieRecord[] {
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as MovieRecord[];
  } catch {
    return [];
  }
}

export function loadUserMovies(): MovieRecord[] {
  const primaryMovies = loadFromPath(PRIMARY_STORE_PATH);
  if (primaryMovies.length > 0) return primaryMovies;
  const fallbackMovies = loadFromPath(FALLBACK_STORE_PATH);
  if (fallbackMovies.length > 0) return fallbackMovies;

  const preferredPath = resolveStorePath();
  if (preferredPath === PRIMARY_STORE_PATH) {
    return primaryMovies;
  }
  return fallbackMovies;
}

export function saveUserMovie(record: MovieRecord): void {
  const movies = loadUserMovies();
  const idx = movies.findIndex((m) => m.slug === record.slug);
  if (idx >= 0) {
    movies[idx] = record;
  } else {
    movies.push(record);
  }

  const serialized = JSON.stringify(movies, null, 2);

  const primaryReady = ensureParentDirectory(PRIMARY_STORE_PATH);
  try {
    if (!primaryReady) throw new Error("Primary store path unavailable");
    writeFileSync(PRIMARY_STORE_PATH, serialized);
  } catch {
    if (!ensureParentDirectory(FALLBACK_STORE_PATH)) {
      throw new Error("Unable to prepare fallback store path");
    }
    writeFileSync(FALLBACK_STORE_PATH, serialized);
  }
}
