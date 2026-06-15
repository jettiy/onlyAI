// ── LM Arena Expert 실시간 랭킹 훅 ─────────────────────────
// chat.lmsys.org Arena Expert 랭킹을 자동 가져옵니다.
// 캐시 6시간, 실패 시 rankings.ts 정적 데이터 fallback
// useOpenRouterRanking.ts와 동일 패턴

import { useState, useEffect, useCallback, useRef } from 'react';
import { ARENA_EXPERT_TOP20, type ArenaExpertEntry } from '../data/rankings';

// ── 캐싱 ──
const ARENA_CACHE_KEY = 'onlyai_arena_ranking';
const ARENA_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6시간
const ARENA_REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6시간 자동 갱신

interface ArenaCacheEntry {
  timestamp: number;
  data: ArenaExpertEntry[];
  updatedAt: string;
}

function getArenaCache(): ArenaCacheEntry | null {
  try {
    const raw = localStorage.getItem(ARENA_CACHE_KEY);
    if (!raw) return null;
    const entry: ArenaCacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > ARENA_CACHE_DURATION) return null;
    return entry;
  } catch { return null; }
}

function saveArenaCache(data: ArenaExpertEntry[], updatedAt: string) {
  try {
    const entry: ArenaCacheEntry = { timestamp: Date.now(), data, updatedAt };
    localStorage.setItem(ARENA_CACHE_KEY, JSON.stringify(entry));
  } catch { /* 용량 초과 무시 */ }
}

// ── 모델명 → 회사/라이선스 매핑 ──
const MODEL_META: Record<string, { company: string; license: 'proprietary' | 'open'; onlyaiName?: string }> = {
  'claude-fable-5': { company: 'Anthropic', license: 'proprietary', onlyaiName: 'Claude Fable 5' },
  'claude-opus-4-8': { company: 'Anthropic', license: 'proprietary', onlyaiName: 'Claude Opus 4.8' },
  'claude-opus-4-7': { company: 'Anthropic', license: 'proprietary', onlyaiName: 'Claude Opus 4.7' },
  'claude-opus-4-6': { company: 'Anthropic', license: 'proprietary', onlyaiName: 'Claude Opus 4.6' },
  'claude-sonnet-4-6': { company: 'Anthropic', license: 'proprietary', onlyaiName: 'Claude Sonnet 4.6' },
  'claude-haiku-4-5': { company: 'Anthropic', license: 'proprietary', onlyaiName: 'Claude Haiku 4.5' },
  'claude-mythos-5': { company: 'Anthropic', license: 'proprietary', onlyaiName: 'Claude Mythos 5' },
  'gpt-5-5-pro': { company: 'OpenAI', license: 'proprietary', onlyaiName: 'GPT-5.5 Pro' },
  'gpt-5-5': { company: 'OpenAI', license: 'proprietary' },
  'gpt-5-4': { company: 'OpenAI', license: 'proprietary', onlyaiName: 'GPT-5.4' },
  'gpt-5-4-mini': { company: 'OpenAI', license: 'proprietary' },
  'gpt-5-4-nano': { company: 'OpenAI', license: 'proprietary' },
  'gpt-4-1': { company: 'OpenAI', license: 'proprietary' },
  'gemini-3-5-pro': { company: 'Google', license: 'proprietary', onlyaiName: 'Gemini 3.5 Pro' },
  'gemini-3-1-pro-preview': { company: 'Google', license: 'proprietary' },
  'gemini-3-5-flash': { company: 'Google', license: 'proprietary', onlyaiName: 'Gemini 3.5 Flash' },
  'gemini-2-5-flash': { company: 'Google', license: 'proprietary' },
  'qwen-3-7-max': { company: 'Alibaba', license: 'proprietary', onlyaiName: 'Qwen 3.7 Max' },
  'qwen3-235b': { company: 'Alibaba', license: 'open' },
  'deepseek-v4-pro': { company: 'DeepSeek', license: 'open', onlyaiName: 'DeepSeek V4 Pro' },
  'deepseek-v3': { company: 'DeepSeek', license: 'open' },
  'deepseek-r1': { company: 'DeepSeek', license: 'open' },
  'kimi-k2-6': { company: 'Moonshot', license: 'open', onlyaiName: 'Kimi K2.6' },
  'mimo-v2-5-pro': { company: 'Xiaomi', license: 'open', onlyaiName: 'MiMo-V2.5-Pro' },
  'mimo-v2-pro': { company: 'Xiaomi', license: 'open' },
  'glm-5.1': { company: 'Zhipu AI', license: 'proprietary', onlyaiName: 'GLM-5.1' },
  'glm-5': { company: 'Zhipu AI', license: 'proprietary' },
  'nvidia-nemotron-3-ultra': { company: 'NVIDIA', license: 'proprietary', onlyaiName: 'NVIDIA Nemotron 3 Ultra' },
  'grok-4-3': { company: 'xAI', license: 'proprietary', onlyaiName: 'Grok 4.3' },
  'grok-4-20': { company: 'xAI', license: 'proprietary' },
  'grok-4-heavy': { company: 'xAI', license: 'proprietary' },
  'grok-3': { company: 'xAI', license: 'proprietary' },
  'llama-4-maverick': { company: 'Meta', license: 'open' },
  'mistral-large-3': { company: 'Mistral', license: 'open' },
};

