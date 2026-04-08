// 공용 회사 로고 컴포넌트
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
      className={`rounded-sm object-contain inline-block ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}

export { LOGO_MAP, COMPANY_LOGO };
