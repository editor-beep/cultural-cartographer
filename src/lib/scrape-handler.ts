import { z } from "zod";
import { analyzeMovie } from "./green";
import { saveUserMovie } from "./user-movie-store";

const RequestSchema = z.object({
  title: z.string().min(1).max(300),
});

// Simple in-memory per-IP rate limiter.
// NOTE: In-memory state is not shared across serverless function instances, so
// this is a best-effort guard against abuse from a single client within one
// function lifetime. For stricter enforcement use an external store (e.g. KV).
// JavaScript's single-threaded event loop means reads and writes to the map are
// always sequential — no additional synchronisation is needed.
const RATE_LIMIT_MAX = 10; // max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1-hour rolling window
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

// Evict entries whose windows have already expired to keep the map bounded.
function evictExpiredEntries(now: number): void {
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  evictExpiredEntries(now);
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

export async function handleScrapeRequest(
  request: Request,
  env: Record<string, string | undefined>,
): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const apiKey = env["GEMINI_API_KEY"];
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  // Rate-limit by forwarded IP (falls back to a shared "unknown" bucket).
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { record, usage } = await analyzeMovie(parsed.data.title, apiKey);
    await saveUserMovie(record);
    return Response.json({ ...record, _usage: usage }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