/** Arena API 응답에서 모델명 정규화 */
function normalizeModelId(raw: string): string {
  return raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Arena API 응답 → ArenaExpertEntry 변환 */
function parseArenaResponse(json: any): ArenaExpertEntry[] {
  // 응답 형식이 다양할 수 있으므로 유연하게 처리
  let entries: any[] = [];

  // 형식 1: { leaderboard: [...] }
  if (Array.isArray(json?.leaderboard)) {
    entries = json.leaderboard;
  }
  // 형식 2: { model_evaluations: { ... } } (오브젝트 형태)
  else if (json?.model_evaluations && typeof json.model_evaluations === 'object') {
    entries = Object.entries(json.model_evaluations).map(([key, val]: [string, any]) => ({
      model_id: key,
      ...(typeof val === 'object' ? val : { score: val }),
    }));
  }
  // 형식 3: 직접 배열
  else if (Array.isArray(json)) {
    entries = json;
  }

  if (entries.length === 0) return [];

  // 점수 기준 정렬 후 변환
  const sorted = [...entries]
    .filter((e: any) => e.score != null)
    .sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 20);

  return sorted.map((e: any, i: number): ArenaExpertEntry => {
    const rawId = e.model_id ?? e.modelId ?? e.id ?? '';
    const normalized = normalizeModelId(rawId);
    const meta = MODEL_META[normalized] ?? MODEL_META[rawId.toLowerCase()] ?? null;

    // 투표수 추출 (다양한 필드명 대응)
    const votes = e.votes ?? e.num_votes ?? e.vote_count ?? 0;

    // 신뢰구간 추출
    const ci95 = e.ci95 ?? e.CI ?? null;
    const ciStr = ci95 != null
      ? (typeof ci95 === 'number' ? `±${Math.round(ci95)}` : String(ci95))
      : '';

    return {
      rank: i + 1,
      modelId: rawId,
      name: meta?.onlyaiName ?? e.model_name ?? e.name ?? rawId,
      company: meta?.company ?? e.organization ?? e.org ?? e.company ?? 'Unknown',
      score: Math.round(typeof e.score === 'number' ? e.score : 0),
      ci: ciStr,
      votes: typeof votes === 'number' ? votes : 0,
      rankSpread: e.rank_spread ?? '', // API에서 제공 안 될 수 있음
      license: meta?.license ?? (e.license === 'open' ? 'open' : 'proprietary'),
    };
  });
}

// ── API 엔드포인트 ──
const ARENA_API_ENDPOINTS = [
  'https://arena.lmsys.org/api/v1/leaderboard',
  'https://chat.lmsys.org/api/v1/leaderboard',
];

// ── 메인 훅 ──
export function useArenaRanking() {
  const [ranking, setRanking] = useState<ArenaExpertEntry[]>(ARENA_EXPERT_TOP20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [isLive, setIsLive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchArenaRanking = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      // 1차: localStorage 캐시 확인
      const cached = getArenaCache();
      if (cached?.data?.length > 0) {
        setRanking(cached.data);
        setUpdatedAt(cached.updatedAt);
        setIsLive(true);
        setLoading(false);
        return;
      }

      // 2차: API 호출 (여러 엔드포인트 시도)
      let data: ArenaExpertEntry[] | null = null;
      for (const endpoint of ARENA_API_ENDPOINTS) {
        try {
          const res = await fetch(endpoint, {
            signal: AbortSignal.timeout(15000), // 15초 타임아웃
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'onlyAI.co.kr/1.0',
            },
          });
          if (res.ok) {
            const json = await res.json();
            const parsed = parseArenaResponse(json);
            if (parsed.length > 0) {
              data = parsed;
              break;
            }
          }
        } catch (endpointErr) {
          console.warn(`[useArenaRanking] ${endpoint} 실패:`, endpointErr);
        }
      }

      if (data && data.length > 0) {
        setRanking(data);
        setIsLive(true);
        const now = new Date();
        const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        setUpdatedAt(formatted);
        saveArenaCache(data, formatted);
      } else {
        // API에서 데이터를 못 가져오면 정적 fallback
        setRanking(ARENA_EXPERT_TOP20);
        setIsLive(false);
      }
    } catch (err) {
      console.warn('[useArenaRanking] 전체 fetch 실패:', err);
      setError(true);
      // stale 캐시라도 있으면 사용
      const stale = localStorage.getItem(ARENA_CACHE_KEY);
      if (stale) {
        try {
          const entry: ArenaCacheEntry = JSON.parse(stale);
          if (entry.data?.length > 0) {
            setRanking(entry.data);
            setUpdatedAt(entry.updatedAt);
            setIsLive(true);
          }
        } catch { /* 무시 */ }
      } else {
        setRanking(ARENA_EXPERT_TOP20);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArenaRanking();
    timerRef.current = setInterval(fetchArenaRanking, ARENA_REFRESH_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchArenaRanking]);

  return { ranking, loading, error, updatedAt, isLive, refetch: fetchArenaRanking };
}
