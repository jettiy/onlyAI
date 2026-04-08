// 공용 로고 유틸리티 — 국기 대신 기업 로고 사용
const LOGO_MAP: Record<string, string> = {
  openai: "openai.png",
  anthropic: "anthropic.jpg",
  google: "google.png",
  meta: "meta.jpg",
  xai: "xai.png",
  deepseek: "deepseek.png",
  minimax: "minimax.png",
  alibaba: "alibaba.png",
  moonshot: "moonshot.png",
  zhipu: "zhipu.png",
  xiaomi: "xiaomi.png",
  mistral: "mistral.jpg",
  cohere: "cohere.png",
};

// company name → logoId
const NAME_TO_LOGO: Record<string, string> = {
  "OpenAI": "openai",
  "Anthropic": "anthropic",
  "Google": "google",
  "Meta": "meta",
  "xAI": "xai",
  "DeepSeek": "deepseek",
  "MiniMax": "minimax",
  "Alibaba": "alibaba",
  "Moonshot": "moonshot",
  "Zhipu AI": "zhipu",
  "Xiaomi": "xiaomi",
  "Mistral": "mistral",
  "Cohere": "cohere",
  "快手(Kuaishou)": "",
  "生数科技": "",
  "Runway": "",
  "Pika Labs": "",
  "Stability AI": "",
  "智谱AI": "",
};

// companyId → logoId (models.ts companies 배열의 id 기준)
export const COMPANY_LOGO: Record<string, string> = {
  openai: "openai.png",
  anthropic: "anthropic.jpg",
  google: "google.png",
  meta: "meta.jpg",
  xai: "xai.png",
  deepseek: "deepseek.png",
  minimax: "minimax.png",
  alibaba: "alibaba.png",
  moonshot: "moonshot.png",
  zhipu: "zhipu.png",
  xiaomi: "xiaomi.png",
  mistral: "mistral.jpg",
  cohere: "cohere.png",
};

export function getLogoUrl(companyId?: string, companyName?: string): string | null {
  if (companyId && COMPANY_LOGO[companyId]) return `/logos/${COMPANY_LOGO[companyId]}`;
  if (companyName) {
    const logoId = NAME_TO_LOGO[companyName];
    if (logoId && LOGO_MAP[logoId]) return `/logos/${LOGO_MAP[logoId]}`;
  }
  return null;
}

// company logoId (models.ts의 logoId 필드용) → path
export function logoIdToPath(logoId?: string): string | null {
  if (!logoId || !LOGO_MAP[logoId]) return null;
  return `/logos/${LOGO_MAP[logoId]}`;
}
