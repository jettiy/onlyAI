import { useState } from "react";

type BenchmarkKey = "mmlu" | "humaneval" | "math" | "gpqa" | "swe" | "ifeval" | "musr" | "coding";

interface ModelBench {
  name: string;
  company: string;
  logoId: string;
  color: string;
  isNew?: boolean;
  scores: Partial<Record<BenchmarkKey, number>>;
}

const BENCHMARKS: { key: BenchmarkKey; label: string; desc: string; category: string }[] = [
  { key: "mmlu",      label: "MMLU-Pro",   desc: "다분야 지식 이해 (전문가 수준)", category: "지능" },
  { key: "gpqa",      label: "GPQA Diamond", desc: "전문가 수준 질문 (박사급 난이도)", category: "지능" },
  { key: "math",      label: "MATH-500",   desc: "수학 문제 해결 (경쟁 수준)", category: "지능" },
  { key: "ifeval",    label: "IFEval",     desc: "지시어 준수도 (%)", category: "지능" },
  { key: "humaneval", label: "HumanEval+", desc: "파이썬 코딩 정확도", category: "코딩" },
  { key: "coding",    label: "SWE-bench",  desc: "실제 SW 버그 수정 (verified)", category: "코딩" },
  { key: "swe",       label: "Aider polyglot", desc: "다언어 코드 편집 성공률 (%)", category: "코딩" },
  { key: "musr",      label: "MUSR",       desc: "다단계 추론 정확도 (%)", category: "추론" },
];

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

