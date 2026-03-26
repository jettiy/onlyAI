import { useState, useEffect, useCallback, useRef } from "react";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  sourceUrl: string;
  url: string;
  category: NewsCategory;
  lang: "ko" | "en";
  readingTime?: string;
  isNew?: boolean;
  tags?: string[];
  stars?: number;       // for GitHub repos
  starsGained?: number; // for GitHub trending weekly
  language?: string;    // GitHub repo language
  isGithub?: boolean;
}

export type NewsCategory =
  | "모델 출시"
  | "연구·논문"
  | "에이전트"
  | "오픈소스"
  | "파인튜닝"
  | "벤치마크"
  | "인프라·하드웨어"
  | "산업·정책"
  | "개발 도구"
  | "멀티모달";

export const categoryColor: Record<NewsCategory, string> = {
  "모델 출시":      "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800",
  "연구·논문":      "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  "에이전트":       "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800",
  "오픈소스":       "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  "파인튜닝":       "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
  "벤치마크":       "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
  "인프라·하드웨어": "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  "산업·정책":      "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
  "개발 도구":      "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800",
  "멀티모달":       "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800",
};

// ── AI 카테고리 분류 헬퍼 ──────────────────────────────
function classifyCategory(text: string): NewsCategory {
  const t = text.toLowerCase();
  if (/model|출시|launch|gpt|claude|gemini|llm|릴리즈|release|새 버전/.test(t)) return "모델 출시";
  if (/agent|에이전트|autonomous|workflow|자율/.test(t)) return "에이전트";
  if (/paper|논문|research|연구|arxiv|benchmark|벤치/.test(t)) return "연구·논문";
  if (/open.?source|오픈소스|github|hugging/.test(t)) return "오픈소스";
  if (/finetun|파인튜닝|lora|rlhf|sft/.test(t)) return "파인튜닝";
  if (/benchmark|벤치마크|mmlu|leaderboard|rank/.test(t)) return "벤치마크";
  if (/hardware|gpu|chip|칩|반도체|인프라|infra|nvidi|tpu/.test(t)) return "인프라·하드웨어";
  if (/policy|정책|규제|법|법률|govern/.test(t)) return "산업·정책";
  if (/tool|도구|dev|sdk|api|framework/.test(t)) return "개발 도구";
  if (/vision|audio|video|image|multimodal|멀티모달|음성|이미지/.test(t)) return "멀티모달";
  return "연구·논문";
}

// ── AI 관련 키워드 필터 ──────────────────────────────
const AI_KEYWORDS = [
  "llm","ai","모델","gpt","claude","gemini","deepseek","llama","qwen","mistral",
  "딥러닝","에이전트","파인튜닝","rag","transformer","diffusion","inference","benchmark",
  "openai","anthropic","hugging","embedding","agent","moe","lora","training","vllm",
  "langchain","pytorch","reasoning","multimodal","음성","이미지 생성","언어모델","인공지능",
  "mimo","minimax","kimi","grok","gemma","falcon","neural","weight","sora","midjourney",
];

function isAIRelated(text: string): boolean {
  const t = text.toLowerCase();
  return AI_KEYWORDS.some((kw) => t.includes(kw));
}

// ── 날짜 파싱 헬퍼 ──────────────────────────────
function parseDate(str: string | undefined): string {
  if (!str) return new Date().toISOString().slice(0, 10);
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch { /* ignore */ }
  return new Date().toISOString().slice(0, 10);
}

