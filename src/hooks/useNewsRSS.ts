import { useState, useEffect, useCallback, useRef } from "react";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  sourceUrl?: string;
  url: string;
  category: string;
  lang: "ko" | "en";
  isNew?: boolean;
  tags?: string[];
  stars?: number;
  starsGained?: number;
  language?: string;
  isGithub?: boolean;
  sourceLang?: string;
  sourceFlag?: string;
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

export const categoryColor: Record<string, string> = {
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

// Fallback curated news (used when API fails)
export const CURATED_NEWS: NewsItem[] = [
  {
    id: "xiaomi-hunter-alpha-reveal",
    title: "샤오미, OpenRouter 1위 미스터리 모델 'Hunter Alpha' 정체 공개 — MiMo-V2-Pro였다",
    summary: "수일간 OpenRouter 일일 API 호출량 1위를 차지한 익명 모델 'Hunter Alpha'의 정체가 샤오미의 MiMo-V2-Pro로 확인됐다.",
    date: "2026-03-19", source: "AI타임스",
    url: "https://efficienist.com/what-is-hunter-alpha-openrouter-model-could-actually-be-xiaomi-mimo-v2-pro/",
    category: "모델 출시", lang: "ko", isNew: true,
  },
  {
    id: "xiaomi-mimo-v2-omni",
    title: "샤오미 MiMo-V2-Omni 출시 — 오디오 이해서 Gemini 3 Pro 능가",
    summary: "텍스트·비전·음성 풀 멀티모달. 10시간 이상 장시간 오디오 분석 가능.",
    date: "2026-03-19", source: "AI타임스",
    url: "https://eu.36kr.com/en/p/3729001380806017",
    category: "멀티모달", lang: "ko", isNew: true,
  },
  {
    id: "gn-llm-arch-gallery",
    title: "LLM 아키텍처 갤러리: GPT-2부터 DeepSeek V3·Qwen3까지 한눈에",
    summary: "Sebastian Raschka가 공개한 LLM 아키텍처 갤러리. 주요 모델 구조 도식·파라미터·어텐션 사양 비교.",
    date: "2026-03-19", source: "GeekNews",
    url: "https://sebastianraschka.com/llm-architecture-gallery/",
    category: "연구·논문", lang: "ko", isNew: true,
  },
  {
    id: "gn-unsloth-studio",
    title: "Unsloth Studio: 로컬 AI 모델 학습·실행 노코드 웹 UI",
    summary: "텍스트·오디오·임베딩·비전 모델을 하나의 인터페이스에서 로컬 학습·실행.",
    date: "2026-03-19", source: "GeekNews",
    url: "https://unsloth.ai/docs/new/studio",
    category: "개발 도구", lang: "ko", isNew: true,
  },
  {
    id: "gn-open-swe",
    title: "Open SWE: Stripe·Ramp·Coinbase 사내 코딩 에이전트 오픈소스화",
    summary: "대형 엔지니어링 조직들의 사내 코딩 에이전트 공통 패턴을 오픈소스 프레임워크로.",
    date: "2026-03-19", source: "GeekNews",
    url: "https://news.hada.io/topic?id=19000",
    category: "에이전트", lang: "ko", isNew: true,
  },
];

export const GITHUB_TRENDING_FALLBACK: NewsItem[] = [
  {
    id: "gh-karpathy-autoresearch",
    title: "karpathy/autoresearch — AI 에이전트가 밤새 LLM 훈련 실험 자동화",
    summary: "AI 에이전트에 GPU 하나와 학습 코드를 주면, 밤새 스스로 실험·수정·반복. 5분 단위 100회/야간.",
    date: "2026-03-15", source: "GitHub Trending",
    url: "https://github.com/karpathy/autoresearch",
    category: "오픈소스", lang: "en", isGithub: true, stars: 42900, language: "Python",
  },
  {
    id: "gh-open-webui",
    title: "open-webui/open-webui — 오프라인 완전 자립 AI 채팅 플랫폼 ⭐124k+",
    summary: "Ollama·OpenAI API 연결 가능한 ChatGPT 스타일 셀프호스트 UI. RAG 내장.",
    date: "2026-03-14", source: "GitHub Trending",
    url: "https://github.com/open-webui/open-webui",
    category: "개발 도구", lang: "en", isGithub: true, stars: 124000, language: "Svelte",
  },
  {
    id: "gh-dify",
    title: "langgenius/dify — 에이전트 워크플로 노코드 올인원 플랫폼",
    summary: "에이전트·RAG 파이프라인·멀티모델 지원을 드래그앤드롭 인터페이스로.",
    date: "2026-03-13", source: "GitHub Trending",
    url: "https://github.com/langgenius/dify",
    category: "에이전트", lang: "en", isGithub: true, stars: 89000, language: "TypeScript",
  },
];

// ── Main hook: fetches from /api/news (Vercel Edge Function) ──
const AUTO_REFRESH_MS = 30 * 60 * 1000; // 30 min

export function useNewsRSS() {
  const [news, setNews] = useState<NewsItem[]>(CURATED_NEWS);
  const [github, setGithub] = useState<NewsItem[]>(GITHUB_TRENDING_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      if (data?.news?.length > 0) {
        // Merge API news with curated (API first, then curated as fallback fill)
        const apiUrls = new Set(data.news.map((n: any) => n.url));
        const curatedOnly = CURATED_NEWS.filter((n) => !apiUrls.has(n.url));
        const merged = [...data.news, ...curatedOnly];
        merged.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNews(merged);
      }

      if (data?.github?.length > 0) {
        setGithub(data.github);
      }

      if (data?.updatedAtKST) {
        setLastUpdated(new Date(data.updatedAtKST));
      }
    } catch {
      // Keep current state (fallback data)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    timerRef.current = setInterval(fetchAll, AUTO_REFRESH_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchAll]);

  return { news, github, loading, lastUpdated, refetch: fetchAll };
}
