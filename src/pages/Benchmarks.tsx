import { useState } from "react";

type BenchmarkKey = "mmlu" | "humaneval" | "math" | "gpqa" | "swe";

interface ModelBench {
  name: string;
  company: string;
  flag: string;
  color: string;
  isNew?: boolean;
  scores: Record<BenchmarkKey, number | null>;
}

const BENCHMARKS: { key: BenchmarkKey; label: string; desc: string; max: number }[] = [
  { key: "mmlu",      label: "MMLU",      desc: "다분야 지식 이해 (0~100%)",    max: 100 },
  { key: "humaneval", label: "HumanEval", desc: "파이썬 코딩 정확도 (0~100%)",  max: 100 },
  { key: "math",      label: "MATH",      desc: "수학 문제 해결 (0~100%)",      max: 100 },
  { key: "gpqa",      label: "GPQA",      desc: "전문가 수준 질문 (0~100%)",    max: 100 },
  { key: "swe",       label: "SWE-bench", desc: "실제 소프트웨어 버그 수정 (%)", max: 100 },
];

const DATA: ModelBench[] = [
  {
    name: "GPT-5", company: "OpenAI", flag: "🇺🇸", color: "#10b981", isNew: true,
    scores: { mmlu: 92.1, humaneval: 95.3, math: 91.7, gpqa: 83.2, swe: 49.0 },
  },
  {
    name: "Claude Opus 4.6", company: "Anthropic", flag: "🇺🇸", color: "#f59e0b",
    scores: { mmlu: 91.8, humaneval: 93.7, math: 89.5, gpqa: 84.1, swe: 72.5 },
  },
  {
    name: "Claude Sonnet 4.6", company: "Anthropic", flag: "🇺🇸", color: "#f59e0b",
    scores: { mmlu: 90.3, humaneval: 92.1, math: 87.2, gpqa: 79.8, swe: 63.3 },
  },
  {
    name: "Gemini 3.1 Pro", company: "Google", flag: "🇺🇸", color: "#3b82f6", isNew: true,
    scores: { mmlu: 91.5, humaneval: 91.2, math: 90.8, gpqa: 82.0, swe: 47.4 },
  },
  {
    name: "Gemini 2.5 Pro", company: "Google", flag: "🇺🇸", color: "#3b82f6",
    scores: { mmlu: 90.0, humaneval: 89.5, math: 91.0, gpqa: 81.7, swe: 45.2 },
  },
  {
    name: "DeepSeek R1", company: "DeepSeek", flag: "🇨🇳", color: "#6366f1",
    scores: { mmlu: 90.8, humaneval: 90.5, math: 97.3, gpqa: 79.2, swe: 49.2 },
  },
  {
    name: "DeepSeek V3.2", company: "DeepSeek", flag: "🇨🇳", color: "#6366f1", isNew: true,
    scores: { mmlu: 88.5, humaneval: 88.0, math: 89.0, gpqa: 74.1, swe: 42.0 },
  },
  {
    name: "Grok 3", company: "xAI", flag: "🇺🇸", color: "#ec4899", isNew: true,
    scores: { mmlu: 92.7, humaneval: 93.3, math: 93.6, gpqa: 84.6, swe: 41.0 },
  },
  {
    name: "MiniMax M2.7", company: "MiniMax", flag: "🇨🇳", color: "#7c3aed", isNew: true,
    scores: { mmlu: 87.3, humaneval: 85.0, math: 84.0, gpqa: 72.0, swe: 38.0 },
  },
  {
    name: "Llama 3.3 70B", company: "Meta", flag: "🇺🇸", color: "#64748b",
    scores: { mmlu: 86.0, humaneval: 80.5, math: 77.0, gpqa: 67.3, swe: 29.0 },
  },
  {
    name: "Mistral Large 3", company: "Mistral", flag: "🇫🇷", color: "#14b8a6",
    scores: { mmlu: 85.0, humaneval: 81.0, math: 79.2, gpqa: 64.0, swe: 31.0 },
  },
];

export default function Benchmarks() {
  const [activeBench, setActiveBench] = useState<BenchmarkKey>("mmlu");
  const bench = BENCHMARKS.find((b) => b.key === activeBench)!;

  // Sort by selected benchmark score
  const sorted = [...DATA]
    .filter((m) => m.scores[activeBench] !== null)
    .sort((a, b) => (b.scores[activeBench] ?? 0) - (a.scores[activeBench] ?? 0));

  const maxScore = Math.max(...sorted.map((m) => m.scores[activeBench] ?? 0));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">📊 벤치마크 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          주요 AI 모델의 공개 벤치마크 점수 비교. 2026년 3월 기준.
        </p>
      </div>

      {/* Benchmark selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {BENCHMARKS.map((b) => (
          <button
            key={b.key}
            onClick={() => setActiveBench(b.key)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeBench === b.key
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Benchmark description */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{bench.label}</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{bench.desc}</p>
      </div>

      {/* Bar chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        {sorted.map((m, idx) => {
          const score = m.scores[activeBench] ?? 0;
          const pct = (score / maxScore) * 100;
          return (
            <div key={m.name} className="flex items-center gap-3">
              <div className="w-5 text-xs text-gray-400 dark:text-gray-500 text-right shrink-0">{idx + 1}</div>
              <div className="w-36 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{m.flag}</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{m.name}</span>
                  {m.isNew && <span className="text-[9px] font-bold text-red-500 shrink-0">NEW</span>}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{m.company}</span>
              </div>
              <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: m.color }}
                />
              </div>
              <div className="w-14 text-right font-mono text-sm font-bold text-gray-900 dark:text-white shrink-0">
                {score.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">전체 벤치마크 요약표</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-36">모델</th>
                {BENCHMARKS.map((b) => (
                  <th key={b.key} className={`text-right px-3 py-3 font-semibold ${activeBench === b.key ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {b.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {DATA.map((m) => (
                <tr key={m.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span>{m.flag}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[110px]">{m.name}</span>
                    </div>
                  </td>
                  {BENCHMARKS.map((b) => {
                    const v = m.scores[b.key];
                    // Find max for this benchmark
                    const colMax = Math.max(...DATA.filter(x => x.scores[b.key] !== null).map(x => x.scores[b.key] ?? 0));
                    const isTop = v !== null && v === colMax;
                    return (
                      <td key={b.key} className={`text-right px-3 py-2.5 font-mono ${isTop ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-600 dark:text-gray-400"}`}>
                        {v !== null ? `${v.toFixed(1)}` : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-[10px] text-gray-400 dark:text-gray-500">* 초록색 굵은 숫자 = 해당 벤치마크 1위. 출처: 공식 기술 보고서 및 papers.withcode.ai (2026.03)</p>
        </div>
      </div>

      {/* Benchmark explanations */}
      <div className="grid sm:grid-cols-2 gap-3">
        {BENCHMARKS.map((b) => (
          <div key={b.key} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-black text-gray-900 dark:text-white">{b.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">측정 범위 0~100%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
          </div>
        ))}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">⚠️ 벤치마크 주의사항</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">벤치마크 점수가 높다고 실사용 성능이 반드시 좋은 건 아니에요. 실제 사용 목적에 맞는 모델을 AI 추천 퀴즈로 찾아보세요.</p>
        </div>
      </div>
    </div>
  );
}
