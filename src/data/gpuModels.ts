// GPU 호환성 데이터베이스
// 출처: Ollama 공식 라이브러리 + toolhalla.ai (2026년 4월 기준)

export interface GpuSpec {
  name: string;
  vram: number;
  tier: 'low' | 'mid' | 'high' | 'ultra';
  note?: string;
}

export interface LocalModel {
  id: string;
  name: string;
  provider: string;
  minVram: number;
  recVram: number;
  minRam: number;
  quant: string;
  size: string;
  desc: string;
  tags: string[];
  ollamaCmd: string;
  ollamaUrl: string;
  isNew?: boolean;
}

export const GPUs: GpuSpec[] = [
  // NVIDIA RTX 50 시리즈
  { name: 'RTX 5090', vram: 32, tier: 'ultra' },
  { name: 'RTX 5080', vram: 16, tier: 'high' },
  { name: 'RTX 5070 Ti', vram: 16, tier: 'high' },
  { name: 'RTX 5070', vram: 12, tier: 'mid' },
  // NVIDIA RTX 40 시리즈
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
  // NVIDIA RTX 30 시리즈
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
  // AMD
  { name: 'RX 7900 XTX', vram: 24, tier: 'ultra' },
  { name: 'RX 7900 XT', vram: 20, tier: 'high' },
  { name: 'RX 7800 XT', vram: 16, tier: 'high' },
  { name: 'RX 7600 XT', vram: 16, tier: 'mid' },
  { name: 'RX 6800 XT', vram: 16, tier: 'high' },
  { name: 'RX 6700 XT', vram: 12, tier: 'mid' },
  // Apple Silicon
  { name: 'M4 Ultra', vram: 64, tier: 'ultra', note: 'Unified Memory' },
  { name: 'M4 Max', vram: 48, tier: 'ultra', note: 'Unified Memory' },
  { name: 'M4 Pro', vram: 24, tier: 'high', note: 'Unified Memory' },
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
];

const OLLAMA_BASE = 'https://ollama.com/library/';

