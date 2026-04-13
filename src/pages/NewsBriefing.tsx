import { useState } from "react";
import { useNewsRSS, categoryColor } from "../hooks/useNewsRSS";

type ViewTab = 'briefing' | 'sources';

const SOURCE_TABS = [
  { key: 'all', label: '전체', icon: '📰' },
  { key: 'AI타임스', label: 'AI타임스', icon: '🇰🇷' },
  { key: 'GeekNews', label: 'GeekNews', icon: '🇰🇷' },
  { key: '36氪', label: '36氪', icon: '🇨🇳' },
  { key: 'Hugging Face', label: 'Hugging Face', icon: '🤗' },
  { key: 'TechCrunch', label: 'TechCrunch', icon: '🇺🇸' },
  { key: 'github', label: 'GitHub', icon: '🐙' },
] as const;

const SOURCE_ICONS: Record<string, string> = {
  'AI타임스': '📰', 'GeekNews': '🇰🇷', 'Hugging Face': '🤗',
  '36氪': '🇨🇳', 'TechCrunch': '🇺🇸', 'GitHub': '🐙',
};

export default function NewsBriefing() {
  const { news, github, loading, error, lastUpdated } = useNewsRSS();
  const [tab, setTab] = useState<ViewTab>('briefing');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // All unique categories and sources
  const categories = Array.from(new Set(news.map(n => n.category))).sort();
  const sources = Array.from(new Set(news.map(n => n.source))).sort();

  // Source counts for badges
  const sourceCount: Record<string, number> = {};
  for (const item of news) {
    const src = item.source ?? 'Other';
    sourceCount[src] = (sourceCount[src] || 0) + 1;
  }

  // Filter news by source + category
  const filtered = news.filter(n => {
    const matchCat = categoryFilter === 'all' || n.category === categoryFilter;
    const matchSrc = sourceFilter === 'all' || sourceFilter === 'github' || n.source === sourceFilter;
    return matchCat && matchSrc;
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = news.filter(n => n.date === today).length;

  // Group by date
  const groupedByDate: Record<string, typeof news> = {};
  for (const item of filtered) {
    if (!groupedByDate[item.date]) groupedByDate[item.date] = [];
    groupedByDate[item.date].push(item);
  }
  const dateKeys = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const formatDate = (d: string) => {
    if (!d) return '';
    const dd = new Date(d);
    if (isNaN(dd.getTime())) return d;
    if (d === today) return '오늘';
    const diff = Math.floor((Date.now() - dd.getTime()) / 86400000);
    if (diff === 1) return '어제';
    return dd.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const isGithubTab = sourceFilter === 'github';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">📰 AI 뉴스 브리핑</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI타임스 · GeekNews · 36氪 · Hugging Face · TechCrunch에서 자동 수집
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
          <div className="text-2xl font-black text-violet-600">{sources.length}</div>
          <div className="text-xs text-gray-500">뉴스 소스</div>
        </div>
      </div>

      {/* Source tabs */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max pb-1">
          {SOURCE_TABS.map(st => {
            const count = st.key === 'all'
              ? news.length
              : st.key === 'github'
                ? github.length
                : sourceCount[st.key] ?? 0;
            const isActive = sourceFilter === st.key;
            return (
              <button
                key={st.key}
                onClick={() => {
                  setSourceFilter(st.key);
                  setCategoryFilter('all');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category filter pills (only for non-GitHub tabs) */}
      {!isGithubTab && categories.length > 0 && (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 min-w-max pb-1">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              전체 카테고리
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">뉴스 불러오는 중...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-8 text-sm text-gray-400">
          뉴스를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {/* GitHub Tab Content */}
      {!loading && isGithubTab && (
        <div>
          {github.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">GitHub 데이터가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {github.map(repo => (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">
                      {repo.language || ''}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 shrink-0">
                      {repo.stars !== undefined && <span>⭐ {repo.stars.toLocaleString()}</span>}
                      {repo.starsGained !== undefined && repo.starsGained > 0 && (
                        <span className="text-emerald-500">+{repo.starsGained.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {repo.title}
                  </h4>
                  {repo.summary && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {repo.summary}
                    </p>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* "All" Tab: date-grouped card grid */}
      {!loading && !isGithubTab && sourceFilter === 'all' && dateKeys.map(date => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400">{formatDate(date)}</h3>
            <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
              {groupedByDate[date].length}건
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groupedByDate[date].map(item => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">{item.sourceFlag ?? SOURCE_ICONS[item.source] ?? '📰'}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${categoryColor[item.category] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    {item.category}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {item.titleKo || item.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Individual source tab: flat card grid (no date grouping) */}
      {!loading && !isGithubTab && sourceFilter !== 'all' && (
        <div>
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">이 소스에 해당하는 기사가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">{item.sourceFlag ?? SOURCE_ICONS[item.source] ?? '📰'}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${categoryColor[item.category] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.titleKo || item.title}
                  </h4>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Source analysis section */}
      {!loading && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <div className="flex gap-2 mb-3">
            {(['briefing', 'sources'] as ViewTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${tab === t
                  ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'}`}>
                {t === 'briefing' ? '📰 뉴스' : '📊 소스 분석'}
              </button>
            ))}
          </div>
          {tab === 'sources' && (
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.entries(sourceCount)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => (
                  <div key={source} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 flex items-center gap-3">
                    <span className="text-lg">{SOURCE_ICONS[source] ?? '📰'}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{source}</p>
                      <p className="text-xs text-gray-400">{count}건</p>
                    </div>
                    <div className="w-24 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-blue-500 rounded-full h-1.5" style={{ width: `${(count / news.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
