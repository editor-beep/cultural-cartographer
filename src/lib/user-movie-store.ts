import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { MovieRecord } from "./green";

const PRIMARY_STORE_PATH = join(process.cwd(), "data/generated/user-movies.json");
const FALLBACK_STORE_PATH = join(tmpdir(), "cultural-cartographer", "user-movies.json");
const FRONTEND_ARTIFACTS_PATH = join(process.cwd(), "data/generated/frontend-artifacts.json");

type FrontendArtifactsFile = {
  generatedAt?: string;
  methodVersion?: string;
  artifacts?: MovieRecord[];
};

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

export function loadUserMovies(): MovieRecord[] {
  if (existsSync(PRIMARY_STORE_PATH)) return loadFromPath(PRIMARY_STORE_PATH);
  if (existsSync(FALLBACK_STORE_PATH)) return loadFromPath(FALLBACK_STORE_PATH);
  return [];
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

  let savedToUserStore = false;
  const primaryReady = ensureParentDirectory(PRIMARY_STORE_PATH);
  try {
    if (primaryReady) {
      writeFileSync(PRIMARY_STORE_PATH, serialized);
      savedToUserStore = true;
    }
  } catch (error) {
    console.warn("Primary user movie store write failed, using fallback path", error);
    // fall through to fallback write below
  }

  if (!savedToUserStore) {
    if (!ensureParentDirectory(FALLBACK_STORE_PATH)) {
      throw new Error("Unable to prepare fallback store path");
    }
    writeFileSync(FALLBACK_STORE_PATH, serialized);
  }

  persistToFrontendArtifacts(record);
}

function persistToFrontendArtifacts(record: MovieRecord): void {
  if (!ensureParentDirectory(FRONTEND_ARTIFACTS_PATH)) {
    throw new Error("Unable to prepare frontend artifacts store path");
  }

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
    artifacts[existing] = record;
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