// ── 큐레이션 뉴스 (fallback + 최신 초기 데이터) ──────────
export const CURATED_NEWS: NewsItem[] = [
  {
    id: "xiaomi-hunter-alpha-reveal",
    title: "샤오미, OpenRouter 1위 미스터리 모델 'Hunter Alpha' 정체 공개 — MiMo-V2-Pro였다",
    summary: "수일간 OpenRouter 일일 API 호출량 1위를 차지한 익명 모델 'Hunter Alpha'의 정체가 샤오미의 MiMo-V2-Pro로 확인됐다. 1조 파라미터, 1M 컨텍스트. Claude Opus 4.6의 1/5 가격.",
    date: "2026-03-19",
    source: "AI타임스", sourceUrl: "https://www.aitimes.com",
    url: "https://efficienist.com/what-is-hunter-alpha-openrouter-model-could-actually-be-xiaomi-mimo-v2-pro/",
    category: "모델 출시", lang: "ko", isNew: true, tags: ["샤오미","MiMo","Hunter Alpha","OpenRouter"],
  },
  {
    id: "xiaomi-mimo-v2-omni",
    title: "샤오미 MiMo-V2-Omni 출시 — 오디오 이해서 Gemini 3 Pro 능가, 이미지서 Claude Opus 4.6 초월",
    summary: "텍스트·비전·음성 풀 멀티모달. OpenRouter에서 'Healer Alpha'로 사전 공개. 10시간 이상 장시간 오디오 분석 가능. DeepSeek 출신 뤄푸리 총괄.",
    date: "2026-03-19",
    source: "AI타임스", sourceUrl: "https://www.aitimes.com",
    url: "https://eu.36kr.com/en/p/3729001380806017",
    category: "멀티모달", lang: "ko", isNew: true, tags: ["샤오미","MiMo-V2-Omni","Healer Alpha","멀티모달"],
  },
  {
    id: "alibaba-q3-earnings",
    title: "알리바바 Q3 FY2026 실적 — EPS $2.95 어닝 비트, 클라우드 AI 9분기 연속 세 자릿수 성장",
    summary: "2026년 3월 19일 발표. 비GAAP EPS $2.95로 컨센서스 $1.91 대비 크게 상회. 총매출 $38.61B로 가이던스 소폭 미달. 클라우드 AI 외부 고객 매출 비중 20% 돌파. 향후 3년 설비투자 $380억 예고.",
    date: "2026-03-19",
    source: "AI타임스", sourceUrl: "https://www.aitimes.com",
    url: "https://www.alibabagroup.com/ir-financial-reports-quarterly-results",
    category: "산업·정책", lang: "ko", isNew: true, tags: ["알리바바","클라우드","실적","AI투자"],
  },
  {
    id: "at-baidu-openclaw", title: "바이두, 새 AI 에이전트로 중국의 '오픈클로 열풍' 합류",
    summary: "중국 AI 시장 경쟁이 에이전트 중심으로 이동. 바이두 신규 AI 에이전트 공개.",
    date: "2026-03-18", source: "AI타임스", sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208055",
    category: "에이전트", lang: "ko", isNew: true, tags: ["바이두","에이전트"],
  },
  {
    id: "at-midjourney-v8", title: "미드저니 V8 알파: 속도·개인화·해상도 동시 향상",
    summary: "미드저니가 V8 알파를 공개. 생성 속도 향상, 사용자 스타일 학습 개인화, 고해상도 동시 강화.",
    date: "2026-03-18", source: "AI타임스", sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208049",
    category: "모델 출시", lang: "ko", isNew: true, tags: ["미드저니","이미지 생성","V8"],
  },
  {
    id: "at-ms-copilot-reorg", title: "MS, 나델라 중심 '코파일럿' 조직 개편…술레이먼은 초지능 집중",
    summary: "마이크로소프트가 코파일럿 중심 조직 개편. 무스타파 술레이먼은 AGI 개발에 전념.",
    date: "2026-03-18", source: "AI타임스", sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208027",
    category: "산업·정책", lang: "ko", isNew: true, tags: ["마이크로소프트","코파일럿","AGI"],
  },
  {
    id: "at-nvidia-h200-china", title: "엔비디아, 중국 AI 칩 판매 재개 시동…H200 생산 재가동",
    summary: "엔비디아가 중국 시장 재진입을 위해 H200 AI 칩 생산 재개.",
    date: "2026-03-18", source: "AI타임스", sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208031",
    category: "인프라·하드웨어", lang: "ko", isNew: true, tags: ["엔비디아","H200","AI칩"],
  },
  {
    id: "at-korea-ai-semiconductor", title: "AI 반도체 5년간 50조 투자…'K-엔비디아 육성' 프로젝트 추진",
    summary: "과기정통부·금융위가 AI 반도체 분야에 5년간 50조 원 투자 계획.",
    date: "2026-03-18", source: "AI타임스", sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208039",
    category: "산업·정책", lang: "ko", isNew: true, tags: ["AI반도체","한국","정책"],
  },
  {
    id: "hf-bitnet-lora", title: "QVAC Fabric으로 엣지 GPU에서 BitNet b1.58 LoRA 파인튜닝",
    summary: "이기종 엣지 GPU에서 1비트 LLM을 LoRA로 파인튜닝. 단일 고사양 GPU 없이 도메인 특화 소형 모델 학습 가능.",
    date: "2026-03-18", source: "Hugging Face Blog", sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/qvac/fabric-llm-finetune-bitnet",
    category: "파인튜닝", lang: "en", isNew: true, tags: ["LoRA","BitNet","엣지 AI"],
  },
  {
    id: "hf-healthcare-robotics", title: "NVIDIA, 헬스케어 로봇 전용 첫 AI 데이터셋과 기반 모델 공개",
    summary: "NVIDIA가 의료 현장 로봇 특화 Physical AI 모델과 데이터셋을 Hugging Face에 공개.",
    date: "2026-03-17", source: "Hugging Face Blog", sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/nvidia/physical-ai-for-healthcare-robotics",
    category: "연구·논문", lang: "en", tags: ["로봇","헬스케어","NVIDIA"],
  },
  {
    id: "gn-llm-arch-gallery", title: "LLM 아키텍처 갤러리: GPT-2부터 DeepSeek V3·Qwen3까지 한눈에",
    summary: "Sebastian Raschka가 공개한 LLM 아키텍처 갤러리. 주요 모델 구조 도식·파라미터·어텐션 사양을 한 페이지에서 비교.",
    date: "2026-03-19", source: "GeekNews", sourceUrl: "https://news.hada.io",
    url: "https://sebastianraschka.com/llm-architecture-gallery/",
    category: "연구·논문", lang: "ko", isNew: true, tags: ["LLM","아키텍처","GPT","DeepSeek"],
  },
  {
    id: "gn-unsloth-studio", title: "Unsloth Studio: 로컬 AI 모델 학습·실행 노코드 웹 UI",
    summary: "텍스트·오디오·임베딩·비전 모델을 하나의 인터페이스에서 로컬 학습·실행. Mac/Windows/Linux 지원.",
    date: "2026-03-19", source: "GeekNews", sourceUrl: "https://news.hada.io",
    url: "https://unsloth.ai/docs/new/studio",
    category: "개발 도구", lang: "ko", isNew: true, tags: ["Unsloth","파인튜닝","노코드","로컬 AI"],
  },
  {
    id: "gn-open-swe", title: "Open SWE: Stripe·Ramp·Coinbase 사내 코딩 에이전트 아키텍처 오픈소스화",
    summary: "대형 엔지니어링 조직들의 사내 코딩 에이전트 공통 패턴을 오픈소스 프레임워크로 공개.",
    date: "2026-03-19", source: "GeekNews", sourceUrl: "https://news.hada.io",
    url: "https://news.hada.io/topic?id=19000",
    category: "에이전트", lang: "ko", isNew: true, tags: ["코딩 에이전트","오픈소스"],
  },
];

