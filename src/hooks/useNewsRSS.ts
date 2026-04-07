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
  "투자·기업":      "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
  "로봇·자율주행": "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
};

// ── Main hook: fetches from /api/news (Vercel Edge Function) ──
const AUTO_REFRESH_MS = 30 * 60 * 1000; // 30 min

export function useNewsRSS() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [github, setGithub] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      if (data?.error) throw new Error(data.error);

      if (data?.news?.length > 0) {
        setNews(data.news);
      }

      if (data?.github?.length > 0) {
        setGithub(data.github);
      }

      if (data?.updatedAtKST) {
        setLastUpdated(new Date(data.updatedAtKST));
      }
    } catch {
      setError(true);
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

  return { news, github, loading, error, lastUpdated, refetch: fetchAll };
}
