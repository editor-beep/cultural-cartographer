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

const STORE_PATH = resolveStorePath();

export function loadUserMovies(): MovieRecord[] {
  if (!existsSync(STORE_PATH)) return [];
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf-8")) as MovieRecord[];
  } catch {
    return [];
  }
}

export function saveUserMovie(record: MovieRecord): void {
  const movies = loadUserMovies();
  const idx = movies.findIndex((m) => m.slug === record.slug);
  if (idx >= 0) {
    movies[idx] = record;
  } else {
    movies.push(record);
  }
  try {
    writeFileSync(STORE_PATH, JSON.stringify(movies, null, 2));
  } catch {
    ensureParentDirectory(FALLBACK_STORE_PATH);
    writeFileSync(FALLBACK_STORE_PATH, JSON.stringify(movies, null, 2));
  }
}
