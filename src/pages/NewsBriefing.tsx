import { useState } from "react";
import { useNewsRSS, categoryColor } from "../hooks/useNewsRSS";

type ViewTab = 'briefing' | 'sources';

const SOURCE_ICONS: Record<string, string> = {
  'AI타임스': '📰', 'GeekNews': '🇰🇷', 'Hugging Face': '🤗',
  '36氪': '🇨🇳', 'TechCrunch': '🇺🇸', 'GitHub': '🐙',
};

export default function NewsBriefing() {
  const { news, github, loading, error, lastUpdated } = useNewsRSS();
  const [tab, setTab] = useState<ViewTab>('briefing');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // All unique categories
  const categories = Array.from(new Set(news.map(n => n.category))).sort();
  const sources = Array.from(new Set(news.map(n => n.source))).sort();

  // Filter
  const filtered = news.filter(n => {
    const matchCat = categoryFilter === 'all' || n.category === categoryFilter;
    const matchSrc = sourceFilter === 'all' || n.source === sourceFilter;
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

  const formatDate = (d: string) => {
    if (d === today) return '오늘';
    const diff = Math.floor((new Date(today).getTime() - new Date(d).getTime()) / 86400000);
    if (diff === 1) return '어제';
    try {
      return new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' });
    } catch { return d; }
  };

  return (
    <div className="space-y-6">
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

      {/* Category filters */}
      <div>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">📂 카테고리</p>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setCategoryFilter('all')}
            className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${categoryFilter === 'all'
              ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            전체
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${categoryFilter === cat
                ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {cat}
              <span className="ml-1 opacity-60">{catCount[cat] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Source filters */}
      {sources.length > 1 && (
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">📡 소스별</p>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setSourceFilter('all')}
              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${sourceFilter === 'all'
                ? 'bg-violet-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              전체
            </button>
            {sources.map(src => (
              <button key={src} onClick={() => setSourceFilter(sourceFilter === src ? 'all' : src)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${sourceFilter === src
                  ? 'bg-violet-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                {SOURCE_ICONS[src] ?? '📰'} {src}
                <span className="ml-1 opacity-60">{sourceCount[src] ?? 0}</span>
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

      {/* News list */}
      {!loading && dateKeys.map(date => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400">
              {formatDate(date)}
            </h3>
            <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
              {groupedByDate[date].length}건
            </span>
          </div>
          <div className="space-y-2">
            {groupedByDate[date].map(item => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0 mt-0.5">{item.sourceFlag ?? '📰'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${categoryColor[item.category] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.source}</span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    {item.summary && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{item.summary}</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* GitHub Trending */}
      {github.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">🐙 GitHub 트렌딩</h2>
          <div className="space-y-2">
            {github.map(repo => (
              <a key={repo.id} href={repo.url} target="_blank" rel="noopener noreferrer"
                className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {repo.title}
                    </h4>
                    {repo.summary && <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{repo.summary}</p>}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 shrink-0">
                    {repo.language && <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{repo.language}</span>}
                    {repo.stars !== undefined && <span>⭐ {repo.stars.toLocaleString()}</span>}
                    {repo.starsGained !== undefined && repo.starsGained > 0 && <span className="text-emerald-500">+{repo.starsGained.toLocaleString()}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Source analysis tab */}
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
    </div>
  );
}
