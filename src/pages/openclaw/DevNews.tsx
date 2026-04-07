import { useState, useEffect } from "react";

interface Release {
  tag: string;
  date: string;
  title: string;
  body: string;
  htmlUrl: string;
  author: string;
  prerelease: boolean;
}

interface RoadmapItem {
  title: string;
  desc: string;
  status: string;
  eta: string;
}

const ROADMAP: RoadmapItem[] = [
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
  '기본': 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

// Classify release notes into a tag
function classifyTag(title: string, body: string): string {
  const text = `${title} ${body}`.toLowerCase();
  if (/security|vulnerability|websocket|inject|xss|auth|token|secret/i.test(text)) return '보안';
  if (/plugin|context.?engine|interface|slot|architecture|refactor/i.test(text)) return '아키폐처';
  if (/ux|ui|mobile|bottom.?tab|palette|dashboard|layout|theme|dark/i.test(text)) return 'UX 개선';
  if (/fix|patch|bug|hotfix|crash|resolve|regression/i.test(text)) return '버그수정';
  if (/add|new|feat|support|introduce|기능|추가|지원/i.test(text)) return '신기능';
  return '기본';
}

// Truncate release body for display
function truncateBody(body: string, maxLen = 300): string {
  if (!body) return '';
  const clean = body
    .replace(/###\s*\w+\s*\n/g, '')  // Remove markdown headers
    .replace(/\*\*/g, '')
    .replace(/- /g, '• ')
    .trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean;
}

export default function DevNews() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const res = await fetch('https://api.github.com/repos/openclaw/openclaw/releases?per_page=15');
        if (!res.ok) throw new Error('GitHub API error');
        const data: any[] = await res.json();

        const parsed: Release[] = data.map((r) => ({
          tag: r.tag_name,
          date: r.published_at?.slice(0, 10) ?? '',
          title: r.name ?? r.tag_name,
          body: r.body ?? '',
          htmlUrl: r.html_url,
          author: r.author?.login ?? 'openclaw',
          prerelease: r.prerelease ?? false,
        }));

        setReleases(parsed);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchReleases();
  }, []);

  const latest = releases[0];
  const updates = releases.slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🛠️ 개발자 소식</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">OpenClaw GitHub Releases에서 자동으로 불러옵니다.</p>
      </div>

      {/* Latest version badge */}
      {latest && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">최신 릴리즈</p>
            <p className="text-sm font-bold font-mono text-gray-900 dark:text-white">{latest.tag}</p>
          </div>
          <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">{latest.date}</div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">GitHub에서 릴리즈 불러오는 중...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-8 text-sm text-gray-400">
          GitHub에서 릴리즈를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {/* Updates */}
      {!loading && updates.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">📋 최근 업데이트</h2>
          <div className="space-y-3">
            {updates.map((u) => (
              <a key={u.tag} href={u.htmlUrl} target="_blank" rel="noopener noreferrer"
                className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">{u.tag}</code>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${TAG_COLORS[classifyTag(u.title, u.body)] ?? TAG_COLORS['기본']}`}>
                      {classifyTag(u.title, u.body)}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{u.title}</h3>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{u.date}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {truncateBody(u.body)}
                </p>
                <span className="text-[10px] text-blue-500 group-hover:underline mt-1 block">GitHub에서 보기 →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap */}
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
