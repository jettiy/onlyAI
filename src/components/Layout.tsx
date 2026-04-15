import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import {
  Home,
  BarChart3,
  DollarSign,
  Sparkles,
  Newspaper,
  MoreHorizontal,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  FileText,
  Octagon,
  BookOpen,
  Search,
  Trophy,
  Calculator,
  Clock,
  Type,
  Ruler,
  Globe,
  Target,
  Compass,
  Video,
  Image,
} from 'lucide-react';

/* ──────────────────────────── Infinity Logo ──────────────────────────── */

function InfinityLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims: Record<string, [number, number]> = {
    sm: [28, 18],
    md: [38, 24],
    lg: [48, 30],
  };
  const [w, h] = dims[size];
  const cx1 = Math.round(w * 0.32),
    cx2 = Math.round(w * 0.68),
    cy = Math.round(h / 2);
  const r = Math.round(h * 0.38),
    ri = Math.round(h * 0.17);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient
          id={`ig-${size}`}
          x1="0"
          y1="0"
          x2={w}
          y2={h}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#5B5FEF" />
          <stop offset="100%" stopColor="#7C6AEF" />
        </linearGradient>
      </defs>
      <circle cx={cx1} cy={cy} r={r} fill={`url(#ig-${size})`} />
      <circle cx={cx1} cy={cy} r={ri} fill="white" />
      <circle cx={cx2} cy={cy} r={r} fill={`url(#ig-${size})`} opacity="0.88" />
      <circle cx={cx2} cy={cy} r={ri} fill="white" />
    </svg>
  );
}

/* ──────────────────────────── Types ──────────────────────────── */

interface MegaChild {
  path: string;
  label: string;
  icon: ReactNode;
}

interface MegaItem {
  label: string;
  path?: string;
  children?: MegaChild[];
}

/* ──────────────────────────── Nav Data ──────────────────────────── */

const TOP_NAV: MegaItem[] = [
  { label: '홈', path: '/' },
  {
    label: '비교',
    children: [
      { path: '/explore/compare', label: '한눈에 비교', icon: <Search size={18} /> },
      { path: '/explore/ranking', label: '랭킹', icon: <Trophy size={18} /> },
      { path: '/explore/calculator', label: '가격 계산기', icon: <Calculator size={18} /> },
      { path: '/explore/timeline', label: '타임라인', icon: <Clock size={18} /> },
      { path: '/explore/tokenizer', label: '토큰 체험기', icon: <Type size={18} /> },
      { path: '/explore/context-window', label: '컨텍스트 시각화', icon: <Ruler size={18} /> },
      { path: '/explore/korean-bench', label: '한국어 성능', icon: <Globe size={18} /> },
      { path: '/explore/prompt-bench', label: '프롬프트 벤치마크', icon: <Target size={18} /> },
      { path: '/explore/guide', label: '시작 가이드', icon: <Compass size={18} /> },
      { path: '/video/timeline', label: '비디오 AI', icon: <Video size={18} /> },
      { path: '/image', label: '이미지 AI', icon: <Image size={18} /> },
    ],
  },
  { label: '가격', path: '/pricing' },
  { label: '추천', path: '/recommend' },
  { label: '뉴스', path: '/news' },
  { label: '비디오 AI', path: '/video/timeline' },
  { label: '이미지 AI', path: '/image' },
  { label: '내 PC', path: '/pc-check' },
  { label: 'OpenClaw', path: '/openclaw' },
];

const MOBILE_BOTTOM_TABS: { path: string; label: string; icon: ReactNode }[] = [
  { path: '/explore/compare', label: '비교', icon: <BarChart3 size={20} /> },
  { path: '/recommend', label: '추천', icon: <Sparkles size={20} /> },
  { path: '/pricing', label: '가격', icon: <DollarSign size={20} /> },
  { path: '/news', label: '뉴스', icon: <Newspaper size={20} /> },
];

