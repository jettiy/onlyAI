// 공용 로고 유틸리티 — artificialanalysis.ai 스타일 모노톤 SVG
const LOGO_MAP: Record<string, string> = {
  // LLM providers
  openai: "aa_openai.svg",
  anthropic: "aa_anthropic.svg",
  google: "aa_google_mono.svg",
  meta: "aa_meta.svg",
  xai: "aa_xai.svg",
  deepseek: "aa_deepseek.svg",
  minimax: "aa_minimax.svg",
  alibaba: "aa_alibaba.svg",
  moonshot: "moonshot.png",
  zhipu: "aa_zhipu.svg",
  xiaomi: "aa_xiaomi.svg",
  mistral: "mistral.jpg",
  cohere: "aa_cohere.svg",
  // Video/Image providers
  klingai: "aa_klingai.svg",
  bytedance: "aa_bytedance.svg",
  pixverse: "aa_pixverse.svg",
  vidu: "aa_vidu.svg",
  runway: "aa_runway.svg",
  luma: "aa_luma.svg",
  pika: "pika.png",
  skywork: "aa_skywork.svg",
  ltx: "aa_ltx.svg",
  stability: "stability.png",
  bfl: "aa_bfl.svg",
  ideogram: "aa_ideogram.svg",
  recraft: "recraft.png",
  fal: "aa_fal.svg",
  stepfun: "aa_stepfun.svg",
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
  "ByteDance": "bytedance",
  "ByteDance(字节跳动)": "bytedance",
  "KlingAI": "klingai",
  "快手(Kuaishou)": "klingai",
  "PixVerse": "pixverse",
  "Vidu": "vidu",
  "Runway": "runway",
  "Luma": "luma",
  "Pika Labs": "pika",
  "Pika": "pika",
  "Skywork AI": "skywork",
  "LTX": "ltx",
  "Stability AI": "stability",
  "Black Forest Labs": "bfl",
  "Ideogram": "ideogram",
  "Recraft": "recraft",
  "fal": "fal",
  "StepFun": "stepfun",
};

export const COMPANY_LOGO: Record<string, string> = { ...LOGO_MAP };

export function getLogoUrl(companyId?: string, companyName?: string): string | null {
  if (companyId && COMPANY_LOGO[companyId]) return `/logos/${COMPANY_LOGO[companyId]}`;
  if (companyName) {
    const logoId = NAME_TO_LOGO[companyName];
    if (logoId && LOGO_MAP[logoId]) return `/logos/${LOGO_MAP[logoId]}`;
  }
  return null;
}

export function logoIdToPath(logoId?: string): string | null {
  if (!logoId || !LOGO_MAP[logoId]) return null;
  return `/logos/${LOGO_MAP[logoId]}`;
}
