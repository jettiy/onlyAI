import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';

const navItems = [
  { path: '/', label: '홈', icon: '🏠', mobileLabel: '홈' },
  { path: '/models', label: 'AI 모델 가이드', icon: '🤖', mobileLabel: '모델' },
  { path: '/news', label: 'AI 뉴스룸', icon: '📰', mobileLabel: '뉴스' },
  { path: '/guide', label: '시작 가이드', icon: '📖', mobileLabel: '가이드' },
  { path: '/pricing', label: '클라우드 가격', icon: '💰', mobileLabel: '가격' },
  { path: '/trending', label: '트렌딩', icon: '🔥', mobileLabel: '트렌딩' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggle } = useDarkMode();

  return (
    <div className={`min-h-screen ${dark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-200">

        {/* 헤더 */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  AI<span className="text-blue-600">이것만</span>
                </span>
              </Link>

              {/* 데스크탑 네비 */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                {/* 다크모드 토글 */}
                <button
                  onClick={toggle}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="다크모드 토글"
                >
                  {dark ? '☀️' : '🌙'}
                </button>
                {/* 모바일 메뉴 버튼 */}
                <button
                  className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {menuOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 모바일 드롭다운 메뉴 */}
          {menuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* 메인 콘텐츠 */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8">
          {children}
        </main>

        {/* 모바일 바텀 네비게이션 */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-bottom">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-colors min-w-[56px] ${
                  location.pathname === item.path
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.mobileLabel}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* 푸터 (데스크탑만) */}
        <footer className="hidden md:block mt-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="font-bold text-gray-800 dark:text-white">AI이것만</span>
                <span className="text-gray-400 text-sm">— AI, 이것만 보면 다 알 수 있어요</span>
              </div>
              <p className="text-xs text-gray-400">매주 업데이트 · 가격 정보는 실제와 다를 수 있어요</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
