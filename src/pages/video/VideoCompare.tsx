import { useState } from "react";
import { videoModels, type VideoModel } from "../../data/videoModels";

type SortKey = "date" | "resolution" | "duration" | "price";

export default function ExploreVideoCompare() {
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [tierFilter, setTierFilter] = useState<"all" | "pro" | "consumer" | "open">("all");

  const filtered = videoModels
    .filter(m => tierFilter === "all" || m.tier === tierFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "date": return b.releaseDate.localeCompare(a.releaseDate);
        case "duration": return parseDuration(b.maxDuration) - parseDuration(a.maxDuration);
        case "resolution": return parseRes(b.maxResolution) - parseRes(a.maxResolution);
        default: return 0;
      }
    });

  const TIER_LABELS: Record<string, { label: string; color: string }> = {
    pro: { label: "프로", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
    consumer: { label: "소비자", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
    open: { label: "오픈소스", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🎬 비디오 AI 한눈에 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          주요 비디오 생성 AI의 성능, 가격, 특징을 한눈에 비교하세요.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          {(["all", "pro", "consumer", "open"] as const).map(f => (
            <button
              key={f}
              onClick={() => setTierFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                tierFilter === f
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "전체" : TIER_LABELS[f]?.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {([["date", "출시순"], ["duration", "길이순"], ["resolution", "해상도순"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                sortBy === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">모델</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">등급</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">해상도</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">최대 길이</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">FPS</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">가격</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">특징</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span>{m.flag}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{m.name}</span>
                      {m.isNew && <span className="text-[8px] font-bold text-red-500">NEW</span>}
                    </div>
                    <div className="text-[10px] text-gray-400">{m.company}</div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${TIER_LABELS[m.tier]?.color}`}>
                      {TIER_LABELS[m.tier]?.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-gray-900 dark:text-white">{m.maxResolution}</td>
                  <td className="px-3 py-3 text-center text-gray-700 dark:text-gray-300">{m.maxDuration}</td>
                  <td className="px-3 py-3 text-center text-gray-700 dark:text-gray-300">{m.maxFps}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`font-semibold ${m.price === "무료" || m.price === "오픈소스" ? "text-emerald-600" : "text-gray-900 dark:text-white"}`}>
                      {m.price}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {m.strengths.slice(0, 2).map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[9px] text-gray-500 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.slice(0, 6).map(m => (
          <div key={m.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{m.flag}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{m.name}</span>
                {m.isNew && <span className="text-[8px] font-bold text-red-500">NEW</span>}
              </div>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${TIER_LABELS[m.tier]?.color}`}>
                {TIER_LABELS[m.tier]?.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{m.company} · {m.releaseDate}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{m.description}</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1.5 text-center">
                <div className="text-[10px] text-gray-400">해상도</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">{m.maxResolution}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1.5 text-center">
                <div className="text-[10px] text-gray-400">길이</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">{m.maxDuration}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1.5 text-center">
                <div className="text-[10px] text-gray-400">가격</div>
                <div className={`text-xs font-bold ${m.price === "무료" || m.price === "오픈소스" ? "text-emerald-600" : "text-gray-900 dark:text-white"}`}>
                  {m.price === "무료" || m.price === "오픈소스" ? m.price : "$$$"}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {m.strengths.map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] rounded">✓ {s}</span>
              ))}
              {m.weaknesses.map(w => (
                <span key={w} className="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-[9px] rounded">✗ {w}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseDuration(d: string): number {
  const match = d.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function parseRes(r: string): number {
  if (r.includes("4K")) return 4;
  if (r.includes("1080")) return 2;
  if (r.includes("720")) return 1;
  return 0;
}
