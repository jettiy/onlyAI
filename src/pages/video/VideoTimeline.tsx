import { useState } from "react";
import { videoModels, TIMELINE_EVENTS } from "../../data/videoModels";
import { logoIdToPath } from "../../lib/logoUtils";

const YEARS = ["2024", "2025", "2026"];
type Year = typeof YEARS[number];

export default function VideoTimeline() {
  const [activeYear, setActiveYear] = useState<Year>("2026");

  const filteredEvents = TIMELINE_EVENTS.filter(e => e.date.startsWith(activeYear)).reverse();
  const modelsByYear = YEARS.reduce<Record<string, typeof videoModels>>((acc, year) => {
    acc[year] = videoModels.filter(m => m.releaseDate.startsWith(year));
    return acc;
  }, {} as Record<string, typeof videoModels>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🎥 비디오 AI 타임라인</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          비디오 생성 AI의 발전 역사와 최신 모델 현황.
        </p>
      </div>

      {/* Year selector */}
      <div className="flex gap-2">
        {YEARS.map(year => {
          const count = TIMELINE_EVENTS.filter(e => e.date.startsWith(year)).length;
          return (
            <button
              key={year}
              onClick={() => setActiveYear(year as Year)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeYear === year
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {year} ({count})
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-4">
          {filteredEvents.map((event, idx) => (
            <div key={event.date + event.title} className="relative flex gap-4">
              {/* Dot */}
              <div className="relative z-10 w-12 shrink-0 flex justify-center pt-1">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  event.isNew
                    ? "bg-red-500 border-red-300"
                    : "bg-brand-500 border-brand-300"
                }`} />
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400">{event.date}</span>
                  {event.logoId && (() => { const s = logoIdToPath(event.logoId); return s ? <img src={s} alt={event.company} className="w-4 h-4 rounded-sm object-contain" loading="lazy" /> : <span className="text-sm">{event.company[0]}</span>; })()}
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{event.title}</span>
                  {event.isNew && <span className="text-[8px] font-bold text-red-500">NEW</span>}
                  <span className="text-[10px] text-gray-400">{event.company}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Models released this year */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          {activeYear}년 출시 모델 ({modelsByYear[activeYear]?.length || 0}개)
        </h3>
        {modelsByYear[activeYear]?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {modelsByYear[activeYear].map(m => (
              <div key={m.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-1">
                  {m.logoId && (() => { const s = logoIdToPath(m.logoId); return s ? <img src={s} alt={m.company} className="w-4 h-4 rounded-sm object-contain" loading="lazy" /> : <span className="text-xs text-gray-400">{m.company[0]}</span>; })()}
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{m.name}</span>
                  {m.isNew && <span className="text-[8px] font-bold text-red-500">NEW</span>}
                </div>
                <p className="text-[10px] text-gray-400">{m.company} · {m.maxResolution} · {m.maxDuration}</p>
                <p className="text-[10px] text-emerald-600">{m.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">이 해에 출시된 모델이 없습니다.</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-black text-gray-900 dark:text-white">{videoModels.length}</div>
          <div className="text-[10px] text-gray-400">등록된 모델</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-black text-brand-600">{videoModels.filter(m => m.maxResolution === "4K").length}</div>
          <div className="text-[10px] text-gray-400">4K 지원</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-black text-emerald-600">{videoModels.filter(m => m.price.includes("무료") || m.price.includes("오픈")).length}</div>
          <div className="text-[10px] text-gray-400">무료/오픈소스</div>
        </div>
      </div>
    </div>
  );
}
