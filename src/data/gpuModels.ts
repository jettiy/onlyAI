// GPU 호환성 데이터베이스
// 출처: 각 모델 공식 요구사양 (2026년 4월 기준)

export interface GpuSpec {
  name: string;           // GPU 이름
  vram: number;           // VRAM (GB)
  tensorCores?: number;   // 텐서코어 수 (대략)
  tier: 'low' | 'mid' | 'high' | 'ultra';  // 성급
  note?: string;          // 비고
}

export interface LocalModel {
  id: string;
  name: string;
  provider: string;
  minVram: number;       // 최소 VRAM (GB)
  recVram: number;       // 권장 VRAM (GB)
  minRam: number;        // 최소 시스템 RAM (GB)
  quant: string;         // 권장 양자화
  size: string;          // 모델 크기 (대략)
  desc: string;          // 한 줄 설명
  tags: string[];        // 용도 태그
}

// 주요 GPU 스펙
export const GPUs: GpuSpec[] = [
  // NVIDIA RTX 4090 대역
  { name: 'RTX 5090', vram: 32, tier: 'ultra' },
  { name: 'RTX 4090', vram: 24, tier: 'ultra' },
  { name: 'RTX 4080 Super', vram: 16, tier: 'high' },
  { name: 'RTX 4080', vram: 16, tier: 'high' },
  { name: 'RTX 4070 Ti Super', vram: 16, tier: 'high' },
  { name: 'RTX 4070 Ti', vram: 12, tier: 'high' },
  { name: 'RTX 4070 Super', vram: 12, tier: 'high' },
  { name: 'RTX 4070', vram: 12, tier: 'mid' },
  { name: 'RTX 4060 Ti 16GB', vram: 16, tier: 'mid' },
  { name: 'RTX 4060 Ti', vram: 8, tier: 'mid' },
  { name: 'RTX 4060', vram: 8, tier: 'mid' },
  // RTX 3090 대역
  { name: 'RTX 3090 Ti', vram: 24, tier: 'ultra' },
  { name: 'RTX 3090', vram: 24, tier: 'ultra' },
  { name: 'RTX 3080 Ti', vram: 12, tier: 'high' },
  { name: 'RTX 3080 12GB', vram: 12, tier: 'high' },
  { name: 'RTX 3080 10GB', vram: 10, tier: 'mid' },
  { name: 'RTX 3070 Ti', vram: 8, tier: 'mid' },
  { name: 'RTX 3070', vram: 8, tier: 'mid' },
  { name: 'RTX 3060 12GB', vram: 12, tier: 'mid' },
  { name: 'RTX 3060', vram: 8, tier: 'low' },
  // 구형 RTX
  { name: 'RTX 2080 Ti', vram: 11, tier: 'mid' },
  { name: 'RTX 2080', vram: 8, tier: 'mid' },
  { name: 'RTX 2070 Super', vram: 8, tier: 'mid' },
  { name: 'RTX 2070', vram: 8, tier: 'mid' },
  { name: 'RTX 2060 Super', vram: 8, tier: 'mid' },
  { name: 'RTX 2060', vram: 6, tier: 'low' },
  // AMD
  { name: 'RX 7900 XTX', vram: 24, tier: 'ultra' },
  { name: 'RX 7900 XT', vram: 20, tier: 'high' },
  { name: 'RX 7800 XT', vram: 16, tier: 'high' },
  { name: 'RX 7600 XT', vram: 16, tier: 'mid' },
  { name: 'RX 6800 XT', vram: 16, tier: 'high' },
  { name: 'RX 6800', vram: 16, tier: 'mid' },
  { name: 'RX 6700 XT', vram: 12, tier: 'mid' },
  // Apple Silicon
  { name: 'M4 Ultra', vram: 64, tier: 'ultra', note: 'Unified Memory' },
  { name: 'M4 Max', vram: 48, tier: 'ultra', note: 'Unified Memory' },
  { name: 'M4 Pro', vram: 24, tier: 'high', note: 'Unified Memory' },
  { name: 'M3 Ultra', vram: 48, tier: 'ultra', note: 'Unified Memory' },
  { name: 'M3 Max', vram: 36, tier: 'ultra', note: 'Unified Memory' },
  { name: 'M3 Pro', vram: 18, tier: 'high', note: 'Unified Memory' },
  { name: 'M2 Ultra', vram: 48, tier: 'ultra', note: 'Unified Memory' },
  { name: 'M2 Max', vram: 32, tier: 'ultra', note: 'Unified Memory' },
  { name: 'M2 Pro', vram: 16, tier: 'high', note: 'Unified Memory' },
  // 인텔
  { name: 'Arc B580', vram: 12, tier: 'mid' },
  { name: 'Arc A770', vram: 16, tier: 'mid' },
  // 통합그래픽
  { name: '통합그래픽 (Intel UHD)', vram: 2, tier: 'low', note: 'RAM 공유' },
  { name: '통합그래픽 (AMD Radeon)', vram: 2, tier: 'low', note: 'RAM 공유' },
  { name: 'Apple M1/M2/M3 기본', vram: 8, tier: 'low', note: 'Unified Memory' },
];