const DATA: ModelBench[] = [
  {
    name: "GPT-5.4", company: "OpenAI", logoId: "openai", color: "#10b981", isNew: true,
    scores: { mmlu: 88.5, gpqa: 71.0, math: 93.5, ifeval: 92.0, humaneval: 97.2, coding: 62.0, swe: 72.0, musr: 80.5 },
  },
  {
    name: "Claude Opus 4.6", company: "Anthropic", logoId: "anthropic", color: "#f59e0b",
    scores: { mmlu: 86.2, gpqa: 68.5, math: 89.8, ifeval: 90.5, humaneval: 96.0, coding: 75.0, swe: 78.5, musr: 76.2 },
  },
  {
    name: "Claude Sonnet 4.6", company: "Anthropic", logoId: "anthropic", color: "#fbbf24",
    scores: { mmlu: 84.3, gpqa: 62.5, math: 86.0, ifeval: 89.8, humaneval: 93.8, coding: 63.3, swe: 69.5, musr: 71.2 },
  },
  {
    name: "Gemini 3.1 Pro", company: "Google", logoId: "google", color: "#3b82f6", isNew: true,
    scores: { mmlu: 88.0, gpqa: 94.3, math: 92.8, ifeval: 93.0, humaneval: 94.5, coding: 80.6, swe: 70.0, musr: 79.5 },
  },
  {
    name: "Gemini 2.5 Pro", company: "Google", logoId: "google", color: "#60a5fa",
    scores: { mmlu: 85.5, gpqa: 63.0, math: 92.5, ifeval: 88.5, humaneval: 90.8, coding: 52.5, swe: 62.5, musr: 77.0 },
  },
  {
    name: "DeepSeek R1", company: "DeepSeek", logoId: "deepseek", color: "#6366f1",
    scores: { mmlu: 81.5, gpqa: 59.2, math: 97.8, ifeval: 85.0, humaneval: 91.0, coding: 49.2, swe: 58.5, musr: 82.3 },
  },
  {
    name: "DeepSeek V3.2", company: "DeepSeek", logoId: "deepseek", color: "#818cf8", isNew: true,
    scores: { mmlu: 79.8, gpqa: 54.5, math: 88.0, ifeval: 84.5, humaneval: 89.5, coding: 42.0, swe: 52.0, musr: 68.0 },
  },
  {
    name: "Grok 4.20", company: "xAI", logoId: "xai", color: "#ec4899", isNew: true,
    scores: { mmlu: 87.8, gpqa: 70.5, math: 94.5, ifeval: 88.5, humaneval: 94.0, coding: 52.0, swe: 58.0, musr: 73.5 },
  },
  {
    name: "GPT-5.4 Mini", company: "OpenAI", logoId: "openai", color: "#34d399", isNew: true,
    scores: { mmlu: 81.5, gpqa: 57.0, math: 84.0, ifeval: 88.0, humaneval: 91.5, coding: 50.0, swe: 62.0, musr: 67.0 },
  },
  {
    name: "Qwen3 235B", company: "Alibaba", logoId: "alibaba", color: "#f97316",
    scores: { mmlu: 79.5, gpqa: 53.0, math: 90.5, ifeval: 82.0, humaneval: 89.8, coding: 38.5, swe: 48.0, musr: 66.5 },
  },
  {
    name: "GLM-5", company: "Zhipu AI", logoId: "zhipu", color: "#8b5cf6",
    scores: { mmlu: 78.0, gpqa: 50.5, math: 88.5, ifeval: 80.0, humaneval: 91.5, coding: 36.0, swe: 45.0, musr: 62.0 },
  },
  {
    name: "MiMo V2 Pro", company: "Xiaomi", logoId: "xiaomi", color: "#a855f7",
    scores: { mmlu: 76.5, gpqa: 48.0, math: 83.0, ifeval: 78.5, humaneval: 87.0, coding: 33.0, swe: 42.0, musr: 58.0 },
  },
  {
    name: "MiniMax M2.7", company: "MiniMax", logoId: "minimax", color: "#7c3aed", isNew: true,
    scores: { mmlu: 76.0, gpqa: 47.5, math: 80.0, ifeval: 77.0, humaneval: 85.0, coding: 30.0, swe: 38.0, musr: 55.0 },
  },
  {
    name: "Kimi K2.5", company: "Moonshot", logoId: "moonshot", color: "#14b8a6",
    scores: { mmlu: 77.5, gpqa: 49.0, math: 82.0, ifeval: 79.0, humaneval: 88.0, coding: 35.0, swe: 43.0, musr: 60.0 },
  },
  {
    name: "Llama 4 Maverick", company: "Meta", logoId: "meta", color: "#64748b",
    scores: { mmlu: 75.0, gpqa: 45.0, math: 73.0, ifeval: 80.5, humaneval: 83.0, coding: 29.0, swe: 35.0, musr: 52.0 },
  },
  {
    name: "Mistral Large 3", company: "Mistral", logoId: "mistral", color: "#14b8a6",
    scores: { mmlu: 74.5, gpqa: 43.0, math: 72.0, ifeval: 78.0, humaneval: 82.5, coding: 28.0, swe: 33.0, musr: 50.0 },
  },
  {
    name: "Claude Haiku 4.5", company: "Anthropic", logoId: "anthropic", color: "#fb923c",
    scores: { mmlu: 74.0, gpqa: 44.0, math: 72.5, ifeval: 87.0, humaneval: 84.0, coding: 22.0, swe: 30.0, musr: 52.0 },
  },
  {
    name: "Claude Opus 4.5", company: "Anthropic", logoId: "anthropic", color: "#d97706",
    scores: { mmlu: 84.5, gpqa: 65.0, math: 87.5, ifeval: 89.0, humaneval: 93.5, coding: 65.0, swe: 72.0, musr: 74.5 },
  },
  {
    name: "Gemini 2.5 Flash", company: "Google", logoId: "google", color: "#38bdf8",
    scores: { mmlu: 77.0, gpqa: 55.0, math: 85.0, ifeval: 86.0, humaneval: 87.5, coding: 38.0, swe: 45.0, musr: 64.0 },
  },
  {
    name: "GPT-4o", company: "OpenAI", logoId: "openai", color: "#a3e635",
    scores: { mmlu: 76.5, gpqa: 53.5, math: 76.5, ifeval: 84.0, humaneval: 87.0, coding: 33.0, swe: 41.0, musr: 58.0 },
  },
  {
    name: "GPT-4o mini", company: "OpenAI", logoId: "openai", color: "#bef264",
    scores: { mmlu: 70.0, gpqa: 40.0, math: 68.0, ifeval: 80.0, humaneval: 80.0, coding: 18.0, swe: 25.0, musr: 45.0 },
  },
  {
    name: "Qwen3 32B", company: "Alibaba", logoId: "alibaba", color: "#fb923c",
    scores: { mmlu: 73.0, gpqa: 45.0, math: 82.0, ifeval: 78.0, humaneval: 84.0, coding: 28.0, swe: 36.0, musr: 55.0 },
  },
  {
    name: "GLM-5 Turbo", company: "Zhipu AI", logoId: "zhipu", color: "#a78bfa",
    scores: { mmlu: 77.0, gpqa: 49.0, math: 86.0, ifeval: 79.0, humaneval: 90.5, coding: 34.0, swe: 43.0, musr: 60.0 },
  },
  {
    name: "Mistral Small 3.1", company: "Mistral", logoId: "mistral", color: "#5eead4",
    scores: { mmlu: 68.0, gpqa: 37.0, math: 65.0, ifeval: 75.0, humaneval: 76.0, coding: 18.0, swe: 22.0, musr: 42.0 },
  },
  {
    name: "Command A", company: "Cohere", logoId: "cohere", color: "#64748b",
    scores: { mmlu: 69.0, gpqa: 38.0, math: 62.0, ifeval: 76.0, humaneval: 75.0, coding: 15.0, swe: 20.0, musr: 44.0 },
  },
];

