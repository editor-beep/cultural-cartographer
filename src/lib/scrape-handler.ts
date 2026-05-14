import { z } from "zod";
import { analyzeMovie } from "./green";
import { saveUserMovie } from "./user-movie-store";

const RequestSchema = z.object({
  title: z.string().min(1).max(300),
});

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
    const record = await analyzeMovie(parsed.data.title, apiKey);
    saveUserMovie(record);
    return Response.json(record, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
