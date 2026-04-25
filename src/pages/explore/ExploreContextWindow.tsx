import { useState } from "react";
import { logoIdToPath } from "../../lib/logoUtils";
import { ClipboardList, Lightbulb } from "lucide-react";

interface ContextModel {
  name: string;
  company: string;
  logoId?: string;
  tokens: number;
  color: string;
  isNew?: boolean;
  sourceUrl: string;
}

const MODELS: ContextModel[] = [
  { name: "GPT-5.4", company: "OpenAI", logoId: "openai", tokens: 1000000, color: "#10b981", isNew: true, sourceUrl: "https://openai.com/index/introducing-gpt-5-4/" },
  { name: "GPT-5.4 mini", company: "OpenAI", logoId: "openai", tokens: 1000000, color: "#34d399", sourceUrl: "https://openai.com/index/introducing-gpt-5-4/" },
  { name: "Claude Opus 4.6", company: "Anthropic", logoId: "anthropic", tokens: 200000, color: "#f59e0b", sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/models" },
  { name: "Claude Sonnet 4.6", company: "Anthropic", logoId: "anthropic", tokens: 200000, color: "#fbbf24", sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/models" },
  { name: "Gemini 3.1 Pro", company: "Google", logoId: "google", tokens: 1048576, color: "#3b82f6", isNew: true, sourceUrl: "https://ai.google.dev/gemini-api/docs/models" },
  { name: "Gemini 2.5 Flash", company: "Google", logoId: "google", tokens: 1048576, color: "#60a5fa", sourceUrl: "https://ai.google.dev/gemini-api/docs/models" },
  { name: "DeepSeek V3.2", company: "DeepSeek", logoId: "deepseek", tokens: 128000, color: "#818cf8", isNew: true, sourceUrl: "https://api-docs.deepseek.com/" },
  { name: "Qwen3 235B", company: "Alibaba", logoId: "alibaba", tokens: 128000, color: "#f97316", sourceUrl: "https://qwen.readthedocs.io/en/latest/" },
  { name: "MiMo V2 Pro", company: "Xiaomi", logoId: "xiaomi", tokens: 1000000, color: "#ec4899", isNew: true, sourceUrl: "https://mimo.xiaomi.com/mimo-v2-pro" },
  { name: "GLM-5", company: "Zhipu AI", logoId: "zhipu", tokens: 200000, color: "#8b5cf6", sourceUrl: "https://glm-5.org/" },
  { name: "GLM-5.1", company: "Zhipu AI", logoId: "zhipu", tokens: 200000, color: "#a78bfa", isNew: true, sourceUrl: "https://glm-5.org/" },
  { name: "Kimi K2.5", company: "Moonshot", logoId: "moonshot", tokens: 262144, color: "#14b8a6", isNew: true, sourceUrl: "https://kimi.moonshot.cn/" },
  { name: "MiniMax M2.7", company: "MiniMax", logoId: "minimax", tokens: 128000, color: "#7c3aed", isNew: true, sourceUrl: "https://www.minimaxi.com/" },
  { name: "Nemotron 3 Super", company: "NVIDIA", logoId: "nvidia", tokens: 128000, color: "#06b6d4", isNew: true, sourceUrl: "https://build.nvidia.com/" },
];

const REAL_WORLD: { label: string; iconName?: string; tokens: number }[] = [
  { label: "📱 카톡 메시지 1개", tokens: 50 },
  { label: "📄 A4 페이지 1장", tokens: 2000 },
  { label: "📰 뉴스 기사 1편", tokens: 5000 },
  { label: "📖 소설 1장", tokens: 20000 },
  { label: "📚 대학 전공책 1권", tokens: 100000 },
  { label: "소설책 1권 (해리포터)", iconName: "clipboard", tokens: 270000 },
  { label: "📚 소설 3권 세트", tokens: 800000 },
];

function formatTokens(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

function tokensToText(tokens: number): string {
  const chars = tokens * 2.8; // avg Korean chars per token
  if (chars >= 1000000) return `약 ${Math.round(chars / 10000).toLocaleString()}만 글자`;
  if (chars >= 1000) return `약 ${Math.round(chars).toLocaleString()} 글자`;
  return `약 ${Math.round(chars)} 글자`;
}

function CompanyLogo({ logoId, name, size = 4 }: { logoId?: string; name: string; size?: number }) {
  const src = logoIdToPath(logoId);
  if (!src) return <span className={`text-${size < 4 ? 'xs' : 'base'}`}>{name[0]}</span>;
  return <img src={src} alt={name} className="w-4 h-4 rounded-sm object-contain" loading="lazy" />;
}

export default function ExploreContextWindow() {
  const [selectedModel, setSelectedModel] = useState<string>("gemini-pro");

  const sorted = [...MODELS].sort((a, b) => b.tokens - a.tokens);
  const maxTokens = sorted[0].tokens;
  const active = MODELS.find(m => m.name === selectedModel) || MODELS[0];

  // How many of each real-world item fits
  const fits = REAL_WORLD.map(item => ({
    ...item,
    count: Math.floor(active.tokens / item.tokens),
    percent: Math.min((item.tokens / active.tokens) * 100, 100),
    width: Math.min((item.tokens / active.tokens) * 100, 100),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">📏 컨텍스트 윈도우 시각화</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          컨텍스트 윈도우가 실제로 얼마나 많은 텍스트인지 직관적으로 확인해보세요.
        </p>
      </div>

      {/* Model selector */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">모델 선택</h3>
        <div className="flex flex-wrap gap-2">
          {sorted.map(m => (
            <button
              key={m.name}
              onClick={() => setSelectedModel(m.name)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedModel === m.name
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <CompanyLogo logoId={m.logoId} name={m.company} /> {m.name} ({formatTokens(m.tokens)})
            </button>
          ))}
        </div>
      </div>

      {/* Main visualization */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              <CompanyLogo logoId={active.logoId} name={active.company} size={5} /> {active.name}
            </h2>
            <p className="text-xs text-gray-400">{active.company} · {formatTokens(active.tokens)} 토큰 · {tokensToText(active.tokens)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">
              {formatTokens(active.tokens)}
            </div>
            <div className="text-[10px] text-gray-400">tokens</div>
          </div>
        </div>

        {/* Visual bar representing full context */}
        <div className="relative h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-1">
          {/* Stacked items */}
          {(() => {
            let used = 0;
            return fits.filter(f => f.count > 0).map((item, idx) => {
              const width = Math.min(item.width, 100 - used);
              if (width <= 0) return null;
              used += width;
              const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#14b8a6", "#6366f1"];
              return (
                <div
                  key={item.label}
                  className="absolute top-0 h-full flex items-center justify-center transition-all duration-500"
                  style={{ left: `${used - width}%`, width: `${width}%`, backgroundColor: colors[idx % colors.length] + "40" }}
                >
                  <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 truncate px-1">{item.label} ×{item.count}</span>
                </div>
              );
            });
          })()}
        </div>
        <div className="flex justify-between text-[9px] text-gray-400">
          <span>0 토큰</span>
          <span>{formatTokens(active.tokens)} 토큰</span>
        </div>
      </div>

      {/* Real-world equivalents */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">이 컨텍스트에는 얼마나 들어갈까?</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {fits.map(item => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.iconName === "clipboard" ? <><ClipboardList size={14} className="inline mr-0.5" />{item.label}</> : item.label}</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {item.count >= 1000 ? `${(item.count / 1000).toFixed(0)}K` : item.count}개
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-violet-500 transition-all duration-500"
                  style={{ width: `${Math.min(item.width, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {formatTokens(item.tokens)} 토큰 · {active.tokens / item.tokens >= 1 ? "전체 수용 가능" : `${((item.tokens / active.tokens) * 100).toFixed(0)}% 차지`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* All models comparison */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">전체 모델 컨텍스트 비교</h3>
        <div className="space-y-3">
          {sorted.map(m => {
            const pct = (m.tokens / maxTokens) * 100;
            const isActive = m.name === selectedModel;
            return (
              <div key={m.name} className={`flex items-center gap-3 ${isActive ? "bg-brand-50 dark:bg-brand-950/20 -mx-2 px-2 py-1 rounded-lg" : ""}`}>
                <div className="w-28 shrink-0">
                  <div className="flex items-center gap-1">
                    <CompanyLogo logoId={m.logoId} name={m.company} />
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{m.name}</span>
                    {m.isNew && <span className="text-[8px] font-bold text-red-500">NEW</span>}
                  </div>
                </div>
                <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: m.color }}
                  />
                </div>
                <div className="w-24 text-right shrink-0">
                  <span className="text-xs font-bold text-gray-900 dark:text-white font-mono">{formatTokens(m.tokens)}</span>
                  <span className="text-[9px] text-gray-400 ml-1">{tokensToText(m.tokens)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fun facts */}
      <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 rounded-xl px-4 py-3 space-y-1.5">
        <p className="text-xs font-semibold text-brand-800 dark:text-brand-300"><Lightbulb size={14} className="inline mr-1" /> 재미있는 사실</p>
        <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">
          • Gemini 3.1 Pro의 1M 컨텍스트는 소설 약 4권 분량이에요. 영화 시나리오 10편도 충분히 담을 수 있어요.
        </p>
        <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">
          • Claude의 200K 컨텍스트는 소설 약 1.3권. 한 번의 프롬프트에 전체 소설을 넣고 질문할 수 있어요.
        </p>
        <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">
          • 128K는 대학 전공책 1권 + 여유. 소설책 반 권 정도로 이해하기 쉬운 크기예요.
        </p>
      </div>

      {/* Sources */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-800 space-y-2">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300"><ClipboardList size={14} className="inline mr-1" /> 데이터 출처</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
          컨텍스트 윈도우 데이터는 각 AI 회사의 공식 문서를 기준으로 합니다.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {MODELS.map(m => (
            <a key={m.name} href={m.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-brand-500 hover:underline truncate block">
              {m.name} → 공식 문서
            </a>
          ))}
        </div>
        <p className="text-[10px] text-gray-400">마지막 업데이트: 2026-04-11</p>
      </div>
    </div>
  );
}