// 로컬에서 돌릴 수 있는 주요 모델
export const LOCAL_MODELS: LocalModel[] = [
  // 초소형 (4GB 이상)
  { id: 'qwen2.5-0.5b', name: 'Qwen 2.5 0.5B', provider: 'Alibaba', minVram: 1, recVram: 2, minRam: 4, quant: 'Q4', size: '~0.4GB', desc: '초경량 테스트용', tags: ['테스트'] },
  { id: 'tinyllama-1.1b', name: 'TinyLlama 1.1B', provider: 'TinyLlama', minVram: 1, recVram: 2, minRam: 4, quant: 'Q4', size: '~0.7GB', desc: '가벼운 대화용', tags: ['대화'] },
  { id: 'phi-3-mini', name: 'Phi-3 Mini 3.8B', provider: 'Microsoft', minVram: 3, recVram: 4, minRam: 8, quant: 'Q4', size: '~2.4GB', desc: '작지만 똑똑한 MS 모델', tags: ['코딩', '대화'] },
  { id: 'gemma-2-2b', name: 'Gemma 2 2B', provider: 'Google', minVram: 2, recVram: 4, minRam: 8, quant: 'Q4', size: '~1.5GB', desc: 'Google 초소형 모델', tags: ['대화', '요약'] },

  // 소형 (8GB VRAM)
  { id: 'llama-3.2-3b', name: 'Llama 3.2 3B', provider: 'Meta', minVram: 3, recVram: 6, minRam: 8, quant: 'Q4', size: '~2GB', desc: 'Meta 경량 오픈소스', tags: ['대화', '요약'] },
  { id: 'qwen2.5-7b', name: 'Qwen 2.5 7B', provider: 'Alibaba', minVram: 5, recVram: 8, minRam: 16, quant: 'Q4', size: '~4.5GB', desc: '중국어 최강 오픈소스', tags: ['한국어', '코딩', '대화'] },
  { id: 'mistral-7b', name: 'Mistral 7B v0.3', provider: 'Mistral', minVram: 5, recVram: 8, minRam: 16, quant: 'Q4', size: '~4.5GB', desc: '프랑스 오픈소스 대표', tags: ['코딩', '대화', '요약'] },
  { id: 'gemma-2-9b', name: 'Gemma 2 9B', provider: 'Google', minVram: 6, recVram: 8, minRam: 16, quant: 'Q4', size: '~6GB', desc: 'Google 소형 최고 성능', tags: ['한국어', '코딩', '대화'] },
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', provider: 'Meta', minVram: 5, recVram: 8, minRam: 16, quant: 'Q4', size: '~5GB', desc: 'Meta 8B 베이스라인', tags: ['코딩', '대화', '요약'] },

  // 중형 (12-16GB VRAM)
  { id: 'qwen2.5-14b', name: 'Qwen 2.5 14B', provider: 'Alibaba', minVram: 9, recVram: 12, minRam: 16, quant: 'Q4', size: '~9GB', desc: '한국어·중국어 강자', tags: ['한국어', '코딩', '요약'] },
  { id: 'llama-3.1-13b', name: 'Llama 3.1 13B', provider: 'Meta', minVram: 8, recVram: 12, minRam: 16, quant: 'Q4', size: '~8GB', desc: 'Meta 중형 오픈소스', tags: ['코딩', '대화'] },
  { id: 'qwen2.5-32b-q3', name: 'Qwen 2.5 32B (Q3)', provider: 'Alibaba', minVram: 12, recVram: 16, minRam: 24, quant: 'Q3', size: '~14GB', desc: '압축해서 대형급 성능', tags: ['한국어', '코딩', '요약'] },
  { id: 'deepseek-r1-distill-qwen-14b', name: 'DeepSeek R1 14B', provider: 'DeepSeek', minVram: 9, recVram: 12, minRam: 16, quant: 'Q4', size: '~9GB', desc: '추론 특화 증류 모델', tags: ['추론', '수학', '코딩'] },

  // 대형 (16-24GB VRAM)
  { id: 'qwen2.5-32b', name: 'Qwen 2.5 32B', provider: 'Alibaba', minVram: 18, recVram: 24, minRam: 32, quant: 'Q4', size: '~20GB', desc: '로컬 한국어 최고 수준', tags: ['한국어', '코딩', '요약', '추론'] },
  { id: 'llama-3.3-70b-q2', name: 'Llama 3.3 70B (Q2)', provider: 'Meta', minVram: 20, recVram: 24, minRam: 32, quant: 'Q2', size: '~22GB', desc: '극한 압축 70B', tags: ['코딩', '대화', '요약'] },
  { id: 'deepseek-r1-distill-qwen-32b', name: 'DeepSeek R1 32B', provider: 'DeepSeek', minVram: 18, recVram: 24, minRam: 32, quant: 'Q4', size: '~20GB', desc: '추론 특화 32B', tags: ['추론', '수학', '코딩'] },
  { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'Mistral', minVram: 24, recVram: 28, minRam: 32, quant: 'Q4', size: '~26GB', desc: 'MoE 아키텍처 (전문가 혼합)', tags: ['코딩', '대화', '다국어'] },

  // 초대형 (24GB+ VRAM)
  { id: 'qwen2.5-72b-q3', name: 'Qwen 2.5 72B (Q3)', provider: 'Alibaba', minVram: 28, recVram: 32, minRam: 48, quant: 'Q3', size: '~30GB', desc: '로컬 최고 한국어 성능', tags: ['한국어', '코딩', '요약', '추론'] },
  { id: 'llama-3.3-70b-q4', name: 'Llama 3.3 70B (Q4)', provider: 'Meta', minVram: 38, recVram: 48, minRam: 64, quant: 'Q4', size: '~42GB', desc: 'Meta 최고 오픈소스', tags: ['코딩', '대화', '요약'] },
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B', provider: 'DeepSeek', minVram: 38, recVram: 48, minRam: 64, quant: 'Q4', size: '~42GB', desc: '로컬 추론 최강', tags: ['추론', '수학', '코딩'] },
  { id: 'command-r-35b', name: 'Command R 35B', provider: 'Cohere', minVram: 22, recVram: 28, minRam: 32, quant: 'Q4', size: '~20GB', desc: 'RAG 특화 모델', tags: ['검색', '요약', '대화'] },
];

