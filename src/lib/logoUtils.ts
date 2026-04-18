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
  moonshot: "aa_moonshot.svg",
  zhipu: "aa_zhipu.svg",
  zai: "aa_zai.svg",
  xiaomi: "aa_xiaomi.svg",
  mistral: "aa_mistral.svg",
  cohere: "aa_cohere.svg",
  // arcee: 로고 파일 미확보 — 추후 aa_arcee.svg 추가 시 활성화
  // arcee: "aa_arcee.svg",
  // Video/Image providers
  klingai: "aa_klingai.svg",
  bytedance: "aa_bytedance.svg",
  pixverse: "aa_pixverse.svg",
  vidu: "aa_vidu.svg",
  runway: "aa_runway.svg",
  luma: "aa_luma.svg",
  pika: "aa_pika.svg",
  skywork: "aa_skywork.svg",
  ltx: "aa_ltx.svg",
  stability: "aa_stability.svg",
  bfl: "aa_bfl.svg",
  ideogram: "aa_ideogram.svg",
  recraft: "aa_recraft.svg",
  fal: "aa_fal.svg",
  stepfun: "aa_stepfun.svg",
  nvidia: "aa_nvidia.svg",
  amazon: "aa_amazon.svg",
  upstage: "aa_upstage.svg",
};

// logoId → full path
export const LOGO_ID_TO_PATH: Record<string, string> = Object.fromEntries(
  Object.entries(LOGO_MAP).map(([k, v]) => [k, `/logos/${v}`])
);

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
  "Arcee AI": "arcee",
  "ByteDance": "bytedance",
  "ByteDance(字节跳动)": "bytedance",
  "KlingAI": "klingai",
  "快手(Kuaishou)": "klingai",
  "快手": "klingai",
  "阿里巴巴(阿里)": "alibaba",
  "Skywork AI(快手)": "skywork",
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
  "NVIDIA": "nvidia",
  "Amazon": "amazon",
  "Upstage": "upstage",
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
