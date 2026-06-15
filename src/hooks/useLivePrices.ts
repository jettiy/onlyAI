// ── OpenRouter 실시간 가격 훅 ─────────────────────────────
// models.ts의 정적 inputPrice/outputPrice를
// OpenRouter API 실시간 가격으로 덮어씁니다.
// API 실패/캐시 만료 시 정적 fallback 유지

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLiveModels, findLiveModel, type LiveModel } from '../lib/liveData';

export interface LivePrice {
  input: number | null;
  output: number | null;
  inputPrice: number | null;
  outputPrice: number | null;
  cacheReadPrice: number | null;
  cacheWritePrice: number | null;
}

export function useLivePrices() {
  const [liveModels, setLiveModels] = useState<LiveModel[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const data = await fetchLiveModels();
      if (data.length > 0) {
        setLiveModels(data);
      }
    } catch (err) {
      console.warn('[useLivePrices] fetch 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    // 10분마다 갱신 (liveData.ts 캐시와 동일 주기)
    timerRef.current = setInterval(fetchPrices, 10 * 60 * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchPrices]);

  /** 특정 openRouterSlug의 실시간 가격 조회 */
  const getLivePrice = useCallback((openRouterSlug?: string): LivePrice | null => {
    if (!openRouterSlug || liveModels.length === 0) return null;
    const live = findLiveModel(liveModels, openRouterSlug);
    if (!live) return null;
    return {
      input: live.pricing.prompt,
      output: live.pricing.completion,
      inputPrice: live.pricing.prompt,
      outputPrice: live.pricing.completion,
      cacheReadPrice: live.pricing.inputCacheRead ?? null,
      cacheWritePrice: live.pricing.inputCacheWrite ?? null,
    };
  }, [liveModels]);

  /** 정적 가격에 실시간 가격 병합 — 실시간 데이터 우선, 없으면 정적 fallback */
  const mergePrice = useCallback((
    staticInput: number | null | undefined,
    staticOutput: number | null | undefined,
    openRouterSlug?: string,
  ): { inputPrice: number | null; outputPrice: number | null } => {
    const live = getLivePrice(openRouterSlug);
    if (live) {
      return {
        inputPrice: live.inputPrice,
        outputPrice: live.outputPrice,
      };
    }
    return {
      inputPrice: staticInput ?? null,
      outputPrice: staticOutput ?? null,
    };
  }, [getLivePrice]);

  return { liveModels, loading, getLivePrice, mergePrice, refetch: fetchPrices };
}
