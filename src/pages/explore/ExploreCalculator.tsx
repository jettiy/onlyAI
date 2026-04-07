import { useState, useMemo } from "react";

interface ModelPrice {
  name: string;
  provider: string;
  input: number;
  output: number;
  context: string;
}

const PRICES: ModelPrice[] = [
  { name: "GPT-5", provider: "OpenAI", input: 1.25, output: 10.0, context: "128K" },
  { name: "GPT-5 Mini", provider: "OpenAI", input: 0.25, output: 2.0, context: "128K" },
  { name: "GPT-5 Nano", provider: "OpenAI", input: 0.05, output: 0.20, context: "128K" },
  { name: "Claude Opus 4.6", provider: "Anthropic", input: 5.0, output: 25.0, context: "200K" },
  { name: "Claude Sonnet 4.6", provider: "Anthropic", input: 3.0, output: 15.0, context: "200K" },
  { name: "Claude Haiku 4.5", provider: "Anthropic", input: 1.0, output: 5.0, context: "200K" },
  { name: "Gemini 3.1 Pro", provider: "Google", input: 2.0, output: 12.0, context: "1M" },
  { name: "Gemini 2.5 Flash", provider: "Google", input: 0.15, output: 0.60, context: "1M" },
  { name: "DeepSeek V3.2", provider: "DeepSeek", input: 0.27, output: 1.10, context: "128K" },
  { name: "DeepSeek R1", provider: "DeepSeek", input: 0.55, output: 2.19, context: "128K" },
  { name: "MiniMax M2.7", provider: "MiniMax", input: 0.8, output: 2.4, context: "128K" },
  { name: "Grok 3", provider: "xAI", input: 3.0, output: 15.0, context: "128K" },
  { name: "Mistral Large 3", provider: "Mistral", input: 2.0, output: 6.0, context: "128K" },
  { name: "Mistral Small 3.1", provider: "Mistral", input: 0.20, output: 0.60, context: "128K" },
  { name: "Llama 3.3 70B", provider: "Meta (Groq)", input: 0.88, output: 0.88, context: "128K" },
  { name: "Qwen3 235B", provider: "Alibaba", input: 0.40, output: 1.20, context: "128K" },
  { name: "MiMo V2 Pro", provider: "Xiaomi", input: 0.50, output: 1.50, context: "1M" },
  { name: "GLM-5", provider: "Zhipu AI", input: 0.60, output: 2.0, context: "200K" },
];

type InputMode = "tokens" | "chars" | "pages" | "cost";

const CONVERSIONS = {
  tokens: { label: "토큰", factor: 1, desc: "직접 입력" },
  chars: { label: "글자", factor: 0.35, desc: "한국어 기준 1토큰 ≈ 2.9글자" },
  pages: { label: "A4 페이지", factor: 2000, desc: "1페이지 ≈ 약 2,000토큰" },
  cost: { label: "예산 (USD)", factor: -1, desc: "예산 기준 처리량 계산" },
};

const RATIOS = [
  { label: "1:0 (입력 전용)", inputRatio: 1, outputRatio: 0 },
  { label: "4:1 (읽기 중심)", inputRatio: 0.8, outputRatio: 0.2 },
  { label: "1:1 (균형)", inputRatio: 0.5, outputRatio: 0.5 },
  { label: "1:3 (생성 중심)", inputRatio: 0.25, outputRatio: 0.75 },
  { label: "0:1 (출력 전용)", inputRatio: 0, outputRatio: 1 },
];

