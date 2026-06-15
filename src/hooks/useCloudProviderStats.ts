// ── 클라우드 제공자 실시간 모델 수 훅 ─────────────────────
// OpenRouter 실시간 모델 목록을 가져와
// 각 제공자의 modelFilter로 매칭되는 모델 수를 카운트합니다.

import { useMemo } from 'react';
import { cloudProviders } from '../data/cloudProviders';
import { useLivePrices } from './useLivePrices';

export function useCloudProviderStats(): {
  /** 제공자 ID → 매칭된 OpenRouter 모델 수 */
  modelCounts: Record<string, number>;
  /** 총 OpenRouter 모델 수 */
  totalModels: number;
  /** 로딩 중 여부 */
  loading: boolean;
} {
  const { liveModels, loading } = useLivePrices();

  const { modelCounts, totalModels } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const provider of cloudProviders) {
      const filter = provider.modelFilter;
      if (!filter || filter.length === 0) {
        counts[provider.id] = 0;
        continue;
      }
      const matched = liveModels.filter((m) =>
        filter.some((keyword) => m.id.toLowerCase().includes(keyword.toLowerCase()))
      );
      counts[provider.id] = matched.length;
    }
    return { modelCounts: counts, totalModels: liveModels.length };
  }, [liveModels]);

  return { modelCounts, totalModels, loading };
}