/* All links for the mobile hamburger drawer (flat list with sections) */
const MOBILE_DRAWER_SECTIONS: { title?: string; items: { path: string; label: string; icon: ReactNode }[] }[] = [
  {
    title: '기본',
    items: [
      { path: '/', label: '홈', icon: <Home size={18} /> },
      { path: '/recommend', label: '추천', icon: <Sparkles size={18} /> },
      { path: '/pricing', label: '가격', icon: <DollarSign size={18} /> },
      { path: '/news', label: '뉴스', icon: <Newspaper size={18} /> },
    ],
  },
  {
    title: '비교',
    items: [
      { path: '/explore/compare', label: '한눈에 비교', icon: <Search size={18} /> },
      { path: '/explore/ranking', label: '랭킹', icon: <Trophy size={18} /> },
      { path: '/explore/calculator', label: '가격 계산기', icon: <Calculator size={18} /> },
      { path: '/explore/timeline', label: '타임라인', icon: <Clock size={18} /> },
      { path: '/explore/tokenizer', label: '토큰 체험기', icon: <Type size={18} /> },
      { path: '/explore/context-window', label: '컨텍스트 시각화', icon: <Ruler size={18} /> },
      { path: '/explore/korean-bench', label: '한국어 성능', icon: <Globe size={18} /> },
      { path: '/explore/prompt-bench', label: '프롬프트 벤치마크', icon: <Target size={18} /> },
      { path: '/explore/guide', label: '시작 가이드', icon: <Compass size={18} /> },
      { path: '/video/timeline', label: '비디오 AI', icon: <Video size={18} /> },
      { path: '/image', label: '이미지 AI', icon: <Image size={18} /> },
    ],
  },
  {
    title: '더보기',
    items: [
      { path: '/pc-check', label: '내 PC 추천', icon: <Monitor size={18} /> },
      { path: '/prompts', label: '프롬프트 적용하기', icon: <FileText size={18} /> },
      { path: '/openclaw', label: 'OpenClaw', icon: <Octagon size={18} /> },
      { path: '/learn', label: 'AI 정보 학습하기', icon: <BookOpen size={18} /> },
    ],
  },
];

/* ──────────────────────────── Helpers ──────────────────────────── */

function isItemActive(pathname: string, item: MegaItem): boolean {
  if (item.path === '/') return pathname === '/';
  if (item.path) return pathname === item.path || pathname.startsWith(item.path + '/');
  if (item.children) return item.children.some((c) => pathname === c.path || pathname.startsWith(c.path + '/'));
  return false;
}

function getBreadcrumb(pathname: string): { section: string; page?: string } | null {
  if (pathname === '/') return null;
  for (const item of TOP_NAV) {
    if (!item.children) continue;
    for (const child of item.children) {
      if (pathname === child.path || pathname.startsWith(child.path + '/')) {
        return { section: item.label, page: child.label };
      }
    }
  }
  // Direct top-level pages
  for (const item of TOP_NAV) {
    if (item.path && item.path !== '/' && pathname.startsWith(item.path)) {
      return { section: item.label };
    }
  }
  return null;
}

/* ──────────────────────────── Mega Menu (Desktop) ──────────────────────────── */

