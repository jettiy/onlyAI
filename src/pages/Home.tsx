import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNewsRSS } from '../hooks/useNewsRSS';
import { models } from '../data/models';
import { type UseCase, type BudgetTier } from '../data/modelStrengths';
import { strengths } from '../data/modelStrengths';
import { recommend } from '../lib/recommendEngine';
import { CompanyLogo } from '../components/CompanyLogo';
import { WEEKLY_RANKING, RANKING_SOURCE } from '../data/rankings';
import {
  Scale,
  Monitor,
  Sparkles,
  Newspaper,
  Video,
  ImageIcon,
  Search,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

/* ── 상수 ── */
const TOP3_RANKING = WEEKLY_RANKING.slice(0, 3);

/* ── 용도별 추천 카드 ── */
const USE_CASE_CARDS = [
  {
    icon: '✍️', label: '글쓰기', desc: '블로그·보고서·번역',
    useCase: 'writing' as UseCase,
    color: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800',
  },
  {
    icon: '💻', label: '코딩', desc: '코드 생성·디버깅',
    useCase: 'coding' as UseCase,
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  },
  {
    icon: '💬', label: '한국어 대화', desc: '자연스러운 한국어',
    useCase: 'chat' as UseCase,
    color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
  },
  {
    icon: '📊', label: '요약·분석', desc: '문서·데이터 요약',
    useCase: 'summary' as UseCase,
    color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  },
  {
    icon: '🖼️', label: '이미지 생성', desc: '그림·디자인·로고',
    useCase: 'image' as UseCase,
    color: 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800',
  },
  {
    icon: '🎬', label: '비디오 생성', desc: '숏폼·광고·영상',
    useCase: 'video' as UseCase,
    color: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
  },
];

const QUICK_LINKS = [
  { icon: Scale, label: 'AI 비교하기', desc: '모델 가격·성능 비교', to: '/explore/compare', color: 'bg-brand' },
  { icon: Monitor, label: 'PC 체크', desc: '내 PC에서 AI 구동 가능?', to: '/pc-check', color: 'bg-success' },
  { icon: Sparkles, label: 'AI 추천', desc: '용도별 맞춤 추천', to: '/recommend', color: 'bg-brand' },
  { icon: Newspaper, label: '뉴스', desc: '오늘의 AI 소식', to: '/news', color: 'bg-amber-500' },
  { icon: Video, label: '비디오 AI', desc: '비디오 생성 모델 비교', to: '/video/compare', color: 'bg-pink-500' },
  { icon: ImageIcon, label: '이미지 AI', desc: '이미지 생성 모델 비교', to: '/image', color: 'bg-teal-500' },
];

const DUMMY_NEWS = [
  { title: 'OpenAI, GPT-5.5 프리뷰 공개 — 추론 능력 2배 향상', cat: '모델 출시' },
  { title: 'Anthropic, Claude 5 출시 예정 — 안전 정책 대폭 개편', cat: '모델 출시' },
  { title: 'Google DeepMind, Gemini 3.0 연구 논문 발표', cat: '연구·논문' },
  { title: 'Meta, Llama 5 오픈소스 공개 — 400B 파라미터', cat: '오픈소스' },
  { title: '삼성전자, AI 반도체 파운드리 투자 50조원 확정', cat: '인프라·하드웨어' },
];

const CAT_COLORS: Record<string, string> = {
  '모델 출시': 'text-violet-500',
  '연구·논문': 'text-brand-500',
  '오픈소스': 'text-emerald-500',
  '인프라·하드웨어': 'text-slate-400',
};

const QUIZ_USES: { key: UseCase; icon: string; label: string }[] = [
  { key: 'writing', icon: '✍️', label: '글쓰기' },
  { key: 'coding', icon: '💻', label: '코딩' },
  { key: 'image', icon: '🖼️', label: '이미지' },
  { key: 'video', icon: '🎬', label: '비디오' },
  { key: 'summary', icon: '📊', label: '요약' },
  { key: 'chat', icon: '💬', label: '대화' },
];

const QUIZ_BUDGETS: { key: BudgetTier; icon: string; label: string }[] = [
  { key: 'free', icon: '🆓', label: '무료' },
  { key: 'cheap', icon: '💰', label: '1만↓' },
  { key: 'mid', icon: '💳', label: '5만↓' },
  { key: 'premium', icon: '💎', label: '상관없음' },
];

/* ── 헬퍼 ── */
function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff < 7) return `${diff}일 전`;
  return `${new Date(dateStr).getMonth() + 1}.${new Date(dateStr).getDate()}`;
}

