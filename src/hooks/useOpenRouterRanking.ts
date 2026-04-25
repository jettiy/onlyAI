// ── OpenRouter 실시간 랭킹 훅 ─────────────────────────────
// OpenRouter 랭킹 페이지(https://openrouter.ai/rankings)에서
// 1시간 주기로 최신 인기 모델 순위를 가져옵니다.
// 일반 사용자도 "아, 요새 이게 뜨네" 하고 알 수 있게.

import { useState, useEffect, useCallback, useRef } from 'react';

export interface LiveRankingEntry {
  rank: number;
  model: string;
  provider: string;
  tokens: string;       // "1.39T"
  tokensNum: number;    // 수치
  share: number;        // 점유율 %
  change: string;       // "+12%", "NEW", "-3%"
  category: 'flagship' | 'value' | 'free';
  color: string;        // 차트 색상
}

export interface ArenaRankingEntry {
  rank: number;
  modelId: string;
  name: string;
  company: string;
  score: number;
  votes: number;
  license: 'proprietary' | 'open';
}

// ── 캐싱 ──
const RANKING_CACHE_KEY = 'onlyai_live_rankings';
const RANKING_CACHE_DURATION = 30 * 60 * 1000; // 30분
const REFRESH_INTERVAL = 60 * 60 * 1000; // 1시간 자동 갱신

interface RankingCacheEntry {
  timestamp: number;
  weekly: LiveRankingEntry[];
  arena: ArenaRankingEntry[];
  updatedAt: string;
}

function getRankingCache(): Partial<RankingCacheEntry> | null {
  try {
    const raw = localStorage.getItem(RANKING_CACHE_KEY);
    if (!raw) return null;
    const entry: RankingCacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > RANKING_CACHE_DURATION) return null;
    return entry;
  } catch { return null; }
}

function saveRankingCache(data: Partial<RankingCacheEntry>) {
  try {
    const entry: RankingCacheEntry = {
      timestamp: Date.now(),
      weekly: data.weekly ?? [],
      arena: data.arena ?? [],
      updatedAt: data.updatedAt ?? new Date().toISOString(),
    };
    localStorage.setItem(RANKING_CACHE_KEY, JSON.stringify(entry));
  } catch { /* 무시 */ }
}

// ── 경량화된 색상 매핑 (provider별) ──
const PROVIDER_COLORS: Record<string, string> = {
  'Anthropic': 'from-amber-400 to-orange-500',
  'OpenAI': 'from-emerald-400 to-teal-500',
  'Google': 'from-blue-400 to-cyan-500',
  'DeepSeek': 'from-green-400 to-emerald-500',
  'Meta': 'from-sky-400 to-indigo-500',
  'Alibaba': 'from-red-400 to-orange-500',
  'MiniMax': 'from-purple-400 to-violet-500',
  'Zhipu AI': 'from-indigo-400 to-purple-500',
  'Moonshot': 'from-pink-400 to-rose-500',
  'Xiaomi': 'from-orange-400 to-red-500',
  'Mistral': 'from-cyan-400 to-blue-500',
  'Cohere': 'from-teal-400 to-green-500',
  'NVIDIA': 'from-emerald-400 to-green-500',
  'xAI': 'from-rose-400 to-pink-500',
  'default': 'from-gray-400 to-gray-500',
};

function getProviderColor(provider: string): string {
  return PROVIDER_COLORS[provider] ?? PROVIDER_COLORS['default'];
}

// ── 메인 훅 ──
export function useOpenRouterRanking() {
  const [weekly, setWeekly] = useState<LiveRankingEntry[]>([]);
  const [arena, setArena] = useState<ArenaRankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // 1차: 정적 JSON 데이터 (GitHub Actions로 갱신)
      const staticRes = await fetch('/data/rankings.json');
      if (staticRes.ok) {
        const data = await staticRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setWeekly(data);
          const metaRes = await fetch('/data/meta.json');
          if (metaRes.ok) {
            const meta = await metaRes.json();
            setUpdatedAt(meta.updatedAtKST || '');
          }
          saveRankingCache({ weekly: data, updatedAt: '' });
          return;
        }
      }

      // 2차: 캐시 확인
      const cached = getRankingCache();
      if (cached?.weekly?.length || cached?.arena?.length) {
        if (cached.weekly) setWeekly(cached.weekly);
        if (cached.arena) setArena(cached.arena);
        if (cached.updatedAt) setUpdatedAt(cached.updatedAt);
        return;
      }

      // 3차: OpenRouter 직접 호출 (fallback)
      const orRes = await fetch('https://openrouter.ai/api/v1/models');
      if (orRes.ok) {
        const data = await orRes.json();
        if (data?.data?.length > 0) {
          const sorted = [...data.data]
            .sort((a: any, b: any) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
            .reverse()
            .slice(0, 15);
          
          const liveToRanking = sorted.map((m: any, i: number) => {
            const provider = m.id?.split('/')[0] ?? 'Unknown';
            const providerPretty = provider.charAt(0).toUpperCase() + provider.slice(1);
            const context = m.contextLength ?? 128000;
            return {
              rank: i + 1,
              model: m.name ?? m.id,
              provider: providerPretty,
              tokens: `${m.createdAt ? 'LIVE' : '—'}`,
              tokensNum: 0,
              share: 0,
              change: i < 3 ? 'NEW' : '',
              category: (i < 5 ? 'flagship' : i < 12 ? 'value' : 'free') as 'flagship' | 'value' | 'free',
              color: getProviderColor(providerPretty),
            } as LiveRankingEntry;
          });
          
          setWeekly(liveToRanking);
          const now = new Date();
          setUpdatedAt(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`);
        }
      }
    } catch {
      setError(true);
      // 캐시라도 있으면 쓰기
      const stale = localStorage.getItem(RANKING_CACHE_KEY);
      if (stale) {
        try {
          const entry: RankingCacheEntry = JSON.parse(stale);
          if (entry.weekly?.length > 0) setWeekly(entry.weekly);
          if (entry.arena?.length > 0) setArena(entry.arena);
          if (entry.updatedAt) setUpdatedAt(entry.updatedAt);
        } catch { /* */ }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
    timerRef.current = setInterval(fetchRankings, RANKING_CACHE_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchRankings]);

  return { weekly, arena, loading, error, updatedAt, refetch: fetchRankings };
}