function MegaMenuDropdown({
  items,
  dark,
  pathname,
  onClose,
}: {
  items: MegaChild[];
  dark: boolean;
  pathname: string;
  onClose: () => void;
}) {
  // Split into columns: 4 + 4 + 3 for "비교", 2-col for "더보기"
  const cols = items.length > 6 ? 3 : items.length > 4 ? 2 : 1;
  const perCol = Math.ceil(items.length / cols);
  const columns: MegaChild[][] = [];
  for (let i = 0; i < cols; i++) {
    columns.push(items.slice(i * perCol, (i + 1) * perCol));
  }

  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[min(560px,90vw)] rounded-xl shadow-xl border p-4 z-50 ${
        dark
          ? 'bg-gray-900 border-gray-700 shadow-black/40'
          : 'bg-white border-gray-200 shadow-gray-300/50'
      }`}
    >
      <div className="grid gap-x-6" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {columns.map((col, ci) => (
          <div key={ci} className="space-y-0.5">
            {col.map((child) => {
              const active = pathname === child.path || pathname.startsWith(child.path + '/');
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? dark
                        ? 'bg-[#5B5FEF]/15 text-[#7C8AEF] font-bold'
                        : 'bg-[#5B5FEF]/10 text-[#5B5FEF] font-bold'
                      : dark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={active ? '' : dark ? 'text-gray-500' : 'text-gray-400'}>{child.icon}</span>
                  <span>{child.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────── Top Nav Item (Desktop) ──────────────────────────── */

function TopNavItem({
  item,
  dark,
  pathname,
}: {
  item: MegaItem;
  dark: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = isItemActive(pathname, item);
  const hasChildren = !!item.children?.length;

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!hasChildren) {
    return (
      <Link
        to={item.path!}
        className={`relative flex items-center gap-1 px-3 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
          active
            ? 'text-[#5B5FEF] font-bold'
            : dark
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {item.label}
        {active && (
          <span
            className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
            style={{ backgroundColor: '#5B5FEF' }}
          />
        )}
      </Link>
    );
  }

  return (
    <div ref={containerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
      <button
        className={`flex items-center gap-1 px-3 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
          active
            ? 'text-[#5B5FEF] font-bold'
            : dark
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
        {active && (
          <span
            className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
            style={{ backgroundColor: '#5B5FEF' }}
          />
        )}
      </button>
      {/* Animated dropdown */}
      <div
        className={`transition-all duration-150 origin-top ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <MegaMenuDropdown items={item.children!} dark={dark} pathname={pathname} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}

/* ──────────────────────────── Breadcrumb ──────────────────────────── */

function Breadcrumb({ dark }: { dark: boolean }) {
  const { pathname } = useLocation();
  const crumb = getBreadcrumb(pathname);
  if (!crumb) return null;

  return (
    <div
      className={`hidden md:flex items-center gap-1.5 px-4 lg:px-0 py-2 text-xs ${
        dark ? 'text-gray-500' : 'text-gray-400'
      }`}
    >
      <Link to="/" className={`transition-colors ${dark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>
        <Home size={12} />
      </Link>
      <ChevronDown size={10} className="rotate-[-90deg] opacity-50" />
      <span className={dark ? 'text-gray-300' : 'text-gray-700'}>{crumb.section}</span>
      {crumb.page && (
        <>
          <ChevronDown size={10} className="rotate-[-90deg] opacity-50" />
          <span className={dark ? 'text-gray-400' : 'text-gray-500'}>{crumb.page}</span>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────── Mobile Drawer ──────────────────────────── */

function MobileDrawer({
  open,
  onClose,
  dark,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  dark: boolean;
  pathname: string;
}) {
  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-sm flex flex-col transition-transform duration-200 md:hidden ${
          dark ? 'bg-gray-900' : 'bg-white'
        } ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <InfinityLogo size="sm" />
            <span className="text-sm font-bold">
              <span
                className="bg-gradient-to-r bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(to right, #5B5FEF, #7C6AEF)' }}
              >
                AI
              </span>
              <span className={dark ? 'text-white' : 'text-gray-900'}>이것만</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>
        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto py-2">
          {MOBILE_DRAWER_SECTIONS.map((section, si) => (
            <div key={si} className={si > 0 ? 'mt-4' : ''}>
              {section.title && (
                <div
                  className={`px-4 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    dark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const active = pathname === item.path || pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? dark
                          ? 'text-[#7C8AEF] bg-[#5B5FEF]/10'
                          : 'text-[#5B5FEF] bg-[#5B5FEF]/5'
                        : dark
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={active ? '' : dark ? 'text-gray-600' : 'text-gray-400'}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────── Layout ──────────────────────────── */

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { dark, toggle } = useDarkMode();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={dark ? 'dark' : ''}>
      {/* ════════════════════════ DESKTOP ════════════════════════ */}
      <div className="hidden md:flex flex-col min-h-screen bg-white dark:bg-gray-950">
        {/* Fixed top nav */}
        <header
          className={`fixed top-0 left-0 right-0 z-40 h-14 border-b backdrop-blur-md ${
            dark
              ? 'bg-gray-950/80 border-gray-800'
              : 'bg-white/80 border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between h-full max-w-6xl mx-auto px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <InfinityLogo size="md" />
              <div>
                <div className="text-[17px] font-black tracking-tight leading-none">
                  <span
                    className="bg-gradient-to-r bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(to right, #5B5FEF, #7C6AEF)' }}
                  >
                    AI
                  </span>
                  <span className={dark ? 'text-white' : 'text-gray-900'}>이것만</span>
                </div>
              </div>
            </Link>

            {/* Nav items */}
            <nav className="flex items-center">
              {TOP_NAV.map((item) => (
                <TopNavItem key={item.label} item={item} dark={dark} pathname={pathname} />
              ))}
            </nav>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className={`p-2 rounded-lg transition-colors ${
                dark ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
              aria-label={dark ? '라이트 모드 전환' : '다크 모드 전환'}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Breadcrumb + content */}
        <div className="flex-1 pt-14">
          <div className="max-w-5xl mx-auto px-4">
            <Breadcrumb dark={dark} />
            <main className="pb-12">{children}</main>
          </div>
        </div>
      </div>

      {/* ════════════════════════ MOBILE ════════════════════════ */}
      <div className="flex flex-col min-h-screen md:hidden bg-gray-50 dark:bg-gray-950">
        {/* Sticky top bar */}
        <header
          className={`sticky top-0 z-40 border-b ${
            dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between px-4 h-14">
            <Link to="/" className="flex items-center gap-2">
              <InfinityLogo size="sm" />
              <span className="text-[17px] font-black">
                <span
                  className="bg-gradient-to-r bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(to right, #5B5FEF, #7C6AEF)' }}
                >
                  AI
                </span>
                <span className={dark ? 'text-white' : 'text-gray-900'}>이것만</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <button
                onClick={toggle}
                className={`p-2 rounded-lg transition-colors ${
                  dark ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
                aria-label={dark ? '라이트 모드 전환' : '다크 모드 전환'}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className={`p-2 rounded-lg transition-colors ${
                  dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
                aria-label="메뉴 열기"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile drawer */}
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} dark={dark} pathname={pathname} />

        {/* Content */}
        <main className="flex-1 pb-20">
          <div className="px-4 py-4">{children}</div>
        </main>

        {/* Fixed bottom tab bar */}
        <nav
          className={`fixed bottom-0 left-0 right-0 z-40 border-t ${
            dark
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-around h-16">
            {MOBILE_BOTTOM_TABS.map((tab) => {
              const active = pathname === tab.path || pathname.startsWith(tab.path + '/');
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl min-w-0 min-h-[44px] transition-colors ${
                    active
                      ? 'text-[#5B5FEF]'
                      : dark
                        ? 'text-gray-500'
                        : 'text-gray-400'
                  }`}
                >
                  {tab.icon}
                  <span className={`font-semibold leading-tight ${active ? 'text-xs' : 'text-[10px]'}`}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}
            {/* Hamburger / more button in bottom bar */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl min-w-0 min-h-[44px] transition-colors ${
                drawerOpen
                  ? 'text-[#5B5FEF]'
                  : dark
                    ? 'text-gray-500'
                    : 'text-gray-400'
              }`}
            >
              <MoreHorizontal size={20} />
              <span className={`font-semibold leading-tight text-[10px]`}>더보기</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
