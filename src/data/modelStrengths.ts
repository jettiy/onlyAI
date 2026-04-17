// ── AI 추천 엔진 데이터 ──────────────────────────────────────────
// 모델별 용도 강점 점수 (1~10), 가격 등급, 한국어, 개인정보

export type UseCase = 'writing' | 'coding' | 'image' | 'video' | 'summary' | 'chat';
export type BudgetTier = 'free' | 'cheap' | 'mid' | 'premium';

export interface ModelStrength {
  id: string;
  name: string;
  companyId: string;
  // 용도별 점수 (1~10)
  scores: Record<UseCase, number>;
  // 가격 등급
  budget: BudgetTier;
  // 한국어 성능 (1~10)
  korean: number;
  // 개인정보: 'local'=로컬 가능, 'cloud'=클라우드 전용, 'open'=오픈소스
  privacy: 'local' | 'cloud' | 'open';
  // 월 예산 추정 (USD)
  monthlyEst: string;
  // 한 줄 추천 이유
  tagline: string;
  // 로고 ID
  logoId?: string;
}

export const strengths: ModelStrength[] = [
  // ===== OpenAI =====
  {
    id: 'gpt-5-4', name: 'GPT-5.4', companyId: 'openai',
    scores: { writing: 9, coding: 10, image: 8, video: 7, summary: 9, chat: 9 },
    budget: 'premium', korean: 9, privacy: 'cloud', monthlyEst: '$50+',
    tagline: '종합 성능 최강. 전문가 업무용.',
    logoId: 'openai',
  },
  {
    id: 'gpt-5-4-mini', name: 'GPT-5.4 Mini', companyId: 'openai',
    scores: { writing: 8, coding: 9, image: 7, video: 7, summary: 8, chat: 8 },
    budget: 'mid', korean: 8, privacy: 'cloud', monthlyEst: '$10~30',
    tagline: '가성비 좋은 GPT. 코딩·요약에 강함.',
    logoId: 'openai',
  },
  {
    id: 'gpt-4-1', name: 'GPT-4.1', companyId: 'openai',
    scores: { writing: 8, coding: 8, image: 1, video: 1, summary: 8, chat: 7 },
    budget: 'cheap', korean: 7, privacy: 'cloud', monthlyEst: '$5~15',
    tagline: '저렴하고 안정적인 선택.',
    logoId: 'openai',
  },
  {
    id: 'o3-mini', name: 'o3 Mini', companyId: 'openai',
    scores: { writing: 6, coding: 8, image: 1, video: 1, summary: 7, chat: 6 },
    budget: 'cheap', korean: 6, privacy: 'cloud', monthlyEst: '$5~10',
    tagline: '복잡한 추론이 필요할 때.',
    logoId: 'openai',
  },

  // ===== Anthropic =====
  {
    id: 'claude-opus-4-6', name: 'Claude Opus 4.6', companyId: 'anthropic',
    scores: { writing: 10, coding: 10, image: 8, video: 7, summary: 10, chat: 10 },
    budget: 'premium', korean: 9, privacy: 'cloud', monthlyEst: '$50+',
    tagline: '글쓰기·코딩 모두 최강. 1M 컨텍스트.',
    logoId: 'anthropic',
  },
  {
    id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', companyId: 'anthropic',
    scores: { writing: 9, coding: 9, image: 7, video: 7, summary: 9, chat: 9 },
    budget: 'mid', korean: 8, privacy: 'cloud', monthlyEst: '$10~30',
    tagline: '성능/가격 밸런스 최고.',
    logoId: 'anthropic',
  },
  {
    id: 'claude-haiku-3-5', name: 'Claude Haiku 3.5', companyId: 'anthropic',
    scores: { writing: 7, coding: 7, image: 1, video: 1, summary: 8, chat: 7 },
    budget: 'cheap', korean: 6, privacy: 'cloud', monthlyEst: '$3~10',
    tagline: '빠르고 저렴한 초경량.',
    logoId: 'anthropic',
  },

  // ===== Google =====
  {
    id: 'gemini-3-1-pro', name: 'Gemini 3.1 Pro', companyId: 'google',
    scores: { writing: 9, coding: 8, image: 9, video: 9, summary: 9, chat: 9 },
    budget: 'cheap', korean: 8, privacy: 'cloud', monthlyEst: '$5~15',
    tagline: '멀티모달 강자. 글+이미지+동영상.',
    logoId: 'google',
  },
  {
    id: 'gemini-3-1-flash', name: 'Gemini 3.1 Flash', companyId: 'google',
    scores: { writing: 7, coding: 7, image: 8, video: 8, summary: 7, chat: 7 },
    budget: 'free', korean: 7, privacy: 'cloud', monthlyEst: '무료',
    tagline: '빠르고 무료인 구글의 선택.',
    logoId: 'google',
  },

  // ===== Zhipu (GLM) =====
  {
    id: 'glm-5-turbo', name: 'GLM-5 Turbo', companyId: 'zhipu',
    scores: { writing: 8, coding: 7, image: 1, video: 1, summary: 8, chat: 8 },
    budget: 'free', korean: 8, privacy: 'cloud', monthlyEst: '무료',
    tagline: '가장 경제적인 선택. 한국어 훌륭.',
    logoId: 'zhipu',
  },
  {
    id: 'glm-5', name: 'GLM-5', companyId: 'zhipu',
    scores: { writing: 8, coding: 9, image: 1, video: 1, summary: 8, chat: 8 },
    budget: 'free', korean: 8, privacy: 'cloud', monthlyEst: '무료',
    tagline: '무료 코딩·분석 최강.',
    logoId: 'zhipu',
  },

  // ===== DeepSeek =====
  {
    id: 'deepseek-r1', name: 'DeepSeek R1', companyId: 'deepseek',
    scores: { writing: 7, coding: 8, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'cheap', korean: 6, privacy: 'open', monthlyEst: '$3~10',
    tagline: '초저가 추론 특화. 오픈소스.',
    logoId: 'deepseek',
  },
  {
    id: 'deepseek-v3', name: 'DeepSeek V3', companyId: 'deepseek',
    scores: { writing: 7, coding: 7, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'cheap', korean: 6, privacy: 'open', monthlyEst: '$2~5',
    tagline: '가격 파괴형 범용 모델.',
    logoId: 'deepseek',
  },

  // ===== Meta =====
  {
    id: 'llama-4-maverick', name: 'Llama 4 Maverick', companyId: 'meta',
    scores: { writing: 7, coding: 7, image: 7, video: 7, summary: 7, chat: 7 },
    budget: 'free', korean: 5, privacy: 'open', monthlyEst: '무료 (로컬)',
    tagline: '로컬 실행 가능한 오픈소스.',
    logoId: 'meta',
  },

  // ===== xAI =====
  {
    id: 'grok-4-20', name: 'Grok 4.20', companyId: 'xai',
    scores: { writing: 8, coding: 8, image: 8, video: 7, summary: 8, chat: 8 },
    budget: 'mid', korean: 6, privacy: 'cloud', monthlyEst: '$10~30',
    tagline: '실시간 정보 + X 연동.',
    logoId: 'xai',
  },

  // ===== MiniMax =====
  {
    id: 'minimax-m2', name: 'MiniMax M2', companyId: 'minimax',
    scores: { writing: 7, coding: 6, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'cheap', korean: 5, privacy: 'cloud', monthlyEst: '$3~10',
    tagline: '저렴한 1M 컨텍스트.',
    logoId: 'minimax',
  },

  // ===== Mistral =====
  {
    id: 'mistral-large', name: 'Mistral Large 2', companyId: 'mistral',
    scores: { writing: 8, coding: 7, image: 1, video: 1, summary: 8, chat: 8 },
    budget: 'mid', korean: 5, privacy: 'cloud', monthlyEst: '$10~20',
    tagline: '유럽 AI 대표. 다국어 강함.',
    logoId: 'mistral',
  },

  // ===== Alibaba =====
  {
    id: 'qwen-3-235b', name: 'Qwen 3 235B', companyId: 'alibaba',
    scores: { writing: 8, coding: 8, image: 1, video: 1, summary: 8, chat: 7 },
    budget: 'free', korean: 6, privacy: 'open', monthlyEst: '무료',
    tagline: '무료 중국 최강. 오픈소스.',
    logoId: 'alibaba',
  },

  // ===== Moonshot =====
  {
    id: 'kimi-k2-5', name: 'Kimi K2.5', companyId: 'moonshot',
    scores: { writing: 8, coding: 9, image: 1, video: 1, summary: 8, chat: 8 },
    budget: 'mid', korean: 5, privacy: 'cloud', monthlyEst: '$10~25',
    tagline: '1조 파라미터 코딩 특화.',
    logoId: 'moonshot',
  },
];

// 용도별 한글 라벨
export const useCaseLabels: Record<UseCase, string> = {
  writing: '글쓰기·번역',
  coding: '코딩·개발',
  image: '이미지 생성',
  video: '비디오 생성',
  summary: '문서 요약·분석',
  chat: '대화·상담',
};

export const useCaseIcons: Record<UseCase, string> = {
  writing: '✍️',
  coding: '💻',
  image: '🖼️',
  video: '🎬',
  summary: '📊',
  chat: '💬',
};

// 예산별 한글 라벨
export const budgetLabels: Record<BudgetTier, string> = {
  free: '무료',
  cheap: '월 1만원 이하',
  mid: '월 5만원 이하',
  premium: '상관없음',
};
