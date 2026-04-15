import { useState, useEffect } from "react";
import { useNewsRSS, categoryColor, type NewsItem, type NewsCategory } from "../hooks/useNewsRSS";

const ALL_CATEGORIES: (NewsCategory | "전체")[] = [
  "전체", "모델 출시", "연구·논문", "에이전트", "오픈소스",
  "파인튜닝", "벤치마크", "인프라·하드웨어", "개발 도구", "멀티모달", "산업·정책",
];

const SOURCES = [
  { id: "all",               label: "전체",     flag: "📰" },
  { id: "Hugging Face Blog", label: "HF Blog",  flag: "🤗" },
  { id: "AI타임스",          label: "AI타임스",  flag: "🇰🇷" },
  { id: "GeekNews",          label: "GeekNews", flag: "🇰🇷" },
  { id: "GitHub Trending",   label: "GitHub",   flag: "⭐" },
];

const SOURCE_COLORS: Record<string, string> = {
  "Hugging Face Blog": "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
  "AI타임스":          "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800",
  "GeekNews":          "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800",
  "GitHub Trending":   "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
};

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1) return "방금 전";
  if (diffH < 24) return `${diffH}시간 전`;
  if (diffD === 1) return "어제";
  if (diffD < 7) return `${diffD}일 전`;
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`;
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n/1000).toFixed(1)}k`;
  return String(n);
}

// GitHub card component
function GithubCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg">⭐</span>
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              {item.url.replace("https://github.com/", "")}
            </span>
            {item.language && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800">
                {item.language}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{item.summary}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags?.map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">#{t}</span>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-bold text-gray-900 dark:text-white">⭐ {formatStars(item.stars ?? 0)}</div>
          <div className="text-xs text-gray-400">{timeAgo(item.date)}</div>
        </div>
      </div>
    </a>
  );
}

// Regular news card
function NewsCard({ item }: { item: NewsItem }) {
  const srcColor = SOURCE_COLORS[item.source] ?? "bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700";
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-brand-300 dark:hover:border-brand-600 transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-2 flex-wrap">
        {item.isNew && (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">NEW</span>
        )}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColor[item.category]}`}>
          {item.category}
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${srcColor}`}>
          {item.source}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">{timeAgo(item.date)}</span>
      </div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2">
        {item.title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
        {item.summary}
      </p>
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">#{t}</span>
          ))}
        </div>
      )}
      <div className="text-xs text-brand-500 dark:text-brand-400 font-medium mt-0.5">읽기 →</div>
    </a>
  );
}

// Hero card (featured top story)
function HeroCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-700 p-5 hover:border-brand-500 transition-all hover:shadow-xl hover:shadow-brand-900/20"
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {item.isNew && (
          <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold animate-pulse">Breaking</span>
        )}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColor[item.category]}`}>
          {item.category}
        </span>
        <span className="text-[10px] text-gray-400 ml-auto">{timeAgo(item.date)}</span>
      </div>
      <h2 className="text-base font-black text-white mb-2 leading-snug group-hover:text-brand-300 transition-colors line-clamp-3">
        {item.title}
      </h2>
      <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">{item.summary}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-1">
          {item.tags?.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-700 text-gray-300 rounded">#{t}</span>
          ))}
        </div>
        <span className="text-xs text-brand-400 font-medium">자세히 읽기 →</span>
      </div>
    </a>
  );
}

export default function News() {
  const { news, github, loading, lastUpdated, refetch } = useNewsRSS();
  const [sourceFilter, setSourceFilter] = useState("all");
  const [catFilter, setCatFilter] = useState<NewsCategory | "전체">("전체");
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [minutesAgo, setMinutesAgo] = useState(0);

  // 업데이트 시간 표시
  useEffect(() => {
    const tick = () => {
      const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
      setMinutesAgo(diff);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const isGithubTab = sourceFilter === "GitHub Trending";

  const filtered = isGithubTab ? github : news.filter((n) => {
    if (sourceFilter !== "all" && n.source !== sourceFilter) return false;
    if (catFilter !== "전체" && n.category !== catFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      const inTitle   = n.title.toLowerCase().includes(q);
      const inSummary = n.summary.toLowerCase().includes(q);
      const inTags    = n.tags?.some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inSummary && !inTags) return false;
    }
    return true;
  });

  const hero = !isGithubTab ? filtered[0] : null;
  const rest = !isGithubTab ? filtered.slice(1) : filtered;
  const newCount = news.filter((n) => n.isNew).length;

  return (
    <div className="space-y-5">

      {/* ── 헤더 ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-0.5 flex items-center gap-2">
            📰 AI 뉴스룸
            {newCount > 0 && (
              <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                NEW {newCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            모델·논문·오픈소스·정책 소식만 선별해요 · 30분마다 자동 갱신
          </p>
          {!loading && (
            <p className="text-xs text-green-500 dark:text-green-400 mt-0.5">
              ✓ 최종 업데이트 {minutesAgo === 0 ? "방금 전" : `${minutesAgo}분 전`}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className={"flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors " + (
            refreshing || loading
              ? "border-gray-200 dark:border-gray-700 text-gray-400"
              : "border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20"
          )}
        >
          <svg className={"w-4 h-4 " + ((refreshing || loading) ? "animate-spin" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {(refreshing || loading) ? "업데이트 중..." : "새로 고침"}
        </button>
      </div>

      {/* ── 출처 탭 ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSourceFilter(s.id); setCatFilter("전체"); }}
            className={"flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors " + (
              sourceFilter === s.id
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
            )}
          >
            <span>{s.flag}</span> {s.label}
          </button>
        ))}
      </div>

      {/* ── 카테고리 칩 (GitHub 탭이 아닐 때만) ── */}
      {!isGithubTab && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={"px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors " + (
                catFilter === c
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-200"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* ── 검색 (GitHub 탭이 아닐 때만) ── */}
      {!isGithubTab && (
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="모델명, 기술, 키워드로 검색..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-brand-400 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      )}

      {/* ── 로딩 인디케이터 ── */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-brand-500 dark:text-brand-400 py-2">
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          3개 출처에서 최신 AI 소식 자동 수집 중...
        </div>
      )}

      {/* ── GitHub 탭 전용 렌더링 ── */}
      {isGithubTab && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">⭐ GitHub 인기 AI 레포지토리</span>
            <span className="text-xs text-gray-400">이번 주 트렌딩 기준</span>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400">
              GitHub 데이터를 가져오는 중이에요...
            </div>
          )}
          <div className="space-y-3">
            {filtered.map((item) => (
              <GithubCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ── 일반 뉴스 렌더링 ── */}
      {!isGithubTab && (
        <>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-16 space-y-2">
              <p className="text-3xl">🔍</p>
              <p className="text-sm text-gray-400">조건에 맞는 뉴스가 없어요.</p>
            </div>
          )}

          {/* 히어로 카드 */}
          {hero && <HeroCard item={hero} />}

          {/* 나머지 카드 그리드 */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rest.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
