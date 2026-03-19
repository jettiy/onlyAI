// ── 타입 정의 ──────────────────────────────────────────────────
export type ModelTier = 'flagship' | 'strong' | 'efficient' | 'local';
export type Region = 'us' | 'china' | 'other';

export interface AIModel {
  id: string;
  name: string;
  company: string;
  companyId: string;
  region: Region;
  tier: ModelTier;
  isFeatured: boolean;        // 대시보드 메인에 노출
  description: string;
  strengths: string[];
  inputPrice: number | null;  // USD / 1M tokens
  outputPrice: number | null;
  contextWindow: string;
  params?: string;            // 파라미터 수
  isLocal: boolean;
  isNew: boolean;
  releaseDate: string;
  useCases: string[];
  openRouterSlug?: string;
  sourceUrl: string;          // 가격 정보 출처
  updatedAt: string;          // 마지막 가격 확인일
}

export interface AICompany {
  id: string;
  name: string;
  region: Region;
  country: string;
  flag: string;
  description: string;
  website: string;
}

// ── 회사 목록 ───────────────────────────────────────────────────
export const companies: AICompany[] = [
  // 미국
  { id: 'openai',    name: 'OpenAI',    region: 'us',    country: '미국',   flag: '🇺🇸', description: 'GPT 시리즈 제작사. ChatGPT로 AI 붐을 일으킨 기업.', website: 'https://openai.com/api/pricing/' },
  { id: 'anthropic', name: 'Anthropic', region: 'us',    country: '미국',   flag: '🇺🇸', description: '안전 중심 AI 연구소. Claude 시리즈 제작.', website: 'https://www.anthropic.com/pricing' },
  { id: 'google',    name: 'Google',    region: 'us',    country: '미국',   flag: '🇺🇸', description: 'Gemini·Gemma 시리즈. 멀티모달 AI 선두.', website: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'meta',      name: 'Meta',      region: 'us',    country: '미국',   flag: '🇺🇸', description: 'Llama 오픈소스로 AI 민주화를 이끄는 기업.', website: 'https://ai.meta.com/llama/' },
  { id: 'xai',       name: 'xAI',       region: 'us',    country: '미국',   flag: '🇺🇸', description: '일론 머스크 설립. Grok 시리즈. X(트위터) 실시간 연동.', website: 'https://docs.x.ai/developers/models' },
  // 중국
  { id: 'minimax',   name: 'MiniMax',   region: 'china', country: '중국',   flag: '🇨🇳', description: '중국 AI 유니콘. M2 시리즈, 홍콩 상장사.', website: 'https://platform.minimax.io/docs/pricing/overview' },
  { id: 'deepseek',  name: 'DeepSeek',  region: 'china', country: '중국',   flag: '🇨🇳', description: '초저가 고성능 오픈소스로 AI 가격 파괴 주도.', website: 'https://api-docs.deepseek.com/quick_start/pricing' },
  { id: 'alibaba',   name: 'Alibaba',   region: 'china', country: '중국',   flag: '🇨🇳', description: '큐원(Qwen) 시리즈. MAU 2억 명 돌파. 알리바바 클라우드.', website: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing' },
  { id: 'moonshot',  name: 'Moonshot',  region: 'china', country: '중국',   flag: '🇨🇳', description: 'Kimi 시리즈. 1조 파라미터 MoE로 주목받는 에이전트 강자.', website: 'https://platform.moonshot.ai/docs/pricing/chat' },
  { id: 'zhipu',     name: 'Zhipu AI',  region: 'china', country: '중국',   flag: '🇨🇳', description: 'GLM(Z.ai) 시리즈. 코딩·추론 특화 중국 AI 연구소.', website: 'https://docs.z.ai/guides/overview/pricing' },
  { id: 'xiaomi',    name: 'Xiaomi',    region: 'china', country: '중국',   flag: '🇨🇳', description: 'MiMo 시리즈. 샤오미 스마트폰·IoT 생태계 AI 전략.', website: 'https://openrouter.ai/xiaomi/mimo-v2-flash' },
  // 기타 국가
  { id: 'mistral',   name: 'Mistral',   region: 'other', country: '프랑스', flag: '🇫🇷', description: '유럽 최대 AI 스타트업. 오픈소스+상업 모델 병행.', website: 'https://mistral.ai/pricing' },
  { id: 'cohere',    name: 'Cohere',    region: 'other', country: '캐나다', flag: '🇨🇦', description: '기업용 RAG·검색 연동 특화. Command 시리즈.', website: 'https://cohere.com/pricing' },
];

// ── 모델 목록 ───────────────────────────────────────────────────
// 가격 출처: OpenAI/Anthropic/Google 공식 API 가격 페이지 (2026-03-19 기준)
// 변동 주기: 회사별 상이 (빠르면 수주 단위)
export const models: AIModel[] = [

  // ===== 🇺🇸 미국 =====

  // OpenAI ─────────────────────
  {
    id: 'gpt-4-1',
    name: 'GPT-4.1',
    company: 'OpenAI', companyId: 'openai', region: 'us',
    tier: 'strong', isFeatured: true,
    description: '2025년 4월 출시. 코딩·지시 이행에 최적화, SWE-bench 점수 GPT-4o 대비 21% 향상. 128K 컨텍스트.',
    strengths: ['코딩', '지시 이행', '장문 컨텍스트', '가성비'],
    inputPrice: 2.0, outputPrice: 8.0, contextWindow: '128K',
    isLocal: false, isNew: false, releaseDate: '2025-04',
    useCases: ['코드 작성', '코드 리뷰', '지시 이행 앱'],
    openRouterSlug: 'openai/gpt-4.1',
    sourceUrl: 'https://openai.com/api/pricing/',
    updatedAt: '2026-03-19',
  },
  {
    id: 'gpt-4-1-mini',
    name: 'GPT-4.1 Mini',
    company: 'OpenAI', companyId: 'openai', region: 'us',
    tier: 'efficient', isFeatured: true,
    description: '가장 저렴한 OpenAI 실용 모델. 입력 $0.4/1M, 출력 $1.6/1M. 일상 작업·챗봇에 최적.',
    strengths: ['초저가', '빠른 응답', '다용도', '높은 RPM'],
    inputPrice: 0.4, outputPrice: 1.6, contextWindow: '128K',
    isLocal: false, isNew: false, releaseDate: '2025-04',
    useCases: ['챗봇', '요약', '분류', '대량 API 처리'],
    openRouterSlug: 'openai/gpt-4.1-mini',
    sourceUrl: 'https://openai.com/api/pricing/',
    updatedAt: '2026-03-19',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    company: 'OpenAI', companyId: 'openai', region: 'us',
    tier: 'strong', isFeatured: false,
    description: '2024년 5월 출시. 텍스트·이미지 통합 멀티모달. 실시간 음성 지원.',
    strengths: ['멀티모달', '실시간 음성', '이미지 이해', '안정성'],
    inputPrice: 2.5, outputPrice: 10.0, contextWindow: '128K',
    isLocal: false, isNew: false, releaseDate: '2024-05',
    useCases: ['멀티모달 앱', '음성 어시스턴트', '이미지 분석'],
    openRouterSlug: 'openai/gpt-4o',
    sourceUrl: 'https://openai.com/api/pricing/',
    updatedAt: '2026-03-19',
  },
  {
    id: 'gpt-4-1-nano',
    name: 'GPT-4.1 Nano',
    company: 'OpenAI', companyId: 'openai', region: 'us',
    tier: 'efficient', isFeatured: false,
    description: 'OpenAI 최소·최저가 모델. 입력 $0.1/1M, 출력 $0.4/1M. Claude Haiku 대비 99% 저렴.',
    strengths: ['초초저가', '초경량', '빠른 분류', '임베딩 전처리'],
    inputPrice: 0.1, outputPrice: 0.4, contextWindow: '128K',
    isLocal: false, isNew: true, releaseDate: '2025-04',
    useCases: ['대량 분류', '키워드 추출', '전처리'],
    openRouterSlug: 'openai/gpt-4.1-nano',
    sourceUrl: 'https://openai.com/api/pricing/',
    updatedAt: '2026-03-19',
  },

  // Anthropic ─────────────────────
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    company: 'Anthropic', companyId: 'anthropic', region: 'us',
    tier: 'flagship', isFeatured: true,
    description: '2026년 최신 Anthropic 플래그십. 코딩·분석 최상위. 프롬프트 캐싱으로 최대 90% 절감 가능.',
    strengths: ['코딩', '분석', '지시 이행', '긴 컨텍스트'],
    inputPrice: 3.0, outputPrice: 15.0, contextWindow: '200K',
    isLocal: false, isNew: true, releaseDate: '2026-01',
    useCases: ['코딩 보조', '기업 챗봇', '데이터 분석'],
    openRouterSlug: 'anthropic/claude-sonnet-4-6',
    sourceUrl: 'https://www.anthropic.com/claude/sonnet',
    updatedAt: '2026-03-19',
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    company: 'Anthropic', companyId: 'anthropic', region: 'us',
    tier: 'efficient', isFeatured: false,
    description: 'Anthropic 최저가 실용 모델. 빠른 속도와 낮은 비용으로 대량 처리에 최적.',
    strengths: ['저가', '빠름', '요약', '분류'],
    inputPrice: 1.0, outputPrice: 5.0, contextWindow: '200K',
    isLocal: false, isNew: false, releaseDate: '2025-07',
    useCases: ['챗봇', '빠른 요약', '대량 문서 처리'],
    openRouterSlug: 'anthropic/claude-haiku-4-5',
    sourceUrl: 'https://www.anthropic.com/pricing',
    updatedAt: '2026-03-19',
  },
  {
    id: 'claude-opus-4',
    name: 'Claude Opus 4',
    company: 'Anthropic', companyId: 'anthropic', region: 'us',
    tier: 'flagship', isFeatured: false,
    description: '200K 컨텍스트, 법률·연구 특화. 가장 비싼 Claude 모델. 복잡한 장문 분석에 최상위.',
    strengths: ['긴 컨텍스트', '안전성', '법률 분석', '복잡 추론'],
    inputPrice: 15.0, outputPrice: 75.0, contextWindow: '200K',
    isLocal: false, isNew: false, releaseDate: '2025-05',
    useCases: ['법률 문서', '장편 연구', '고가치 단건 작업'],
    openRouterSlug: 'anthropic/claude-opus-4',
    sourceUrl: 'https://www.anthropic.com/pricing',
    updatedAt: '2026-03-19',
  },

  // Google ─────────────────────
  {
    id: 'gemini-3-1-pro',
    name: 'Gemini 3.1 Pro Preview',
    company: 'Google', companyId: 'google', region: 'us',
    tier: 'flagship', isFeatured: true,
    description: '2026년 2월 출시. 1M 컨텍스트. 이미지·영상·텍스트 통합 최강 멀티모달. Gemini 3 Pro 후계.',
    strengths: ['멀티모달', '1M 컨텍스트', '수학', '코딩'],
    inputPrice: 2.0, outputPrice: 12.0, contextWindow: '1M',
    isLocal: false, isNew: true, releaseDate: '2026-02',
    useCases: ['대용량 문서', '이미지·영상 분석', '멀티모달 앱'],
    openRouterSlug: 'google/gemini-3.1-pro-preview',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/google-gemini-3.1-pro-preview',
    updatedAt: '2026-03-19',
  },
  {
    id: 'gemini-3-1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    company: 'Google', companyId: 'google', region: 'us',
    tier: 'efficient', isFeatured: true,
    description: '2026년 3월 출시. Pro 대비 1/8 비용, 2.5 Flash보다 빠름. 대량 처리에 최적.',
    strengths: ['초저가', '빠름', '1M 컨텍스트', 'Pro 아키텍처'],
    inputPrice: 0.25, outputPrice: 1.5, contextWindow: '1M',
    isLocal: false, isNew: true, releaseDate: '2026-03',
    useCases: ['대량 처리', '빠른 요약', '저비용 멀티모달'],
    openRouterSlug: 'google/gemini-3.1-flash-lite',
    sourceUrl: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-lite/',
    updatedAt: '2026-03-19',
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    company: 'Google', companyId: 'google', region: 'us',
    tier: 'strong', isFeatured: false,
    description: '1M 컨텍스트. 코딩·수학 강점. 3.1 Pro 이전의 Google 주력 모델.',
    strengths: ['1M 컨텍스트', '코딩', '수학', '멀티모달'],
    inputPrice: 1.25, outputPrice: 10.0, contextWindow: '1M',
    isLocal: false, isNew: false, releaseDate: '2025-09',
    useCases: ['대용량 코드베이스', '수학 연산', '멀티모달'],
    openRouterSlug: 'google/gemini-2.5-pro',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/google-gemini-2.5-pro',
    updatedAt: '2026-03-19',
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    company: 'Google', companyId: 'google', region: 'us',
    tier: 'efficient', isFeatured: false,
    description: '빠르고 저렴한 Google 실용 모델. 1M 컨텍스트를 $0.1/1M에 제공.',
    strengths: ['저가', '1M 컨텍스트', '빠름', '멀티모달'],
    inputPrice: 0.1, outputPrice: 0.4, contextWindow: '1M',
    isLocal: false, isNew: false, releaseDate: '2025-02',
    useCases: ['챗봇', '빠른 요약', '대량 API'],
    openRouterSlug: 'google/gemini-2.0-flash-001',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/google-gemini-2.0-flash-001',
    updatedAt: '2026-03-19',
  },

  // Meta ─────────────────────
  {
    id: 'llama-4-maverick',
    name: 'Llama 4 Maverick',
    company: 'Meta', companyId: 'meta', region: 'us',
    tier: 'strong', isFeatured: true,
    description: '2025년 4월 출시. 400B MoE 오픈소스. 상업용 무료, 로컬 실행 가능. 1M 컨텍스트.',
    strengths: ['오픈소스', '무료 상업용', '로컬 가능', '코딩'],
    inputPrice: 0.19, outputPrice: 0.85, contextWindow: '1M',
    params: '400B MoE',
    isLocal: true, isNew: false, releaseDate: '2025-04',
    useCases: ['로컬 AI 서버', '파인튜닝', '비용 절감'],
    openRouterSlug: 'meta-llama/llama-4-maverick',
    sourceUrl: 'https://pricepertoken.com/compare/meta-llama-llama-4-maverick-vs-meta-llama-llama-4-scout',
    updatedAt: '2026-03-19',
  },
  {
    id: 'llama-4-scout',
    name: 'Llama 4 Scout',
    company: 'Meta', companyId: 'meta', region: 'us',
    tier: 'efficient', isFeatured: false,
    description: '2025년 4월 출시. Maverick의 경량 버전. 10M 컨텍스트(!), $0.15/1M 초저가.',
    strengths: ['10M 컨텍스트', '초저가', '오픈소스', '로컬'],
    inputPrice: 0.15, outputPrice: 0.6, contextWindow: '10M',
    params: '109B MoE',
    isLocal: true, isNew: false, releaseDate: '2025-04',
    useCases: ['초장문 처리', '저비용 에이전트', '로컬 실행'],
    openRouterSlug: 'meta-llama/llama-4-scout',
    sourceUrl: 'https://pricepertoken.com/compare/meta-llama-llama-4-maverick-vs-meta-llama-llama-4-scout',
    updatedAt: '2026-03-19',
  },

  // xAI ─────────────────────
  {
    id: 'grok-4',
    name: 'Grok 4',
    company: 'xAI', companyId: 'xai', region: 'us',
    tier: 'flagship', isFeatured: true,
    description: '일론 머스크 xAI 제작. X(트위터) 실시간 데이터 접근. 직설적 답변 스타일. Sonnet 4.6과 동일 가격.',
    strengths: ['실시간 검색', 'X 데이터', '추론', '직설적'],
    inputPrice: 3.0, outputPrice: 15.0, contextWindow: '128K',
    isLocal: false, isNew: true, releaseDate: '2026-01',
    useCases: ['실시간 뉴스', 'SNS 분석', '트렌드 파악'],
    openRouterSlug: 'x-ai/grok-4',
    sourceUrl: 'https://docs.x.ai/developers/models',
    updatedAt: '2026-03-19',
  },
  {
    id: 'grok-3',
    name: 'Grok 3 Beta',
    company: 'xAI', companyId: 'xai', region: 'us',
    tier: 'strong', isFeatured: false,
    description: '기업용 데이터 추출·코딩·요약 특화. Grok 4 이전의 주력 모델.',
    strengths: ['기업 데이터', '코딩', '요약', '실시간 검색'],
    inputPrice: 3.0, outputPrice: 15.0, contextWindow: '131K',
    isLocal: false, isNew: false, releaseDate: '2025-02',
    useCases: ['기업 자동화', '데이터 추출', '코딩'],
    openRouterSlug: 'x-ai/grok-3-beta',
    sourceUrl: 'https://docs.x.ai/developers/models',
    updatedAt: '2026-03-19',
  },

  // ===== 🇨🇳 중국 =====

  // MiniMax ─────────────────────
  {
    id: 'minimax-m2-7',
    name: 'MiniMax M2.7',
    company: 'MiniMax', companyId: 'minimax', region: 'china',
    tier: 'flagship', isFeatured: true,
    description: '2026년 3월 출시. 자가진화·소프트웨어 엔지니어링 특화. M2 계열 최신 플래그십.',
    strengths: ['자가진화', '소프트웨어 엔지니어링', '멀티모달', '에이전트'],
    inputPrice: 0.26, outputPrice: 1.0, contextWindow: '128K',
    isLocal: false, isNew: true, releaseDate: '2026-03',
    useCases: ['코딩 에이전트', '아시아어', '비용 효율'],
    openRouterSlug: 'minimax/minimax-m2',
    sourceUrl: 'https://blog.galaxy.ai/model/minimax-m2',
    updatedAt: '2026-03-19',
  },
  {
    id: 'minimax-m2-5',
    name: 'MiniMax M2.5',
    company: 'MiniMax', companyId: 'minimax', region: 'china',
    tier: 'strong', isFeatured: false,
    description: 'M2.7 이전 안정 버전. 197K 컨텍스트. 입력 $0.25/1M. 코딩·에이전트 워크플로 적합.',
    strengths: ['안정성', '코딩', '에이전트', '가성비'],
    inputPrice: 0.25, outputPrice: 1.2, contextWindow: '197K',
    isLocal: false, isNew: false, releaseDate: '2025-10',
    useCases: ['코딩 보조', '에이전트 워크플로', '대량 처리'],
    openRouterSlug: 'minimax/minimax-m2.5',
    sourceUrl: 'https://costgoat.com/compare/llm-api',
    updatedAt: '2026-03-19',
  },

  // DeepSeek ─────────────────────
  {
    id: 'deepseek-v3-2',
    name: 'DeepSeek V3.2',
    company: 'DeepSeek', companyId: 'deepseek', region: 'china',
    tier: 'strong', isFeatured: true,
    description: '2026년 1월 출시. 685B MoE (37B 활성). 채팅·추론 통합. GPT-4.1급 성능을 1/7 가격에.',
    strengths: ['최강 가성비', '코딩', '수학', '오픈소스'],
    inputPrice: 0.4, outputPrice: 1.2, contextWindow: '128K',
    params: '685B MoE (37B active)',
    isLocal: false, isNew: true, releaseDate: '2026-01',
    useCases: ['개발자 도구', '수학·과학', '대량 API 호출'],
    openRouterSlug: 'deepseek/deepseek-v3.2',
    sourceUrl: 'https://getdeploying.com/llms/deepseek-v3.2',
    updatedAt: '2026-03-19',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    company: 'DeepSeek', companyId: 'deepseek', region: 'china',
    tier: 'efficient', isFeatured: false,
    description: '오픈소스 공개, 164K 컨텍스트. 입력 $0.014/1M. 사실상 무료에 가까운 가격.',
    strengths: ['오픈소스', '초저가', '코딩', '164K ctx'],
    inputPrice: 0.014, outputPrice: 0.028, contextWindow: '164K',
    params: '671B MoE',
    isLocal: false, isNew: false, releaseDate: '2024-12',
    useCases: ['대량 비용 절감', '자체 호스팅', '연구'],
    openRouterSlug: 'deepseek/deepseek-chat',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/deepseek-deepseek-chat',
    updatedAt: '2026-03-19',
  },

  // Alibaba ─────────────────────
  {
    id: 'qwen-max-2026',
    name: 'Qwen Max (큐원 Max)',
    company: 'Alibaba', companyId: 'alibaba', region: 'china',
    tier: 'strong', isFeatured: true,
    description: '알리바바 큐원 최상위 모델. 입력 $1.6/1M. MAU 2억 돌파 큐원 앱의 기반 모델. 50% 가격 인하 진행 중.',
    strengths: ['한·중 언어', '코딩', '멀티모달', '큰 생태계'],
    inputPrice: 1.6, outputPrice: 6.4, contextWindow: '128K',
    isLocal: false, isNew: true, releaseDate: '2026-01',
    useCases: ['한·중 처리', '개발', '비용 효율 워크플로'],
    openRouterSlug: 'qwen/qwen-max',
    sourceUrl: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing',
    updatedAt: '2026-03-19',
  },
  {
    id: 'qwen3-5-35b',
    name: 'Qwen3.5 35B A3B',
    company: 'Alibaba', companyId: 'alibaba', region: 'china',
    tier: 'efficient', isFeatured: false,
    description: '2026년 큐원3.5 시리즈 경량 MoE. 262K 컨텍스트. 입력 $0.163/1M. 오픈소스.',
    strengths: ['오픈소스', '저가', '에이전트', '한·중 지원'],
    inputPrice: 0.163, outputPrice: 1.0, contextWindow: '262K',
    params: '35B MoE (3B active)',
    isLocal: false, isNew: true, releaseDate: '2026-02',
    useCases: ['오픈소스 대체', '파인튜닝', '저비용 에이전트'],
    openRouterSlug: 'qwen/qwen3.5-35b-a3b',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/qwen3.5-35b-a3b',
    updatedAt: '2026-03-19',
  },

  // Moonshot ─────────────────────
  {
    id: 'kimi-k2-5',
    name: 'Kimi K2.5',
    company: 'Moonshot', companyId: 'moonshot', region: 'china',
    tier: 'strong', isFeatured: true,
    description: '2026년 1월 출시(오픈소스 MIT). 에이전트 최적화 멀티모달. 시각적 코딩 능력 최상위. 262K 컨텍스트.',
    strengths: ['에이전트', '시각 코딩', '멀티모달', '오픈소스'],
    inputPrice: 0.6, outputPrice: 2.5, contextWindow: '262K',
    params: '1T MoE',
    isLocal: false, isNew: true, releaseDate: '2026-01',
    useCases: ['에이전트 앱', '코딩 보조', '긴 문서'],
    openRouterSlug: 'moonshotai/kimi-k2.5',
    sourceUrl: 'https://platform.moonshot.ai/docs/pricing/chat',
    updatedAt: '2026-03-19',
  },
  {
    id: 'kimi-k2',
    name: 'Kimi K2',
    company: 'Moonshot', companyId: 'moonshot', region: 'china',
    tier: 'efficient', isFeatured: false,
    description: 'K2.5의 이전 안정 버전. 131K 컨텍스트. 입력 $0.55/1M. 에이전트 워크플로에 검증된 선택.',
    strengths: ['에이전트', '코딩', '안정성', '131K ctx'],
    inputPrice: 0.55, outputPrice: 2.2, contextWindow: '131K',
    isLocal: false, isNew: false, releaseDate: '2025-09',
    useCases: ['에이전트', '코딩', '기업 챗봇'],
    openRouterSlug: 'moonshotai/kimi-k2',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/moonshotai-kimi-k2',
    updatedAt: '2026-03-19',
  },

  // Zhipu AI ─────────────────────
  {
    id: 'glm-4-7',
    name: 'GLM-4.7',
    company: 'Zhipu AI', companyId: 'zhipu', region: 'china',
    tier: 'strong', isFeatured: true,
    description: '2026년 1월 출시. 즈푸AI(Z.ai) 최신 플래그십. 200K 컨텍스트. 추론·코딩·에이전트 강화.',
    strengths: ['추론', '코딩', '에이전트', '중국어'],
    inputPrice: 0.52, outputPrice: 2.0, contextWindow: '200K',
    isLocal: false, isNew: true, releaseDate: '2026-01',
    useCases: ['코딩', '기업 챗봇', '에이전트'],
    openRouterSlug: 'z-ai/glm-4.7',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/z-ai-glm-4.7-flash',
    updatedAt: '2026-03-19',
  },
  {
    id: 'glm-4-7-flash',
    name: 'GLM-4.7 Flash',
    company: 'Zhipu AI', companyId: 'zhipu', region: 'china',
    tier: 'efficient', isFeatured: false,
    description: '2026년 1월 출시. 입력 $0.06/1M 초저가. 200K 컨텍스트. 중국 플랫폼에서 무료 제공.',
    strengths: ['초저가', '빠름', '중국어', '200K ctx'],
    inputPrice: 0.06, outputPrice: 0.4, contextWindow: '200K',
    isLocal: false, isNew: true, releaseDate: '2026-01',
    useCases: ['무료 API', '빠른 챗봇', '중국어 앱'],
    openRouterSlug: 'z-ai/glm-4.7-flash',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/z-ai-glm-4.7-flash',
    updatedAt: '2026-03-19',
  },
  {
    id: 'glm-4-5-air-free',
    name: 'GLM-4.5 Air (무료)',
    company: 'Zhipu AI', companyId: 'zhipu', region: 'china',
    tier: 'efficient', isFeatured: false,
    description: '에이전트 특화 경량 모델. OpenRouter에서 완전 무료 제공. 아이디어 검증·프로토타입에 최적.',
    strengths: ['완전 무료', '에이전트', '빠름', '중국어'],
    inputPrice: 0, outputPrice: 0, contextWindow: '128K',
    isLocal: false, isNew: true, releaseDate: '2026-02',
    useCases: ['무료 프로토타입', '에이전트 테스트', '학습용'],
    openRouterSlug: 'z-ai/glm-4.5-air:free',
    sourceUrl: 'https://openrouter.ai/z-ai/glm-4.5-air:free',
    updatedAt: '2026-03-19',
  },

  // Xiaomi ─────────────────────
  {
    id: 'mimo-v2-flash',
    name: 'MiMo-V2-Flash',
    company: 'Xiaomi', companyId: 'xiaomi', region: 'china',
    tier: 'efficient', isFeatured: true,
    description: '2025년 12월 출시. 309B MoE (15B 활성). 150토큰/초 초고속. $0.09/1M 초저가. 262K 컨텍스트.',
    strengths: ['초고속', '초저가', '오픈소스', '스마트폰 최적화'],
    inputPrice: 0.09, outputPrice: 0.29, contextWindow: '262K',
    params: '309B MoE (15B active)',
    isLocal: true, isNew: true, releaseDate: '2025-12',
    useCases: ['엣지 AI', '모바일 앱', '저비용 대량 호출'],
    openRouterSlug: 'xiaomi/mimo-v2-flash',
    sourceUrl: 'https://openrouter.ai/xiaomi/mimo-v2-flash',
    updatedAt: '2026-03-19',
  },

  // ===== 🌍 기타 국가 =====

  // Mistral ─────────────────────
  {
    id: 'mistral-large-3',
    name: 'Mistral Large 3',
    company: 'Mistral', companyId: 'mistral', region: 'other',
    tier: 'strong', isFeatured: true,
    description: '2026년 1월 출시. 262K 컨텍스트. 입력 $0.5/1M으로 GPT-4.1 대비 4배 저렴. 유럽 GDPR 완벽 준수.',
    strengths: ['유럽 규정', '다국어', '코딩', '가성비'],
    inputPrice: 0.5, outputPrice: 1.5, contextWindow: '262K',
    params: '123B',
    isLocal: false, isNew: true, releaseDate: '2026-01',
    useCases: ['유럽 기업', '다국어 앱', 'GDPR 준수'],
    openRouterSlug: 'mistralai/mistral-large-2512',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/mistral-ai-mistral-large-2512',
    updatedAt: '2026-03-19',
  },
  {
    id: 'mistral-medium-3',
    name: 'Mistral Medium 3',
    company: 'Mistral', companyId: 'mistral', region: 'other',
    tier: 'efficient', isFeatured: false,
    description: '2025년 5월 출시. "Medium is the new Large". 131K 컨텍스트. 기업 배포 단순화 특화.',
    strengths: ['가성비', '기업 배포', '131K ctx', '오픈소스'],
    inputPrice: 0.4, outputPrice: 2.0, contextWindow: '131K',
    isLocal: false, isNew: false, releaseDate: '2025-05',
    useCases: ['기업 챗봇', 'RAG', '비용 절감'],
    openRouterSlug: 'mistralai/mistral-medium-3',
    sourceUrl: 'https://pricepertoken.com/pricing-page/model/mistral-ai-mistral-medium-3',
    updatedAt: '2026-03-19',
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    company: 'Cohere', companyId: 'cohere', region: 'other',
    tier: 'strong', isFeatured: false,
    description: '캐나다 Cohere. 기업용 RAG·검색 연동 특화. 10개 언어 지원. 도구 호출 최적화.',
    strengths: ['RAG', '검색 연동', '기업용', '다국어'],
    inputPrice: 2.5, outputPrice: 10.0, contextWindow: '128K',
    isLocal: false, isNew: false, releaseDate: '2024-08',
    useCases: ['기업 RAG', '지식베이스 검색', '문서 Q&A'],
    openRouterSlug: 'cohere/command-r-plus',
    sourceUrl: 'https://cohere.com/pricing',
    updatedAt: '2026-03-19',
  },
];

