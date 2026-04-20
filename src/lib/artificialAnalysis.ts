/**
 * Artificial Analysis API 연동 유틸
 * https://artificialanalysis.ai/api-reference
 * 
 * 무료 API: 1,000 requests/day
 * - Intelligence Index, Coding Index, Math Index
 * - MMLU-Pro, GPQA, HLE, LiveCodeBench 등 벤치마크
 * - 가격(입력/출력 토큰당), 속도(TTFT, tokens/s), 컨텍스트
 */

const AA_API_URL = "https://artificialanalysis.ai/api/v2/data/llms/models";
const AA_API_KEY = import.meta.env.VITE_AA_API_KEY || "";

export interface AAModel {
  id: string;
  name: string;
  slug: string;
  model_creator: { id: string; name: string; slug: string };
  evaluations: {
    artificial_analysis_intelligence_index: number | null;
    artificial_analysis_coding_index: number | null;
    artificial_analysis_math_index: number | null;
    mmlu_pro: number | null;
    gpqa: number | null;
    hle: number | null;        // HumanEval+
    livecodebench: number | null;
    scicode: number | null;
    math_500: number | null;
    aime: number | null;
    ifbench: number | null;
    tau2: number | null;
  };
  pricing: {
    price_1m_blended_3_to_1: number | null;
    price_1m_input_tokens: number | null;
    price_1m_output_tokens: number | null;
  };
  median_output_tokens_per_second: number | null;
  median_time_to_first_token_seconds: number | null;
  context_window?: number;
  release_date?: string;
}

/** onlyAI 모델명 → AA slug 매핑 */
const MODEL_SLUG_MAP: Record<string, string[]> = {
  "gpt-5.4": ["gpt-5-4"],
  "gpt-5.4 mini": ["gpt-5-4-mini"],
  "gpt-5.4 nano": ["gpt-5-4-nano"],
  "claude opus 4.6": ["claude-opus-4-6", "claude-opus-4-0"],
  "claude sonnet 4.6": ["claude-sonnet-4-6"],
  "claude haiku 4.5": ["claude-haiku-4-5"],
  "gemini 3.1 pro": ["gemini-3-1-pro"],
  "gemini 2.5 flash": ["gemini-2-5-flash"],
  "gemini 2.5 pro": ["gemini-2-5-pro"],
  "grok 4.20": ["grok-4-20", "grok-4"],
  "grok 3": ["grok-3"],
  "glm-5": ["glm-5"],
  "glm-5 turbo": ["glm-5-turbo"],
  "qwen3 235b": ["qwen-3-235b"],
  "deepseek r1": ["deepseek-r1"],
  "deepseek v3": ["deepseek-v3"],
  "mimo v2 pro": ["mimo-v2-pro"],
  "mimo v2 flash": ["mimo-v2-flash"],
};

let cachedData: AAModel[] | null = null;
let cacheExpiry = 0;
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6시간

/** 전체 모델 데이터 fetch (캐시 6시간) */
export async function fetchAAModels(): Promise<AAModel[]> {
  const now = Date.now();
  if (cachedData && now < cacheExpiry) return cachedData;

  if (!AA_API_KEY) {
    console.warn("[AA] API key not set");
    return [];
  }

  try {
    const resp = await fetch(AA_API_URL, {
      headers: {
        "x-api-key": AA_API_KEY,
        "User-Agent": "onlyAI.co.kr/1.0",
      },
    });
    if (!resp.ok) {
      console.error("[AA] API error:", resp.status);
      return cachedData || [];
    }
    const json = await resp.json();
    cachedData = json.data || [];
    cacheExpiry = now + CACHE_TTL;
    return cachedData;
  } catch (e) {
    console.error("[AA] fetch failed:", e);
    return cachedData || [];
  }
}

/** 모델명으로 AA 데이터 찾기 */
export async function getAAData(modelName: string): Promise<AAModel | null> {
  const models = await fetchAAModels();
  const slugs = MODEL_SLUG_MAP[modelName.toLowerCase()] || [modelName.toLowerCase().replace(/\s+/g, "-")];
  
  for (const slug of slugs) {
    const found = models.find(m => m.slug === slug);
    if (found) return found;
  }
  return null;
}

/** onlyAI 표시용 벤치마크 변환 */
export interface AABenchmarks {
  intelligenceIndex: number | null;
  codingIndex: number | null;
  mmluPro: number | null;
  gpqa: number | null;
  speed: number | null;
  source: "Artificial Analysis";
  updatedAt: string;
}

export async function getAABenchmarks(modelName: string): Promise<AABenchmarks> {
  const data = await getAAData(modelName);
  if (!data) {
    return { intelligenceIndex: null, codingIndex: null, mmluPro: null, gpqa: null, speed: null, source: "Artificial Analysis", updatedAt: "" };
  }
  
  return {
    intelligenceIndex: data.evaluations.artificial_analysis_intelligence_index,
    codingIndex: data.evaluations.artificial_analysis_coding_index,
    mmluPro: data.evaluations.mmlu_pro ? Math.round(data.evaluations.mmlu_pro * 100) : null,
    gpqa: data.evaluations.gpqa ? Math.round(data.evaluations.gpqa * 100) : null,
    speed: data.median_output_tokens_per_second ? Math.round(data.median_output_tokens_per_second) : null,
    source: "Artificial Analysis",
    updatedAt: new Date().toISOString().split("T")[0],
  };
}