/* ── 컴포넌트 ── */
export default function Home() {
  const { news: allNews } = useNewsRSS();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const topNews = allNews.length > 0
    ? allNews.slice(0, 5)
    : DUMMY_NEWS.map((n, i) => ({ id: `d${i}`, title: n.title, category: n.cat, date: new Date().toISOString(), source: '더미', summary: '', url: '#', tags: [] }));

  // 하단 Pricing: 상위 5개 (입력가격 기준 정렬, null 제외)
  const topPriced = [...models]
    .filter(m => m.inputPrice != null && m.outputPrice != null)
    .sort((a, b) => (a.inputPrice! + a.outputPrice!) - (b.inputPrice! + b.outputPrice!))
    .slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore/compare?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* ═══ Bento Grid: 2열 레이아웃 ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

      {/* ═══ 1. HERO ═══ */}
      <section className="lg:col-span-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-10 animate-fade-in">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <span
            className="inline-block text-[11px] font-bold tracking-wider uppercase text-white px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: '#5B5FEF' }}
          >
            한국어 AI 모델 비교 NO.1
          </span>

          {/* Heading */}
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-2">
            한국어 AI, 뭐가 제일 좋을까?
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            가격, 성능, 한국어 능력까지 — 58개 AI 모델을 한 곳에서 비교하세요
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="찾는 모델이 있나요?"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30 focus:border-[#5B5FEF] transition-all"
            />
          </form>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/recommend"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: '#5B5FEF' }}
            >
              <Sparkles className="w-4 h-4" />
              나에게 맞는 AI 찾기
            </Link>
            <Link
              to="/explore/compare"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <BarChart3 className="w-4 h-4" />
              58개 모델 전체 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 2. TOP 3 모델 카드 (OpenRouter 랭킹) ═══ */}
      <section className="lg:col-span-3 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">이번주 인기 모델</h2>
            <span className="text-[11px] font-normal text-gray-400">{RANKING_SOURCE}</span>
          </div>
          <Link to="/explore/ranking" className="text-xs text-gray-500 hover:text-[#5B5FEF] dark:hover:text-[#8B8FFF] transition-colors">
            전체 랭킹 <ArrowRight className="inline w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TOP3_RANKING.map((entry, idx) => (
            <div
              key={entry.model}
              className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-lg hover:border-[#5B5FEF]/30 dark:hover:border-[#5B5FEF]/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <CompanyLogo company={entry.company} size={28} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.model}</p>
                    <p className="text-[11px] text-gray-400">{entry.company}</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-gray-200 dark:text-gray-700">#{idx + 1}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {entry.tokens}
                </span>
                <span className="text-[11px] text-gray-400">토큰</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${entry.change === 'NEW' ? 'text-emerald-500' : entry.change.startsWith('+') ? 'text-red-500' : entry.change.startsWith('-') ? 'text-blue-500' : 'text-gray-400'}`}>
                  {entry.change}
                </span>
                <span className="text-[11px] text-gray-400">전 주 대비</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. 용도별 AI 추천 ═══ */}
      <section className="lg:col-span-2 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">용도별 AI 추천</h2>
          <Link to="/recommend" className="text-xs text-gray-500 hover:text-[#5B5FEF] dark:hover:text-[#8B8FFF] transition-colors">
            더 자세히 <ArrowRight className="inline w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {USE_CASE_CARDS.map(uc => {
            const top2 = strengths
              .filter(s => s.scores[uc.useCase] >= 8)
              .sort((a, b) => b.scores[uc.useCase] - a.scores[uc.useCase])
              .slice(0, 2);
            return (
              <Link
                key={uc.useCase}
                to={`/recommend?useCase=${uc.useCase}`}
                className={`group block rounded-2xl border p-4 hover:shadow-md transition-all ${uc.color}`}
              >
                <span className="text-xl mb-2 block">{uc.icon}</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{uc.label}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">{uc.desc}</p>
                {top2.length > 0 && (
                  <div className="space-y-1.5">
                    {top2.map(s => (
                      <div key={s.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CompanyLogo company={s.companyId} size={14} />
                          <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{s.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">{s.monthlyEst}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ 4. 빠른 시작 ═══ */}
      <section className="lg:col-span-5 animate-fade-in">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">빠른 시작</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-lg transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center mb-3 text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{link.label}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{link.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ 4. 가격 한눈에 보기 ═══ */}
      <section className="lg:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">가격 한눈에 보기</h2>
          <Link to="/pricing" className="text-xs text-gray-500 hover:text-[#5B5FEF] dark:hover:text-[#8B8FFF] transition-colors">
            전체 가격표 <ArrowRight className="inline w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 pb-2 pr-4">모델</th>
                <th className="text-right text-[11px] font-semibold text-gray-500 dark:text-gray-400 pb-2 px-2">입력</th>
                <th className="text-right text-[11px] font-semibold text-gray-500 dark:text-gray-400 pb-2 px-2">출력</th>
                <th className="text-right text-[11px] font-semibold text-gray-500 dark:text-gray-400 pb-2 pl-2">컨텍스트</th>
              </tr>
            </thead>
            <tbody>
              {topPriced.map(m => {
                const isFree = m.inputPrice === 0 && m.outputPrice === 0;
                const isExpensive = m.outputPrice != null && m.outputPrice > 10;
                return (
                  <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <CompanyLogo company={m.company} size={18} />
                        <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">{m.name}</span>
                      </div>
                    </td>
                    <td className={`text-right py-2 px-2 font-mono text-xs ${isFree ? 'text-emerald-500 font-bold' : isExpensive ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                      {isFree ? '무료' : `$${m.inputPrice?.toFixed(2)}`}
                    </td>
                    <td className={`text-right py-2 px-2 font-mono text-xs ${isFree ? 'text-emerald-500 font-bold' : isExpensive ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                      {isFree ? '무료' : `$${m.outputPrice?.toFixed(2)}`}
                    </td>
                    <td className="text-right py-2 pl-2 text-xs text-gray-500 dark:text-gray-400">
                      {m.contextWindow}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">USD per 1M tokens · 입력가격 기준 정렬</p>
      </section>

      {/* ═══ 5. 최근 업데이트 ═══ */}
      <section className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">최근 업데이트</h2>
          <Link to="/news" className="text-xs text-gray-500 hover:text-[#5B5FEF] dark:hover:text-[#8B8FFF] transition-colors">
            전체 보기 <ArrowRight className="inline w-3 h-3" />
          </Link>
        </div>
        <ul className="space-y-2">
          {topNews.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className={`text-[10px] font-bold tracking-wider uppercase shrink-0 w-14 pt-0.5 ${CAT_COLORS[item.category] ?? 'text-gray-500'}`}>
                  {item.category}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#5B5FEF] dark:group-hover:text-[#8B8FFF] transition-colors line-clamp-1">
                  {item.title}
                </span>
                {item.date && (
                  <span className="text-[10px] text-gray-400 shrink-0 pt-0.5">{timeAgo(item.date)}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══ 6. CTA 배너 ═══ */}
      <section
        className="lg:col-span-5 rounded-2xl p-6 md:p-8 text-center text-white animate-fade-in relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5B5FEF 0%, #7C6AEF 50%, #9B8AEF 100%)' }}
      >
        {/* 장식 원 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex -space-x-2">
              {['openai', 'anthropic', 'google', 'meta'].map(c => (
                <span key={c} className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                  <CompanyLogo company={c} size={14} />
                </span>
              ))}
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-black mb-1.5">어떤 AI가 나에게 맞을까?</h2>
          <p className="text-sm text-white/80 mb-5 max-w-sm mx-auto">
            2가지만 선택하면 최적의 AI 모델을 추천해드립니다
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/recommend"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#FFFFFF', color: '#5B5FEF' }}
            >
              <Sparkles className="w-4 h-4" />
              무료로 AI 찾기
            </Link>
            <Link
              to="/explore/compare"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white border border-white/30 transition-all hover:bg-white/10"
            >
              <BarChart3 className="w-4 h-4" />
              전체 모델 비교
            </Link>
          </div>
        </div>
      </section>
      </div>
      {/* ═══ 데이터 기준일 ═══ */}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
        데이터 기준일: 2026년 4월 16일 · 모델 정보는 정기적으로 업데이트됩니다
      </p>

      {/* ═══ 7. 미니 추천 퀴즈 ═══ */}
      <MiniRecommend navigate={navigate} />
    </div>
  );
}

/* ── 미니 추천 퀴즈 위젯 ── */
function MiniRecommend({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [useCase, setUseCase] = useState<UseCase | ''>('');
  const [budget, setBudget] = useState<BudgetTier | ''>('');

  // 실시간 미리보기
  const preview = useMemo(() => {
    if (!useCase && !budget) return [];
    return recommend({
      useCases: useCase ? [useCase] : [],
      budget: (budget || 'free') as BudgetTier,
      privacy: 'medium',
    }).slice(0, 3);
  }, [useCase, budget]);

  const go = () => {
    const params = new URLSearchParams();
    if (useCase) params.set('useCase', useCase);
    if (budget) params.set('budget', budget);
    navigate(`/recommend${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 animate-fade-in">
      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">나에게 맞는 AI 찾기</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">2가지만 선택하면 추천해드려요</p>

      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">용도</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {QUIZ_USES.map(u => (
          <button key={u.key} onClick={() => setUseCase(useCase === u.key ? '' : u.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              useCase === u.key
                ? 'text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            style={useCase === u.key ? { backgroundColor: '#5B5FEF', boxShadow: '0 4px 14px rgba(91,95,239,0.3)' } : undefined}
          >
            <span>{u.icon}</span>{u.label}
          </button>
        ))}
      </div>

      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">예산</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {QUIZ_BUDGETS.map(b => (
          <button key={b.key} onClick={() => setBudget(budget === b.key ? '' : b.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              budget === b.key
                ? 'text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            style={budget === b.key ? { backgroundColor: '#5B5FEF', boxShadow: '0 4px 14px rgba(91,95,239,0.3)' } : undefined}
          >
            <span>{b.icon}</span>{b.label}
          </button>
        ))}
      </div>

      {/* 실시간 미리보기 */}
      {preview.length > 0 && (
        <div className="mb-4 space-y-2 animate-fade-in">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">추천 결과 미리보기</p>
          {preview.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="text-sm">{['🥇','🥈','🥉'][i]}</span>
              <CompanyLogo company={r.companyId} size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{r.name}</p>
                <p className="text-[10px] text-gray-400">{r.tagline}</p>
              </div>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">{r.score}점</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={go}
        className="w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ backgroundColor: '#5B5FEF', boxShadow: '0 4px 14px rgba(91,95,239,0.3)' }}
      >
        <Sparkles className="w-4 h-4" />
        {preview.length > 0 ? '전체 결과 보기' : 'AI 추천 결과 보기'}
      </button>
    </section>
  );
}
