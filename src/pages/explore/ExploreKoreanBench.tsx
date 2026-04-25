import { useState } from "react";
import { logoIdToPath } from "../../lib/logoUtils";
import { BarChart3 } from "lucide-react";

interface BenchModel {
  name: string;
  company: string;
  logoId?: string;
  color: string;
  isNew?: boolean;
  scores: Record<string, number | null>;
  notes: string[];
}

const BENCHMARKS = [
  { key: "mmlu", label: "MMLU-Pro", desc: "다분야 지식 이해 (전문가 수준)", max: 100 },
  { key: "gpqa", label: "GPQA", desc: "전문가 수준 질문 (박사급 난이도)", max: 100 },
  { key: "math", label: "MATH-500", desc: "수학 문제 해결 (경쟁 수준)", max: 100 },
  { key: "humaneval", label: "HumanEval+", desc: "파이썬 코딩 정확도", max: 100 },
  { key: "swebench", label: "SWE-bench", desc: "실제 SW 버그 수정 (verified)", max: 100 },
  { key: "ifeval", label: "IFEval", desc: "지시어 준수도 (%)", max: 100 },
  { key: "musr", label: "MUSR", desc: "다단계 추론 정확도 (%)", max: 100 },
];

const DATA: BenchModel[] = [
  {
    name: "GPT-5.4", company: "OpenAI", logoId: "openai", color: "#10b981", isNew: true,
    scores: { mmlu: 88.5, gpqa: 92.0, math: 93.5, humaneval: 97.2, swebench: 74.9, ifeval: 92.0, musr: 80.5 },
    notes: ["다분야 지식 최상위", "코딩 능력 1위권", "지시어 준수도 뛰어남"],
  },
  {
    name: "Claude Opus 4.6", company: "Anthropic", logoId: "anthropic", color: "#f59e0b",
    scores: { mmlu: 86.2, gpqa: 89.7, math: 89.8, humaneval: 96.0, swebench: 80.8, ifeval: 90.5, musr: 76.2 },
    notes: ["긴 문맥에서 일관성 유지", "SWE-bench 최상위", "작문 품질 우수"],
  },
  {
    name: "Claude Sonnet 4.6", company: "Anthropic", logoId: "anthropic", color: "#fbbf24",
    scores: { mmlu: 84.3, gpqa: 62.5, math: 86.0, humaneval: 93.8, swebench: 63.3, ifeval: 89.8, musr: 71.2 },
    notes: ["Opus 대비 95% 성능", "가격 효율 우수", "대부분 작업에 최적"],
  },
  {
    name: "Gemini 3.1 Pro", company: "Google", logoId: "google", color: "#3b82f6", isNew: true,
    scores: { mmlu: 88.0, gpqa: 94.3, math: 92.8, humaneval: 94.5, swebench: 80.6, ifeval: 93.0, musr: 79.5 },
    notes: ["GPQA 1위", "멀티모달 지원", "1M 컨텍스트"],
  },
  {
    name: "DeepSeek R1", company: "DeepSeek", logoId: "deepseek", color: "#6366f1",
    scores: { mmlu: 81.5, gpqa: 59.2, math: 97.8, humaneval: 91.0, swebench: 49.2, ifeval: 85.0, musr: 82.3 },
    notes: ["MATH 1위", "추론 능력 강점", "가격 대비 훌륭"],
  },
  {
    name: "GLM-5", company: "Zhipu AI", logoId: "zhipu", color: "#8b5cf6",
    scores: { mmlu: 86.0, gpqa: 83.3, math: 88.5, humaneval: 91.5, swebench: 67.8, ifeval: 80.0, musr: 62.0 },
    notes: ["무료 API 제공", "균형 잡힌 성능", "중국 AI 중 강점"],
  },
  {
    name: "GPT-5.4 mini", company: "OpenAI", logoId: "openai", color: "#34d399", isNew: true,
    scores: { mmlu: 81.5, gpqa: 57.0, math: 84.0, humaneval: 91.5, swebench: 50.0, ifeval: 88.0, musr: 67.0 },
    notes: ["가성비 최고", "빠른 응답 속도", "GPT-5.4와 유사 품질"],
  },
  {
    name: "Qwen3 235B", company: "Alibaba", logoId: "alibaba", color: "#f97316",
    scores: { mmlu: 79.5, gpqa: 87.4, math: 90.5, humaneval: 89.8, swebench: 38.5, ifeval: 82.0, musr: 66.5 },
    notes: ["GPQA 상위권", "오픈소스 최상위", "수학 성능 강점"],
  },
  {
    name: "DeepSeek V3.2", company: "DeepSeek", logoId: "deepseek", color: "#818cf8", isNew: true,
    scores: { mmlu: 79.8, gpqa: 54.5, math: 88.0, humaneval: 89.5, swebench: 42.0, ifeval: 84.5, musr: 68.0 },
    notes: ["가격 대비 최강", "685B MoE 구조", "균형 잡힌 성능"],
  },
  {
    name: "Llama 3.3 70B", company: "Meta", logoId: "meta", color: "#64748b",
    scores: { mmlu: 75.0, gpqa: 45.0, math: 73.0, humaneval: 83.0, swebench: 29.0, ifeval: 80.5, musr: 52.0 },
    notes: ["오픈소스 표준", "파인튜닝 용이", "커뮤니티 활성"],
  },
  {
    name: "MiMo V2 Pro", company: "Xiaomi", logoId: "xiaomi", color: "#ec4899", isNew: true,
    scores: { mmlu: 76.5, gpqa: 87.0, math: 83.0, humaneval: 87.0, swebench: 33.0, ifeval: 78.5, musr: 58.0 },
    notes: ["GPQA 상위권", "1M 컨텍스트", "신규 모델"],
  },
  {
    name: "MiniMax M2.7", company: "MiniMax", logoId: "minimax", color: "#7c3aed", isNew: true,
    scores: { mmlu: 76.0, gpqa: 86.6, math: 80.0, humaneval: 85.0, swebench: 73.8, ifeval: 77.0, musr: 55.0 },
    notes: ["GPQA 상위권", "SWE-bench 강점", "신규 모델"],
  },
  {
    name: "Grok 4.20", company: "xAI", logoId: "xai", color: "#ec4899", isNew: true,
    scores: { mmlu: 87.8, gpqa: 70.5, math: 94.5, humaneval: 94.0, swebench: 52.0, ifeval: 88.5, musr: 73.5 },
    notes: ["MATH 상위권", "실시간 정보 반영", "균형 잡힌 성능"],
  },
  {
    name: "Gemini 2.5 Flash", company: "Google", logoId: "google", color: "#38bdf8",
    scores: { mmlu: 77.0, gpqa: 55.0, math: 85.0, humaneval: 87.5, swebench: 38.0, ifeval: 86.0, musr: 64.0 },
    notes: ["최저가 옵션", "빠른 응답 속도", "코딩/수학 밸런스"],
  },
];

