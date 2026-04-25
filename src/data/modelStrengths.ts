// ── AI 추천 엔진 데이터 ──────────────────────────────────────────
// 모델별 용도 강점 점수 (1~10), 가격 등급, 한국어, 환경

export type UseCase = 'writing' | 'coding' | 'image' | 'video' | 'summary' | 'chat';
export type BudgetTier = 'free' | 'cheap' | 'mid' | 'premium';
export type EnvPreference = 'cloud' | 'local' | 'both';

export interface ModelStrength {
  id: string;
  name: string;
  companyId: string;
  // 용도별 점수 (1~10)
  scores: Record<UseCase, number>;
  // 가격 등급
  budget: BudgetTier;
  // 한국어 성능 (1~10) — 범용 언어 능력의 일환
  korean: number;
  // 실행 환경: 'local'=로컬 가능, 'cloud'=클라우드 전용, 'open'=오픈소스
  env: 'local' | 'cloud' | 'open';
  // 월 예산 추정 (USD)
  monthlyEst: string;
  // 한 줄 추천 이유
  tagline: string;
  // 로고 ID
  logoId?: string;
  // 로컬 모델 여부
  isLocal?: boolean;
  // VRAM 요구사항 (로컬 모델)
  recVram?: number;
}

export const strengths: ModelStrength[] = [
  // ===== OpenAI =====
  {
    id: 'gpt-5-4', name: 'GPT-5.4', companyId: 'openai',
    scores: { writing: 9, coding: 10, image: 8, video: 7, summary: 9, chat: 9 },
    budget: 'premium', korean: 9, env: 'cloud', monthlyEst: '$50+',
    tagline: '종합 성능 최강. 전문가 업무용.',
    logoId: 'openai',
  },
  {
    id: 'gpt-5-4-mini', name: 'GPT-5.4 Mini', companyId: 'openai',
    scores: { writing: 8, coding: 9, image: 7, video: 7, summary: 8, chat: 8 },
    budget: 'mid', korean: 8, env: 'cloud', monthlyEst: '$10~30',
    tagline: '가성비 좋은 GPT. 코딩·요약에 강함.',
    logoId: 'openai',
  },
  {
    id: 'gpt-4-1', name: 'GPT-4.1', companyId: 'openai',
    scores: { writing: 8, coding: 8, image: 1, video: 1, summary: 8, chat: 7 },
    budget: 'cheap', korean: 7, env: 'cloud', monthlyEst: '$5~15',
    tagline: '저렴하고 안정적인 선택.',
    logoId: 'openai',
  },
  {
    id: 'gpt-4-1-mini', name: 'GPT-4.1 Mini', companyId: 'openai',
    scores: { writing: 7, coding: 7, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'cheap', korean: 6, env: 'cloud', monthlyEst: '$3~10',
    tagline: '가볍고 저렴한 실용 모델.',
    logoId: 'openai',
  },

  // ===== Anthropic =====
  {
    id: 'claude-opus-4-7', name: 'Claude Opus 4.7', companyId: 'anthropic',
    scores: { writing: 10, coding: 10, image: 9, video: 8, summary: 10, chat: 10 },
    budget: 'premium', korean: 9, env: 'cloud', monthlyEst: '$50+',
    tagline: '글쓰기·코딩 모두 최강. 시각 분석 98.5%.',
    logoId: 'anthropic',
  },
  {
    id: 'claude-opus-4-6', name: 'Claude Opus 4.6', companyId: 'anthropic',
    scores: { writing: 10, coding: 10, image: 8, video: 7, summary: 10, chat: 10 },
    budget: 'premium', korean: 9, env: 'cloud', monthlyEst: '$50+',
    tagline: '글쓰기·코딩 모두 최강. 1M 컨텍스트.',
    logoId: 'anthropic',
  },
  {
    id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', companyId: 'anthropic',
    scores: { writing: 9, coding: 9, image: 7, video: 7, summary: 9, chat: 9 },
    budget: 'mid', korean: 8, env: 'cloud', monthlyEst: '$10~30',
    tagline: '성능/가격 밸런스 최고.',
    logoId: 'anthropic',
  },
  {
    id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', companyId: 'anthropic',
    scores: { writing: 7, coding: 7, image: 1, video: 1, summary: 8, chat: 7 },
    budget: 'cheap', korean: 6, env: 'cloud', monthlyEst: '$3~10',
    tagline: '빠르고 저렴한 초경량.',
    logoId: 'anthropic',
  },

  // ===== Google =====
  {
    id: 'gemini-3-1-pro', name: 'Gemini 3.1 Pro', companyId: 'google',
    scores: { writing: 9, coding: 8, image: 9, video: 9, summary: 9, chat: 9 },
    budget: 'cheap', korean: 8, env: 'cloud', monthlyEst: '$5~15',
    tagline: '멀티모달 강자. 글+이미지+동영상.',
    logoId: 'google',
  },
  {
    id: 'gemini-2-5-flash', name: 'Gemini 2.5 Flash', companyId: 'google',
    scores: { writing: 7, coding: 7, image: 8, video: 8, summary: 7, chat: 7 },
    budget: 'free', korean: 7, env: 'cloud', monthlyEst: '무료',
    tagline: '빠르고 무료인 구글의 선택.',
    logoId: 'google',
  },

  // ===== Zhipu (GLM) =====
  {
    id: 'glm-5', name: 'GLM-5', companyId: 'zhipu',
    scores: { writing: 8, coding: 9, image: 1, video: 1, summary: 8, chat: 8 },
    budget: 'free', korean: 8, env: 'cloud', monthlyEst: '무료',
    tagline: '무료 코딩·분석 최강.',
    logoId: 'zhipu',
  },
  {
    id: 'glm-5-turbo', name: 'GLM-5 Turbo', companyId: 'zhipu',
    scores: { writing: 8, coding: 7, image: 1, video: 1, summary: 8, chat: 8 },
    budget: 'free', korean: 8, env: 'cloud', monthlyEst: '무료',
    tagline: '가장 경제적인 선택. 빠른 응답.',
    logoId: 'zhipu',
  },

  // ===== DeepSeek =====
  {
    id: 'deepseek-v3-2', name: 'DeepSeek V3.2', companyId: 'deepseek',
    scores: { writing: 7, coding: 8, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'cheap', korean: 6, env: 'open', monthlyEst: '$2~5',
    tagline: '가격 파괴형 범용 모델.',
    logoId: 'deepseek',
  },

  // ===== Meta =====
  {
    id: 'llama-4-maverick', name: 'Llama 4 Maverick', companyId: 'meta',
    scores: { writing: 7, coding: 7, image: 7, video: 7, summary: 7, chat: 7 },
    budget: 'free', korean: 5, env: 'open', monthlyEst: '무료 (로컬)',
    tagline: '로컬 실행 가능한 오픈소스 플래그십.',
    logoId: 'meta',
  },
  {
    id: 'llama-4-scout', name: 'Llama 4 Scout', companyId: 'meta',
    scores: { writing: 6, coding: 6, image: 6, video: 6, summary: 7, chat: 6 },
    budget: 'free', korean: 5, env: 'open', monthlyEst: '무료 (로컬)',
    tagline: '10M 컨텍스트. 초대규모 문서 분석.',
    logoId: 'meta',
  },

  // ===== xAI =====
  {
    id: 'grok-4-20-beta', name: 'Grok 4.20 Beta', companyId: 'xai',
    scores: { writing: 8, coding: 8, image: 8, video: 7, summary: 8, chat: 8 },
    budget: 'mid', korean: 6, env: 'cloud', monthlyEst: '$10~30',
    tagline: '실시간 정보 + X 연동.',
    logoId: 'xai',
  },

  // ===== MiniMax =====
  {
    id: 'minimax-m2-7', name: 'MiniMax M2.7', companyId: 'minimax',
    scores: { writing: 7, coding: 8, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'cheap', korean: 5, env: 'cloud', monthlyEst: '$3~10',
    tagline: '자가진화 에이전트. 코딩 강점.',
    logoId: 'minimax',
  },

  // ===== Mistral =====
  {
    id: 'mistral-large-3', name: 'Mistral Large 3', companyId: 'mistral',
    scores: { writing: 8, coding: 7, image: 1, video: 1, summary: 8, chat: 8 },
    budget: 'mid', korean: 4, env: 'cloud', monthlyEst: '$10~20',
    tagline: '유럽 AI 대표. GDPR 준수.',
    logoId: 'mistral',
  },

  // ===== Alibaba =====
  {
    id: 'qwen-3-235b', name: 'Qwen 3 235B', companyId: 'alibaba',
    scores: { writing: 8, coding: 8, image: 1, video: 1, summary: 8, chat: 7 },
    budget: 'free', korean: 7, env: 'open', monthlyEst: '무료',
    tagline: '무료 오픈소스. 1M 컨텍스트.',
    logoId: 'alibaba',
  },
  {
    id: 'qwen-3.6-plus', name: 'Qwen 3.6 Plus', companyId: 'alibaba',
    scores: { writing: 8, coding: 8, image: 7, video: 7, summary: 8, chat: 8 },
    budget: 'free', korean: 8, env: 'cloud', monthlyEst: '무료',
    tagline: '차세대 무료 플래그십. 에이전트 강화.',
    logoId: 'alibaba',
  },

  // ===== Moonshot =====
  {
    id: 'kimi-k2-5', name: 'Kimi K2.5', companyId: 'moonshot',
    scores: { writing: 8, coding: 9, image: 7, video: 7, summary: 8, chat: 8 },
    budget: 'mid', korean: 5, env: 'cloud', monthlyEst: '$10~25',
    tagline: '1조 파라미터 코딩 특화.',
    logoId: 'moonshot',
  },

  // ===== Xiaomi =====
  {
    id: 'mimo-v2-pro', name: 'MiMo-V2-Pro', companyId: 'xiaomi',
    scores: { writing: 8, coding: 8, image: 6, video: 6, summary: 8, chat: 8 },
    budget: 'mid', korean: 5, env: 'cloud', monthlyEst: '$10~25',
    tagline: '1M 컨텍스트. 에이전트 최적.',
    logoId: 'xiaomi',
  },

  // ===== 로컬 모델 =====
  {
    id: 'qwen3.5-27b', name: 'Qwen 3.5 27B', companyId: 'alibaba',
    scores: { writing: 8, coding: 8, image: 1, video: 1, summary: 8, chat: 8 },
    budget: 'free', korean: 8, env: 'local', monthlyEst: '무료 (로컬)',
    tagline: '로컬 올라운더 최고. 16GB+ 권장.',
    logoId: 'alibaba', isLocal: true, recVram: 16,
  },
  {
    id: 'qwen3.5-9b', name: 'Qwen 3.5 9B', companyId: 'alibaba',
    scores: { writing: 7, coding: 7, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'free', korean: 7, env: 'local', monthlyEst: '무료 (로컬)',
    tagline: '8GB GPU로 구동. 가성비 로컬 모델.',
    logoId: 'alibaba', isLocal: true, recVram: 8,
  },
  {
    id: 'glm-4.7-flash-local', name: 'GLM-4.7 Flash', companyId: 'zhipu',
    scores: { writing: 7, coding: 7, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'free', korean: 7, env: 'local', monthlyEst: '무료 (로컬)',
    tagline: '가벼운 로컬 모델. 8GB VRAM.',
    logoId: 'zhipu', isLocal: true, recVram: 8,
  },
  {
    id: 'gemma4-26b-moe', name: 'Gemma 4 26B MoE', companyId: 'google',
    scores: { writing: 7, coding: 8, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'free', korean: 5, env: 'local', monthlyEst: '무료 (로컬)',
    tagline: '에이전트·함수호출 최적. 16GB VRAM.',
    logoId: 'google', isLocal: true, recVram: 16,
  },
  {
    id: 'phi4-14b', name: 'Phi-4 14B', companyId: 'meta',
    scores: { writing: 6, coding: 9, image: 1, video: 1, summary: 6, chat: 6 },
    budget: 'free', korean: 4, env: 'local', monthlyEst: '무료 (로컬)',
    tagline: 'STEM·코딩 특화. 12GB VRAM.',
    logoId: 'meta', isLocal: true, recVram: 12,
  },
  {
    id: 'deepseek-v3.2-local', name: 'DeepSeek V3.2', companyId: 'deepseek',
    scores: { writing: 7, coding: 8, image: 1, video: 1, summary: 7, chat: 7 },
    budget: 'free', korean: 6, env: 'local', monthlyEst: '무료 (로컬)',
    tagline: 'RTX 3090/4090 코딩 최강. 22GB VRAM.',
    logoId: 'deepseek', isLocal: true, recVram: 22,
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

// 환경별 한글 라벨
export const envLabels: Record<EnvPreference, string> = {
  cloud: '클라우드만',
  local: '로컬만',
  both: '로컬도 고려',
};
