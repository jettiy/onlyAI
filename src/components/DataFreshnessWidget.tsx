// ── 데이터 신선도 대시보드 위젯 ─────────────────────────
// 각 데이터 소스의 마지막 갱신 시간과 신선도 상태를 표시합니다.
// 초록=최신(30분 이내), 노랑=갱신 필요(30분~6시간), 빨강=만료(6시간+)

import { useState, useEffect, useCallback } from 'react';
import { getAACacheStatus } from '../lib/artificialAnalysis';
import { Activity, DollarSign, Trophy, BarChart3, Database } from 'lucide-react';

/* ── 상수 ── */
const PRICE_CACHE_KEY = 'onlyai_live_models';
const ARENA_CACHE_KEY = 'onlyai_arena_ranking';
const MODEL_DB_DATE = '2026-06-15';

type FreshnessLevel = 'fresh' | 'stale' | 'expired';

interface FreshnessInfo {
  name: string;
  level: FreshnessLevel;
  timeAgo: string;
}

/* ── 유틸 ── */

function getCacheTimestamp(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    return entry.timestamp ?? null;
  } catch {
    return null;
  }
}

function computeFreshnessLevel(minutesAgo: number): FreshnessLevel {
  if (minutesAgo < 30) return 'fresh';
  if (minutesAgo < 360) return 'stale'; // 6시간
  return 'expired';
}

function formatTimeAgo(timestamp: number | null): string {
  if (!timestamp) return '미확인';
  const diff = Math.floor((Date.now() - timestamp) / 60000);
  if (diff < 1) return '방금 전';
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}

/* ── 커스텀 훅 ── */

function useDataFreshness(): FreshnessInfo[] {
  const [, setTick] = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    // 1분마다 갱신
    const timer = setInterval(refresh, 60_000);
    return () => clearInterval(timer);
  }, [refresh]);

  // 가격 데이터: localStorage 캐시 타임스탬프
  const priceTs = getCacheTimestamp(PRICE_CACHE_KEY);
  const priceMinutes = priceTs ? (Date.now() - priceTs) / 60000 : Infinity;

  // Arena 랭킹: localStorage 캐시 타임스탬프
  const arenaTs = getCacheTimestamp(ARENA_CACHE_KEY);
  const arenaMinutes = arenaTs ? (Date.now() - arenaTs) / 60000 : Infinity;

  // 벤치마크: artificialAnalysis.ts 모듈 캐시
  const aaStatus = getAACacheStatus();
  const aaMinutes = aaStatus.fetchedAt ? (Date.now() - aaStatus.fetchedAt) / 60000 : Infinity;

  // 모델 DB: 정적 날짜 (1일 이내=fresh, 7일 이내=stale, 그 이상=expired)
  const modelDbTs = new Date(MODEL_DB_DATE).getTime();
  const modelDbMinutes = (Date.now() - modelDbTs) / 60000;

  return [
    {
      name: '가격',
      level: computeFreshnessLevel(priceMinutes),
      timeAgo: priceTs ? formatTimeAgo(priceTs) : '미확인',
    },
    {
      name: 'Arena 랭킹',
      level: computeFreshnessLevel(arenaMinutes),
      timeAgo: arenaTs ? formatTimeAgo(arenaTs) : '미확인',
    },
    {
      name: '벤치마크',
      level: computeFreshnessLevel(aaMinutes),
      timeAgo: aaStatus.fetchedAt ? formatTimeAgo(aaStatus.fetchedAt) : '미확인',
    },
    {
      name: '모델 DB',
      level:
        modelDbMinutes < 1440
          ? 'fresh'
          : modelDbMinutes < 1440 * 7
            ? 'stale'
            : 'expired',
      timeAgo: MODEL_DB_DATE,
    },
  ];
}

/* ── 스타일 상수 ── */

const DOT_CLASSES: Record<FreshnessLevel, string> = {
  fresh: 'bg-emerald-400 shadow-emerald-400/50',
  stale: 'bg-amber-400 shadow-amber-400/50',
  expired: 'bg-red-400 shadow-red-400/50',
};

const ITEM_ICONS = [
  DollarSign,
  Trophy,
  BarChart3,
  Database,
] as const;

/* ── 컴포넌트 ── */

export default function DataFreshnessWidget() {
  const items = useDataFreshness();

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-md bg-[#5B5FEF]/10 flex items-center justify-center text-[#5B5FEF]">
          <Activity className="w-3 h-3" />
        </span>
        <h3 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 tracking-wide">
          데이터 신선도
        </h3>
      </div>

      {/* 데이터 소스 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {items.map((item, i) => {
          const IconComp = ITEM_ICONS[i];
          return (
            <div
              key={item.name}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              {/* 컬러 도트 */}
              <span
                className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${DOT_CLASSES[item.level]} ${
                  item.level === 'fresh' ? 'animate-pulse' : ''
                }`}
              />
              {/* 아이콘 */}
              <IconComp className="w-3 h-3 shrink-0 text-gray-400 dark:text-gray-500" />
              {/* 텍스트 */}
              <div className="min-w-0">
                <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight truncate">
                  {item.name}
                </div>
                <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 leading-tight tabular-nums">
                  {item.timeAgo}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