function LogoImg({ logoId, name, size = 18 }: { logoId: string; name: string; size?: number }) {
  const src = LOGO_MAP[logoId];
  if (!src) return <span className="text-sm">🤖</span>;
  return (
    <img
      src={`/logos/${src}`}
      alt={name}
      className="rounded-sm object-contain"
      style={{ width: size, height: size }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

/* 페이지네이션 컴포넌트 */
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === total || Math.abs(p - current) <= 1);
  const withDots: (number | '...')[] = [];
  for (let i = 0; i < visible.length; i++) {
    if (i > 0 && visible[i] - visible[i - 1] > 1) withDots.push('...');
    withDots.push(visible[i]);
  }
  return (
    <div className="flex items-center justify-center gap-1.5 py-3">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
        이전
      </button>
      {withDots.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-2 text-xs text-gray-400">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)}
            className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors ${
              p === current ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(current + 1)} disabled={current === total}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
        다음
      </button>
    </div>
  );
}

export default function Benchmarks() {
  const [activeBench, setActiveBench] = useState<BenchmarkKey>("mmlu");
  const [summaryPage, setSummaryPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const bench = BENCHMARKS.find((b) => b.key === activeBench)!;

  const sorted = [...DATA]
    .filter((m) => m.scores[activeBench] !== undefined)
    .sort((a, b) => (b.scores[activeBench] ?? 0) - (a.scores[activeBench] ?? 0));

  const maxScore = Math.max(...sorted.map((m) => m.scores[activeBench] ?? 0));

  const categories = ["전체", "지능", "코딩", "추론"];
  const [catFilter, setCatFilter] = useState("전체");
  const filteredBenchmarks = catFilter === "전체" ? BENCHMARKS : BENCHMARKS.filter(b => b.category === catFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">📊 벤치마크 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          주요 AI 모델의 공개 벤치마크 점수 비교. artificialanalysis.ai / 공식 기술 보고서 참고. 2026년 4월 기준.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              catFilter === c ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Benchmark selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filteredBenchmarks.map((b) => (
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
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">{bench.category}</span>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{bench.label}</p>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{bench.desc}</p>
      </div>

      {/* Bar chart with logos */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
        {sorted.map((m, idx) => {
          const score = m.scores[activeBench] ?? 0;
          const pct = (score / maxScore) * 100;
          const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
          return (
            <div key={m.name} className="flex items-center gap-3 group">
              <div className="w-5 text-xs text-center shrink-0 font-medium">
                {medal || <span className="text-gray-400">{idx + 1}</span>}
              </div>
              <div className="w-36 shrink-0 flex items-center gap-2">
                <LogoImg logoId={m.logoId} name={m.company} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-500 transition-colors">{m.name}</span>
                    {m.isNew && <span className="text-[8px] font-bold text-red-500 shrink-0">NEW</span>}
                  </div>
                  <span className="text-[10px] text-gray-400">{m.company}</span>
                </div>
              </div>
              <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: m.color }}
                />
              </div>
              <div className="w-14 text-right font-mono text-sm font-bold text-gray-900 dark:text-white shrink-0">
                {score.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary table with logos — 페이지네이션 적용 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">전체 벤치마크 요약표</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">{DATA.length}개 모델 중 {(summaryPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(summaryPage * ITEMS_PER_PAGE, DATA.length)}개 표시</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-40">모델</th>
                {BENCHMARKS.map((b) => (
                  <th key={b.key} className={`text-right px-2 py-3 font-semibold ${activeBench === b.key ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {b.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {DATA.slice((summaryPage - 1) * ITEMS_PER_PAGE, summaryPage * ITEMS_PER_PAGE).map((m) => (
                <tr key={m.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <LogoImg logoId={m.logoId} name={m.company} size={16} />
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[100px]">{m.name}</div>
                        <div className="text-[9px] text-gray-400">{m.company}</div>
                      </div>
                    </div>
                  </td>
                  {BENCHMARKS.map((b) => {
                    const v = m.scores[b.key];
                    if (v === undefined) return <td key={b.key} className="text-right px-2 py-2.5 text-gray-300 dark:text-gray-600">—</td>;
                    const colMax = Math.max(...DATA.filter(x => x.scores[b.key] !== undefined).map(x => x.scores[b.key] ?? 0));
                    const isTop = v === colMax;
                    return (
                      <td key={b.key} className={`text-right px-2 py-2.5 font-mono ${isTop ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-600 dark:text-gray-400"}`}>
                        {v.toFixed(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-[10px] text-gray-400 dark:text-gray-500">* 초록색 굵은 숫자 = 해당 벤치마크 1위. 출처: 공식 기술 보고서, artificialanalysis.ai, Arena leaderboard (2026.04)</p>
        </div>
        {/* 페이지네이션 — 요약표만 */}
        {Math.ceil(DATA.length / ITEMS_PER_PAGE) > 1 && (
          <Pagination current={summaryPage} total={Math.ceil(DATA.length / ITEMS_PER_PAGE)} onChange={(p) => { setSummaryPage(p); }} />
        )}
      </div>

      {/* Benchmark explanations */}
      <div className="grid sm:grid-cols-2 gap-3">
        {BENCHMARKS.map((b) => (
          <div key={b.key} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-black text-gray-900 dark:text-white">{b.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">{b.category}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
