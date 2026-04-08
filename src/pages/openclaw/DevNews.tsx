import { useState, useEffect } from "react";

interface Release {
  tag: string;
  version: string;
  date: string;
  title: string;
  summary: string;
  summaryKo: string;
  tagLabel: string;
  htmlUrl: string;
  prerelease: boolean;
}

const ROADMAP = [
  { title: '음성 명령 지원', desc: '텔레그램 음성 메시지로 AI에게 명령하기', status: '개발 중', eta: 'Q2 2026' },
  { title: 'Windows 네이티브 앱', desc: 'MaxClaw Windows 데스크톱 앱', status: '계획 중', eta: 'Q3 2026' },
  { title: '팀 플랜', desc: '여러 명이 함께 쓰는 공유 워크스페이스', status: '계획 중', eta: 'Q3 2026' },
  { title: '플러그인 SDK', desc: '외부 개발자가 스킬을 쉽게 만들 수 있는 SDK', status: '계획 중', eta: 'Q4 2026' },
];

const TAG_COLORS: Record<string, string> = {
  '신기능': 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  '보안': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  '아키텍처': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  'UX 개선': 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  '버그수정': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  '성능 개선': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  '플랫폼': 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  '개선': 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

export default function DevNews() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState('');
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/openclaw-releases')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setReleases(d.releases ?? []); setUpdatedAt(d.updatedAt ?? ''); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const latest = releases[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🛠️ 개발자 소식</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          OpenClaw GitHub Releases 자동 수집 · 한글 요약
          {updatedAt && <span className="ml-1 text-gray-400">({updatedAt} 업데이트)</span>}
        </p>
      </div>

      {/* 최신 버전 */}
      {latest && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">최신 릴리즈</p>
            <p className="text-sm font-bold font-mono text-gray-900 dark:text-white">{latest.version}</p>
          </div>
          <div className="ml-auto text-xs text-gray-400">{latest.date}</div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">GitHub에서 릴리즈 불러오는 중...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-sm text-gray-400">릴리즈를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div>
      )}

      {/* 태그 필터 */}
      {!loading && releases.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {['전체', ...Array.from(new Set(releases.map(r => r.tagLabel)))].map(tag => (
            <button key={tag} onClick={() => setExpandedTag(tag === '전체' ? null : (expandedTag === tag ? null : tag))}
              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${expandedTag === tag || (tag === '전체' && !expandedTag)
                ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* 업데이트 목록 */}
      {!loading && (
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">📋 최근 업데이트</h2>
          <div className="space-y-3">
            {(expandedTag ? releases.filter(r => r.tagLabel === expandedTag) : releases.slice(0, 10)).map((u) => (
              <a key={u.tag} href={u.htmlUrl} target="_blank" rel="noopener noreferrer"
                className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">{u.version}</code>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${TAG_COLORS[u.tagLabel] ?? TAG_COLORS['개선']}`}>
                      {u.tagLabel}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{u.title}</h3>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{u.date}</span>
                </div>
                {u.summaryKo && (
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{u.summaryKo}</p>
                )}
                {u.summary && u.summaryKo && u.summary !== u.summaryKo && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowOriginal(prev => ({ ...prev, [u.tag]: !prev[u.tag] })); }}
                    className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1.5 inline-flex items-center gap-1 transition-colors"
                  >
                    {showOriginal[u.tag] ? '△ 간단히 보기' : '▽ 원문 요약 보기'}
                  </button>
                )}
                {showOriginal[u.tag] && u.summary && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed whitespace-pre-line mt-1 pt-1 border-t border-gray-100 dark:border-gray-800">{u.summary}</p>
                )}
                <span className="text-[10px] text-blue-500 group-hover:underline mt-2 block">GitHub에서 자세히 보기 →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 로드맵 */}
      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">🗺️ 로드맵</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {ROADMAP.map(r => (
            <div key={r.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{r.title}</h3>
                <span className="text-[10px] text-gray-400">{r.eta}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{r.desc}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${r.status === '개발 중' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
