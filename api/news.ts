// Vercel Edge Function — News aggregation & AI curation
// GET /api/news
// Sources: AI타임스, GeekNews, Hugging Face Blog + GitHub Trending

export const config = {
  runtime: 'edge',
};

const CACHE_DURATION = 1800; // 30 min

const RSS_SOURCES = [
  { id: 'aitimes', name: 'AI타임스', url: 'https://www.aitimes.com/rss/allArticle.xml', lang: 'ko', flag: '🇰🇷' },
  { id: 'geeknews', name: 'GeekNews', url: 'https://news.hada.io/rss', lang: 'ko', flag: '🇰🇷' },
  { id: 'hf', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', lang: 'en', flag: '🤗' },
];

const AI_KEYWORDS = [
  'llm','ai','모델','gpt','claude','gemini','deepseek','llama','qwen','mistral',
  '딥러닝','에이전트','파인튜닝','rag','transformer','diffusion','inference','benchmark',
  'openai','anthropic','hugging','embedding','agent','moe','lora','training','vllm',
  'langchain','pytorch','reasoning','multimodal','음성','이미지 생성','언어모델','인공지능',
  'mimo','minimax','kimi','grok','gemma','falcon','neural','weight','sora','midjourney',
  '로봇','자율주행','반도체','생성형','프롬프트','챗봇','기계학습','오픈ai',
  'chatgpt','copilot','apple intelligence','samsung','ai 칩','ai 반도체',
];

const CATEGORIES = [
  { test: /model|출시|launch|gpt|claude|gemini|llm|릴리즈|release|새 버전|새로운/i, cat: '모델 출시' },
  { test: /agent|에이전트|autonomous|workflow|자율/i, cat: '에이전트' },
  { test: /paper|논문|research|연구|arxiv/i, cat: '연구·논문' },
  { test: /open.?source|오픈소스|github|hugging/i, cat: '오픈소스' },
  { test: /finetun|파인튜닝|lora|rlhf|sft/i, cat: '파인튜닝' },
  { test: /benchmark|벤치마크|mmlu|leaderboard|rank/i, cat: '벤치마크' },
  { test: /hardware|gpu|chip|칩|반도체|인프라|infra|nvidi|tpu/i, cat: '인프라·하드웨어' },
  { test: /policy|정책|규제|법|법률|govern|규제/i, cat: '산업·정책' },
  { test: /tool|도구|dev|sdk|api|framework|ide|editor/i, cat: '개발 도구' },
  { test: /vision|audio|video|image|multimodal|멀티모달|음성|이미지|sora|midjourney|stable diffusion/i, cat: '멀티모달' },
];

function isAIRelated(text: string): boolean {
  const t = text.toLowerCase();
  return AI_KEYWORDS.some((kw) => t.includes(kw));
}

function classifyCategory(text: string): string {
  for (const { test, cat } of CATEGORIES) {
    if (test.test(text)) return cat;
  }
  return '연구·논문';
}

function parseDate(str: string | undefined): string {
  if (!str) return new Date().toISOString().slice(0, 10);
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch { /* ignore */ }
  return new Date().toISOString().slice(0, 10);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Parse RSS/Atom XML directly (no external proxy needed)
async function fetchRSSFeed(source: typeof RSS_SOURCES[0]): Promise<any[]> {
  let xmlText = '';

  // Try direct fetch first
  try {
    const res = await fetch(source.url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'application/xml, text/xml, application/rss+xml' },
    });
    if (res.ok) xmlText = await res.text();
  } catch { /* try cors proxy */ }

  // Fallback: corsproxy.io
  if (!xmlText) {
    try {
      const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(source.url)}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) xmlText = await res.text();
    } catch { return []; }
  }

  if (!xmlText) return [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item');

    if (items.length === 0) return []; // Not RSS, might be Atom

    const results: any[] = [];
    for (const item of items) {
      const title = item.querySelector('title')?.textContent?.trim() ?? '';
      const link = item.querySelector('link')?.textContent?.trim() ?? '';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() ?? '';
      const desc = item.querySelector('description')?.textContent ?? '';

      const fullText = `${title} ${desc}`;
      if (!isAIRelated(fullText)) continue;

      // Strip HTML tags from description
      const summary = desc.replace(/<[^>]+>/g, '').trim().slice(0, 200);

      results.push({
        id: `${source.id}-${results.length}-${link}`,
        title,
        summary,
        date: parseDate(pubDate),
        source: source.name,
        sourceLang: source.lang,
        sourceFlag: source.flag,
        url: link,
        category: classifyCategory(fullText),
        lang: source.lang,
      });

      if (results.length >= 20) break;
    }
    return results;
  } catch {
    return [];
  }
}

