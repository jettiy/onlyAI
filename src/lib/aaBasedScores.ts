// ── AA 벤치마크 기반 추천 점수 유틸 ─────────────────────────
// Artificial Analysis API 데이터를 modelStrengths.ts 수동 점수 대신
// 자동으로 계산합니다.
// 매핑: coding → AA Coding Index, writing → AA Intelligence Index,
//       summary → MMLU-Pro
// AA에 데이터 없는 모델은 수동 점수 fallback

import { fetchAAModels, getAAData, type AAModel } from './artificialAnalysis';
import { type UseCase, type ModelStrength } from '../data/modelStrengths';

/** AA 벤치마크 → 1~10 점수 변환 결과 */
export interface AABasedScores {
  coding: number | null;      // AA Coding Index 기반
  writing: number | null;     // AA Intelligence Index 기반
  summary: number | null;     // MMLU-Pro 기반
  image: number | null;       // AA 데이터 없음 → null (수동 fallback)
  video: number | null;       // AA 데이터 없음 → null (수동 fallback)
  chat: number | null;        // Intelligence Index 기반 (writing과 유사)
}

// ── AA 지표 → 1~10 점수 변환 함수 ──

/**
 * AA Coding Index (0~100) → 1~10 점수
 * 기준: 95+ → 10, 85+ → 9, 70+ → 8, 55+ → 7, 40+ → 6, 25+ → 5
 */
function codingIndexToScore(codingIndex: number): number {
  if (codingIndex >= 95) return 10;
  if (codingIndex >= 85) return 9;
  if (codingIndex >= 75) return 8;
  if (codingIndex >= 60) return 7;
  if (codingIndex >= 45) return 6;
  if (codingIndex >= 30) return 5;
  if (codingIndex >= 20) return 4;
  if (codingIndex >= 10) return 3;
  if (codingIndex >= 5) return 2;
  return 1;
}

/**
 * AA Intelligence Index (0~100) → 1~10 점수
 * 기준: 60+ → 10, 55+ → 9, 50+ → 8, 45+ → 7, 38+ → 6, 30+ → 5
 */
function intelligenceIndexToScore(intelligenceIndex: number): number {
  if (intelligenceIndex >= 60) return 10;
  if (intelligenceIndex >= 55) return 9;
  if (intelligenceIndex >= 50) return 8;
  if (intelligenceIndex >= 45) return 7;
  if (intelligenceIndex >= 38) return 6;
  if (intelligenceIndex >= 30) return 5;
  if (intelligenceIndex >= 22) return 4;
  if (intelligenceIndex >= 15) return 3;
  if (intelligenceIndex >= 8) return 2;
  return 1;
}

/**
 * MMLU-Pro (0~100%) → 1~10 점수
 * 기준: 90+ → 10, 80+ → 9, 70+ → 8, 60+ → 7, 50+ → 6, 40+ → 5
 */
function mmluProToScore(mmluPro: number): number {
  if (mmluPro >= 90) return 10;
  if (mmluPro >= 80) return 9;
  if (mmluPro >= 70) return 8;
  if (mmluPro >= 60) return 7;
  if (mmluPro >= 50) return 6;
  if (mmluPro >= 40) return 5;
  if (mmluPro >= 30) return 4;
  if (mmluPro >= 20) return 3;
  if (mmluPro >= 10) return 2;
  return 1;
}

/** AA 모델 데이터에서 추천 점수 계산 */
export function calculateAABasedScores(aaModel: AAModel): AABasedScores {
  const evals = aaModel.evaluations;

  // coding: AA Coding Index 기반
  const coding = evals.artificial_analysis_coding_index != null
    ? codingIndexToScore(evals.artificial_analysis_coding_index)
    : null;

  // writing: AA Intelligence Index 기반
  const writing = evals.artificial_analysis_intelligence_index != null
    ? intelligenceIndexToScore(evals.artificial_analysis_intelligence_index)
    : null;

  // summary: MMLU-Pro 기반 (AA에서는 0~1 비율로 반환됨)
  const summary = evals.mmlu_pro != null
    ? mmluProToScore(evals.mmlu_pro * 100)
    : null;

  // chat: Intelligence Index 기반 (writing과 동일하지만 약간 가중치 조정)
  const chat = evals.artificial_analysis_intelligence_index != null
    ? Math.max(1, intelligenceIndexToScore(evals.artificial_analysis_intelligence_index) - 1)
    : null;

  // image/video: AA에서 해당 벤치마크 없음 → 수동 fallback
  return { coding, writing, summary, image: null, video: null, chat };
}

/**
 * 모델명으로 AA 기반 점수 조회 (캐시 활용)
 * @returns AA 점수 (null인 항목은 수동 점수 사용 필요)
 */
export async function getAABasedScores(modelName: string): Promise<AABasedScores> {
  const aaModel = await getAAData(modelName);
  if (!aaModel) {
    return { coding: null, writing: null, summary: null, image: null, video: null, chat: null };
  }
  return calculateAABasedScores(aaModel);
}

