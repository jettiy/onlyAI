import { useState, useCallback } from "react";
import { logoIdToPath } from "../../lib/logoUtils";
import { Lightbulb } from "lucide-react";

// Approximate token counts per model family (characters per token ratio)
const MODEL_TOKENIZERS = [
  { id: "gpt-5.4", name: "GPT-5.4", company: "OpenAI", logoId: "openai", charPerToken: 2.8, encoding: "o200k_base", isNew: true },
  { id: "gpt-5.4-mini", name: "GPT-5.4 mini", company: "OpenAI", logoId: "openai", charPerToken: 2.8, encoding: "o200k_base" },
  { id: "gpt-5.4-nano", name: "GPT-5.4 nano", company: "OpenAI", logoId: "openai", charPerToken: 2.9, encoding: "o200k_base" },
  { id: "claude-opus", name: "Claude Opus 4.6", company: "Anthropic", logoId: "anthropic", charPerToken: 3.0, encoding: "claude-3" },
  { id: "claude-sonnet", name: "Claude Sonnet 4.6", company: "Anthropic", logoId: "anthropic", charPerToken: 3.0, encoding: "claude-3" },
  { id: "gemini-pro", name: "Gemini 3.1 Pro", company: "Google", logoId: "google", charPerToken: 2.6, encoding: "gemini" },
  { id: "gemini-flash", name: "Gemini 2.5 Flash", company: "Google", logoId: "google", charPerToken: 2.6, encoding: "gemini" },
  { id: "grok-3", name: "Grok 3", company: "xAI", logoId: "xai", charPerToken: 2.8, encoding: "tiktoken-v2" },
  { id: "deepseek-v3.2", name: "DeepSeek V3.2", company: "DeepSeek", logoId: "deepseek", charPerToken: 2.2, encoding: "deepseek", isNew: true },
  { id: "qwen3", name: "Qwen3 235B", company: "Alibaba", logoId: "alibaba", charPerToken: 1.8, encoding: "qwen" },
  { id: "glm5", name: "GLM-5", company: "Zhipu AI", logoId: "zhipu", charPerToken: 2.0, encoding: "glm" },
  { id: "mimo", name: "MiMo V2 Pro", company: "Xiaomi", logoId: "xiaomi", charPerToken: 2.1, encoding: "mimo" },
  { id: "minimax", name: "MiniMax M2.7", company: "MiniMax", logoId: "minimax", charPerToken: 2.0, encoding: "minimax" },
  { id: "kimi", name: "Kimi K2.5", company: "Moonshot", logoId: "moonshot", charPerToken: 2.0, encoding: "kimi" },
];

const SAMPLE_TEXTS = [
  { label: "한국어 뉴스 기사", text: "삼성전자가 차세대 AI 반도체 기술인 HBM4E(하이밴드메모리 4 확장) 개발을 완료하고, 2026년 하반기부터 양산에 들어간다고 7일 밝혔다. HBM4E는 기존 HBM3E 대역폭을 2배 이상 향상시켜, 엔비디아 차세대 AI 가속기 블랙웰 울트라에 탑재될 전망이다. 업계 관계자는 \"삼성의 HBM4E가 성공하면 글로벌 AI 반도체 시장의 판도가 바뀔 수 있다\"고 평가했다." },
  { label: "영어 기술 문서", text: "Large language models (LLMs) have fundamentally transformed the landscape of artificial intelligence. The transformer architecture, introduced in the seminal paper 'Attention Is All You Need', has enabled models with billions of parameters to process and generate human-like text with remarkable fluency and coherence. Recent advances in reasoning capabilities, tool use, and multimodal understanding have further expanded their practical applications." },
  { label: "중국어 경제 보도", text: "中国人民银行4月7日发布数据显示，2026年第一季度国内生产总值同比增长5.2%，高于市场预期的5.0%。其中，人工智能产业增速达到28.7%，成为拉动经济增长的新引擎。国家统计局表示，AI相关产业投资同比增长45.3%，其中大模型研发投入占比超过60%。" },
  { label: "일본어 문화 기사", text: "東京株式市場でAI関連企業の株価が急上昇している。ソフトバンクグループは自社開発の日本語特化型AIモデル「Sakura-5」を公開し、日语理解能力で世界最高水準を達成したと発表した。このモデルは日本の文学作品から法律文書まで幅広い分野で高い性能を示している。" },
  { label: "코드 스니펫", text: "import { useState, useEffect, useCallback } from 'react';\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value);\n  \n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  \n  return debounced;\n}" },
  { label: "혼합 다국어", text: "Hello! 안녕하세요! 今日はいい天気ですね。The rapid advancement of AI technology has created unprecedented opportunities for global collaboration. 韩国和中国在AI领域的合作正在加速推进。この分野では日米韓中が重要な役割を果たしている。" },
];