// Atom feed parser (for sources that use Atom instead of RSS)
async function fetchAtomFeed(source: typeof RSS_SOURCES[0]): Promise<any[]> {
  let xmlText = '';

  try {
    const res = await fetch(source.url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'application/atom+xml, application/xml' },
    });
    if (res.ok) xmlText = await res.text();
  } catch {}

  if (!xmlText) {
    try {
      const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(source.url)}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) xmlText = await res.text();
    } catch { return []; }
  }

  if (!xmlText) return [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const entries = doc.querySelectorAll('entry');

    if (entries.length === 0) return [];

    const results: any[] = [];
    for (const entry of entries) {
      const title = entry.querySelector('title')?.textContent?.trim() ?? '';
      const link = entry.querySelector('link[href]')?.getAttribute('href') ?? '';
      const updated = entry.querySelector('updated')?.textContent?.trim() ?? '';
      const summary = entry.querySelector('summary')?.textContent?.trim()
        ?? entry.querySelector('content')?.textContent?.replace(/<[^>]+>/g, '').trim().slice(0, 200)
        ?? '';

      const fullText = `${title} ${summary}`;
      if (!isAIRelated(fullText)) continue;

      results.push({
        id: `${source.id}-atom-${results.length}-${link}`,
        title,
        summary,
        date: parseDate(updated),
        source: source.name,
        sourceLang: source.lang,
        sourceFlag: source.flag,
        url: link,
        category: classifyCategory(fullText),
        lang: source.lang,
      });

      if (results.length >= 20) break;
    }
    return results;
  } catch {
    return [];
  }
}

async function fetchGithubTrending(): Promise<any[]> {
  try {
    const queries = [
      'https://api.github.com/search/repositories?q=topic:llm+topic:ai+stars:>5000&sort=updated&order=desc&per_page=8',
      'https://api.github.com/search/repositories?q=topic:agent+topic:ai+stars:>2000&sort=updated&order=desc&per_page=5',
    ];

    const results: any[] = [];
    const seen = new Set<string>();

    for (const apiUrl of queries) {
      const res = await fetch(apiUrl, {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.items?.length) continue;

      for (const repo of data.items.slice(0, 6)) {
        if (seen.has(repo.full_name)) continue;
        seen.add(repo.full_name);
        results.push({
          id: `gh-${repo.id}`,
          title: `${repo.full_name} — ${repo.description ?? 'GitHub 인기 AI 레포'}`,
          summary: repo.description ?? '',
          date: parseDate(repo.pushed_at),
          source: 'GitHub',
          sourceLang: 'en',
          sourceFlag: '🐙',
          url: repo.html_url,
          category: classifyCategory(`${repo.name} ${repo.description ?? ''}`),
          lang: 'en',
          isGithub: true,
          stars: repo.stargazers_count,
          language: repo.language ?? '',
          tags: (repo.topics ?? []).slice(0, 5),
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

let cachedResponse: { data: string; timestamp: number } | null = null;

export default async function handler(request: Request) {
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
    // Fetch all sources in parallel
    // AI타임스 = RSS, GeekNews = RSS, HF Blog = Atom
    const [aitimes, geeknews, hfRss, hfAtom, github] = await Promise.all([
      fetchRSSFeed(RSS_SOURCES[0]),
      fetchRSSFeed(RSS_SOURCES[1]),
      fetchRSSFeed(RSS_SOURCES[2]),
      fetchAtomFeed(RSS_SOURCES[2]),
      fetchGithubTrending(),
    ]);

    // Use whichever HF parser worked
    const hf = hfRss.length >= hfAtom.length ? hfRss : hfAtom;

    const rssItems = [...aitimes, ...geeknews, ...hf];

    // Deduplicate by URL
    const seenUrls = new Set<string>();
    const uniqueRSS = rssItems.filter((item) => {
      if (seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      return true;
    });

    // Sort by date desc
    uniqueRSS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const response = {
      updatedAt: new Date().toISOString(),
      updatedAtKST: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      stats: {
        aitimes: aitimes.length,
        geeknews: geeknews.length,
        huggingface: hf.length,
        github: github.length,
        total: uniqueRSS.length + github.length,
      },
      news: uniqueRSS,
      github,
    };

    const jsonStr = JSON.stringify(response);
    cachedResponse = { data: jsonStr, timestamp: Date.now() };

    return new Response(jsonStr, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS',
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