// ── GitHub 트렌딩 큐레이션 (API 실패 시 fallback) ──────────
export const GITHUB_TRENDING_FALLBACK: NewsItem[] = [
  {
    id: "gh-karpathy-autoresearch",
    title: "karpathy/autoresearch — AI 에이전트가 밤새 LLM 훈련 실험 자동화",
    summary: "AI 에이전트에 GPU 하나와 학습 코드를 주면, 밤새 스스로 실험·수정·반복해 더 나은 모델을 찾아준다. 5분 단위 실험, 100회/야간. Andrej Karpathy 개발.",
    date: "2026-03-15",
    source: "GitHub Trending", sourceUrl: "https://github.com/trending",
    url: "https://github.com/karpathy/autoresearch",
    category: "오픈소스", lang: "en", isNew: true, isGithub: true,
    stars: 42900, starsGained: 8200, language: "Python",
    tags: ["에이전트","자동화","LLM 훈련","Karpathy"],
  },
  {
    id: "gh-open-webui",
    title: "open-webui/open-webui — 오프라인 완전 자립 AI 채팅 플랫폼 ⭐124k+",
    summary: "Ollama·OpenAI API 연결 가능한 ChatGPT 스타일 셀프호스트 UI. RAG 내장, 음성·비디오 통화, 모델 빌더, 기업용 SSO/RBAC 지원. 완전 오프라인 동작.",
    date: "2026-03-14",
    source: "GitHub Trending", sourceUrl: "https://github.com/trending",
    url: "https://github.com/open-webui/open-webui",
    category: "개발 도구", lang: "en", isGithub: true,
    stars: 124000, starsGained: 3100, language: "Svelte",
    tags: ["오픈소스","Ollama","RAG","셀프호스트"],
  },
  {
    id: "gh-dify",
    title: "langgenius/dify — 에이전트 워크플로 노코드 올인원 플랫폼",
    summary: "에이전트·RAG 파이프라인·멀티모델 지원·사용량 모니터링을 하나의 드래그앤드롭 인터페이스로 제공. TypeScript 기반. 로컬·클라우드 배포 모두 지원.",
    date: "2026-03-13",
    source: "GitHub Trending", sourceUrl: "https://github.com/trending",
    url: "https://github.com/langgenius/dify",
    category: "에이전트", lang: "en", isGithub: true,
    stars: 89000, starsGained: 2400, language: "TypeScript",
    tags: ["에이전트","노코드","RAG","워크플로"],
  },
  {
    id: "gh-ragflow",
    title: "infiniflow/ragflow — 기업용 에이전트형 RAG 엔진 ⭐70k+",
    summary: "문서 수집→벡터 인덱싱→쿼리 플래닝→도구 사용 에이전트까지 단계별 RAG 파이프라인 제공. 인용 추적·다단계 추론·멀티 에이전트 지원.",
    date: "2026-03-12",
    source: "GitHub Trending", sourceUrl: "https://github.com/trending",
    url: "https://github.com/infiniflow/ragflow",
    category: "에이전트", lang: "en", isGithub: true,
    stars: 70000, starsGained: 1800, language: "Python",
    tags: ["RAG","에이전트","기업용","오픈소스"],
  },
  {
    id: "gh-caramaschihg-awesome-agents",
    title: "caramaschiHG/awesome-ai-agents-2026 — 300+ AI 에이전트 프레임워크 총정리",
    summary: "코딩·브라우저·멀티에이전트·RAG 등 20개 카테고리, 300개 이상의 AI 에이전트 도구·프레임워크·논문 큐레이션 리스트.",
    date: "2026-03-10",
    source: "GitHub Trending", sourceUrl: "https://github.com/trending",
    url: "https://github.com/caramaschiHG/awesome-ai-agents-2026",
    category: "에이전트", lang: "en", isGithub: true,
    stars: 18000, starsGained: 4200, language: "",
    tags: ["에이전트","큐레이션","프레임워크"],
  },
];

