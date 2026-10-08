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
  "gpt-6 astra": ["gpt-6-astra"],
  "gpt-6.1 sol": ["gpt-6-1-sol"],
  "gpt-6 sol": ["gpt-6-sol"],
  "gpt-6 luna": ["gpt-6-luna"],
  "gpt-5.5 pro": ["gpt-5-5"],
  "gpt-5.5 instant": ["gpt-5-5-instant"],
  "gpt-5.4": ["gpt-5-4"],
  "gpt-5.4 mini": ["gpt-5-4-mini"],
  "claude fable 5.1": ["claude-fable-5-1"],
  "claude opus 5.5": ["claude-opus-5-5"],
  "claude sonnet 5.5": ["claude-sonnet-5-5"],
  "claude haiku 5.5": ["claude-haiku-5-5"],
  "claude sonnet 5": ["claude-sonnet-5"],
  "claude mythos 5": ["claude-mythos-5"],
  "claude opus 4.8": ["claude-opus-4-8"],
  "gemini 3.8 flash": ["gemini-3-8-flash"],
  "gemini 3.6 flash": ["gemini-3-6-flash"],
  "gemini 3.5 flash-lite": ["gemini-3-5-flash-lite"],
  "gemini 3.5 flash": ["gemini-3-5-flash"],
  "gemini 3.5 pro": ["gemini-3-5-pro"],
  "gemma 4 (31b)": ["gemma-4-31b"],
  "muse spark 1.3": ["muse-spark-1-3"],
  "llama 4 maverick": ["llama-4-maverick"],
  "llama 4 scout": ["llama-4-scout"],
  "grok 4.7": ["grok-4-7"],
  "grok 4.5": ["grok-4-5"],
  "grok build 0.1": ["grok-build"],
  "minimax m3": ["minimax-m3"],
  "minimax m2.7": ["minimax-m2-7"],
  "deepseek v4.1 flash": ["deepseek-v4-1-flash"],
  "deepseek v4 pro": ["deepseek-v4-pro", "deepseek-v4"],
  "qwen 3.8 max prime": ["qwen-3-8-max-prime"],
  "qwen 3.8 flash": ["qwen-3-8-flash"],
  "qwen 3.8 omni flash": ["qwen-3-8-omni-flash"],
  "qwen 3.7 max": ["qwen-3-7-max"],
  "qwen 3.7 plus": ["qwen-3-7-plus"],
  "qwen 3.6 plus": ["qwen-3-6-plus"],
  "kimi k3": ["kimi-k3"],
  "kimi k2.7 code": ["kimi-k2-7-code"],
  "kimi k2.6": ["kimi-k2-6"],
  "glm-5.3": ["glm-5-3"],
  "glm-5.3 flash": ["glm-5-3-flash"],
  "glm-5.2": ["glm-5-2", "glm-5.2"],
  "glm-5.1": ["glm-5-1", "glm-5.1"],
  "glm-5.1 (mit)": ["glm-5-1"],
  "mimo-v2.6-pro": ["mimo-v2-6-pro"],
  "mimo-v2.6-flash": ["mimo-v2-6-flash"],
  "mimo-v2.5-pro": ["mimo-v2-5-pro"],
  "mistral large 4": ["mistral-large-4"],
  "mistral large 3": ["mistral-large-3"],
  "mistral small 4": ["mistral-small-4"],
  "command a+": ["command-a-plus"],
  "arcee trinity": ["arcee-trinity"],
  "nvidia nemotron 3 ultra": ["nvidia-nemotron-3-ultra"],
  "nvidia nemotron 3.5 lightning": ["nvidia-nemotron-3-5-lightning"],
  "mai-code-1-flash": ["mai-code-1-flash"],
  "mai-thinking-1": ["mai-thinking-1"],
  "solar pro 4": ["solar-pro4"],
  "solar mini 4": ["solar-mini4"],
  "step 5 preview": ["step-5-preview"],
};

let cachedData: AAModel[] | null = null;
let cacheExpiry = 0;
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6시간

/** AA 캐시 상태 조회 (데이터 신선도 위젯용) */
export function getAACacheStatus(): { hasData: boolean; fetchedAt: number | null } {
  return {
    hasData: cachedData !== null,
    fetchedAt: cacheExpiry > 0 ? cacheExpiry - CACHE_TTL : null,
  };
}

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
