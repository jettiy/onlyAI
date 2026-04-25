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
  titleKo?: string;
  summaryKo?: string;
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
  "연구·논문":      "bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800",
  "에이전트":       "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800",
  "오픈소스":       "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  "파인튜닝":       "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
  "벤치마크":       "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
  "인프라·하드웨어": "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  "산업·정책":      "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
  "개발 도구":      "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800",
  "멀티모달":       "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800",
  "투자·기업":      "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
  "로봇·자율주행": "bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800",
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
      // 1차: 정적 JSON 데이터 (GitHub Actions로 갱신)
      const staticRes = await fetch('/data/rss-merged.json');
      if (staticRes.ok) {
        const data = await staticRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: NewsItem[] = data.map((item: any, i: number) => ({
            id: `rss-${i}`,
            title: item.title || '(제목 없음)',
            summary: item.summary || '',
            date: item.date || '',
            source: item.source || '',
            url: item.url || '',
            category: '오픈소스',
            lang: 'en',
          }));
          setNews(mapped);
          setGithub([]);
          return;
        }
      }

      // 2차: 기존 정적 데이터 파일
      const newsRes = await fetch('/data/news.json');
      if (newsRes.ok) {
        const data = await newsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setNews(data);
          return;
        }
      }
      
      // 3차: Vercel API 라우트 (기존)
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('API error');
      const apidata = await res.json();

      if (apidata?.error) throw new Error(apidata.error);

      if (apidata?.news?.length > 0) {
        setNews(apidata.news);
      }

      if (apidata?.github?.length > 0) {
        setGithub(apidata.github);
      }

      if (apidata?.updatedAtKST) {
        const d = new Date(apidata.updatedAtKST);
        if (!isNaN(d.getTime())) setLastUpdated(d);
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