// ── RSS 소스 설정 ──────────────────────────────
const RSS_SOURCES = [
  {
    id: "hf",
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    lang: "en" as const,
    flag: "🤗",
  },
  {
    id: "geeknews",
    name: "GeekNews",
    url: "https://news.hada.io/rss",
    lang: "ko" as const,
    flag: "🇰🇷",
  },
  {
    id: "aitimes",
    name: "AI타임스",
    url: "https://www.aitimes.com/rss/allArticle.xml",
    lang: "ko" as const,
    flag: "🇰🇷",
  },
];

const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

async function fetchRSSFeed(source: typeof RSS_SOURCES[0]): Promise<NewsItem[]> {
  try {
    const url = `${RSS_PROXY}${encodeURIComponent(source.url)}&count=30&api_key=`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items?.length) return [];

    return data.items
      .filter((item: { title: string; description?: string; content?: string }) => {
        const text = `${item.title} ${item.description ?? ""} ${item.content ?? ""}`;
        return isAIRelated(text);
      })
      .slice(0, 15)
      .map((item: { title: string; description?: string; pubDate?: string; link: string; guid?: string }, idx: number): NewsItem => {
        const rawSummary = (item.description ?? "").replace(/<[^>]+>/g, "").trim();
        const summary = rawSummary.slice(0, 200) + (rawSummary.length > 200 ? "..." : "");
        const text = `${item.title} ${rawSummary}`;
        return {
          id: `${source.id}-live-${idx}-${item.guid ?? item.link}`,
          title: item.title.trim(),
          summary: summary || "자세한 내용은 원문을 확인하세요.",
          date: parseDate(item.pubDate),
          source: source.name,
          sourceUrl: source.url,
          url: item.link,
          category: classifyCategory(text),
          lang: source.lang,
          isNew: true,
        };
      });
  } catch {
    return [];
  }
}

