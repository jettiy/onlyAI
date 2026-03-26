import { Link } from 'react-router-dom';
import { CURATED_NEWS } from '../hooks/useNewsRSS';

const CAT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  '모델 출시':       { bg: 'bg-violet-50 dark:bg-violet-950/30',  text: 'text-violet-600 dark:text-violet-400',  bar: 'bg-violet-500' },
  '연구·논문':       { bg: 'bg-blue-50 dark:bg-blue-950/30',       text: 'text-blue-600 dark:text-blue-400',      bar: 'bg-blue-500' },
  '에이전트':        { bg: 'bg-cyan-50 dark:bg-cyan-950/30',        text: 'text-cyan-600 dark:text-cyan-400',      bar: 'bg-cyan-500' },
  '오픈소스':        { bg: 'bg-emerald-50 dark:bg-emerald-950/30',  text: 'text-emerald-600 dark:text-emerald-400',bar: 'bg-emerald-500' },
  '파인튜닝':        { bg: 'bg-amber-50 dark:bg-amber-950/30',      text: 'text-amber-600 dark:text-amber-400',    bar: 'bg-amber-500' },
  '벤치마크':        { bg: 'bg-orange-50 dark:bg-orange-950/30',    text: 'text-orange-600 dark:text-orange-400',  bar: 'bg-orange-500' },
  '인프라·하드웨어': { bg: 'bg-slate-50 dark:bg-slate-900/30',      text: 'text-slate-600 dark:text-slate-400',    bar: 'bg-slate-500' },
  '산업·정책':       { bg: 'bg-red-50 dark:bg-red-950/30',          text: 'text-red-600 dark:text-red-400',        bar: 'bg-red-500' },
  '개발 도구':       { bg: 'bg-sky-50 dark:bg-sky-950/30',          text: 'text-sky-600 dark:text-sky-400',        bar: 'bg-sky-500' },
  '멀티모달':        { bg: 'bg-pink-50 dark:bg-pink-950/30',         text: 'text-pink-600 dark:text-pink-400',      bar: 'bg-pink-500' },
};

const CURATION_DATE = '2026년 3월 19일';

const TOP_NEWS = CURATED_NEWS.filter((n) => n.isNew).slice(0, 5);

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff < 7) return `${diff}일 전`;
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

const SECTIONS = [
  {
    icon: '🔭',
    label: 'AI 모델 탐색하기',
    desc: '타임라인·가격·벤치마크·추천',
    to: '/explore',
    color: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  {
    icon: '📋',
    label: '프롬프트 적용하기',
    desc: '작성법·프레임워크·저장소',
    to: '/prompts',
    color: 'from-violet-500 to-violet-600',
    light: 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900',
    textColor: 'text-violet-700 dark:text-violet-300',
  },
  {
    icon: '🦞',
    label: 'OpenClaw 활용하기',
    desc: '설치·스킬·자동화·크론',
    to: '/openclaw',
    color: 'from-orange-500 to-amber-500',
    light: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
  {
    icon: '🧠',
    label: 'AI 정보 학습하기',
    desc: '용어사전·협업 시뮬레이터',
    to: '/learn',
    color: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
];

export default function Home() {
  const hero = TOP_NEWS[0];
  const secondary = TOP_NEWS.slice(1, 3);

  return (
    <div className="space-y-8">

      {/* ── HERO SECTION ── */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-7 text-white relative">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <p className="text-[11px] tracking-[0.3em] font-bold text-gray-400 uppercase mb-2">AI Intelligence Guide</p>
          <h1 className="text-3xl font-black leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
            AI, <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">이것만</span> 보면<br />다 알 수 있어요
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-md">
            AI 모델 비교·프롬프트 작성법·OpenClaw 자동화까지.<br />
            AI 입문자부터 실무자까지, 한 곳에서 시작하세요.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/explore/guide"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
              🎯 AI 추천받기
            </Link>
            <Link to="/explore/compare"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20">
              ⚖️ 모델 비교하기
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4 SECTION CARDS ── */}
      <div className="grid grid-cols-2 gap-3">
        {SECTIONS.map(s => (
          <Link key={s.to} to={s.to}
            className={`group relative block rounded-xl border p-4 hover:shadow-md transition-all ${s.light}`}>
            <span className="text-2xl mb-2 block">{s.icon}</span>
            <p className={`text-sm font-bold mb-0.5 ${s.textColor}`}>{s.label}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{s.desc}</p>
          </Link>
        ))}
      </div>

      {/* ── DIVIDER ── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">AI 뉴스 브리핑</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">
            {CURATION_DATE} 기준 큐레이션
          </span>
        </div>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* ── HERO NEWS ── */}
      {hero && (() => {
        const cat = CAT_COLORS[hero.category] ?? CAT_COLORS['연구·논문'];
        return (
          <a href={hero.url} target="_blank" rel="noopener noreferrer" className="group block">
            <div className={`relative overflow-hidden rounded-2xl ${cat.bg} border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-all duration-300`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${cat.bar} rounded-l-2xl`} />
              <div className="pl-3">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded ${cat.bg} ${cat.text} border border-current border-opacity-20`}>
                    {hero.category}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{timeAgo(hero.date)} · {hero.source}</span>
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-current transition-colors" style={{ letterSpacing: '-0.02em' }}>
                  {hero.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">{hero.summary}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex flex-wrap gap-1">
                    {hero.tags?.slice(0, 4).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded font-medium">#{t}</span>
                    ))}
                  </div>
                  <span className={`text-xs font-bold ${cat.text}`}>전문 읽기 →</span>
                </div>
              </div>
            </div>
          </a>
        );
      })()}

      {/* ── SECONDARY NEWS ── */}
      {secondary.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {secondary.map((item) => {
            const cat = CAT_COLORS[item.category] ?? CAT_COLORS['연구·논문'];
            return (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                className="group relative block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-600 transition-all overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${cat.bar}`} />
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[9px] font-black tracking-widest uppercase ${cat.text}`}>{item.category}</span>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500">{timeAgo(item.date)}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{item.summary}</p>
                <p className={`text-[10px] font-semibold mt-2 ${cat.text}`}>읽기 →</p>
              </a>
            );
          })}
        </div>
      )}

    </div>
  );
}
