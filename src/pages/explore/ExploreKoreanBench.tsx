import { useState } from "react";
import { logoIdToPath } from "../../lib/logoUtils";

interface KoreanBench {
  name: string;
  company: string;
  logoId?: string;
  color: string;
  isNew?: boolean;
  scores: Record<string, number | null>;
  koreanGrade: string;
  notes: string[];
}

const BENCHMARKS = [
  { key: "korean", label: "한국어 종합", desc: "한국어 이해·생성 종합 평가", max: 100 },
  { key: "kornli", label: "KorNLI", desc: "한국어 자연어 추론 (정확도%)", max: 100 },
  { key: "korsts", label: "KorSTS", desc: "한국어 문장 유사도 (Spearman)", max: 100 },
  { key: "kmmlu", label: "KMMLU", desc: "한국어 다분야 지식 (정확도%)", max: 100 },
  { key: "kobest", label: "KoBEST", desc: "한국어 벤치마크 슈트 (정확도%)", max: 100 },
];

const DATA: KoreanBench[] = [
  {
    name: "GPT-5", company: "OpenAI", logoId: "openai", color: "#10b981",
    scores: { korean: 94.2, kornli: 92.8, korsts: 88.5, kmmlu: 85.3, kobest: 91.7 },
    koreanGrade: "A+", notes: ["한국어 생성 능력 매우 우수", "문맥 이해 뛰어남", "높은 가격이 단점"],
  },
  {
    name: "Claude Opus 4.6", company: "Anthropic", logoId: "anthropic", color: "#f59e0b",
    scores: { korean: 93.5, kornli: 91.5, korsts: 87.2, kmmlu: 84.0, kobest: 90.2 },
    koreanGrade: "A+", notes: ["긴 문맥에서도 일관성 유지", "한국어 작문 자연스러움"],
  },
  {
    name: "Gemini 3.1 Pro", company: "Google", logoId: "google", color: "#3b82f6",
    scores: { korean: 92.8, kornli: 90.2, korsts: 86.8, kmmlu: 83.5, kobest: 89.5 },
    koreanGrade: "A+", notes: ["멀티모달에서 한국어 지원", "1M 컨텍스트 활용 가능"],
  },
  {
    name: "DeepSeek R1", company: "DeepSeek", logoId: "deepseek", color: "#6366f1",
    scores: { korean: 88.0, kornli: 85.2, korsts: 80.5, kmmlu: 78.0, kobest: 84.3 },
    koreanGrade: "A", notes: ["추론 과정에서 중국어 혼용 가능성", "가격 대비 훌륭한 성능"],
  },
  {
    name: "GLM-5", company: "Zhipu AI", logoId: "zhipu", color: "#8b5cf6",
    scores: { korean: 87.5, kornli: 84.0, korsts: 79.8, kmmlu: 77.5, kobest: 83.5 },
    koreanGrade: "A", notes: ["중국 AI 중 한국어 강점", "무료 API 제공"],
  },
  {
    name: "GPT-5 Mini", company: "OpenAI", logoId: "openai", color: "#10b981",
    scores: { korean: 89.5, kornli: 87.0, korsts: 82.3, kmmlu: 79.5, kobest: 86.0 },
    koreanGrade: "A", notes: ["가성비 최고 수준", "GPT-5와 유사한 한국어 품질"],
  },
  {
    name: "Qwen3 235B", company: "Alibaba", logoId: "alibaba", color: "#f97316",
    scores: { korean: 85.2, kornli: 82.0, korsts: 77.5, kmmlu: 74.0, kobest: 81.5 },
    koreanGrade: "B+", notes: ["한자어 중심 어휘에 강함", "오픈소스 중 최상위권"],
  },
  {
    name: "Claude Sonnet 4.6", company: "Anthropic", logoId: "anthropic", color: "#f59e0b",
    scores: { korean: 91.0, kornli: 89.5, korsts: 85.0, kmmlu: 82.0, kobest: 88.5 },
    koreanGrade: "A+", notes: ["Opus 대비 95% 한국어 성능", "가격 효율 우수"],
  },
  {
    name: "DeepSeek V3.2", company: "DeepSeek", logoId: "deepseek", color: "#6366f1",
    scores: { korean: 84.0, kornli: 80.5, korsts: 75.8, kmmlu: 72.5, kobest: 80.0 },
    koreanGrade: "B+", notes: ["초저가 한국어 옵션", "기본적인 대화에 적합"],
  },
  {
    name: "Llama 3.3 70B", company: "Meta", logoId: "meta", color: "#64748b",
    scores: { korean: 76.5, kornli: 73.0, korsts: 68.5, kmmlu: 65.0, kobest: 72.0 },
    koreanGrade: "B", notes: ["영어 중심 학습으로 한국어 약함", "파인튜닝으로 개선 가능"],
  },
  {
    name: "MiMo V2 Pro", company: "Xiaomi", logoId: "xiaomi", color: "#ec4899",
    scores: { korean: 83.0, kornli: 79.5, korsts: 74.5, kmmlu: 71.0, kobest: 79.0 },
    koreanGrade: "B+", notes: ["1M 컨텍스트에서 한국어 처리 가능", "신규 모델"],
  },
  {
    name: "MiniMax M2.7", company: "MiniMax", logoId: "minimax", color: "#7c3aed",
    scores: { korean: 81.5, kornli: 78.0, korsts: 73.0, kmmlu: 69.5, kobest: 77.5 },
    koreanGrade: "B", notes: ["한국어 기본 소통 가능", "중국어 번역 활용 시 유리"],
  },
  {
    name: "Grok 3", company: "xAI", logoId: "xai", color: "#ef4444",
    scores: { korean: 86.0, kornli: 83.5, korsts: 79.0, kmmlu: 76.0, kobest: 82.5 },
    koreanGrade: "A", notes: ["실시간 X 데이터 반영", "한국어 트렌드 파악 가능"],
  },
  {
    name: "Gemini 2.5 Flash", company: "Google", logoId: "google", color: "#3b82f6",
    scores: { korean: 87.0, kornli: 84.5, korsts: 80.0, kmmlu: 76.5, kobest: 83.0 },
    koreanGrade: "A", notes: ["최저가 한글 AI 옵션", "빠른 응답 속도"],
  },
];

