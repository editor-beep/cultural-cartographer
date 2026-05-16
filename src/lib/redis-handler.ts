import { createClient } from "redis";

let redis: Awaited<ReturnType<ReturnType<typeof createClient>["connect"]>> | null = null;

async function getRedis(url?: string) {
  if (!redis) {
    redis = await createClient({ url }).connect();
  }
  return redis;
}

export async function handleRedisRequest(
  request: Request,
  env: Record<string, string | undefined>,
): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const client = await getRedis(env["REDIS_URL"]);
  const result = await client.get("item");
  return new Response(JSON.stringify({ result }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