// ── GitHub Trending API ──────────────────────────────
async function fetchGithubTrending(): Promise<NewsItem[]> {
  try {
    // GitHub Search API: recently updated AI repos sorted by stars
    const queries = [
      "https://api.github.com/search/repositories?q=topic:llm+topic:ai+stars:>5000&sort=updated&order=desc&per_page=10",
      "https://api.github.com/search/repositories?q=topic:agent+topic:ai+stars:>2000&sort=updated&order=desc&per_page=8",
    ];

    const results: NewsItem[] = [];
    const seen = new Set<string>();

    for (const apiUrl of queries) {
      const res = await fetch(apiUrl, {
        headers: { "Accept": "application/vnd.github.v3+json" },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.items?.length) continue;

      for (const repo of data.items.slice(0, 6)) {
        if (seen.has(repo.full_name)) continue;
        seen.add(repo.full_name);
        const text = `${repo.name} ${repo.description ?? ""}`;
        results.push({
          id: `gh-${repo.id}`,
          title: `${repo.full_name} — ${repo.description ?? "GitHub 인기 AI 레포"}`,
          summary: repo.description ?? "자세한 내용은 GitHub 레포를 확인하세요.",
          date: parseDate(repo.pushed_at),
          source: "GitHub Trending",
          sourceUrl: "https://github.com/trending",
          url: repo.html_url,
          category: classifyCategory(text),
          lang: "en",
          isNew: false,
          isGithub: true,
          stars: repo.stargazers_count,
          language: repo.language ?? "",
          tags: (repo.topics ?? []).slice(0, 5),
        });
      }
    }

    return results.length > 0 ? results : GITHUB_TRENDING_FALLBACK;
  } catch {
    return GITHUB_TRENDING_FALLBACK;
  }
}

// ── 메인 훅 ──────────────────────────────
const AUTO_REFRESH_MS = 30 * 60 * 1000; // 30분

export function useNewsRSS() {
  const [news, setNews] = useState<NewsItem[]>(CURATED_NEWS);
  const [github, setGithub] = useState<NewsItem[]>(GITHUB_TRENDING_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // 병렬로 모든 소스 가져오기
      const [hfItems, gnItems, atItems, ghItems] = await Promise.all([
        fetchRSSFeed(RSS_SOURCES[0]), // HF Blog
        fetchRSSFeed(RSS_SOURCES[1]), // GeekNews
        fetchRSSFeed(RSS_SOURCES[2]), // AI타임스
        fetchGithubTrending(),
      ]);

      // 뉴스 병합 (큐레이션 + RSS)
      const rssItems = [...hfItems, ...gnItems, ...atItems];
      const curatedUrls = new Set(CURATED_NEWS.map((n) => n.url));
      const freshRSS = rssItems.filter((n) => !curatedUrls.has(n.url));
      const merged = [...freshRSS, ...CURATED_NEWS];

      // 날짜 내림차순 정렬 (최신순)
      merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setNews(merged);
      if (ghItems.length > 0) setGithub(ghItems);
      setLastUpdated(new Date());
    } catch {
      // silently keep current state
    } finally {
      setLoading(false);
    }
  }, []);

  // 최초 로드 + 30분 자동 새로고침
  useEffect(() => {
    fetchAll();

    timerRef.current = setInterval(fetchAll, AUTO_REFRESH_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchAll]);

  return { news, github, loading, lastUpdated, refetch: fetchAll };
}