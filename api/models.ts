// Vercel Edge Function — OpenRouter Models API proxy
// GET /api/models
// Returns: filtered AI model list with prices from OpenRouter

export const config = {
  runtime: 'edge',
};

const CACHE_DURATION = 3600; // 1 hour

interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;   // per token
    completion: string; // per token
  };
  top_provider?: {
    max_completion_tokens?: number;
  };
  architecture?: {
    modality: string;
    tokenizer: string;
    instruct_type: string | null;
  };
}

// Major AI companies to track
const COMPANY_MAP: Record<string, { id: string; name: string; region: string; flag: string }> = {
  'openai': { id: 'openai', name: 'OpenAI', region: 'us', flag: '🇺🇸' },
  'anthropic': { id: 'anthropic', name: 'Anthropic', region: 'us', flag: '🇺🇸' },
  'google': { id: 'google', name: 'Google', region: 'us', flag: '🇺🇸' },
  'meta-llama': { id: 'meta', name: 'Meta', region: 'us', flag: '🇺🇸' },
  'xai': { id: 'xai', name: 'xAI', region: 'us', flag: '🇺🇸' },
  'mistralai': { id: 'mistral', name: 'Mistral', region: 'other', flag: '🇫🇷' },
  'deepseek': { id: 'deepseek', name: 'DeepSeek', region: 'china', flag: '🇨🇳' },
  'minimax': { id: 'minimax', name: 'MiniMax', region: 'china', flag: '🇨🇳' },
  'alibaba': { id: 'alibaba', name: 'Alibaba', region: 'china', flag: '🇨🇳' },
  'qwen': { id: 'qwen', name: 'Alibaba', region: 'china', flag: '🇨🇳' },
  'moonshotai': { id: 'moonshot', name: 'Moonshot', region: 'china', flag: '🇨🇳' },
  'zhipu': { id: 'zhipu', name: 'Zhipu', region: 'china', flag: '🇨🇳' },
  'xiaomi': { id: 'xiaomi', name: 'Xiaomi', region: 'china', flag: '🇨🇳' },
  'cohere': { id: 'cohere', name: 'Cohere', region: 'other', flag: '🇨🇦' },
};

// Key models to always include (flagship/popular)
const PRIORITY_MODELS = [
  'openai/gpt-5', 'openai/gpt-5-mini', 'openai/gpt-5-nano',
  'openai/o3', 'openai/o4-mini',
  'anthropic/claude-opus-4-6', 'anthropic/claude-sonnet-4-6', 'anthropic/claude-haiku-4-5',
  'google/gemini-3-1-pro', 'google/gemini-2-5-flash', 'google/gemini-2-5-pro',
  'xai/grok-3', 'xai/grok-3-mini',
  'deepseek/deepseek-chat-v3-0324', 'deepseek/deepseek-r1',
  'meta-llama/llama-3.3-70b-instruct', 'meta-llama/llama-4-maverick',
  'mistralai/mistral-large-3', 'mistralai/mistral-small-3.1',
  'minimax/minimax-m1',
  'qwen/qwen3-235b-a22b', 'qwen/qwen3-30b-a3b',
  'xiaomi/mimo-v2-pro',
];

function identifyCompany(modelId: string): { id: string; name: string; region: string; flag: string } | null {
  const prefix = modelId.split('/')[0]?.toLowerCase() ?? '';
  // Direct match
  if (COMPANY_MAP[prefix]) return COMPANY_MAP[prefix];
  // Partial match
  for (const [key, val] of Object.entries(COMPANY_MAP)) {
    if (prefix.includes(key) || key.includes(prefix)) return val;
  }
  return null;
}

function formatContextLength(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)}M`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)}K`;
  return String(bytes);
}

function classifyTier(pricing: { prompt: string; completion: string }, ctxLen: number): string {
  const inputPerM = parseFloat(pricing.prompt) * 1_000_000;
  if (inputPerM >= 3) return 'flagship';
  if (inputPerM >= 1) return 'strong';
  if (inputPerM >= 0.1) return 'efficient';
  return 'local';
}

let cachedResponse: { data: string; timestamp: number } | null = null;

export default async function handler(request: Request) {
  // Check cache
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION * 1000) {
    return new Response(cachedResponse.data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'OpenRouter API error', status: res.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const data = await res.json();
    const allModels: OpenRouterModel[] = data.data ?? [];

    // Filter: only models with pricing and reasonable context
    const priced = allModels.filter(
      (m) => m.pricing && parseFloat(m.pricing.prompt) > 0 && m.context_length >= 4096
    );

    // Score models for ranking
    const scored = priced.map((m) => {
      const inputPerM = parseFloat(m.pricing.prompt) * 1_000_000;
      const outputPerM = parseFloat(m.pricing.completion) * 1_000_000;
      const company = identifyCompany(m.id);
      const isPriority = PRIORITY_MODELS.some((p) => m.id.includes(p.split('/')[1] ?? '') && m.id.startsWith(p.split('/')[0]));

      return {
        id: m.id,
        name: m.name,
        description: m.description?.slice(0, 200) ?? '',
        contextLength: m.context_length,
        contextLabel: formatContextLength(m.context_length),
        tier: classifyTier(m.pricing, m.context_length),
        company,
        inputPricePerM: Math.round(inputPerM * 100) / 100,
        outputPricePerM: Math.round(outputPerM * 100) / 100,
        modality: m.architecture?.modality ?? 'text',
        isPriority,
      };
    });

    // Sort: priority first, then by popularity (input price as proxy)
    scored.sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.inputPricePerM - b.inputPricePerM;
    });

    // Limit to top 150
    const topModels = scored.slice(0, 150);

    // Also prepare price comparison table
    const priceTable = topModels
      .filter((m) => m.company)
      .slice(0, 30)
      .map((m) => ({
        model: m.name.split('/').pop()?.trim() ?? m.name,
        provider: m.company?.name ?? 'Unknown',
        providerId: m.company?.id,
        region: m.company?.region,
        flag: m.company?.flag,
        input: m.inputPricePerM,
        output: m.outputPricePerM,
        context: m.contextLabel,
        tier: m.tier,
      }));

    const response = {
      updatedAt: new Date().toISOString(),
      updatedAtKST: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      totalModels: allModels.length,
      trackedModels: topModels.length,
      models: topModels,
      priceTable,
    };

    const jsonStr = JSON.stringify(response);

    // Cache in memory
    cachedResponse = { data: jsonStr, timestamp: Date.now() };

    return new Response(jsonStr, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS',
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
