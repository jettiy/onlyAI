// Vercel Edge Function — News aggregation & AI curation
// GET /api/news
// Sources: AI타임스, GeekNews, 36氪, Hugging Face Blog, TechCrunch AI + GitHub Trending

export const config = {
  runtime: 'edge',
};

const CACHE_DURATION = 1800; // 30 min

const RSS_SOURCES = [
  { id: 'aitimes', name: 'AI타임스', url: 'https://www.aitimes.com/rss/allArticle.xml', lang: 'ko', flag: '🇰🇷' },
  { id: 'geeknews', name: 'GeekNews', url: 'https://news.hada.io/rss', lang: 'ko', flag: '🇰🇷' },
  { id: '36kr', name: '36氪', url: 'https://36kr.com/feed', lang: 'zh', flag: '🇨🇳' },
  { id: 'hf', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', lang: 'en', flag: '🤗' },
  { id: 'tc', name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', lang: 'en', flag: '🇺🇸' },
];

const AI_KEYWORDS = [
  'llm','ai','모델','gpt','claude','gemini','deepseek','llama','qwen','mistral',
  '딥러닝','에이전트','파인튜닝','rag','transformer','diffusion','inference','benchmark',
  'openai','anthropic','hugging','embedding','agent','moe','lora','training','vllm',
  'langchain','pytorch','reasoning','multimodal','음성','이미지 생성','언어모델','인공지능',
  'mimo','minimax','kimi','grok','gemma','falcon','neural','weight','sora','midjourney',
  '로봇','자율주행','반도체','생성형','프롬프트','챗봇','기계학습','오픈ai',
  'chatgpt','copilot','apple intelligence','samsung','ai 칩','ai 반도체',
  '人工智能','大模型','深度学习','机器人','自动驾驶','芯片','机器学习',
  'gpt-','claude-','gemini-','open source model','foundation model',
  'ai startup','ai funding','series a','series b','valuation',
  '智能','模型','训练','推理','多模态','语言模型',
];

const CATEGORIES = [
  { test: /model|출시|launch|gpt|claude|gemini|llm|릴리즈|release|새 버전|새로운|发布|上线/i, cat: '모델 출시' },
  { test: /agent|에이전트|autonomous|workflow|자율|智能体/i, cat: '에이전트' },
  { test: /paper|논문|research|연구|arxiv|论文|研究/i, cat: '연구·논문' },
  { test: /open.?source|오픈소스|github|hugging|开源/i, cat: '오픈소스' },
  { test: /finetun|파인튜닝|lora|rlhf|sft|微调/i, cat: '파인튜닝' },
  { test: /benchmark|벤치마크|mmlu|leaderboard|rank|评测/i, cat: '벤치마크' },
  { test: /hardware|gpu|chip|칩|반도체|인프라|infra|nvidi|tpu|芯片|半导体/i, cat: '인프라·하드웨어' },
  { test: /policy|정책|규제|법|법률|govern|监管|合规/i, cat: '산업·정책' },
  { test: /tool|도구|dev|sdk|api|framework|ide|editor|工具|框架/i, cat: '개발 도구' },
  { test: /vision|audio|video|image|multimodal|멀티모달|음성|이미지|sora|midjourney|多模态|视频|语音/i, cat: '멀티모달' },
  { test: /투자|investment|funding|series [ab]|매출|revenue|기업|company|startup|valuation|ipo|상장|strategic/i, cat: '투자·기업' },
  { test: /robot|로봇|autonomous driv|자율주행|car|ev|전기차|tesla|mobility/i, cat: '로봇·자율주행' },
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

// Simple XML tag extraction without DOMParser (Edge Runtime compatible)
function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
  if (cdataMatch) return decodeEntities(cdataMatch[1].trim());
  // Handle normal content
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (match) return decodeEntities(match[1].replace(/<[^>]+>/g, '').trim());
  return '';
}

function extractLink(xml: string): string {
  // Try <link>href</link>
  const m1 = xml.match(/<link[^>]*>([^<]+)<\/link>/);
  if (m1) return m1[1].trim();
  // Try <link href="..." />
  const m2 = xml.match(/<link[^>]*href="([^"]+)"/);
  if (m2) return m2[1].trim();
  // Try <link href='...' />
  const m3 = xml.match(/<link[^>]*href='([^']+)'/);
  if (m3) return m3[1].trim();
  return '';
}

