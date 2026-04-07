import { useState, useEffect } from "react";
import { useNewsRSS, categoryColor } from "../hooks/useNewsRSS";

type ViewTab = 'briefing' | 'sources';

const SOURCE_ICONS: Record<string, string> = {
  'AI타임스': '📰',
  'GeekNews': '🇰🇷',
  'Hugging Face': '🤗',
  'GitHub': '🐙',
};

export default function NewsBriefing() {
  const { news, github, loading, lastUpdated } = useNewsRSS();
  const [tab, setTab] = useState<ViewTab>('briefing');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Group news by category
  const categories = Array.from(new Set(news.map(n => n.category)));

  const filtered = categoryFilter === 'all'
    ? news
    : news.filter(n => n.category === categoryFilter);

  // Today's count
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = news.filter(n => n.date === today).length;

  // Group by date
  const groupedByDate: Record<string, typeof news> = {};
  for (const item of filtered) {
    if (!groupedByDate[item.date]) groupedByDate[item.date] = [];
    groupedByDate[item.date].push(item);
  }
  const dateKeys = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  // Source distribution
  const sourceCount: Record<string, number> = {};
  for (const item of news) {
    const src = item.source ?? 'Other';
    sourceCount[src] = (sourceCount[src] || 0) + 1;
  }

  // Category distribution
  const catCount: Record<string, number> = {};
  for (const item of news) {
    catCount[item.category] = (catCount[item.category] || 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">📰 AI 뉴스 브리핑</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI타임스 · GeekNews · Hugging Face에서 자동 수집
          {lastUpdated && (
            <span className="ml-1">
              · <span className="text-gray-400">{lastUpdated.toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 업데이트</span>
            </span>
          )}
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
          <div className="text-2xl font-black text-gray-900 dark:text-white">{news.length}</div>
          <div className="text-xs text-gray-500">전체 뉴스</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
          <div className="text-2xl font-black text-emerald-600">{todayCount}</div>
          <div className="text-xs text-gray-500">오늘 새로운</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
          <div className="text-2xl font-black text-blue-600">{github.length}</div>
          <div className="text-xs text-gray-500">GitHub 인기</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
          <div className="text-2xl font-black text-violet-600">{Object.keys(sourceCount).length}</div>
          <div className="text-xs text-gray-500">뉴스 소스</div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {([['briefing','📋 브리핑'],['sources','📊 소스 분석']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as ViewTab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === key
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Briefing Tab */}
      {tab === 'briefing' && (
        <>
          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`}>
              전체 ({news.length})
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  categoryFilter === cat
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}>
                {cat} ({catCount[cat] || 0})
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              뉴스 불러오는 중...
            </div>
          )}

          {/* Grouped by date */}
          <div className="space-y-6">
            {dateKeys.map(date => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {date === today ? '📅 오늘' : date === new Date(Date.now() - 86400000).toISOString().slice(0, 10) ? '어제' : date}
                  </span>
                  <span className="text-xs text-gray-400">{groupedByDate[date].length}건</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {groupedByDate[date].map((item, idx) => (
                    <a key={item.id + idx} href={item.url} target="_blank" rel="noopener noreferrer"
                      className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColor[item.category] ?? ''}`}>
                          {item.category}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {(item.sourceFlag ?? '')} {item.source}
                        </span>
                        {item.lang === 'en' && (
                          <span className="text-[10px] text-gray-400">🇺🇸</span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      {item.summary && item.summary.length > 10 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      )}
                      {item.isGithub && item.stars && (
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                          <span>⭐ {item.stars?.toLocaleString()}</span>
                          {item.language && <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{item.language}</span>}
                          {item.tags && item.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-gray-300">#{t}</span>
                          ))}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-400">뉴스를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div>
          )}
        </>
      )}

      {/* Sources Tab */}
      {tab === 'sources' && (
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Source cards */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">📊 뉴스 소스별 수집 현황</h2>
            <div className="space-y-3">
              {Object.entries(sourceCount)
                .sort(([,a], [,b]) => b - a)
                .map(([source, count]) => {
                  const max = Math.max(...Object.values(sourceCount));
                  return (
                    <div key={source} className="flex items-center gap-3">
                      <span className="text-sm">{SOURCE_ICONS[source] ?? '📰'}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24 truncate">{source}</span>
                      <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${(count / max) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 w-8 text-right">{count}건</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">🏷️ 카테고리별 분포</h2>
            <div className="space-y-2">
              {Object.entries(catCount)
                .sort(([,a], [,b]) => b - a)
                .map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColor[cat] ?? ''} w-20 text-center`}>
                      {cat}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${(count / news.length) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* GitHub trending */}
          <div className="sm:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">🐙 GitHub 인기 AI 레포지토리</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {github.slice(0, 8).map((item, idx) => (
                <a key={item.id + idx} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                  <span className="text-lg font-black text-gray-300 dark:text-gray-600 w-6 text-right shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{item.summary}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                      <span>⭐ {item.stars?.toLocaleString()}</span>
                      {item.language && <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{item.language}</span>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
