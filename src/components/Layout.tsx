import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';

function InfinityLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims: Record<string, [number, number]> = { sm: [28, 18], md: [38, 24], lg: [48, 30] };
  const [w, h] = dims[size];
  const cx1 = Math.round(w * 0.32), cx2 = Math.round(w * 0.68), cy = Math.round(h / 2);
  const r = Math.round(h * 0.38), ri = Math.round(h * 0.17);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`ig-${size}`} x1="0" y1="0" x2={w} y2={h} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6"/>
          <stop offset="48%" stopColor="#6D28D9"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>
      <circle cx={cx1} cy={cy} r={r} fill={`url(#ig-${size})`}/>
      <circle cx={cx1} cy={cy} r={ri} fill="white"/>
      <circle cx={cx2} cy={cy} r={r} fill={`url(#ig-${size})`} opacity="0.88"/>
      <circle cx={cx2} cy={cy} r={ri} fill="white"/>
    </svg>
  );
}

const NAV = [
  { label: '홈', path: '/', icon: '🏠', short: '홈', children: [], mobileHide: false },
  {
    label: 'AI 모델 추천', path: '/recommend', icon: '✨', short: '추천', children: [], mobileHide: false,
  },
  {
    label: 'AI 모델 비교', path: '/explore/compare', icon: '📊', short: '모델비교',
    mobileHide: true, mobileGroup: 'explore',
    children: [
      { path: '/explore/compare', label: '한눈에 비교', icon: '⚖️' },
      { path: '/explore/ranking', label: '랭킹', icon: '🏆' },
      { path: '/explore/calculator', label: '가격 계산기', icon: '🧮' },
    ],
  },
  {
    label: '모델 히스토리', path: '/explore/timeline', icon: '📈', short: '히스토리',
    mobileHide: true, mobileGroup: 'explore',
    children: [
      { path: '/explore/timeline', label: '타임라인', icon: '🗓️' },
    ],
  },
  {
    label: '성능 테스트', path: '/explore/tokenizer', icon: '🧪', short: '성능테스트',
    mobileHide: true, mobileGroup: 'explore',
    children: [
      { path: '/explore/tokenizer', label: '토큰 체험기', icon: '🔤' },
      { path: '/explore/context-window', label: '컨텍스트 시각화', icon: '📏' },
      { path: '/explore/korean-bench', label: '한국어 성능', icon: '🇰🇷' },
      { path: '/explore/prompt-bench', label: '프롬프트 벤치마크', icon: '🎯' },
      { path: '/explore/guide', label: '시작 가이드', icon: '🎯' },
    ],
  },
  {
    label: '비디오 AI', path: '/video', icon: '🎬', short: '비디오', mobileHide: false,
    children: [
      { path: '/video/timeline', label: '비디오 AI 타임라인', icon: '🎥' },
      { path: '/video/compare', label: '비디오 AI 비교', icon: '🎬' },
    ],
  },
  {
    label: '이미지 AI', path: '/image', icon: '🖼️', short: '이미지',
    mobileHide: true, mobileGroup: 'explore',
    children: [
      { path: '/image', label: '비교', icon: '🖼️' },
    ],
  },
  {
    label: '내 PC 추천', path: '/pc-check', icon: '🖥️', short: 'PC 추천', children: [], mobileHide: false,
  },
  {
    label: '뉴스 브리핑', path: '/news', icon: '📰', short: '뉴스', children: [], mobileHide: false,
  },
  {
    label: '프롬프트 적용하기', path: '/prompts', icon: '📋', short: '프롬프트', mobileHide: false,
    children: [
      { path: '/prompts/intro', label: '프롬프트가 뭔가요?', icon: '💡' },
      { path: '/prompts/how', label: '프롬프트 작성법', icon: '✏️' },
      { path: '/prompts/library', label: '프롬프트 저장소', icon: '📚' },
    ],
  },
  {
    label: 'OpenClaw 활용하기', path: '/openclaw', icon: '🦞', short: 'OpenClaw', mobileHide: false,
    children: [
      { path: '/openclaw/intro', label: 'OpenClaw란?', icon: '🌐' },
      { path: '/openclaw/guide', label: '활용법', icon: '📖' },
      { path: '/openclaw/skills', label: '스킬트리 저장소', icon: '🌳' },
      { path: '/openclaw/devnews', label: '개발자 소식', icon: '🛠️' },
    ],
  },
  {
    label: 'OpenClaw 설치방법', path: '/openclaw/install', icon: '⚙️', short: '설치', mobileHide: false,
    children: [
      { path: '/openclaw/install', label: '설치 가이드', icon: '🎯' },
    ],
  },
  {
    label: 'AI 정보 학습하기', path: '/learn', icon: '🧠', short: '학습', mobileHide: false,
    children: [
      { path: '/learn/glossary', label: '용어사전', icon: '📖' },
      { path: '/learn/simulator', label: '협업 시뮬레이터', icon: '🤝' },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { dark, toggle } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['/explore/compare','/explore/timeline','/explore/tokenizer','/video','/news','/prompts','/openclaw','/learn']);

  const isActive = (path: string) => {
    if (path === '/') return loc.pathname === '/';
    // /explore sub-categories: match if path starts with any /explore/* child
    if (path.startsWith('/explore/')) {
      return loc.pathname === path || loc.pathname.startsWith(path);
    }
    return loc.pathname.startsWith(path);
  };
  const toggle2 = (p: string) => setExpanded(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const currentSection = NAV.find(s => {
    if (s.path === '/') return false;
    if (s.path.startsWith('/explore/')) {
      // Check if any child of this section matches
      return s.children.some(c => loc.pathname === c.path || loc.pathname.startsWith(c.path + '/'));
    }
    return loc.pathname.startsWith(s.path);
  });
  const currentChild = NAV.flatMap(s => s.children).find(c => loc.pathname === c.path);

  return (
    <div className={dark ? 'dark' : ''}>
      {/* DESKTOP */}
      <div className="hidden md:flex h-screen overflow-hidden bg-white dark:bg-gray-950">
        <aside className="w-64 shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 overflow-y-auto"
          style={{ backgroundColor: dark ? '#111827' : '#F5F7FA' }}>
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <Link to="/" className="flex items-center gap-2.5">
              <InfinityLogo size="md"/>
              <div>
                <div className="text-[17px] font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">AI</span>
                  <span className="text-gray-900 dark:text-white">이것만</span>
                </div>
                <div className="text-[9px] text-gray-400 tracking-widest uppercase mt-0.5">AI Intelligence</div>
              </div>
            </Link>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-0.5">
            {NAV.map(section => {
              const active = isActive(section.path);
              const open = expanded.includes(section.path);
              return (
                <div key={section.path}>
                  {section.children.length === 0 ? (
                    <Link to={section.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'}`}>
                      <span className="text-base">{section.icon}</span><span>{section.label}</span>
                    </Link>
                  ) : (
                    <>
                      <button onClick={() => toggle2(section.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${active && !currentChild ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'}`}>
                        <span className="text-base">{section.icon}</span>
                        <span className="flex-1">{section.label}</span>
                        <span className={`text-xs opacity-60 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
                      </button>
                      {open && (
                        <div className="ml-3 mt-0.5 mb-1 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-0.5">
                          {section.children.map(child => {
                            const cActive = loc.pathname === child.path;
                            return (
                              <Link key={child.path} to={child.path}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}>
                                <span>{child.icon}</span><span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <p className="text-[10px] text-gray-400 font-mono">{new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'})}</p>
            <button onClick={toggle} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <span>{dark ? '☀️' : '🌙'}</span><span>{dark ? '라이트 모드' : '다크 모드'}</span>
            </button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="shrink-0 flex items-center justify-between px-8 h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              {currentSection ? (
                <><span>{currentSection.icon} {currentSection.label}</span>
                {currentChild && <><span className="text-gray-300 dark:text-gray-600 mx-1">›</span><span className="text-gray-800 dark:text-gray-200 font-semibold">{currentChild.label}</span></>}</>
              ) : <span className="text-gray-800 dark:text-gray-200 font-semibold">🏠 홈</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>
              <span className="text-[11px] text-green-500 font-medium">LIVE</span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-8 py-8">{children}</div>
          </main>
        </div>
      </div>
      {/* MOBILE */}
      <div className="flex flex-col min-h-screen md:hidden bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 h-14">
            <Link to="/" className="flex items-center gap-2">
              <InfinityLogo size="sm"/>
              <span className="text-[17px] font-black">
                <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">AI</span>
                <span className="text-gray-900 dark:text-white">이것만</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <button onClick={toggle} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">{dark ? '☀️' : '🌙'}</button>
              <button onClick={() => setMobileOpen(v => !v)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-lg">{mobileOpen ? '✕' : '☰'}</button>
            </div>
          </div>
          {mobileOpen && (
            <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pb-3 max-h-[72vh] overflow-y-auto">
              {(() => {
                const exploreSections = NAV.filter(s => s.mobileGroup === 'explore');
                const otherSections = NAV.filter(s => !s.mobileGroup);
                const isExploreActive = loc.pathname.startsWith('/explore');
                return (
                  <>
                    {/* 탐색 통합 메뉴 */}
                    <div className="px-4 pt-3">
                      <button
                        onClick={() => setMobileOpen(prev => !prev)}
                        className="flex items-center justify-between w-full py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200">
                        <span className="flex items-center gap-2">
                          <span>📊</span><span>AI 모델 탐색</span>
                        </span>
                        <span className="text-gray-400 text-xs">▼</span>
                      </button>
                      {exploreSections.map(s => (
                        <div key={s.path} className="ml-2 mt-1">
                          <Link to={s.path} onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 py-1.5 text-xs font-bold ${isExploreActive && isActive(s.path) ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>
                            <span>{s.icon}</span><span>{s.label}</span>
                          </Link>
                          {s.children.map(c => (
                            <Link key={c.path} to={c.path} onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-2 pl-6 py-1.5 text-xs rounded-lg ${loc.pathname === c.path ? 'text-blue-600 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                              <span>{c.icon}</span><span>{c.label}</span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    {/* 나머지 메뉴 */}
                    {otherSections.map(s => (
                      <div key={s.path} className="px-4 pt-3">
                        <Link to={s.path} onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200">
                          <span>{s.icon}</span><span>{s.label}</span>
                        </Link>
                        {s.children.map(c => (
                          <Link key={c.path} to={c.path} onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 pl-6 py-1.5 text-xs rounded-lg ${loc.pathname === c.path ? 'text-blue-600 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                            <span>{c.icon}</span><span>{c.label}</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          )}
        </header>
        <main className="flex-1 pb-20"><div className="px-4 py-4">{children}</div></main>
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-around h-16">
            {(() => {
              const bottomTabs = [
                { path: '/', label: '홈', icon: '🏠', active: loc.pathname === '/' },
                { path: '/explore/compare', label: '비교', icon: '📊', active: loc.pathname.startsWith('/explore') },
                { path: '/pricing', label: '가격', icon: '💰', active: loc.pathname === '/pricing' },
                { path: '/recommend', label: '추천', icon: '✨', active: loc.pathname.startsWith('/recommend') },
              ];
              const moreActive = !bottomTabs.some(t => t.active);
              return <>
                {bottomTabs.map(t => (
                  <Link key={t.path} to={t.path} onClick={() => setMobileOpen(false)}
                    className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl min-w-0 min-h-[44px] transition-colors ${t.active ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 dark:text-gray-500'}`}>
                    <span className="text-xl">{t.icon}</span>
                    <span className={`font-semibold leading-tight ${t.active ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'}`}>{t.label}</span>
                  </Link>
                ))}
                <button onClick={() => setMobileOpen(v => !v)}
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl min-w-0 min-h-[44px] transition-colors ${mobileOpen || moreActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 dark:text-gray-500'}`}>
                  <span className="text-xl">⋯</span>
                  <span className={`font-semibold leading-tight ${mobileOpen || moreActive ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'}`}>더보기</span>
                </button>
              </>;
            })()}
          </div>
        </nav>
      </div>
    </div>
  );
}
