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
    description: '300개 이상의 AI 모델을 하나의 API로 통합. 가장 많은 모델 지원.',
    freetier: '27개 무료 모델 제공, 유료는 종량제',
    pros: ['가장 많은 모델 수', '가격 투명성', '하나의 API 키로 모든 모델', '무료 모델 있음'],
    cons: ['중간자(프록시) 서비스라 약간의 지연', '월정액 없음'],
    bestFor: '다양한 모델을 비교·실험하고 싶은 개발자',
    badge: '추천',
  },
  {
    id: 'groq',
    name: 'Groq',
    url: 'https://groq.com',
    description: '전용 LPU 칩으로 업계 최고 속도의 추론. 빠른 응답이 필요한 앱에 최적.',
    freetier: '무료 티어 제공 (속도 제한 있음)',
    pros: ['업계 최고 추론 속도', '무료 티어 넉넉함', 'Llama·Mixtral 지원'],
    cons: ['지원 모델 수 적음', '최신 모델 지원 느림'],
    bestFor: '빠른 응답 속도가 필요한 챗봇·실시간 앱',
  },
  {
    id: 'together',
    name: 'Together AI',
    url: 'https://together.ai',
    description: '오픈소스 모델 전문 클라우드. Llama·Mistral 계열을 저렴하게 제공.',
    freetier: '가입 시 $5 무료 크레딧',
    pros: ['오픈소스 모델 전문', '파인튜닝 지원', '저렴한 가격'],
    cons: ['클로즈드 모델(GPT/Claude) 없음', '속도 보통'],
    bestFor: '오픈소스 모델로 파인튜닝하고 싶은 개발자',
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    url: 'https://fireworks.ai',
    description: '빠르고 저렴한 오픈소스 모델 호스팅. Together AI와 유사하지만 더 빠름.',
    freetier: '가입 시 $1 크레딧',
    pros: ['빠른 추론 속도', '저렴한 가격', '이미지 생성 모델도 지원'],
    cons: ['모델 수 적음', '인지도 낮음'],
    bestFor: '저렴하고 빠른 Llama/오픈소스 모델이 필요한 경우',
  },
  {
    id: 'deepseek-api',
    name: 'DeepSeek API',
    url: 'https://platform.deepseek.com',
    description: '중국 DeepSeek의 공식 API. 본사 직접 서비스라 가장 저렴.',
    freetier: '가입 시 $5 무료 크레딧',
    pros: ['DeepSeek 모델 최저가', '빠른 속도', '간단한 설정'],
    cons: ['중국 서버 (레이턴시)', 'DeepSeek 모델만 제공'],
    bestFor: 'DeepSeek 모델을 가장 저렴하게 쓰고 싶은 경우',
    badge: '가성비',
  },
];