function splitItems(xml: string): string[] {
  // Split by <item> and <entry>
  const items: string[] = [];
  // RSS items
  const parts = xml.split(/<item[^>]*>/);
  for (let i = 1; i < parts.length; i++) {
    const item = parts[i].split(/<\/item>/)[0];
    if (item) items.push(item);
  }
  // Atom entries
  if (items.length === 0) {
    const entries = xml.split(/<entry[^>]*>/);
    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i].split(/<\/entry>/)[0];
      if (entry) items.push(entry);
    }
  }
  return items;
}

async function fetchRSSFeed(source: typeof RSS_SOURCES[0]): Promise<any[]> {
  const results: any[] = [];

  try {
    const res = await fetch(source.url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        'Accept': 'application/xml, text/xml, application/rss+xml, application/atom+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; OnlyAI-Bot/1.0)',
      },
    });
    if (!res.ok) return results;

    const xml = await res.text();
    const items = splitItems(xml);

    for (let i = 0; i < items.length && results.length < 20; i++) {
      const item = items[i];
      const title = extractTag(item, 'title');
      const link = extractLink(item);
      const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'published') || extractTag(item, 'updated') || extractTag(item, 'dc:date');
      const desc = extractTag(item, 'description') || extractTag(item, 'summary') || extractTag(item, 'content');

      const fullText = `${title} ${desc}`;
      if (!title || !isAIRelated(fullText)) continue;

      const summary = desc.slice(0, 200);

      results.push({
        id: `${source.id}-${i}-${link}`,
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
    }
  } catch (e) {
    console.error(`RSS fetch failed for ${source.name}:`, e);
  }

  return results;
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

// ─── GLM-5 Turbo 번역 ───────────────────────────────────
interface NewsTranslateItem {
  id: string;
  title: string;
  summary: string;
  lang: string;
}

// ─── GLM-5 Turbo 번역 (타이틀만, 1회 배치) ──────────────
interface NewsTranslateItem {
  id: string;
  title: string;
  lang: string;
}

async function translateNewsItems(items: NewsTranslateItem[]): Promise<Map<string, { title: string }>> {
  const apiKey = (typeof process !== 'undefined' && process.env?.ZAI_API_KEY) ?? '';
  if (!apiKey) return new Map();

  const toTranslate = items.filter(i => i.lang === 'en' || i.lang === 'zh').slice(0, 15);
  if (toTranslate.length === 0) return new Map();

  const prompt = `다음 AI 뉴스 제목들을 한국어로 간결하게 번역해줘.
JSON 배열만 출력 (코드블록, 마크다운 금지):
[{"id":"원본id","title":"한국어 제목"}]

제목:
${toTranslate.map((item, i) => `[${i + 1}] ID:${item.id} ${item.title}`).join('\n')}`;

  try {
    const res = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'glm-5-turbo', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 500 }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`GLM API ${res.status}`);
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';

    let jsonStr = content
      .replace(/^\s*```(?:json)?\s*/gi, '')
      .replace(/\s*```\s*$/g, '')
      .trim();
    const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (arrMatch) jsonStr = arrMatch[0];

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('Not an array');

    const map = new Map<string, { title: string }>();
    for (const item of parsed) {
      if (item.id && typeof item.title === 'string') {
        map.set(item.id, { title: item.title });
      }
    }
    return map;
  } catch (e) {
    console.error('Title translation failed:', e);
    return new Map();
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
    const allResults = await Promise.all([
      ...RSS_SOURCES.map(s => fetchRSSFeed(s)),
      fetchGithubTrending(),
    ]);

    const newsResults = allResults.slice(0, -1);
    const github = allResults[allResults.length - 1] as any[];

    // Merge all RSS items
    const rssItems = newsResults.flat();

    // Deduplicate by URL
    const seenUrls = new Set<string>();
    const uniqueRSS = rssItems.filter((item) => {
      if (!item.url || seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      return true;
    });

    // Sort by date desc
    uniqueRSS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Translate non-Korean news with GLM-5 Turbo
    const translated = await translateNewsItems(uniqueRSS.map(i => ({ id: i.id, title: i.title, lang: i.lang })));
    for (const item of uniqueRSS) {
      const t = translated.get(item.id);
      if (t?.title) item.titleKo = t.title;
    }

    const sourceStats: Record<string, number> = {};
    newsResults.forEach((r, i) => {
      sourceStats[RSS_SOURCES[i].id] = r.length;
    });

    const response = {
      updatedAt: new Date().toISOString(),
      updatedAtKST: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      stats: {
        ...sourceStats,
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