// ── 헬퍼 ────────────────────────────────────────────────────────
export const tierLabels: Record<ModelTier, string> = {
  flagship:  '플래그십',
  strong:    '고성능',
  efficient: '효율',
  local:     '로컬 전용',
};

export const tierColors: Record<ModelTier, string> = {
  flagship:  'bg-purple-100 text-purple-700',
  strong:    'bg-blue-100 text-blue-700',
  efficient: 'bg-green-100 text-green-700',
  local:     'bg-orange-100 text-orange-700',
};

export const regionLabels: Record<Region, string> = {
  us:    '🇺🇸 미국',
  china: '🇨🇳 중국',
  other: '🌍 기타',
};

// ── 가격 예시 데이터 (홈페이지 기준) ────────────────────────────
export interface PriceExample {
  useCase: string;
  icon: string;
  description: string;
  tokensInput: number;   // 1회 작업 평균 입력 토큰
  tokensOutput: number;  // 1회 작업 평균 출력 토큰
  timesPerMonth: number; // 월 평균 사용 횟수
}

export const priceExamples: PriceExample[] = [
  {
    useCase: '랜딩 페이지 제작',
    icon: '🖥️',
    description: '홈페이지 1페이지 기획·카피·HTML 코드 생성 (1회)',
    tokensInput: 2000, tokensOutput: 8000,
    timesPerMonth: 1,
  },
  {
    useCase: '블로그 글쓰기',
    icon: '✍️',
    description: '2,000자 블로그 포스팅 1개 작성 (월 8회)',
    tokensInput: 500, tokensOutput: 3000,
    timesPerMonth: 8,
  },
  {
    useCase: '고객 응대 챗봇',
    icon: '💬',
    description: '1일 100회 고객 질문 처리 (월 3,000회)',
    tokensInput: 300, tokensOutput: 500,
    timesPerMonth: 3000,
  },
  {
    useCase: '코드 리뷰 & 수정',
    icon: '🔧',
    description: '파일 1개 코드 리뷰·수정 제안 (월 50회)',
    tokensInput: 5000, tokensOutput: 3000,
    timesPerMonth: 50,
  },
  {
    useCase: '이메일 요약',
    icon: '📧',
    description: '이메일 10개 요약 정리 (월 200회)',
    tokensInput: 2000, tokensOutput: 500,
    timesPerMonth: 200,
  },
];
