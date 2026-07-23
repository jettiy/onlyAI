// ── 실시간 데이터 통합 레이어 ──────────────────────────────
// OpenRouter API에서 모델/가격 정보를 실시간으로 가져오고
// 기존 정적 데이터와 병합합니다.
// 일반 사용자도 부드럽게 체감할 수 있도록 fallback + 캐시 구조

interface LiveModelPricing {
  prompt: number;       // $/1M 토큰
  completion: number;   // $/1M 토큰
  inputCacheRead?: number;
  inputCacheWrite?: number;
  webSearch?: number;
}

export interface LiveModel {
  id: string;
  name: string;
  contextLength: number;
  pricing: LiveModelPricing;
  modalities: string;
  createdAt: number;    // unix timestamp
  description: string;
  topProvider: {
    maxCompletionTokens: number | null;
  };
}

// ── 캐싱 ──
const CACHE_KEY = 'onlyai_live_models_v2';
const CACHE_DURATION = 10 * 60 * 1000; // 10분

interface CacheEntry {
  timestamp: number;
  data: LiveModel[];
}

function getFromCache(): LiveModel[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_DURATION) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function saveToCache(data: LiveModel[]) {
  try {
    const entry: CacheEntry = { timestamp: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // 용량 초과 무시
  }
}

// ── 메인 API 호출 ──
let lastFetchTime = 0;
let lastFetchPromise: Promise<LiveModel[]> | null = null;

// OpenRouter API 원시 응답 (가격은 문자열 per-token)
interface OpenRouterPricing {
  prompt?: string;
  completion?: string;
  input_cache_read?: string;
  input_cache_write?: string;
  web_search?: string;
}
interface OpenRouterModel {
  id: string;
  name: string;
  context_length?: number;
  pricing?: OpenRouterPricing;
  architecture?: { modality?: string };
  created?: number;
  description?: string;
  top_provider?: { max_completion_tokens?: number | null };
}

// 원시 응답 → LiveModel 정규화. OpenRouter 가격은 문자열 per-token이므로
// 숫자 $/1M 토큰으로 변환하지 않으면 .toFixed() 호출 시 크래시 + 단위 불일치.
function normalizeModel(raw: OpenRouterModel): LiveModel {
  const p = raw.pricing ?? {};
  return {
    id: raw.id,
    name: raw.name,
    contextLength: raw.context_length ?? 0,
    pricing: {
      prompt: priceToPerMillion(p.prompt ?? '0'),
      completion: priceToPerMillion(p.completion ?? '0'),
      inputCacheRead: p.input_cache_read != null ? priceToPerMillion(p.input_cache_read) : undefined,
      inputCacheWrite: p.input_cache_write != null ? priceToPerMillion(p.input_cache_write) : undefined,
      webSearch: p.web_search != null ? priceToPerMillion(p.web_search) : undefined,
    },
    modalities: raw.architecture?.modality ?? 'TEXT',
    createdAt: raw.created ?? 0,
    description: raw.description ?? '',
    topProvider: { maxCompletionTokens: raw.top_provider?.max_completion_tokens ?? null },
  };
}
export async function fetchLiveModels(): Promise<LiveModel[]> {
  const cached = getFromCache();
  if (cached) return cached;

  // 중복 호출 방지 (1초 이내)
  if (lastFetchPromise && Date.now() - lastFetchTime < 1000) {
    return lastFetchPromise;
  }

  lastFetchTime = Date.now();
  lastFetchPromise = (async () => {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/models', {
        signal: AbortSignal.timeout(10000), // 10초 타임아웃
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: { data: OpenRouterModel[] } = await res.json();
      const normalized = json.data.map(normalizeModel);
      saveToCache(normalized);
      return normalized;
    } catch (err) {
      console.warn('[liveData] OpenRouter API 실패, 캐시 사용:', err);
      // 캐시가 만료됐어도 있으면 fallback으로 사용
      const stale = localStorage.getItem(CACHE_KEY);
      if (stale) {
        try {
          const entry: CacheEntry = JSON.parse(stale);
          if (entry.data.length > 0) return entry.data;
        } catch { /* 무시 */ }
      }
      return []; // 빈 배열 → 호출자가 fallback 처리
    }
  })();

  return lastFetchPromise;
}

// ── 유틸 ──

/** OpenRouter 모델 ID로 모델 찾기 */
export function findLiveModel(liveModels: LiveModel[], openRouterSlug?: string): LiveModel | undefined {
  if (!openRouterSlug) return undefined;
  // 정확한 매칭: "openai/gpt-4.1" → "openai/gpt-4.1"
  const exact = liveModels.find(m => m.id === openRouterSlug);
  if (exact) return exact;
  // 부분 매칭: "openai/gpt-4.1" → "openai/gpt-4.1-20250408"
  const partial = liveModels.find(m => m.id.startsWith(openRouterSlug + '-') || m.id.startsWith(openRouterSlug + '.'));
  if (partial) return partial;
  // 더 느슨한 매칭: 모델명 기준
  const nameMatch = liveModels.find(m => {
    const shortName = openRouterSlug.split('/').pop()?.toLowerCase() ?? '';
    return m.name.toLowerCase().includes(shortName);
  });
  return nameMatch;
}

/** OpenRouter 가격 → $/1M 토큰으로 변환 */
export function priceToPerMillion(price: string): number {
  return parseFloat(price) * 1_000_000;
}

/** 실시간 데이터에 업데이트 시간 표시 */
export function formatLastUpdated(liveModels: LiveModel[]): string {
  if (liveModels.length === 0) return '';
  // 가장 최근 생성된 모델 기준
  const latest = liveModels.reduce((a, b) => a.createdAt > b.createdAt ? a : b);
  const d = new Date(latest.createdAt * 1000);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diff < 1) return '방금 전';
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}

/** 실시간 데이터가 로딩 중인지 확인 */
export function isStaleData(liveModels: LiveModel[] | null): boolean {
  if (!liveModels || liveModels.length === 0) return true;
  return false;
}
