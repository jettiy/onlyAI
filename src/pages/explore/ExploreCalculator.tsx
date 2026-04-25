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
    if (inputMode === "cost") return val; 
    const conv = CONVERSIONS[inputMode];
    return val * conv.factor;
  }, [inputValue, inputMode]);

  const results = useMemo(() => {
    if (inputMode === "cost") {
      const budget = parseFloat(inputValue) || 0;
      return PRICES.map(p => {
        const blended = p.input * ratio.inputRatio + p.output * ratio.outputRatio;
        const tokens = blended > 0 ? Math.round(budget / blended * 1_000_000) : 0;
        return { ...p, cost: budget, tokens, blended };
      }).sort((a, b) => b.tokens - a.tokens);
    }

    const inputTokens = totalTokens * ratio.inputRatio;
    const outputTokens = totalTokens * ratio.outputRatio;
    return PRICES.map(p => {
      const cost = (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
      const blended = p.input * ratio.inputRatio + p.output * ratio.outputRatio;
      return { ...p, cost, tokens: totalTokens, blended };
    }).sort((a, b) => a.cost - b.cost);
  }, [totalTokens, inputMode, ratio]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🧮 API 가격 계산기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          토큰 수 슬라이더로 조절하거나 예산을 입력하여 모델별 비용을 비교하세요.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-6">
        {/* Token/Budget Slider */}
        {inputMode !== "cost" && (
            <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">
                    {CONVERSIONS[inputMode].label} 수: {parseFloat(inputValue).toLocaleString()}
                </label>
                <input
                    type="range"
                    min="1000"
                    max="10000000"
                    step="1000"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
                />
            </div>
        )}
        
        <div className="flex flex-wrap gap-4">
            {/* Input mode selector */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">단위</label>
                <div className="flex gap-2">
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
            </div>

            {/* Cost Input if in cost mode */}
            {inputMode === "cost" && (
                <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">예산 (USD)</label>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            )}
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
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">
            📊 모델 비교 표
          </h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                        <th className="px-5 py-3">모델</th>
                        <th className="px-5 py-3 text-right">비용</th>
                        <th className="px-5 py-3 text-right">처리량</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {results.map((r) => (
                        <tr key={r.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-5 py-3">
                                <div className="font-bold text-gray-900 dark:text-white">{r.name}</div>
                                <div className="text-[10px] text-gray-400">{r.provider}</div>
                            </td>
                            <td className="px-5 py-3 text-right font-mono font-bold">${r.cost.toFixed(2)}</td>
                            <td className="px-5 py-3 text-right font-mono font-bold text-brand-600 dark:text-brand-400">
                                {r.tokens > 1_000_000 ? `${(r.tokens / 1_000_000).toFixed(1)}M` : `${(r.tokens / 1000).toFixed(0)}K`} 토큰
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