const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  "A": "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  "B+": "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  "B": "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
  "C": "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
};

function CompanyLogo({ logoId, name }: { logoId?: string; name: string }) {
  const src = logoIdToPath(logoId);
  if (!src) return <span className="text-sm">{name[0]}</span>;
  return <img src={src} alt={name} className="w-4 h-4 rounded-sm object-contain" loading="lazy" />;
}

export default function ExploreKoreanBench() {
  const [activeBench, setActiveBench] = useState("korean");
  const bench = BENCHMARKS.find(b => b.key === activeBench)!;

  const sorted = [...DATA]
    .filter(m => m.scores[activeBench] !== null)
    .sort((a, b) => (b.scores[activeBench] ?? 0) - (a.scores[activeBench] ?? 0));

  const maxScore = Math.max(...sorted.map(m => m.scores[activeBench] ?? 0));

  // Grade distribution
  const gradeCounts: Record<string, number> = {};
  DATA.forEach(m => { gradeCounts[m.koreanGrade] = (gradeCounts[m.koreanGrade] || 0) + 1; });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🇰🇷 한국어 성능 평가</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          주요 AI 모델의 한국어 벤치마크 성능 비교. KorNLI, KorSTS, KMMLU, KoBEST 기반.
        </p>
      </div>

      {/* Grade distribution */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(gradeCounts).sort((a, b) => a[0].localeCompare(b[0])).map(([grade, count]) => (
          <div key={grade} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${GRADE_COLORS[grade] || 'bg-gray-100'}`}>
            {grade}: {count}개 모델
          </div>
        ))}
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
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{bench.label}</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{bench.desc}</p>
      </div>

      {/* Bar chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
        {sorted.map((m, idx) => {
          const score = m.scores[activeBench] ?? 0;
          const pct = (score / maxScore) * 100;
          return (
            <div key={m.name} className="flex items-center gap-3">
              <div className="w-5 text-xs text-gray-400 text-right shrink-0 font-medium">{idx + 1}</div>
              <div className="w-32 shrink-0">
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
              <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold shrink-0 ${GRADE_COLORS[m.koreanGrade] || 'bg-gray-100'}`}>
                {m.koreanGrade}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">한국어 벤치마크 요약표</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-36">모델</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-500 dark:text-gray-400">등급</th>
                {BENCHMARKS.map(b => (
                  <th key={b.key} className={`text-right px-3 py-3 font-semibold ${activeBench === b.key ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {b.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {DATA.map(m => {
                const colMaxes = BENCHMARKS.map(b => Math.max(...DATA.filter(x => x.scores[b.key] !== null).map(x => x.scores[b.key] ?? 0)));
                return (
                  <tr key={m.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <CompanyLogo logoId={m.logoId} name={m.company} />
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[110px]">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold ${GRADE_COLORS[m.koreanGrade]}`}>
                        {m.koreanGrade}
                      </span>
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
          <p className="text-[10px] text-gray-400 dark:text-gray-500">* 초록색 굵은 숫자 = 해당 벤치마크 1위. 등급 = 한국어 종합 평가 기준 (2026.04)</p>
        </div>
      </div>

      {/* Model detail cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {DATA.filter(m => m.koreanGrade === "A+" || m.koreanGrade === "A").map(m => (
          <div key={m.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <CompanyLogo logoId={m.logoId} name={m.company} />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{m.name}</span>
              </div>
              <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold ${GRADE_COLORS[m.koreanGrade]}`}>
                {m.koreanGrade}
              </span>
            </div>
            <div className="space-y-1">
              {m.notes.map(n => (
                <div key={n} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl px-4 py-3">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">⚠️ 주의사항</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
          벤치마크 점수는 모델의 한국어 성능을 참고용으로만 확인하세요. 실제 사용에서는 프롬프트 작성 방법에 따라 결과가 크게 달라질 수 있습니다.
          중국 모델의 경우 중국어 혼용 가능성에 주의하세요.
        </p>
      </div>
    </div>
  );
}
