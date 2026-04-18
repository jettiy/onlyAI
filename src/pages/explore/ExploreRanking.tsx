import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "../../lib/safeRecharts";
import {
  WEEKLY_RANKING, MONTHLY_RANKING, RANKING_TIMELINE, RANKING_SOURCE,
  ARENA_EXPERT_TOP20,
  type RankingEntry,
} from "../../data/rankings";
import { CompanyLogo } from "../../components/CompanyLogo";

type Period = "weekly" | "monthly";
type View = "chart" | "list";

/* ── helpers ── */
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

function getCategoryLabel(cat: string) {
  switch (cat) {
    case "flagship": return "🚀 플래그십";
    case "value": return "💎 가성비";
    case "free": return "🆓 무료";
    default: return cat;
  }
}

const AREA_COLORS = ["#f59e0b", "#fb923c", "#8b5cf6", "#6366f1", "#10b981"];

/* ── Custom tooltip ── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl border border-gray-700">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="flex justify-between gap-4">
          <span>{p.name}</span>
          <span className="font-mono">{p.value.toFixed(2)}T</span>
        </p>
      ))}
    </div>
  );
}

/* ── Share Donut (CSS only) ── */
function ShareRing({ share, color }: { share: number; color: string }) {
  const pct = Math.min(share, 100);
  return (
    <div className="relative w-10 h-10">
      <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="3" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor"
          className={color}
          strokeWidth="3"
          strokeDasharray={`${pct} ${100 - pct}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700 dark:text-gray-300">
        {share}%
      </span>
    </div>
  );
}

/* ── Main Component ── */
export default function ExploreRanking() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [view, setView] = useState<View>("list");

  const data: RankingEntry[] = period === "weekly" ? WEEKLY_RANKING : MONTHLY_RANKING;
  const topModel = data[0];
  const maxTokens = Math.max(...data.map((m) => m.tokensNum));

  return (
    <div className="space-y-6">
      {/* ── 헤더 ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
            🏆 AI 모델 인기 랭킹
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            OpenRouter 토큰 사용량 기준 — 가장 많이 쓰이는 AI 모델 순위예요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* 기간 토글 */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {(["weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  period === p
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {p === "weekly" ? "이번 주" : "이번 달"}
              </button>
            ))}
          </div>
          {/* 뷰 토글 */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setView("list")}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                view === "list"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="리스트 뷰"
            >
              ☰
            </button>
            <button
              onClick={() => setView("chart")}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                view === "chart"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="차트 뷰"
            >
              📊
            </button>
          </div>
        </div>
      </div>

      {/* ── 트렌드 Area Chart ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">📈 토큰 사용량 추이</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={RANKING_TIMELINE} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              {WEEKLY_RANKING.slice(0, 5).map((m, i) => (
                <linearGradient key={m.model} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={AREA_COLORS[i]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={AREA_COLORS[i]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" unit="T" />
            <Tooltip content={<ChartTooltip />} />
            {WEEKLY_RANKING.slice(0, 5).map((m, i) => (
              <Area
                key={m.model}
                type="monotone"
                dataKey={m.model}
                stroke={AREA_COLORS[i]}
                fill={`url(#grad-${i})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Top 3 Podium ── */}
      {topModel && view === "list" && (
        <div className="grid grid-cols-3 gap-3">
          {[data[1], data[0], data[2]].filter(Boolean).map((m, idx) => {
            const medals = ["🥈", "🥇", "🥉"];
            const sizes = ["", "ring-2 ring-amber-400 scale-105", ""];
            return (
              <div
                key={m.model}
                className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center transition-transform hover:scale-[1.02] ${sizes[idx]}`}
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
                <div className="mt-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getChangeColor(m.change)} ${getChangeBg(m.change)}`}>
                    {m.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 리스트 뷰 ── */}
      {view === "list" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <div className="w-6 text-[10px] font-semibold text-gray-400 text-center">#</div>
            <div className="w-40 text-[10px] font-semibold text-gray-400">모델</div>
            <div className="flex-1 text-[10px] font-semibold text-gray-400">사용량</div>
            <div className="w-10 text-[10px] font-semibold text-gray-400 text-center">점유율</div>
            <div className="w-14 text-[10px] font-semibold text-gray-400 text-right">토큰</div>
            <div className="w-12 text-[10px] font-semibold text-gray-400 text-center">변동</div>
          </div>

          {/* 행 */}
          {data.map((m) => {
            const pct = (m.tokensNum / maxTokens) * 100;
            return (
              <div
                key={m.model}
                className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group"
              >
                {/* 순위 */}
                <div className="w-6 text-center shrink-0">
                  {m.rank <= 3 ? (
                    <span className="text-sm">{["🥇", "🥈", "🥉"][m.rank - 1]}</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-400">{m.rank}</span>
                  )}
                </div>

                {/* 모델명 + 회사 */}
                <div className="w-40 shrink-0 flex items-center gap-2">
                  <CompanyLogo company={m.company} size={20} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
                      {m.model}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400">{m.company}</span>
                      <span className="text-[8px] px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {getCategoryLabel(m.category)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 토큰 바 */}
                <div className="flex-1 relative h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg bg-gradient-to-r ${m.color} transition-all duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-500 dark:text-gray-400">
                    {m.share}%
                  </span>
                </div>

                {/* 점유율 도넛 */}
                <div className="w-10 shrink-0 flex justify-center">
                  <ShareRing share={m.share} color={m.rank <= 3 ? "text-amber-500" : m.category === "free" ? "text-emerald-500" : "text-violet-500"} />
                </div>

                {/* 토큰 수 */}
                <div className="w-14 text-right text-xs font-black text-gray-900 dark:text-white shrink-0 font-mono">
                  {m.tokens}
                </div>

                {/* 변동 */}
                <div className="w-12 text-center shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getChangeColor(m.change)} ${getChangeBg(m.change)}`}>
                    {m.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 차트 뷰 ── */}
      {view === "chart" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">📊 토큰 사용량 비교</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 60 }}>
              <XAxis
                dataKey="model"
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} unit="T" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}T`, "토큰"]}
              />
              <Bar dataKey="tokensNum" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {data.map((m, i) => (
                  <Cell
                    key={i}
                    className={`fill-current ${
                      m.rank === 1 ? "text-amber-400" :
                      m.rank === 2 ? "text-orange-400" :
                      m.rank === 3 ? "text-yellow-500" :
                      m.category === "free" ? "text-emerald-400" :
                      "text-violet-400"
                    }`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ═══ arena.ai Expert 랭킹 ═══ */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">⚔️ arena.ai Expert 랭킹</h2>
        <p className="text-xs text-gray-400 mb-4">전문가 블라인드 평가 · 295,028표 · 290개 모델 · 2026년 4월 17일</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500">
                <th className="py-2 px-2 w-12">순위</th>
                <th className="py-2 px-2">모델</th>
                <th className="py-2 px-2">회사</th>
                <th className="py-2 px-2 text-right">점수</th>
                <th className="py-2 px-2 text-right">신뢰구간</th>
                <th className="py-2 px-2 text-right">투표수</th>
                <th className="py-2 px-2 text-right">순위범위</th>
                <th className="py-2 px-2 text-center">라이선스</th>
              </tr>
            </thead>
            <tbody>
              {ARENA_EXPERT_TOP20.map((e, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-2.5 px-2 font-bold">
                    <span className={e.rank <= 3 ? `inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] ${e.rank === 1 ? 'bg-amber-400' : e.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'}` : ''}>
                      {e.rank <= 3 ? ['', '🥇', '🥈', '🥉'][e.rank] : e.rank}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-semibold text-gray-900 dark:text-white">{e.name}</td>
                  <td className="py-2.5 px-2 text-gray-500">{e.company}</td>
                  <td className="py-2.5 px-2 text-right font-bold text-gray-900 dark:text-white">{e.score}</td>
                  <td className="py-2.5 px-2 text-right text-gray-400">{e.ci}</td>
                  <td className="py-2.5 px-2 text-right text-gray-500">{e.votes > 0 ? e.votes.toLocaleString() : '-'}</td>
                  <td className="py-2.5 px-2 text-right text-gray-400">{e.rankSpread}</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${e.license === 'open' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      {e.license === 'open' ? '오픈소스' : '상용'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 출처 ── */}
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
