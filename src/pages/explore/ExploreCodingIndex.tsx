import { useMemo, useState } from "react";
import { strengths, type ModelStrength } from "../../data/modelStrengths";
import { models } from "../../data/models";
import { CompanyLogo } from "../../components/CompanyLogo";
import { Code2, TrendingUp } from "lucide-react";

type LicenseFilter = "all" | "open" | "cloud";

// 코딩 점수 → 색상/라벨
function scoreStyle(score: number): { badge: string; bar: string } {
  if (score >= 9) return { badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300", bar: "bg-violet-500" };
  if (score >= 8) return { badge: "bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300", bar: "bg-brand-500" };
  if (score >= 7) return { badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300", bar: "bg-emerald-500" };
  return { badge: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300", bar: "bg-gray-400" };
}

export default function ExploreCodingIndex() {
  const [licFilter, setLicFilter] = useState<LicenseFilter>("all");

  const rows = useMemo(() => {
    // 카탈로그에 남아있는(최신) 모델만, 코딩 점수 기준 정렬
    const modelIds = new Set(models.map(m => m.id));
    return strengths
      .filter(s => modelIds.has(s.id))
      .filter(s => licFilter === "all" ? true : licFilter === "open" ? s.env === "open" : s.env !== "open")
      .sort((a, b) => b.scores.coding - a.scores.coding);
  }, [licFilter]);

  const maxScore = 10;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <Code2 size={24} className="text-violet-500" /> 코딩 인덱스 리더보드
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          모델별 코딩 성능 순위 · Artificial Analysis <span className="font-semibold">Coding Index</span> 참고.
          AA API 연동 시 실제 Coding Index 점수로 자동 전환됩니다.
        </p>
      </div>

      {/* 라이선스 필터 */}
      <div className="flex gap-2">
        {([["all", "전체"], ["cloud", "상용"], ["open", "오픈웨이트"]] as const).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setLicFilter(v)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              licFilter === v
                ? "bg-brand-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 리더보드 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {rows.map((s: ModelStrength, idx) => {
          const model = models.find(m => m.id === s.id);
          const price = model?.inputPrice;
          const st = scoreStyle(s.scores.coding);
          return (
            <div
              key={s.id}
              className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <div className="w-7 text-center shrink-0">
                {idx < 3 ? (
                  <span className="text-sm">{["🥇", "🥈", "🥉"][idx]}</span>
                ) : (
                  <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                )}
              </div>
              <div className="shrink-0">
                <CompanyLogo company={s.companyId} size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{s.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${st.badge}`}>코딩 {s.scores.coding}</span>
                  {s.env === "open" && (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">오픈</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 truncate">{s.tagline}</p>
              </div>
              {/* 점수 바 */}
              <div className="hidden sm:block w-28 shrink-0">
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className={`h-full rounded-full ${st.bar}`} style={{ width: `${(s.scores.coding / maxScore) * 100}%` }} />
                </div>
              </div>
              {/* 가격 */}
              <div className="w-16 text-right shrink-0">
                {price != null ? (
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-300">${price}/M</span>
                ) : (
                  <span className="text-[10px] text-gray-400">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
        <TrendingUp size={12} /> 점수는 1~10 (modelStrengths 기반) · AA API 키 등록 시 실제 Coding Index로 대체
      </p>
    </div>
  );
}
