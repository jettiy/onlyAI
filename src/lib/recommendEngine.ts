// ── AI 추천 엔진 ────────────────────────────────────────────────
import { strengths, type UseCase, type BudgetTier } from '../data/modelStrengths';

export interface RecommendInput {
  useCases: UseCase[];
  budget: BudgetTier;
  privacy: 'high' | 'medium' | 'low'; // 매우 중요, 보통, 상관없음
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
  privacy: string;
  url?: string;
  reason?: string;
  // 점수 항목별
  detailScores: {
    useCase: number;  // 최대 40
    budget: number;   // 최대 30
    korean: number;   // 최대 15
    privacy: number;  // 최대 15
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

function privacyScore(modelPrivacy: string, userPrivacy: string): number {
  const map: Record<string, number> = {
    'local-high': 15,
    'open-high': 12,
    'cloud-high': 3,
    'local-medium': 12,
    'open-medium': 10,
    'cloud-medium': 8,
    'local-low': 5,
    'open-low': 5,
    'cloud-low': 10,
  };
  return map[`${modelPrivacy}-${userPrivacy}`] ?? 5;
}

export function recommend(input: RecommendInput): RecommendResult[] {
  const compatibleBudgets = budgetCompatibility[input.budget];

  const results = strengths.map(model => {
    // 1. 용도 매칭 (40점)
    let useCaseScore = 0;
    if (input.useCases.length === 0) {
      // 전부 다 선택 시 평균
      const avg = Object.values(model.scores).reduce((a, b) => a + b, 0) / 6;
      useCaseScore = (avg / 10) * 40;
    } else {
      const maxScore = Math.max(...input.useCases.map(uc => model.scores[uc]));
      const avgScore = input.useCases.reduce((sum, uc) => sum + model.scores[uc], 0) / input.useCases.length;
      // 최대 점수 60% + 평균 40%
      useCaseScore = ((maxScore * 0.6 + avgScore * 0.4) / 10) * 40;
    }

    // 2. 가격 적합도 (30점)
    let budgetScore: number;
    if (compatibleBudgets.includes(model.budget)) {
      if (model.budget === 'free') budgetScore = 30;
      else if (model.budget === input.budget) budgetScore = 25;
      else budgetScore = 20;
    } else {
      budgetScore = 2;
    }

    // 3. 한국어 (15점)
    const koreanScore = (model.korean / 10) * 15;

    // 4. 개인정보 (15점)
    const privScore = privacyScore(model.privacy, input.privacy);

    const totalScore = useCaseScore + budgetScore + koreanScore + privScore;

    const matchedUseCases = input.useCases.length === 0
      ? (['writing', 'coding', 'image', 'video', 'summary', 'chat'] as UseCase[])
      : input.useCases.filter(uc => model.scores[uc] >= 7);

    const selectedUseCases = input.useCases.length > 0 ? input.useCases : matchedUseCases;
    const reasonParts = selectedUseCases.map(uc => useCaseReasonMap[uc]).filter(Boolean);
    if (model.budget === 'free') reasonParts.push('무료로 사용 가능');
    if (model.budget === 'premium') reasonParts.push('프리미엄 성능');
    const reason = reasonParts.join(' · ');

    return {
      id: model.id,
      name: model.name,
      companyId: model.companyId,
      logoId: model.logoId,
      score: Math.round(totalScore * 10) / 10,
      tagline: model.tagline,
      monthlyEst: model.monthlyEst,
      korean: model.korean,
      privacy: model.privacy === 'local' ? '로컬 가능' : model.privacy === 'open' ? '오픈소스' : '클라우드',
      reason,
      detailScores: {
        useCase: Math.round(useCaseScore * 10) / 10,
        budget: Math.round(budgetScore * 10) / 10,
        korean: Math.round(koreanScore * 10) / 10,
        privacy: Math.round(privScore * 10) / 10,
      },
      matchedUseCases,
    };
  });

  // 점수순 정렬, 상위 5개 반환
  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}
