// Vercel Edge Function — News aggregation (static JSON with RSS fallback)
// GET /api/news
// Primary: reads pre-built public/data/news.json (built by GitHub Actions)
// Fallback: live RSS fetch if JSON file missing (pre-deploy safety)

export const config = {
  runtime: 'edge',
};

const CACHE_DURATION = 1800; // 30 min

let cachedResponse: { data: string; timestamp: number } | null = null;

export default async function handler(request: Request) {
  // In-memory cache
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION * 1000) {
    return new Response(cachedResponse.data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    // Try to read pre-built JSON from public/data/news.json
    // In Vercel Edge, we fetch it from the same origin
    const url = new URL(request.url);
    const origin = url.origin;
    let jsonStr: string | null = null;

    try {
      const res = await fetch(`${origin}/data/news.json`);
      if (res.ok) {
        jsonStr = await res.text();
        // Validate it's proper JSON
        const parsed = JSON.parse(jsonStr);
        if (parsed.news || parsed.github) {
          cachedResponse = { data: jsonStr, timestamp: Date.now() };
          return new Response(jsonStr, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'X-Cache': 'STATIC',
              'Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
            },
          });
        }
      }
    } catch {
      // File not found or invalid — fall through to live fetch
    }

    // ─── Fallback: Live RSS fetch ────────────────────────
    const { default: liveHandler } = await import('./news-live');
    return liveHandler(request);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