// PC 사양에 맞는 모델 찾기
export function findCompatibleModels(vramGb: number, ramGb: number): {
  canRun: LocalModel[];
  recommended: LocalModel[];
  cannotRun: LocalModel[];
} {
  const canRun = LOCAL_MODELS.filter(m => vramGb >= m.minVram && ramGb >= m.minRam);
  const recommended = LOCAL_MODELS.filter(m => vramGb >= m.recVram && ramGb >= m.minRam);
  const cannotRun = LOCAL_MODELS.filter(m => vramGb < m.minVram || ramGb < m.minRam);
  return { canRun, recommended, cannotRun };
}

// GPU 검색
export function searchGpu(query: string): GpuSpec | null {
  const q = query.toLowerCase().trim();
  // 정확 매칭
  const exact = GPUs.find(g => g.name.toLowerCase() === q);
  if (exact) return exact;
  // 부분 매칭
  return GPUs.find(g => g.name.toLowerCase().includes(q) || q.includes(g.name.toLowerCase())) ?? null;
}

// VRAM 티어 설명
export const VRAM_TIERS = [
  { max: 4, label: '4GB 미만', color: 'text-red-500', desc: '초소형 모델만 가능 (0.5~2B)', icon: '🔴' },
  { max: 8, label: '4~8GB', color: 'text-orange-500', desc: '소형 모델 구동 가능 (3~8B)', icon: '🟠' },
  { max: 16, label: '8~16GB', color: 'text-yellow-500', desc: '중형 모델까지 가능 (7~14B)', icon: '🟡' },
  { max: 24, label: '16~24GB', color: 'text-green-500', desc: '대부분 모델 구동 가능 (32B)', icon: '🟢' },
  { max: Infinity, label: '24GB+', color: 'text-blue-500', desc: '최고 성능 모델 구동 가능 (70B+)', icon: '🔵' },
];
