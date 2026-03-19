import { useState } from "react";
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
];

const SOURCE_COLORS: Record<string, string> = {
  "Hugging Face Blog": "text-yellow-600 dark:text-yellow-400",
  "AI타임스":          "text-blue-600 dark:text-blue-400",
  "GeekNews":          "text-green-600 dark:text-green-400",
};

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  if (diff < 7) return `${diff}일 전`;
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`;
}

function readingTimeEst(summary: string): string {
  const words = summary.replace(/[^\w\s가-힣]/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 150));
  return `${mins}분`;
}

export default function News() {
  const { news, loading, lastUpdated, refetch } = useNewsRSS();
  const [sourceFilter, setSourceFilter] = useState("all");
  const [catFilter, setCatFilter]     = useState<NewsCategory | "전체">("전체");
  const [query, setQuery]             = useState("");
  const [refreshing, setRefreshing]   = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filtered = news.filter((n) => {
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

  const hero = filtered[0];
  const secondary = filtered.slice(1, 4);
  const rest = filtered.slice(4);
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
            모델 출시 · 논문 · 오픈소스 · 정책 소식만 선별해요
            {lastUpdated && (
              <span className="ml-2 text-green-500 font-medium">
                · {lastUpdated.toLocaleDateString("ko-KR")} 업데이트
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={"flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors " + (
            refreshing
              ? "border-gray-200 dark:border-gray-700 text-gray-400"
              : "border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          )}
        >
          <svg className={"w-4 h-4 " + (refreshing ? "animate-spin" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? "업데이트 중..." : "새로 고침"}
        </button>
      </div>

      {/* ── 출처 필터 ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSourceFilter(s.id)}
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

      {/* ── 카테고리 칩 ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={"px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors " + (
              catFilter === c
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-200"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── 검색 ── */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="모델명, 기술, 키워드로 검색..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      {loading && (
        <p className="text-center text-sm text-gray-400 py-2">최신 소식 확인 중...</p>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-3xl">🔍</p>
          <p className="text-sm text-gray-400">조건에 맞는 뉴스가 없어요.</p>
        </div>
      )}

      {/* ── 히어로 카드 (풀 와이드, 매거진 스타일) ── */}
      {hero && (
        <a
          href={hero.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-700 dark:border-gray-700 p-6 md:p-8 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-900/20"
        >
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {hero.isNew && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs rounded-full font-bold uppercase tracking-wide animate-pulse">
                Breaking
              </span>
            )}
            <span className={categoryColor[hero.category] + " px-2.5 py-1 text-xs rounded-full font-semibold"}>
              {hero.category}
            </span>
            <span className={"text-xs font-semibold " + (SOURCE_COLORS[hero.source] ?? "text-gray-400")}>
              {hero.source}
            </span>
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-400">{timeAgo(hero.date)}</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-500">📖 {hero.readingTime ?? readingTimeEst(hero.summary)} 읽기</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors leading-snug">
            {hero.title}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4 max-w-3xl">{hero.summary}</p>

          {hero.tags && hero.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {hero.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 bg-gray-700/60 text-gray-300 text-xs rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-blue-400 font-medium group-hover:text-blue-300">
            <span>원문 읽기</span>
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </a>
      )}

      {/* ── 서브 히어로 3개 (가로 배열) ── */}
      {secondary.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          {secondary.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-100 dark:border-gray-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {item.isNew && <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded-full font-bold">NEW</span>}
                <span className={categoryColor[item.category] + " px-2 py-0.5 text-[10px] rounded-full font-medium"}>
                  {item.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">{item.summary}</p>
              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className={"font-semibold " + (SOURCE_COLORS[item.source] ?? "")}>{item.source}</span>
                <span>{timeAgo(item.date)}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* ── 나머지 뉴스 피드 ── */}
      {rest.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
            더 많은 소식
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {rest.map((item) => (
              <FeedRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ── 출처 안내 ── */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">큐레이션 출처</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { name: "🤗 Hugging Face Blog", desc: "AI 연구·모델·논문 공식 블로그", url: "https://huggingface.co/blog" },
            { name: "🇰🇷 AI타임스",          desc: "국내 AI 기술 전문 미디어",       url: "https://www.aitimes.com" },
            { name: "🇰🇷 GeekNews",          desc: "개발자 커뮤니티 AI 소식 (RSS 실시간)", url: "https://news.hada.io" },
          ].map((src) => (
            <a key={src.name} href={src.url} target="_blank" rel="noopener noreferrer"
              className="flex flex-col gap-1 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{src.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{src.desc}</p>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-3">
          광고·PR·투자 소식은 제외하고 AI 기술·모델·연구 소식만 선별해요. 원본 링크로 바로 연결돼요.
        </p>
      </div>
    </div>
  );
}

function FeedRow({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
    >
      {/* 카테고리 뱃지 */}
      <div className="shrink-0 mt-0.5">
        <span className={categoryColor[item.category] + " px-2 py-0.5 text-[10px] rounded-full font-medium whitespace-nowrap"}>
          {item.category}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {/* 제목 */}
        <div className="flex items-start gap-1.5 mb-1">
          {item.isNew && (
            <span className="shrink-0 mt-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded-full font-bold">NEW</span>
          )}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
        </div>

        {/* 요약 */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1 leading-relaxed">{item.summary}</p>

        {/* 태그 */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((t) => (
              <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 text-[9px] rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 메타 */}
      <div className="shrink-0 text-right space-y-1">
        <p className={"text-[10px] font-semibold " + (SOURCE_COLORS[item.source] ?? "text-gray-500")}>
          {item.source === "Hugging Face Blog" ? "HF Blog" : item.source}
        </p>
        <p className="text-[10px] text-gray-400">{timeAgo(item.date)}</p>
        {item.readingTime && (
          <p className="text-[10px] text-gray-300 dark:text-gray-600">{item.readingTime}</p>
        )}
      </div>
    </a>
  );
}
