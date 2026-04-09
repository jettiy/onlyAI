// 공용 회사 로고 컴포넌트 — artificialanalysis.ai 스타일 모노톤 SVG
const LOGO_MAP: Record<string, string> = {
  openai: "aa_openai.svg",
  anthropic: "aa_anthropic.svg",
  google: "aa_google.svg",
  meta: "aa_meta.svg",
  xai: "aa_xai.svg",
  deepseek: "aa_deepseek.svg",
  minimax: "aa_minimax.svg",
  alibaba: "aa_alibaba.svg",
  moonshot: "moonshot.png",
  zhipu: "aa_zhipu.svg",
  xiaomi: "aa_xiaomi.svg",
  mistral: "mistral_new.png",
  cohere: "aa_cohere.svg",
};

const COMPANY_LOGO: Record<string, string> = {
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
};

export function CompanyLogo({ company, size = 18, className = "" }: { company: string; size?: number; className?: string }) {
  const logoId = COMPANY_LOGO[company];
  if (!logoId) return null;
  const src = LOGO_MAP[logoId];
  if (!src) return null;
  return (
    <img
      src={`/logos/${src}`}
      alt={company}
      className={`object-contain inline-block ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}

export { LOGO_MAP, COMPANY_LOGO };