function CompanyLogo({ logoId, name }: { logoId?: string; name: string }) {
  const src = logoIdToPath(logoId);
  if (!src) return <span className="text-sm">{name[0]}</span>;
  return <img src={src} alt={name} className="w-4 h-4 rounded-sm object-contain" loading="lazy" />;
}

export default function ExploreKoreanBench() {
  const [activeBench, setActiveBench] = useState("mmlu");
  const bench = BENCHMARKS.find(b => b.key === activeBench)!;

  const sorted = [...DATA]
    .filter(m => m.scores[activeBench] !== null)
    .sort((a, b) => (b.scores[activeBench] ?? 0) - (a.scores[activeBench] ?? 0));

  const maxScore = Math.max(...sorted.map(m => m.scores[activeBench] ?? 0));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
          <BarChart3 className="inline w-6 h-6 mr-1.5 -mt-0.5 text-brand-500" /> 모델 성능 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          주요 AI 모델의 벤치마크 성능 비교. MMLU-Pro, GPQA, MATH, HumanEval 등 기반.
        </p>
      </div>

      {/* Benchmark selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {BENCHMARKS.map(b => (
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

      {/* Benchmark info */}
      <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-brand-800 dark:text-brand-300">{bench.label}</p>
        <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">{bench.desc}</p>
      </div>

      {/* Bar chart */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
        {sorted.map((m, idx) => {
          const score = m.scores[activeBench] ?? 0;
          const pct = (score / maxScore) * 100;
          const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
          return (
            <div key={m.name} className="flex items-center gap-3">
              <div className="w-5 text-xs text-center shrink-0 font-medium">
                {medal || <span className="text-gray-400">{idx + 1}</span>}
              </div>
              <div className="w-36 shrink-0">
                <div className="flex items-center gap-1">
                  <CompanyLogo logoId={m.logoId} name={m.company} />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{m.name}</span>
                  {m.isNew && <span className="text-[9px] font-bold text-red-500">NEW</span>}
                </div>
                <span className="text-[10px] text-gray-400">{m.company}</span>
              </div>
              <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: m.color }}
                />
              </div>
              <div className="w-14 text-right text-sm font-black text-gray-900 dark:text-white shrink-0 font-mono">
                {score.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">벤치마크 요약표</h2>
        </div>
        {/* 모바일 카드 */}
        <div className="md:hidden space-y-3 px-4">
          {DATA.map(m => (
            <div key={m.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CompanyLogo logoId={m.logoId} name={m.company} />
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{m.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {BENCHMARKS.map(b => {
                  const v = m.scores[b.key];
                  if (v === null) return <div key={b.key} className="text-[10px] text-gray-300 dark:text-gray-600">{b.label}: —</div>;
                  return <div key={b.key} className="text-[10px] font-mono text-gray-600 dark:text-gray-400">{b.label}: {v.toFixed(1)}</div>;
                })}
              </div>
            </div>
          ))}
        </div>
        {/* 데스크탑 테이블 */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-36">모델</th>
                {BENCHMARKS.map(b => (
                  <th key={b.key} className={`text-right px-3 py-3 font-semibold ${activeBench === b.key ? "text-brand-600 dark:text-brand-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {b.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {DATA.map((m, rowIdx) => {
                const colMaxes = BENCHMARKS.map(b => Math.max(...DATA.filter(x => x.scores[b.key] !== null).map(x => x.scores[b.key] ?? 0)));
                return (
                  <tr key={m.name} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${rowIdx % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <CompanyLogo logoId={m.logoId} name={m.company} />
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[110px]">{m.name}</span>
                      </div>
                    </td>
                    {BENCHMARKS.map((b, bi) => {
                      const v = m.scores[b.key];
                      const isTop = v !== null && v === colMaxes[bi];
                      return (
                        <td key={b.key} className={`text-right px-3 py-2.5 font-mono ${isTop ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-600 dark:text-gray-400"}`}>
                          {v !== null ? `${v.toFixed(1)}` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-[10px] text-gray-400 dark:text-gray-500">* 초록색 굵은 숫자 = 해당 벤치마크 1위. 출처: artificialanalysis.ai · 공식 기술 보고서 · 2026.04</p>
        </div>
      </div>

      {/* Model detail cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {DATA.slice(0, 6).map(m => (
          <div key={m.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <CompanyLogo logoId={m.logoId} name={m.company} />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{m.name}</span>
              </div>
              {m.isNew && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold">NEW</span>}
            </div>
            <div className="space-y-1">
              {m.notes.map(n => (
                <div key={n} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-brand-500 mt-0.5 shrink-0">•</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl px-4 py-3">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">⚠️ 참고사항</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
          벤치마크 점수는 모델의 성능을 참고용으로만 확인하세요. 실제 사용에서는 프롬프트 작성 방법에 따라 결과가 크게 달라질 수 있습니다.
        </p>
      </div>
    </div>
  );
}