/**
 * AA 점수와 수동 점수 병합
 * AA에 데이터 있으면 AA 점수 우선, 없으면 수동 점수 사용
 */
export function mergeScores(
  manualScores: Record<UseCase, number>,
  aaScores: AABasedScores,
): Record<UseCase, number> {
  return {
    writing: aaScores.writing ?? manualScores.writing,
    coding: aaScores.coding ?? manualScores.coding,
    image: aaScores.image ?? manualScores.image,
    video: aaScores.video ?? manualScores.video,
    summary: aaScores.summary ?? manualScores.summary,
    chat: aaScores.chat ?? manualScores.chat,
  };
}

/**
 * 전체 모델에 대해 AA 점수 일괄 계산 (추천 엔진용)
 * 이미 캐시된 AA 데이터를 활용하므로 추가 API 호출 없음
 */
export async function computeAllAABasedScores(
  allStrengths: ModelStrength[],
): Promise<Map<string, AABasedScores>> {
  // AA 데이터 1회 fetch (캐시 활용)
  const aaModels = await fetchAAModels();
  const scoreMap = new Map<string, AABasedScores>();

  for (const model of allStrengths) {
    // 이미 계산된 것은 스킵
    if (scoreMap.has(model.id)) continue;

    // AA slug 매핑 시도
    const slugs = getSlugsForModel(model.name);
    let matchedAA: AAModel | null = null;

    for (const slug of slugs) {
      const found = aaModels.find(m => m.slug === slug);
      if (found) { matchedAA = found; break; }
    }

    if (matchedAA) {
      scoreMap.set(model.id, calculateAABasedScores(matchedAA));
    } else {
      scoreMap.set(model.id, { coding: null, writing: null, summary: null, image: null, video: null, chat: null });
    }
  }

  return scoreMap;
}

/** onlyAI 모델명 → AA slug 매핑 (artificialAnalysis.ts와 동일 패턴) */
const EXTRA_SLUG_MAP: Record<string, string[]> = {
  'gpt-5.5 pro': ['gpt-5-5'],
  'gpt-5.5 instant': ['gpt-5-5-instant'],
  'gpt-5.4 mini': ['gpt-5-4-mini'],
  'claude opus 4.8': ['claude-opus-4-8'],
  'claude opus 4.7': ['claude-opus-4-7'],
  'claude opus 4.6': ['claude-opus-4-6'],
  'claude sonnet 4.6': ['claude-sonnet-4-6'],
  'claude haiku 4.5': ['claude-haiku-4-5'],
  'claude fable 5': ['claude-fable-5'],
  'claude mythos 5': ['claude-mythos-5'],
  'gemini 3.5 flash': ['gemini-3-5-flash'],
  'gemini 3.5 pro': ['gemini-3-5-pro'],
  'gemini 3.1 pro': ['gemini-3-1-pro'],
  'gemini 2.5 flash': ['gemini-2-5-flash'],
  'gemini 2.5 pro': ['gemini-2-5-pro'],
  'grok 4.3': ['grok-4-3'],
  'grok 4.20 beta': ['grok-4-20', 'grok-4'],
  'grok 4 heavy': ['grok-4-heavy'],
  'grok build 0.1': ['grok-build'],
  'glm-5.2': ['glm-5-2'],
  'glm-5.1': ['glm-5-1', 'glm-5.1'],
  'glm-5': ['glm-5'],
  'glm-5 turbo': ['glm-5-turbo'],
  'qwen 3.7 max': ['qwen-3-7-max'],
  'qwen 3.7 plus': ['qwen-3-7-plus'],
  'qwen 3 235b': ['qwen-3-235b'],
  'qwen 3.6 plus': ['qwen-3-6-plus'],
  'deepseek v4 pro': ['deepseek-v4-pro', 'deepseek-v4'],
  'deepseek v3.2': ['deepseek-v3-2', 'deepseek-v3'],
  'kimi k2.6': ['kimi-k2-6', 'kimi-k2.6'],
  'kimi k2.5': ['kimi-k2-5'],
  'kimi k2.7 code': ['kimi-k2-7-code'],
  'mimo-v2.5-pro': ['mimo-v2-5-pro'],
  'mimo-v2-pro': ['mimo-v2-pro'],
  'mimo-v2-flash': ['mimo-v2-flash'],
  'nvidia nemotron 3 ultra': ['nvidia-nemotron-3-ultra'],
  'mistral large 3': ['mistral-large-3'],
  'mistral small 4': ['mistral-small-4'],
  'devstral 2': ['devstral-2'],
  'minimax m2.7': ['minimax-m2-7'],
  'minimax m3': ['minimax-m3'],
  'mai code 1 flash': ['mai-code-1-flash'],
  'mai thinking 1': ['mai-thinking-1'],
};

function getSlugsForModel(name: string): string[] {
  const lower = name.toLowerCase();
  return EXTRA_SLUG_MAP[lower] ?? [lower.replace(/\s+/g, '-')];
}
