// ── AI 추천 엔진 ────────────────────────────────────────────────
// 추천 3대 축: 한국어 성능(30%) + 경제성(35%) + 활용도(35%)
import { strengths, type UseCase, type BudgetTier, type EnvPreference, envLabels } from '../data/modelStrengths';
import { models } from '../data/models';
import { computeAllAABasedScores, mergeScores, type AABasedScores } from '../lib/aaBasedScores';

// ── AA 기반 점수 캐시 ──
let aaScoresCache: Map<string, AABasedScores> | null = null;
let aaScoresLoading: Promise<Map<string, AABasedScores>> | null = null;

/** 전체 모델에 대한 AA 점수 일괄 로딩 (캐시 6시간) */
async function loadAAScoresOnce(): Promise<Map<string, AABasedScores>> {
  if (aaScoresCache) return aaScoresCache;
  if (aaScoresLoading) return aaScoresLoading;

  aaScoresLoading = computeAllAABasedScores(strengths).then(map => {
    aaScoresCache = map;
    aaScoresLoading = null;
    return map;
  }).catch(err => {
    console.warn('[recommendEngine] AA 점수 로딩 실패:', err);
    aaScoresLoading = null;
    return new Map<string, AABasedScores>();
  });

  return aaScoresLoading;
}

export interface RecommendInput {
  useCases: UseCase[];
  budget: BudgetTier;
  env: EnvPreference; // 'cloud' | 'local' | 'both'
}

export interface RecommendResult {
  id: string;
  name: string;
  companyId: string;
  logoId?: string;
  score: number;
  tagline: string;
  monthlyEst: string;
  korean: number;
  envLabel: string;
  isLocal: boolean;
  url?: string;
  reason?: string;
  // 점수 항목별 (총 100점)
  detailScores: {
    useCase: number;   // 최대 35 (활용도)
    budget: number;    // 최대 35 (경제성)
    korean: number;    // 최대 30 (한국어 성능)
  };
  matchedUseCases: UseCase[];
}

// 예산 호환성 점수
const budgetCompatibility: Record<BudgetTier, BudgetTier[]> = {
  free: ['free'],
  cheap: ['free', 'cheap'],
  mid: ['free', 'cheap', 'mid'],
  premium: ['free', 'cheap', 'mid', 'premium'],
};

const useCaseReasonMap: Record<UseCase, string> = {
  writing: '글쓰기 성능이 뛰어남',
  coding: '코드 생성 능력 우수',
  image: '이미지 생성에 특화',
  video: '영상 생성에 특화',
  summary: '요약·정리에 강함',
  chat: '대화 자연스러움',
};

export function recommend(input: RecommendInput): RecommendResult[] {
  return recommendSync(input, null);
}

/** 비동기 버전: AA 벤치마크 점수를 우선 사용 */
export async function recommendAsync(input: RecommendInput): Promise<RecommendResult[]> {
  try {
    const aaScoresMap = await loadAAScoresOnce();
    return recommendSync(input, aaScoresMap);
  } catch {
    // AA 로딩 실패 시 수동 점수만으로 fallback
    return recommendSync(input, null);
  }
}

function recommendSync(input: RecommendInput, aaScoresMap: Map<string, AABasedScores> | null): RecommendResult[] {
  const compatibleBudgets = budgetCompatibility[input.budget];

  // 환경 필터링
  let candidates = strengths;
  if (input.env === 'local') {
    candidates = candidates.filter(m => m.env === 'local' || m.env === 'open');
  } else if (input.env === 'cloud') {
    candidates = candidates.filter(m => m.env !== 'local');
  }
  // 'both' → 모든 모델 포함

  const results = candidates.map(model => {
    // ── AA 기반 점수 병합: 실시간 데이터 우선, 수동 fallback ──
    const effectiveScores = aaScoresMap
      ? mergeScores(model.scores, aaScoresMap.get(model.id) ?? { coding: null, writing: null, summary: null, image: null, video: null, chat: null })
      : model.scores;

    // 1. 활용도 (35점) — 사용자 용도와 모델 강점 매칭
    let useCaseScore: number;
    if (input.useCases.length === 0) {
      const avg = Object.values(effectiveScores).reduce((a, b) => a + b, 0) / 6;
      useCaseScore = (avg / 10) * 35;
    } else {
      const maxScore = Math.max(...input.useCases.map(uc => effectiveScores[uc]));
      const avgScore = input.useCases.reduce((sum, uc) => sum + effectiveScores[uc], 0) / input.useCases.length;
      useCaseScore = ((maxScore * 0.6 + avgScore * 0.4) / 10) * 35;
    }

    // 2. 경제성 (35점) — 예산 대비 가성비
    let budgetScore: number;
    if (compatibleBudgets.includes(model.budget)) {
      if (model.budget === 'free') budgetScore = 35;
      else if (model.budget === input.budget) budgetScore = 28;
      else budgetScore = 22;
    } else {
      budgetScore = 2;
    }

    // 3. 한국어 성능 (30점) — 모델의 일반적 한국어 능력
    const koreanScore = (model.korean / 10) * 30;

    // 4. Arena Score 보너스 (최대 ~5점)
    let arenaBonus = 0;
    const modelData = models.find(m => m.id === model.id);
    if (modelData?.arenaScore != null && modelData?.arenaScore != undefined) {
      arenaBonus = (modelData.arenaScore / 1600) * 5;
    }

    const totalScore = useCaseScore + budgetScore + koreanScore + arenaBonus;

    const matchedUseCases = input.useCases.length === 0
      ? (['writing', 'coding', 'image', 'video', 'summary', 'chat'] as UseCase[])
      : input.useCases.filter(uc => effectiveScores[uc] >= 7);

    const selectedUseCases = input.useCases.length > 0 ? input.useCases : matchedUseCases;
    const reasonParts = selectedUseCases.map(uc => useCaseReasonMap[uc]).filter(Boolean);
    if (model.budget === 'free') reasonParts.push('무료로 사용 가능');
    if (model.env === 'local' || model.env === 'open') reasonParts.push('로컬 실행 가능');
    if (model.budget === 'premium') reasonParts.push('프리미엄 성능');
    const reason = reasonParts.join(' · ');

    const envLabel = model.env === 'local' ? '로컬 전용'
      : model.env === 'open' ? '오픈소스 (로컬 가능)'
      : '클라우드';

    return {
      id: model.id,
      name: model.name,
      companyId: model.companyId,
      logoId: model.logoId,
      score: Math.round(totalScore * 10) / 10,
      tagline: model.tagline,
      monthlyEst: model.monthlyEst,
      korean: model.korean,
      envLabel,
      isLocal: model.isLocal ?? (model.env === 'local' || model.env === 'open'),
      reason,
      detailScores: {
        useCase: Math.round(useCaseScore * 10) / 10,
        budget: Math.round(budgetScore * 10) / 10,
        korean: Math.round(koreanScore * 10) / 10,
      },
      matchedUseCases,
    };
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}