export default function ExploreCalculator() {
  const [inputMode, setInputMode] = useState<InputMode>("tokens");
  const [inputValue, setInputValue] = useState("1000000");
  const [ratioIdx, setRatioIdx] = useState(2); // 1:1

  const ratio = RATIOS[ratioIdx];
  const totalTokens = useMemo(() => {
    const val = parseFloat(inputValue) || 0;
    if (inputMode === "cost") return val; // special handling below
    const conv = CONVERSIONS[inputMode];
    return val * conv.factor;
  }, [inputValue, inputMode]);

  const results = useMemo(() => {
    if (inputMode === "cost") {
      // Budget mode: how many tokens per model
      const budget = parseFloat(inputValue) || 0;
      return PRICES.map(p => {
        const blended = p.input * ratio.inputRatio + p.output * ratio.outputRatio;
        const tokens = blended > 0 ? Math.round(budget / blended * 1_000_000) : 0;
        return { ...p, cost: budget, tokens, blended };
      }).sort((a, b) => b.tokens - a.tokens);
    }

    // Token mode: cost per model
    const inputTokens = totalTokens * ratio.inputRatio;
    const outputTokens = totalTokens * ratio.outputRatio;
    return PRICES.map(p => {
      const cost = (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
      const blended = p.input * ratio.inputRatio + p.output * ratio.outputRatio;
      return { ...p, cost, tokens: totalTokens, blended };
    }).sort((a, b) => a.cost - b.cost);
  }, [totalTokens, inputMode, ratio]);

  const cheapest = results[0];
  const expensive = results[results.length - 1];

  const displayValue = useMemo(() => {
    const val = parseFloat(inputValue) || 0;
    if (inputMode === "cost") return `$${val.toLocaleString()}`;
    if (inputMode === "tokens") return `${Math.round(val).toLocaleString()} 토큰`;
    if (inputMode === "chars") return `${Math.round(val).toLocaleString()} 글자`;
    return `${val} 페이지`;
  }, [inputValue, inputMode]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🧮 API 가격 계산기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          토큰, 글자, 페이지, 예산을 입력하면 각 모델의 비용을 비교해드립니다.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
        {/* Input mode selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.entries(CONVERSIONS) as [InputMode, typeof CONVERSIONS[InputMode]][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setInputMode(key); setInputValue(key === "cost" ? "10" : "1000000"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                inputMode === key
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Input field */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
            {inputMode === "cost" ? "예산 입력 (USD)" : `${CONVERSIONS[inputMode].label} 수 입력`}
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={inputMode === "cost" ? "10" : "1000000"}
          />
          <p className="text-[10px] text-gray-400 mt-1">{CONVERSIONS[inputMode].desc}</p>
        </div>

        {/* Ratio selector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">입출력 비율</label>
          <div className="flex flex-wrap gap-2">
            {RATIOS.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setRatioIdx(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  ratioIdx === i
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {inputMode === "cost" ? "💰 예산별 처리 가능 토큰 수" : "💰 예상 비용"}
          </h2>
          <span className="text-xs text-gray-400">{displayValue} 기준</span>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {results.map((r, idx) => {
            const isCheapest = idx === 0;
            const isExpensive = idx === results.length - 1;
            return (
              <div key={r.name} className={`flex items-center gap-3 px-5 py-3 transition-colors ${isCheapest ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}>
                <div className={`w-5 text-xs text-center font-bold shrink-0 ${isCheapest ? "text-emerald-500" : "text-gray-300"}`}>
                  {isCheapest ? "🏆" : idx + 1}
                </div>
                <div className="w-28 shrink-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{r.name}</div>
                  <div className="text-[10px] text-gray-400">{r.provider}</div>
                </div>
                <div className="flex-1 relative h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  {inputMode === "cost" ? (
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
                      style={{ width: `${cheapest.tokens > 0 ? (r.tokens / cheapest.tokens) * 100 : 0}%` }}
                    />
                  ) : (
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-500 transition-all duration-500"
                      style={{ width: `${expensive.cost > 0 ? (r.cost / expensive.cost) * 100 : 0}%` }}
                    />
                  )}
                </div>
                <div className="w-24 text-right shrink-0">
                  {inputMode === "cost" ? (
                    <div className="text-xs font-bold text-gray-900 dark:text-white font-mono">
                      {r.tokens > 1_000_000 ? `${(r.tokens / 1_000_000).toFixed(1)}M` : r.tokens > 1000 ? `${(r.tokens / 1000).toFixed(0)}K` : r.tokens} 토큰
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-gray-900 dark:text-white font-mono">
                      ${r.cost.toFixed(2)}
                    </div>
                  )}
                </div>
                {isCheapest && (
                  <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[9px] rounded-full font-bold shrink-0">
                    최저가
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick presets */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">⚡ 빠른 프리셋</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "챗봇 1회", value: "3000", mode: "tokens" as InputMode },
            { label: "블로그 글 1편", value: "5000", mode: "tokens" as InputMode },
            { label: "A4 10페이지", value: "10", mode: "pages" as InputMode },
            { label: "월 $10 예산", value: "10", mode: "cost" as InputMode },
            { label: "월 $50 예산", value: "50", mode: "cost" as InputMode },
            { label: "1만 글자", value: "10000", mode: "chars" as InputMode },
            { label: "100만 토큰", value: "1000000", mode: "tokens" as InputMode },
            { label: "월 $100 예산", value: "100", mode: "cost" as InputMode },
          ].map(p => (
            <button
              key={p.label}
              onClick={() => { setInputMode(p.mode); setInputValue(p.value); }}
              className="px-3 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
