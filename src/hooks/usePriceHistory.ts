// ── 가격 이력 수집 훅 ─────────────────────────────────
// 매일 가격 스냅샷을 localStorage에 저장하고 차트 데이터로 반환

import { useState, useEffect, useCallback } from 'react';
import { useLivePrices } from './useLivePrices';
import { models } from '../data/models';

interface PriceSnapshot {
  date: string;       // "2026-06-15"
  inputPrice: number;
  outputPrice: number;
}

interface PriceHistoryData {
  dates: string[];
  inputPrices: number[];
  outputPrices: number[];
}

const STORAGE_PREFIX = 'price_history_';
const MAX_DAYS = 90;

function getStorageKey(modelId: string): string {
  return `${STORAGE_PREFIX}${modelId}`;
}

function getTodayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function loadSnapshots(modelId: string): PriceSnapshot[] {
  try {
    const raw = localStorage.getItem(getStorageKey(modelId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveSnapshots(modelId: string, snapshots: PriceSnapshot[]): void {
  try {
    localStorage.setItem(getStorageKey(modelId), JSON.stringify(snapshots));
  } catch {
    // localStorage full — ignore
  }
}

function pruneOldSnapshots(snapshots: PriceSnapshot[]): PriceSnapshot[] {
  if (snapshots.length <= MAX_DAYS) return snapshots;
  return snapshots.slice(snapshots.length - MAX_DAYS);
}

// 인기 모델 10개 (openRouterSlug이 있는 것)
export const POPULAR_MODEL_IDS = [
  'gpt-5-5',
  'gpt-5-4',
  'claude-fable-5',
  'claude-opus-4-8',
  'claude-opus-4-7',
  'gemini-2-5-pro',
  'gemini-2-5-flash',
  'glm-5.1',
  'deepseek-v3-2',
  'qwen-3-235b',
];

export function usePriceHistory(selectedModelId?: string) {
  const modelId = selectedModelId ?? POPULAR_MODEL_IDS[0];
  const { getLivePrice, loading: liveLoading } = useLivePrices();

  const [snapshots, setSnapshots] = useState<PriceSnapshot[]>(() => {
    return loadSnapshots(modelId);
  });

  // 선택 모델 변경 시 스냅샷 다시 로드
  useEffect(() => {
    setSnapshots(loadSnapshots(modelId));
  }, [modelId]);

  // 실시간 가격이 로드되면 오늘 스냅샷 저장
  const saveTodaySnapshot = useCallback(() => {
    if (liveLoading) return;

    const modelData = models.find(m => m.id === modelId);
    if (!modelData) return;

    let inputPrice: number | null = null;
    let outputPrice: number | null = null;

    // 실시간 가격 우선
    if (modelData.openRouterSlug) {
      const live = getLivePrice(modelData.openRouterSlug);
      if (live) {
        inputPrice = live.inputPrice;
        outputPrice = live.outputPrice;
      }
    }

    // fallback: 정적 가격
    if (inputPrice == null) inputPrice = modelData.inputPrice;
    if (outputPrice == null) outputPrice = modelData.outputPrice;

    if (inputPrice == null || outputPrice == null) return;

    const today = getTodayStr();

    setSnapshots(prev => {
      // 오늘 이미 저장됐으면 무시
      if (prev.length > 0 && prev[prev.length - 1].date === today) {
        return prev;
      }

      const next = [...prev, { date: today, inputPrice, outputPrice }];
      const pruned = pruneOldSnapshots(next);
      saveSnapshots(modelId, pruned);
      return pruned;
    });
  }, [modelId, getLivePrice, liveLoading]);

  useEffect(() => {
    saveTodaySnapshot();
  }, [saveTodaySnapshot]);

  // 차트 데이터로 변환
  const chartData: PriceHistoryData = {
    dates: snapshots.map(s => s.date),
    inputPrices: snapshots.map(s => s.inputPrice),
    outputPrices: snapshots.map(s => s.outputPrice),
  };

  return {
    snapshots,
    chartData,
    popularModelIds: POPULAR_MODEL_IDS,
  };
}
