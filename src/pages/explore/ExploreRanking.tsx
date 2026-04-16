import { useState } from "react";
import { WEEKLY_RANKING, MONTHLY_RANKING, RANKING_SOURCE, type RankingEntry } from "../../data/rankings";
import { CompanyLogo } from "../../components/CompanyLogo";

type Period = "weekly" | "monthly";

function getChangeColor(change: string) {
  if (change === "NEW") return "text-emerald-500";
  const val = parseInt(change, 10);
  if (val > 0) return "text-red-500";
  if (val < 0) return "text-blue-500";
  return "text-gray-400";
}

function getChangeBg(change: string) {
  if (change === "NEW") return "bg-emerald-100 dark:bg-emerald-900/40";
  const val = parseInt(change, 10);
  if (val > 0) return "bg-red-50 dark:bg-red-900/30";
  if (val < 0) return "bg-blue-50 dark:bg-blue-900/30";
  return "bg-gray-100 dark:bg-gray-800";
}

export default function ExploreRanking() {
  const [period, setPeriod] = useState<Period>("weekly");

  const data: RankingEntry[] = period === "weekly" ? WEEKLY_RANKING : MONTHLY_RANKING;
  const topModel = data[0];
  const maxTokens = Math.max(...data.map((m) => m.tokensNum));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🏆 AI 모델 인기 랭킹</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          OpenRouter 토큰 사용량 기준 — 가장 많이 쓰이는 AI 모델 순위예요.
        </p>
      </div>

      {/* 기간 탭 */}
      <div className="flex gap-2">
        {(["weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              period === p
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {p === "weekly" ? "이번 주" : "이번 달"}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {topModel && (
        <div className="grid grid-cols-3 gap-3">
          {[data[1], data[0], data[2]].filter(Boolean).map((m, idx) => {
            const medals = ["🥈", "🥇", "🥉"];
            const sizes = ["", "ring-2 ring-amber-400 scale-105", ""];
            return (
              <div
                key={m.model}
                className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center ${sizes[idx]}`}
              >
                <div className="text-2xl mb-1">{medals[idx]}</div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <CompanyLogo company={m.company} size={16} />
                  <span className="text-[10px] text-gray-400">{m.company}</span>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{m.model}</div>
                <div className="text-lg font-black bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent mt-1">
                  {m.tokens}
                </div>
                <div className="text-[9px] text-gray-400">토큰</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ranking List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="w-5 text-xs font-semibold text-gray-400 text-center">순위</div>
          <div className="w-36 text-xs font-semibold text-gray-400">모델</div>
          <div className="flex-1 text-xs font-semibold text-gray-400">토큰 사용량</div>
          <div className="w-16 text-xs font-semibold text-gray-400 text-right">토큰</div>
          <div className="w-14 text-xs font-semibold text-gray-400 text-center">변동</div>
        </div>

        {data.map((m) => {
          const pct = (m.tokensNum / maxTokens) * 100;
          const barColor =
            m.rank <= 3
              ? "from-amber-400 to-orange-500"
              : m.rank <= 6
              ? "from-brand-400 to-violet-500"
              : "from-gray-400 to-gray-500";
          return (
            <div key={m.model} className="flex items-center gap-3 group">
              <div
                className={`w-5 text-xs text-center shrink-0 font-bold ${
                  m.rank <= 3 ? "text-amber-500" : "text-gray-400"
                }`}
              >
                {m.rank <= 3 ? ["🥇", "🥈", "🥉"][m.rank - 1] : m.rank}
              </div>
              <div className="w-36 shrink-0 flex items-center gap-2">
                <CompanyLogo company={m.company} size={18} />
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
                    {m.model}
                  </div>
                  <div className="text-[10px] text-gray-400">{m.company}</div>
                </div>
              </div>
              <div className="flex-1 relative h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="w-16 text-right text-sm font-black text-gray-900 dark:text-white shrink-0 font-mono">
                {m.tokens}
              </div>
              <div className="w-14 text-center shrink-0">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getChangeColor(m.change)} ${getChangeBg(m.change)}`}
                >
                  {m.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 출처 */}
      <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-brand-800 dark:text-brand-300 mb-1">ℹ️ 랭킹 출처</p>
        <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">
          {RANKING_SOURCE}. OpenRouter 플랫폼에서 라우팅된 토큰 사용량을 기준으로 한 인기 랭킹입니다.
          실제 전체 사용량과는 차이가 있을 수 있습니다.
        </p>
      </div>
    </div>
  );
}
