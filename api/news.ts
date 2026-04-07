// Vercel Edge Function — News aggregation & AI curation
// GET /api/news
// Sources: AI타임스, GeekNews, Hugging Face Blog + GitHub Trending

export const config = {
  runtime: 'edge',
};

const CACHE_DURATION = 1800; // 30 min

const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

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
];

const CATEGORIES = [
  { test: /model|출시|launch|gpt|claude|gemini|llm|릴리즈|release|새 버전/i, cat: '모델 출시' },
  { test: /agent|에이전트|autonomous|workflow|자율/i, cat: '에이전트' },
  { test: /paper|논문|research|연구|arxiv/i, cat: '연구·논문' },
  { test: /open.?source|오픈소스|github|hugging/i, cat: '오픈소스' },
  { test: /finetun|파인튜닝|lora|rlhf|sft/i, cat: '파인튜닝' },
  { test: /benchmark|벤치마크|mmlu|leaderboard|rank/i, cat: '벤치마크' },
  { test: /hardware|gpu|chip|칩|반도체|인프라|infra|nvidi|tpu/i, cat: '인프라·하드웨어' },
  { test: /policy|정책|규제|법|법률|govern/i, cat: '산업·정책' },
  { test: /tool|도구|dev|sdk|api|framework/i, cat: '개발 도구' },
  { test: /vision|audio|video|image|multimodal|멀티모달|음성|이미지/i, cat: '멀티모달' },
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

async function fetchRSSFeed(source: typeof RSS_SOURCES[0]): Promise<any[]> {
  try {
    const url = `${RSS_PROXY}${encodeURIComponent(source.url)}&count=50&api_key=`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items?.length) return [];

    return data.items
      .filter((item: any) => isAIRelated(`${item.title} ${item.description ?? ''} ${item.content ?? ''}`))
      .slice(0, 20)
      .map((item: any, idx: number) => ({
        id: `${source.id}-${idx}-${item.guid ?? item.link}`,
        title: item.title.trim(),
        summary: (item.description ?? '').replace(/<[^>]+>/g, '').trim().slice(0, 200),
        date: parseDate(item.pubDate),
        source: source.name,
        sourceLang: source.lang,
        sourceFlag: source.flag,
        url: item.link,
        category: classifyCategory(`${item.title} ${(item.description ?? '')}`),
        lang: source.lang,
      }));
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
    const [aitimes, geeknews, hf, github] = await Promise.all([
      fetchRSSFeed(RSS_SOURCES[0]),
      fetchRSSFeed(RSS_SOURCES[1]),
      fetchRSSFeed(RSS_SOURCES[2]),
      fetchGithubTrending(),
    ]);

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
