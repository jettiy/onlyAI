export interface CloudProvider {
  id: string;
  name: string;
  url: string;
  description: string;
  freetier: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  badge?: string;
}

export const cloudProviders: CloudProvider[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    url: 'https://openrouter.ai',
    description: '500개 이상의 AI 모델을 하나의 API 키로 통합. GPT·Claude·Gemini·Llama 전부 지원. 가장 유연한 멀티모델 라우터.',
    freetier: '30개 이상 무료 모델 (Llama 3.3 70B, Gemini 2.5 Flash 포함), 유료는 종량제',
    pros: ['가장 많은 모델 수 (500개+)', '하나의 API 키로 모든 모델', '실시간 가격 비교 내장', '무료 모델 다수', '스트리밍·함수 호출 지원'],
    cons: ['중간자 서비스라 약 50~100ms 추가 지연', '최신 모델 반영 약간 느림'],
    bestFor: '다양한 모델을 비교·실험하고 싶은 개발자',
    badge: '추천',
  },
  {
    id: 'groq',
    name: 'Groq',
    url: 'https://groq.com',
    description: '전용 LPU(언어처리장치) 칩으로 업계 최고 추론 속도. Llama 3.3 70B를 초당 800토큰+으로 처리.',
    freetier: '무료 티어 일 6,000회 요청 (속도 제한 있음), 유료 전환 시 무제한',
    pros: ['업계 최고 추론 속도 (초당 800토큰+)', '무료 티어 넉넉함', 'Llama·Gemma·Mixtral 지원', '낮은 레이턴시'],
    cons: ['지원 모델 GPT/Claude 없음', '최신 모델 반영 느림', '고급 기능(파인튜닝 등) 없음'],
    bestFor: '빠른 응답 속도가 필요한 챗봇·실시간 애플리케이션',
  },
  {
    id: 'deepseek-api',
    name: 'DeepSeek API',
    url: 'https://platform.deepseek.com',
    description: 'DeepSeek 공식 API. V3.2($0.27/1M) 최저가 수준, R1 추론 모델($0.55/1M)까지 자체 서버 직접 서비스.',
    freetier: '가입 시 $5 무료 크레딧 (약 1,850만 토큰)',
    pros: ['DeepSeek 모델 업계 최저가', '빠른 속도', 'V3.2·R1 모두 지원', 'OpenAI 호환 API'],
    cons: ['중국 서버 (레이턴시 100~200ms)', 'DeepSeek 모델만 제공', '데이터 프라이버시 우려'],
    bestFor: 'DeepSeek를 가장 저렴하게, 최고 성능으로 쓰고 싶은 경우',
    badge: '가성비',
  },
  {
    id: 'google-aistudio',
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    description: 'Google 공식 Gemini API. Gemini 3.1 Pro·2.5 Flash·Gemma 모두 지원. 1M 컨텍스트 윈도우 독보적.',
    freetier: 'Gemini 2.5 Flash 분당 15회 무료, AI Studio 개인 사용 무료 (RPM 제한)',
    pros: ['1M 컨텍스트 윈도우', 'Google 공식 최신 모델 즉시 반영', '멀티모달 강력 (이미지·영상)', 'Gemma 오픈소스도 지원'],
    cons: ['한국어 이해 품질 약간 아쉬움', 'EU 데이터 규정 이슈', '가격 구간 복잡'],
    bestFor: '긴 문서 처리·멀티모달 작업이 많은 개발자',
  },
  {
    id: 'anthropic',
    name: 'Anthropic API',
    url: 'https://www.anthropic.com/api',
    description: 'Claude 공식 API. Claude Opus 4.6·Sonnet 4.6·Haiku 4.5 모두 지원. 안전성·코딩·긴 문맥에서 최강.',
    freetier: '없음 (유료만), claude.ai 웹은 무료 플랜 있음',
    pros: ['코딩·분석·글쓰기 최고 품질', '200K 컨텍스트', 'Vision 지원', 'Computer Use (화면 제어) 지원'],
    cons: ['무료 API 없음', 'Opus 4.6 입력 $5로 고가', '한국어 품질 GPT 대비 약간 아쉬움'],
    bestFor: '코딩 에이전트·긴 문서 분석·고품질 글쓰기',
  },
  {
    id: 'together',
    name: 'Together AI',
    url: 'https://together.ai',
    description: '오픈소스 모델 전문 클라우드. Llama·Mixtral·Qwen 파인튜닝·배포까지 원스톱 지원.',
    freetier: '가입 시 $5 무료 크레딧',
    pros: ['오픈소스 모델 최다', '파인튜닝 지원 (LoRA)', '저렴한 오픈소스 가격', '배치 처리 지원'],
    cons: ['GPT·Claude 없음', '속도 보통', '프리미엄 기능은 유료'],
    bestFor: '오픈소스 모델 파인튜닝·커스텀 모델 배포가 필요한 팀',
  },
  {
    id: 'minimax-api',
    name: 'MiniMax API',
    url: 'https://platform.minimax.io',
    description: 'M2.7 모델 공식 API. 중국 최고 멀티모달 모델, OpenClaw 기본 연동 지원.',
    freetier: '레퍼럴 가입 시 크레딧, 유료 결제 10% 할인',
    pros: ['M2.7 최고 성능 (OpenRouter 1위 탈환)', '이미지·음성·텍스트 멀티모달', '가격 대비 성능 탁월', 'OpenClaw 연동'],
    cons: ['중국 서버', '한국어 공식 지원 미흡', '커뮤니티 작음'],
    bestFor: 'OpenClaw 연동·멀티모달·비용 효율적 고성능 작업',
    badge: 'NEW',
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    url: 'https://fireworks.ai',
    description: '빠르고 저렴한 오픈소스 모델 호스팅. Groq보다 모델 수 많고 이미지 생성(SDXL·Flux)도 지원.',
    freetier: '가입 시 $1 크레딧',
    pros: ['빠른 추론 속도', '이미지 생성 모델 지원', '저렴한 오픈소스 가격', 'Serverless·On-demand 선택'],
    cons: ['인지도 낮음', 'GPT·Claude 없음', '문서 영어 전용'],
    bestFor: '저렴하고 빠른 Llama/Flux 모델이 필요한 경우',
  },
];