function estimateTokens(text: string, charPerToken: number): number {
  return Math.ceil(text.length / charPerToken);
}

function estimateCost(tokens: number, inputPrice: number): string {
  const cost = (tokens / 1_000_000) * inputPrice;
  return cost < 0.01 ? `<$0.01` : `$${cost.toFixed(3)}`;
}

function CompanyLogo({ logoId, name }: { logoId?: string; name: string }) {
  const src = logoIdToPath(logoId);
  if (!src) return <span className="text-xs">{name[0]}</span>;
  return <img src={src} alt={name} className="w-4 h-4 rounded-sm object-contain" loading="lazy" />;
}

export default function ExploreTokenizer() {
  const [text, setText] = useState(SAMPLE_TEXTS[0].text);
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "gpt-5.4", "claude-opus", "gemini-pro", "deepseek-v3.2", "qwen3", "glm5"
  ]);

  const toggleModel = (id: string) => {
    setSelectedModels(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const results = MODEL_TOKENIZERS
    .filter(m => selectedModels.includes(m.id))
    .map(m => ({
      ...m,
      tokens: estimateTokens(text, m.charPerToken),
    }))
    .sort((a, b) => a.tokens - b.tokens);

  const minTokens = results.length > 0 ? results[0].tokens : 0;
  const maxTokens = results.length > 0 ? results[results.length - 1].tokens : 1;

  const charCount = text.length;
  const lineCount = text.split("\n").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🔤 토큰화이저 체험기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          같은 텍스트가 각 AI 모델에서 몇 토큰으로 처리되는지 비교해보세요. 미국·중국 최신 모델 위주.
        </p>
      </div>

      {/* Text input */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">텍스트 입력</label>
          <div className="flex gap-2 text-xs text-gray-400">
            <span>{charCount} 글자</span>
            <span>·</span>
            <span>{lineCount} 줄</span>
          </div>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
          placeholder="비교할 텍스트를 입력하세요..."
        />
        <div className="flex flex-wrap gap-2">
          {SAMPLE_TEXTS.map(s => (
            <button
              key={s.label}
              onClick={() => setText(s.text)}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[11px] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model selector */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          모델 선택 ({selectedModels.length}/{MODEL_TOKENIZERS.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {MODEL_TOKENIZERS.map(m => {
            const sel = selectedModels.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModel(m.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  sel
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <CompanyLogo logoId={m.logoId} name={m.company} /> {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* Token bar chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">토큰 수 비교</h2>
            <p className="text-[10px] text-gray-400 mb-4">토큰이 적을수록 비용이 저렴하고 처리가 빨라요</p>
            <div className="space-y-3">
              {results.map((r, idx) => {
                const pct = maxTokens > minTokens
                  ? ((r.tokens - minTokens) / (maxTokens - minTokens)) * 60 + 40
                  : 100;
                const savings = idx === 0 && results.length > 1
                  ? Math.round((1 - r.tokens / maxTokens) * 100)
                  : 0;
                return (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="w-32 shrink-0">
                      <div className="flex items-center gap-1">
                        <CompanyLogo logoId={r.logoId} name={r.company} />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{r.name}</span>
                        {r.isNew && <span className="text-[8px] font-bold text-red-500">NEW</span>}
                      </div>
                      <span className="text-[10px] text-gray-400">{r.company}</span>
                    </div>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: idx === 0 ? "#22c55e" : idx <= 2 ? "#3b82f6" : "#94a3b8"
                        }}
                      />
                    </div>
                    <div className="w-16 text-right shrink-0">
                      <span className="text-sm font-black text-gray-900 dark:text-white font-mono">
                        {r.tokens.toLocaleString()}
                      </span>
                    </div>
                    {savings > 0 && (
                      <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[9px] rounded-full font-bold shrink-0">
                        -{savings}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insight box */}
          <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-brand-800 dark:text-brand-300 mb-1"><Lightbulb size={14} className="inline mr-1" /> 인사이트</p>
            {results.length >= 2 && (
              <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">
                같은 텍스트도 <strong>{results[0].name}</strong>은 {results[0].tokens.toLocaleString()}토큰,
                <strong>{results[results.length - 1].name}</strong>은 {results[results.length - 1].tokens.toLocaleString()}토큰으로 처리합니다.
                {(results[results.length - 1].tokens - results[0].tokens) > 0 &&
                  ` 최대 {((1 - results[0].tokens / results[results.length - 1].tokens) * 100).toFixed(0)}%의 토큰 절약 효과가 있어요.`}
              </p>
            )}
            <p className="text-[10px] text-brand-500 dark:text-brand-500 mt-1.5">
              * 토큰 수는 추정치입니다. 실제 토큰 수는 모델의 토크나이저에 따라 다를 수 있어요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