export const LOCAL_MODELS: LocalModel[] = [
  // ─── 초소형 (4GB 이하) ───
  {
    id: 'gemma4-e2b', name: 'Gemma 4 E2B', provider: 'Google',
    minVram: 1, recVram: 3, minRam: 4, quant: 'Q4', size: '~2GB',
    desc: '초경량 에이전트 모델, 온디바이스에서 툴호출 가능',
    tags: ['대화', '요약', '테스트'],
    ollamaCmd: 'ollama pull gemma4:2b', ollamaUrl: `${OLLAMA_BASE}gemma4`, isNew: true,
  },
  {
    id: 'gemma4-e4b', name: 'Gemma 4 E4B', provider: 'Google',
    minVram: 2, recVram: 4, minRam: 4, quant: 'Q4', size: '~3GB',
    desc: '엣지 디바이스 최적, 라즈베리파이 가능',
    tags: ['대화', '요약', '테스트'],
    ollamaCmd: 'ollama pull gemma4:4b', ollamaUrl: `${OLLAMA_BASE}gemma4`, isNew: true,
  },
  {
    id: 'gemma3-4b', name: 'Gemma 3 4B', provider: 'Google',
    minVram: 2, recVram: 3, minRam: 4, quant: 'Q4', size: '~3GB',
    desc: '라즈베리파이도 구동 가능, 128K 컨텍스트',
    tags: ['대화', '요약', '테스트'],
    ollamaCmd: 'ollama pull gemma3:4b', ollamaUrl: `${OLLAMA_BASE}gemma3`,
  },
  {
    id: 'qwen3-0.6b', name: 'Qwen 3 0.6B', provider: 'Alibaba',
    minVram: 1, recVram: 2, minRam: 4, quant: 'Q4', size: '~0.4GB',
    desc: '초경량 테스트용, 한국어 지원',
    tags: ['테스트', '대화'],
    ollamaCmd: 'ollama pull qwen3:0.6b', ollamaUrl: `${OLLAMA_BASE}qwen3`,
  },
  {
    id: 'phi4-mini', name: 'Phi-4 Mini 3.8B', provider: 'Microsoft',
    minVram: 2, recVram: 4, minRam: 4, quant: 'Q4', size: '~2.4GB',
    desc: '작지만 똑똑한 MS 모델, 지시사항 준수 우수',
    tags: ['코딩', '대화'],
    ollamaCmd: 'ollama pull phi4:3.8b', ollamaUrl: `${OLLAMA_BASE}phi4`,
  },
  {
    id: 'llama3.2-3b', name: 'Llama 3.2 3B', provider: 'Meta',
    minVram: 2, recVram: 4, minRam: 4, quant: 'Q4', size: '~2GB',
    desc: 'Meta 경량 오픈소스, 128K 컨텍스트',
    tags: ['대화', '요약'],
    ollamaCmd: 'ollama pull llama3.2:3b', ollamaUrl: `${OLLAMA_BASE}llama3.2`,
  },

  // ─── 소형 (8GB VRAM) ───
  {
    id: 'qwen3-30b-a3b', name: 'Qwen 3 30B-A3B', provider: 'Alibaba',
    minVram: 4, recVram: 6, minRam: 8, quant: 'Q4', size: '~6GB',
    desc: 'MoE 3B 활성, 30B급 품질을 3B 속도로!',
    tags: ['한국어', '코딩', '대화', '요약'],
    ollamaCmd: 'ollama pull qwen3:30b-a3b', ollamaUrl: `${OLLAMA_BASE}qwen3`, isNew: true,
  },
  {
    id: 'qwen3-coder-30b-a3b', name: 'Qwen 3 Coder 30B-A3B', provider: 'Alibaba',
    minVram: 4, recVram: 6, minRam: 8, quant: 'Q4', size: '~6GB',
    desc: 'MoE 코딩 전용, 256K 컨텍스트, 에이전트 워크플로우',
    tags: ['코딩', '대화'],
    ollamaCmd: 'ollama pull qwen3-coder:30b-a3b', ollamaUrl: `${OLLAMA_BASE}qwen3-coder`, isNew: true,
  },
  {
    id: 'llama3.2-vision-11b', name: 'Llama 3.2 Vision 11B', provider: 'Meta',
    minVram: 6, recVram: 8, minRam: 8, quant: 'Q4', size: '~7GB',
    desc: '이미지+텍스트 멀티모달, OCR·차트 분석',
    tags: ['대화', '요약', '테스트'],
    ollamaCmd: 'ollama pull llama3.2-vision:11b', ollamaUrl: `${OLLAMA_BASE}llama3.2-vision`,
  },
  {
    id: 'qwen2.5-coder-7b', name: 'Qwen 2.5 Coder 7B', provider: 'Alibaba',
    minVram: 4, recVram: 6, minRam: 8, quant: 'Q4', size: '~4.5GB',
    desc: '8GB GPU 코딩 최강, 7B급 HumanEval 1위',
    tags: ['코딩', '대화'],
    ollamaCmd: 'ollama pull qwen2.5-coder:7b', ollamaUrl: `${OLLAMA_BASE}qwen2.5-coder`,
  },
  {
    id: 'gemma3-12b', name: 'Gemma 3 12B', provider: 'Google',
    minVram: 7, recVram: 10, minRam: 8, quant: 'Q4', size: '~8GB',
    desc: '멀티모달+텍스트, 128K 컨텍스트',
    tags: ['대화', '요약'],
    ollamaCmd: 'ollama pull gemma3:12b', ollamaUrl: `${OLLAMA_BASE}gemma3`,
  },
  {
    id: 'qwen3-8b', name: 'Qwen 3 8B', provider: 'Alibaba',
    minVram: 5, recVram: 7, minRam: 8, quant: 'Q4', size: '~5GB',
    desc: '한국어+코딩 균형, 하이브리드 추론',
    tags: ['한국어', '코딩', '대화', '요약'],
    ollamaCmd: 'ollama pull qwen3:8b', ollamaUrl: `${OLLAMA_BASE}qwen3`, isNew: true,
  },

  // ─── 중형 (12-16GB VRAM) ───
  {
    id: 'glm-4.7-flash', name: 'GLM-4.7 Flash', provider: 'Zhipu AI',
    minVram: 5, recVram: 8, minRam: 16, quant: 'Q4', size: '~6GB',
    desc: '30B MoE 30B급 최강, 한국어 강점, Apache 2.0',
    tags: ['한국어', '코딩', '대화', '요약', '추론'],
    ollamaCmd: 'ollama pull glm-4.7-flash', ollamaUrl: `${OLLAMA_BASE}glm-4.7-flash`, isNew: true,
  },
  {
    id: 'qwen3-14b', name: 'Qwen 3 14B', provider: 'Alibaba',
    minVram: 8, recVram: 10, minRam: 16, quant: 'Q4', size: '~9GB',
    desc: '2026 최고 올라운더, GPT-4급 성능',
    tags: ['한국어', '코딩', '대화', '요약', '추론'],
    ollamaCmd: 'ollama pull qwen3:14b', ollamaUrl: `${OLLAMA_BASE}qwen3`, isNew: true,
  },
  {
    id: 'deepseek-r1-14b', name: 'DeepSeek R1 14B', provider: 'DeepSeek',
    minVram: 8, recVram: 10, minRam: 16, quant: 'Q4', size: '~9GB',
    desc: '추론 전용, 수학·논리·디버깅 최강',
    tags: ['추론', '수학', '코딩'],
    ollamaCmd: 'ollama pull deepseek-r1:14b', ollamaUrl: `${OLLAMA_BASE}deepseek-r1`,
  },
  {
    id: 'phi4-14b', name: 'Phi-4 14B', provider: 'Microsoft',
    minVram: 7, recVram: 10, minRam: 16, quant: 'Q4', size: '~9GB',
    desc: 'STEM·수학 14B급 최고, 30-70B 상대로도 우수',
    tags: ['수학', '추론', '코딩'],
    ollamaCmd: 'ollama pull phi4:14b', ollamaUrl: `${OLLAMA_BASE}phi4`,
  },
  {
    id: 'llama4-scout-17b', name: 'Llama 4 Scout 17B-16E', provider: 'Meta',
    minVram: 8, recVram: 12, minRam: 16, quant: 'Q4', size: '~11GB',
    desc: 'MoE 16전문가, 512K 컨텍스트 (최장!)',
    tags: ['다국어', '대화', '요약'],
    ollamaCmd: 'ollama pull llama4:scout', ollamaUrl: `${OLLAMA_BASE}llama4`, isNew: true,
  },
  {
    id: 'deepseek-coder-v2-16b', name: 'DeepSeek Coder V2 16B', provider: 'DeepSeek',
    minVram: 8, recVram: 12, minRam: 16, quant: 'Q4', size: '~10GB',
    desc: '12-16GB GPU 코딩 최강, 128K 컨텍스트',
    tags: ['코딩', '대화'],
    ollamaCmd: 'ollama pull deepseek-coder-v2:16b', ollamaUrl: `${OLLAMA_BASE}deepseek-coder-v2`,
  },

  // ─── 대형 (16-24GB VRAM) ───
  {
    id: 'deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'DeepSeek',
    minVram: 16, recVram: 22, minRam: 32, quant: 'Q4', size: '~22GB',
    desc: '685B MoE(37B 활성), GPT-5급 성능, MIT 라이선스',
    tags: ['한국어', '코딩', '대화', '요약', '추론'],
    ollamaCmd: 'ollama pull deepseek-v3.2', ollamaUrl: `${OLLAMA_BASE}deepseek-v3.2`, isNew: true,
  },
  {
    id: 'gemma3-27b', name: 'Gemma 3 27B', provider: 'Google',
    minVram: 12, recVram: 16, minRam: 24, quant: 'Q4', size: '~16GB',
    desc: '24GB GPU 최고 품질, 128K 컨텍스트, 긴 문서 분석',
    tags: ['한국어', '코딩', '대화', '요약', '추론'],
    ollamaCmd: 'ollama pull gemma3:27b', ollamaUrl: `${OLLAMA_BASE}gemma3`,
  },
  {
    id: 'gemma4-26b-moe', name: 'Gemma 4 26B MoE', provider: 'Google',
    minVram: 10, recVram: 16, minRam: 24, quant: 'Q4', size: '~14GB',
    desc: '4B 활성 MoE, 네이티브 함수호출, 에이전트 최적',
    tags: ['코딩', '대화', '추론'],
    ollamaCmd: 'ollama pull gemma4:26b', ollamaUrl: `${OLLAMA_BASE}gemma4`, isNew: true,
  },
  {
    id: 'mistral-small-3.2-24b', name: 'Mistral Small 3.2 24B', provider: 'Mistral',
    minVram: 14, recVram: 16, minRam: 24, quant: 'Q4', size: '~15GB',
    desc: '다국어 강점, 한국어 가능',
    tags: ['다국어', '대화', '요약'],
    ollamaCmd: 'ollama pull mistral-small:24b', ollamaUrl: `${OLLAMA_BASE}mistral-small`,
  },
  {
    id: 'qwen2.5-coder-32b', name: 'Qwen 2.5 Coder 32B', provider: 'Alibaba',
    minVram: 16, recVram: 22, minRam: 32, quant: 'Q4', size: '~20GB',
    desc: '로컬 코딩 최강, HumanEval 92.7%',
    tags: ['코딩', '대화', '요약'],
    ollamaCmd: 'ollama pull qwen2.5-coder:32b', ollamaUrl: `${OLLAMA_BASE}qwen2.5-coder`,
  },
  {
    id: 'deepseek-r1-32b', name: 'DeepSeek R1 32B', provider: 'DeepSeek',
    minVram: 16, recVram: 20, minRam: 32, quant: 'Q4', size: '~20GB',
    desc: 'RTX 4090 추론 최강, LiveCodeBench 72.6%',
    tags: ['추론', '수학', '코딩'],
    ollamaCmd: 'ollama pull deepseek-r1:32b', ollamaUrl: `${OLLAMA_BASE}deepseek-r1`,
  },

  // ─── 초대형 (24GB+ VRAM) ───
  {
    id: 'qwen3-32b', name: 'Qwen 3 32B', provider: 'Alibaba',
    minVram: 18, recVram: 22, minRam: 32, quant: 'Q4', size: '~20GB',
    desc: '24GB GPU에서 구동 가능한 최고 성능',
    tags: ['한국어', '코딩', '대화', '요약', '추론'],
    ollamaCmd: 'ollama pull qwen3:32b', ollamaUrl: `${OLLAMA_BASE}qwen3`, isNew: true,
  },
  {
    id: 'gemma4-31b', name: 'Gemma 4 31B', provider: 'Google',
    minVram: 18, recVram: 22, minRam: 32, quant: 'Q4', size: '~18GB',
    desc: 'Arena AI #3, Apache 2.0 오픈소스',
    tags: ['코딩', '대화', '추론'],
    ollamaCmd: 'ollama pull gemma4:31b', ollamaUrl: `${OLLAMA_BASE}gemma4`, isNew: true,
  },
  {
    id: 'qwen3-70b', name: 'Qwen 3 70B', provider: 'Alibaba',
    minVram: 32, recVram: 40, minRam: 48, quant: 'Q4', size: '~40GB',
    desc: '로컬 최고 성능, RTX 5090/Mac Studio 전용',
    tags: ['한국어', '코딩', '요약', '추론', '대화'],
    ollamaCmd: 'ollama pull qwen3:70b', ollamaUrl: `${OLLAMA_BASE}qwen3`, isNew: true,
  },
  {
    id: 'llama4-maverick-109b', name: 'Llama 4 Maverick 109B', provider: 'Meta',
    minVram: 48, recVram: 64, minRam: 64, quant: 'Q4', size: '~58GB',
    desc: 'Meta 최대 오픈소스, 1M 컨텍스트',
    tags: ['코딩', '대화', '요약', '다국어'],
    ollamaCmd: 'ollama pull llama4:maverick', ollamaUrl: `${OLLAMA_BASE}llama4`, isNew: true,
  },
  {
    id: 'deepseek-r1-70b', name: 'DeepSeek R1 70B', provider: 'DeepSeek',
    minVram: 38, recVram: 44, minRam: 64, quant: 'Q4', size: '~42GB',
    desc: '로컬 추론 한계 돌파, GPT-4o 수준',
    tags: ['추론', '수학', '코딩'],
    ollamaCmd: 'ollama pull deepseek-r1:70b', ollamaUrl: `${OLLAMA_BASE}deepseek-r1`,
  },
];

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

export function searchGpu(query: string): GpuSpec | null {
  const q = query.toLowerCase().trim();
  const exact = GPUs.find(g => g.name.toLowerCase() === q);
  if (exact) return exact;
  return GPUs.find(g => g.name.toLowerCase().includes(q) || q.includes(g.name.toLowerCase())) ?? null;
}

export const VRAM_TIERS = [
  { max: 4, label: '4GB 미만', color: 'text-red-500', desc: '초소형 모델만 가능 (Gemma 3 4B)', icon: '🔴' },
  { max: 8, label: '4~8GB', color: 'text-orange-500', desc: '소형~MoE 모델 가능 (Qwen 3 30B-A3B)', icon: '🟠' },
  { max: 16, label: '8~16GB', color: 'text-yellow-500', desc: '중형 모델 가능 (Qwen 3 14B, Gemma 3 27B)', icon: '🟡' },
  { max: 24, label: '16~24GB', color: 'text-green-500', desc: '대부분 모델 구동 가능 (Qwen 3 32B)', icon: '🟢' },
  { max: Infinity, label: '24GB+', color: 'text-brand-500', desc: '최고 성능 모델 구동 가능 (70B+)', icon: '🔵' },
];
