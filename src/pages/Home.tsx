import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNewsRSS } from '../hooks/useNewsRSS';
import { models } from '../data/models';
import { strengths } from '../data/modelStrengths';
import { WEEKLY_RANKING, RANKING_SOURCE, ARENA_EXPERT_TOP20 } from '../data/rankings';
import { CompanyLogo } from '../components/CompanyLogo';
import DataFreshnessWidget from '../components/DataFreshnessWidget';
import {
  Sparkles,
  Search,
  BarChart3,
  ArrowRight,
  DollarSign,
  Trophy,
  TrendingUp,
  Newspaper,
  Medal,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  Flame,
  Target,
} from 'lucide-react';

/* ══════════════════════════════════════════════
   AI Trading Terminal — Home Dashboard
   브랜드 컬러: #5B5FEF (인디고)
   ══════════════════════════════════════════════ */

/* ── 상수 ── */
const TOP_RANKING = WEEKLY_RANKING.slice(0, 8);

const DUMMY_NEWS = [
  { title: 'OpenAI, GPT-5.5 프리뷰 공개 — 추론 능력 2배 향상', cat: '모델 출시' },
  { title: 'Anthropic, Claude 5 출시 예정 — 안전 정책 대폭 개편', cat: '모델 출시' },
  { title: 'Google DeepMind, Gemini 3.0 연구 논문 발표', cat: '연구·논문' },
  { title: 'Meta, Llama 5 오픈소스 공개 — 400B 파라미터', cat: '오픈소스' },
  { title: '삼성전자, AI 반도체 파운드리 투자 50조원 확정', cat: '인프라·하드웨어' },
];

const CAT_COLORS: Record<string, string> = {
  '모델 출시': 'text-violet-400',
  '연구·논문': 'text-brand-400',
  '오픈소스': 'text-emerald-400',
  '인프라·하드웨어': 'text-slate-400',
};

/* ── 헬퍼 ── */
function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff < 7) return `${diff}일 전`;
  return `${new Date(dateStr).getMonth() + 1}.${new Date(dateStr).getDate()}`;
}

// ── Highlights 데이터 ──

// 경제성 Top3: (inputPrice+outputPrice) 오름차순
const economyTop3 = [...models]
  .filter(m => m.inputPrice != null && m.outputPrice != null)
  .sort((a, b) => (a.inputPrice! + a.outputPrice!) - (b.inputPrice! + b.outputPrice!))
  .slice(0, 3);

// 활용도 Top3: strengths에서 종합 평균 높은 순
const utilityTop3 = [...strengths]
  .sort((a, b) => {
    const avgA = Object.values(a.scores).reduce((s, v) => s + v, 0) / 6;
    const avgB = Object.values(b.scores).reduce((s, v) => s + v, 0) / 6;
    return avgB - avgA;
  })
  .slice(0, 3);

// 성능 Top3: strengths에서 코딩+글쓰기 평균 높은 순
const performanceTop3 = [...strengths]
  .sort((a, b) => {
    const sA = (a.scores.coding + a.scores.writing) / 2;
    const sB = (b.scores.coding + b.scores.writing) / 2;
    return sB - sA;
  })
  .slice(0, 3);

// ── Arena Expert Top3 ──
const arenaTop3 = [...models]
  .filter(m => m.arenaScore != null && m.arenaScore != undefined)
  .sort((a, b) => (b.arenaScore ?? 0) - (a.arenaScore ?? 0))
  .slice(0, 3);

const arenaMedals = [Medal, Award, Star] as const;
const arenaAccents = [
  'border-amber-300 dark:border-amber-500/50',
  'border-gray-300 dark:border-gray-500/50',
  'border-orange-300 dark:border-orange-500/50',
] as const;
const arenaBgs = [
  'bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-900',
  'bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900',
  'bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-900',
] as const;

// ── 가성비 데이터 계산 ──
interface CostPerfItem {
  id: string;
  name: string;
  companyId: string;
  score: number;
  monthlyCost: number;
  price: number;
  isFree: boolean;
  isOpenSource: boolean;
}

function getBarColor(monthlyCostKRW: number): string {
  if (monthlyCostKRW === 0) return '#22C55E';
  if (monthlyCostKRW <= 5000) return '#84CC16';
  if (monthlyCostKRW <= 30000) return '#F59E0B';
  return '#EF4444';
}

function getPriceBadge(monthlyCost: number): { label: string; color: string; bg: string } {
  if (monthlyCost === 0) return { label: '무료', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/40' };
  if (monthlyCost <= 5000) return { label: '저렴', color: 'text-lime-600 dark:text-lime-400', bg: 'bg-lime-50 dark:bg-lime-900/40' };
  if (monthlyCost <= 30000) return { label: '보통', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/40' };
  return { label: '비쌈', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/40' };
}

const allCostPerfData: CostPerfItem[] = strengths
  .filter(s => {
    const m = models.find(x => x.id === s.id);
    return m && m.inputPrice != null;
  })
  .map(s => {
    const m = models.find(x => x.id === s.id)!;
    const avgScore = Object.values(s.scores).reduce((sum, v) => sum + v, 0) / 6;
    const totalPrice = (m.inputPrice ?? 0) + (m.outputPrice ?? 0);
    const monthlyCostKRW = Math.round(((m.inputPrice ?? 0) * 50000 + (m.outputPrice ?? 0) * 50000) / 1000000 * 1380);
    const isFree = m.inputPrice === 0 && m.outputPrice === 0;
    const isOpenSource = s.env === 'open' || s.env === 'local';
    return {
      id: s.id,
      name: s.name,
      companyId: s.companyId,
      score: Math.round(avgScore * 10) / 10,
      monthlyCost: monthlyCostKRW,
      price: totalPrice,
      isFree,
      isOpenSource,
    };
  })
  .sort((a, b) => {
    if (a.isFree && !b.isFree) return -1;
    if (!a.isFree && b.isFree) return 1;
    const ratioA = a.score / Math.max(a.monthlyCost, 1);
    const ratioB = b.score / Math.max(b.monthlyCost, 1);
    return ratioB - ratioA;
  });

const TOP3_ACCENTS = [
  'border-amber-500/40',
  'border-gray-500/40',
  'border-orange-500/40',
] as const;
const TOP3_BGS = [
  'bg-amber-500/5 dark:bg-amber-900/20',
  'bg-gray-500/5 dark:bg-gray-800/50',
  'bg-orange-500/5 dark:bg-orange-900/20',
] as const;
const TOP3_ICONS = [Medal, Award, Star] as const;

// ── 필터 타입 ──
type CostPerfFilter = 'all' | 'free' | 'cheap' | 'paid';
type RankingTab = 'usage' | 'arena';

const COST_PERF_FILTER_BUTTONS: { label: string; value: CostPerfFilter }[] = [
  { label: '전체', value: 'all' },
  { label: '무료', value: 'free' },
  { label: '저렴', value: 'cheap' },
  { label: '상용', value: 'paid' },
];

/* ── 컴포넌트 ── */
export default function Home() {
  const { news: allNews } = useNewsRSS();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [costPerfFilter, setCostPerfFilter] = useState<CostPerfFilter>('all');
  const [rankingTab, setRankingTab] = useState<RankingTab>('usage');
  const [showAllRanking, setShowAllRanking] = useState(false);

  // Filter cost-perf data
  const filteredCostPerfData = useMemo(() => {
    switch (costPerfFilter) {
      case 'free': return allCostPerfData.filter(d => d.isFree);
      case 'cheap': return allCostPerfData.filter(d => !d.isFree && d.monthlyCost <= 5000);
      case 'paid': return allCostPerfData.filter(d => !d.isFree);
      default: return allCostPerfData;
    }
  }, [costPerfFilter]);

  // Ranking data per tab
  const usageBarData = useMemo(() => {
    return TOP_RANKING.map((r) => ({
      name: r.model,
      company: r.company,
      tokens: r.tokensNum,
      displayTokens: r.tokens,
    }));
  }, []);

  const arenaBarData = useMemo(() => {
    return ARENA_EXPERT_TOP20.slice(0, 10).map((a) => ({
      name: a.name,
      company: a.company,
      score: a.score,
      ci: a.ci,
      votes: a.votes,
    }));
  }, []);

  const maxTokens = Math.max(...usageBarData.map(d => d.tokens), 1);
  const maxArenaScore = arenaBarData.length > 0 ? Math.max(...arenaBarData.map(d => d.score)) : 1;

  const topNews = allNews.length > 0
    ? allNews.slice(0, 5)
    : DUMMY_NEWS.map((n, i) => ({ id: `d${i}`, title: n.title, category: n.cat, date: new Date().toISOString(), source: '더미', summary: '', url: '#', tags: [] }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore/compare?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">

      {/* ═══════════════════════════════════════
          1. SEARCH BAR — 컴팩트 터미널 스타일
          ═══════════════════════════════════════ */}
      <section className="animate-fade-in">
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
          {/* 타이틀 바 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#5B5FEF] animate-pulse" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wider uppercase">AI Terminal</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <Link to="/explore/guide" className="hover:text-[#8B8FFF] transition-colors inline-flex items-center gap-1"><Sparkles className="w-3 h-3" />추천</Link>
              <Link to="/pricing" className="hover:text-[#8B8FFF] transition-colors inline-flex items-center gap-1"><DollarSign className="w-3 h-3" />가격</Link>
              <Link to="/explore/compare" className="hover:text-[#8B8FFF] transition-colors inline-flex items-center gap-1"><BarChart3 className="w-3 h-3" />전체</Link>
            </div>
          </div>

          {/* 검색바 */}
          <form onSubmit={handleSearch} className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="모델 검색 또는 용도 입력…  예: 블로그 글쓰기"
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#5B5FEF]/50 focus:border-[#5B5FEF]/50 transition-all font-mono"
            />
          </form>

          {/* 빠른 태그 */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '글쓰기·문서', query: '글쓰기 문서 작성' },
              { label: '번역·요약', query: '번역 요약' },
              { label: '이미지 생성', query: '이미지 생성' },
              { label: '업무 생산성', query: '업무 생산성 코딩' },
              { label: '무료 우선', query: '무료 우선' },
              { label: '월 1만원 이하', query: '월 1만원 이하' },
            ].map((item) => (
              <button
                key={item.query}
                onClick={() => { setSearchQuery(item.query); handleSearch(new Event('click') as any); }}
                className="px-2.5 py-1 rounded text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/60 hover:text-[#8B8FFF] hover:bg-[#5B5FEF]/10 hover:border-[#5B5FEF]/20 transition-all border border-transparent"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. KEY METRICS — 3카드 가로 배치
          ═══════════════════════════════════════ */}
      <section className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* ── Arena Top3 ── */}
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 hover:border-[#5B5FEF]/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#5B5FEF]/10 flex items-center justify-center text-[#5B5FEF]">
                <Trophy className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">Arena Top 3</h3>
                <p className="text-[10px] text-gray-500">Expert 평가 순위</p>
              </div>
              <Link to="/explore/ranking" className="text-[10px] text-gray-500 hover:text-[#8B8FFF] transition-colors">
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {arenaTop3.map((m, i) => {
                const IconComp = arenaMedals[i];
                const iconColor = i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-500 dark:text-gray-400' : 'text-orange-400';
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 cursor-pointer group rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
                    onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(m.name)}`)}
                  >
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 w-3">{i + 1}</span>
                    <IconComp className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                    <CompanyLogo company={m.company} size={16} />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white truncate flex-1">{m.name}</span>
                    <span className="text-[11px] font-bold text-[#8B8FFF] tabular-nums">{m.arenaScore}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 가성비 Top3 ── */}
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 hover:border-[#5B5FEF]/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Target className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">가성비 Top 3</h3>
                <p className="text-[10px] text-gray-500">가격 대비 성능 최고</p>
              </div>
              <Link to="/pricing" className="text-[10px] text-gray-500 hover:text-[#8B8FFF] transition-colors">
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {filteredCostPerfData.slice(0, 3).map((item, i) => {
                const IconComp = TOP3_ICONS[i];
                const badge = getPriceBadge(item.monthlyCost);
                const iconColor = i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-500 dark:text-gray-400' : 'text-orange-400';
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border ${TOP3_ACCENTS[i]} ${TOP3_BGS[i]} px-2 py-1.5 cursor-pointer group hover:brightness-125 transition-all`}
                    onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(item.name)}`)}
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                      <CompanyLogo company={item.companyId} size={16} />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white truncate flex-1">{item.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.bg} ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 실사용량 Top3 ── */}
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 hover:border-[#5B5FEF]/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <Flame className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">실사용량 Top 3</h3>
                <p className="text-[10px] text-gray-500">OpenRouter 주간 사용량</p>
              </div>
              <Link to="/explore/ranking" className="text-[10px] text-gray-500 hover:text-[#8B8FFF] transition-colors">
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {usageBarData.slice(0, 3).map((item, i) => {
                const IconComp = TOP3_ICONS[i];
                const iconColor = i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-500 dark:text-gray-400' : 'text-orange-400';
                return (
                  <div
                    key={item.name}
                    className={`rounded-lg border ${TOP3_ACCENTS[i]} ${TOP3_BGS[i]} px-2 py-1.5 cursor-pointer group hover:brightness-125 transition-all`}
                    onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(item.name)}`)}
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                      <CompanyLogo company={item.company} size={16} />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white truncate flex-1">{item.name}</span>
                      <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tabular-nums">{item.displayTokens}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. COST-PERF TABLE — 가성비 전체 리스트
          ═══════════════════════════════════════ */}
      <section className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#5B5FEF]" />
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">가성비 리더보드</h2>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">월 10만 토큰 기준 · ₩1380/$</span>
        </div>

        {/* 필터 */}
        <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
          {COST_PERF_FILTER_BUTTONS.map(btn => (
            <button
              key={btn.value}
              onClick={() => setCostPerfFilter(btn.value)}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                costPerfFilter === btn.value
                  ? 'bg-[#5B5FEF] text-white'
                  : 'text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Top3 하이라이트 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {filteredCostPerfData.slice(0, 3).map((item, i) => {
            const IconComp = TOP3_ICONS[i];
            const badge = getPriceBadge(item.monthlyCost);
            const iconColor = i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-500 dark:text-gray-400' : 'text-orange-400';
            return (
              <div
                key={item.id}
                className={`rounded-lg border ${TOP3_ACCENTS[i]} ${TOP3_BGS[i]} p-3 cursor-pointer hover:brightness-125 transition-all`}
                onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(item.name)}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <IconComp className={`w-4 h-4 shrink-0 ${iconColor}`} />
                  <CompanyLogo company={item.companyId} size={18} />
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.bg} ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate mb-1">{item.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">성능 <span className="font-bold text-[#8B8FFF]">{item.score}</span></p>
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                    {item.monthlyCost === 0 ? '무료' : `₩${item.monthlyCost.toLocaleString()}/mo`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 바 리스트 */}
        <div className="space-y-1.5">
          {filteredCostPerfData.slice(3).map((item, i) => {
            const badge = getPriceBadge(item.monthlyCost);
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg px-2 py-1 transition-colors"
                onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(item.name)}`)}
              >
                <span className="w-5 text-center text-[10px] text-gray-400 dark:text-gray-600 shrink-0 font-mono">{i + 4}</span>
                <CompanyLogo company={item.companyId} size={14} />
                <span className="w-20 sm:w-28 text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score * 10}%`, backgroundColor: getBarColor(item.monthlyCost) }}
                  />
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.bg} ${badge.color}`}>
                  {item.monthlyCost === 0 ? '무료' : `₩${item.monthlyCost.toLocaleString()}`}
                </span>
                <span className="w-7 text-right text-[10px] text-gray-500 shrink-0 font-mono">{item.score}</span>
              </div>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-3 mt-3 text-[9px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#22C55E' }} />무료</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#84CC16' }} />저렴</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#F59E0B' }} />보통</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#EF4444' }} />비쌈</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. RANKING TABLE — 실사용량 / Arena Expert
          ═══════════════════════════════════════ */}
      <section className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#5B5FEF]" />
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">랭킹</h2>
          </div>
          <Link to="/explore/ranking" className="text-[10px] text-gray-500 hover:text-[#8B8FFF] transition-colors flex items-center gap-1">
            전체 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 탭 */}
        <div className="flex gap-1.5 mt-2 mb-4">
          <button
            onClick={() => setRankingTab('usage')}
            className={`rounded px-3 py-1 text-[11px] font-semibold transition-all ${
              rankingTab === 'usage'
                ? 'bg-[#5B5FEF] text-white'
                : 'text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            실사용량
          </button>
          <button
            onClick={() => setRankingTab('arena')}
            className={`rounded px-3 py-1 text-[11px] font-semibold transition-all ${
              rankingTab === 'arena'
                ? 'bg-[#5B5FEF] text-white'
                : 'text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            Arena Expert
          </button>
        </div>

        {/* Arena Expert Top3 카드 */}
        {rankingTab === 'arena' && arenaTop3.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            {arenaTop3.map((m, i) => {
              const iconColor = i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-500 dark:text-gray-400' : 'text-orange-400';
              return (
                <div
                  key={m.id}
                  className={`rounded-lg border ${arenaAccents[i]} ${arenaBgs[i]} p-3 flex items-center gap-2.5 cursor-pointer hover:brightness-125 transition-all`}
                  onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(m.name)}`)}
                >
                  <span className="text-lg shrink-0">{i === 0 ? <Medal className={`w-5 h-5 ${iconColor}`} /> : i === 1 ? <Award className={`w-5 h-5 ${iconColor}`} /> : <Star className={`w-5 h-5 ${iconColor}`} />}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{m.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-[#8B8FFF]">{m.arenaScore}</span>
                      {m.arenaCI && <span className="ml-0.5">{m.arenaCI}</span>}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">{m.company}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Usage Top3 카드 */}
        {rankingTab === 'usage' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            {usageBarData.slice(0, 3).map((item, i) => {
              const IconComp = TOP3_ICONS[i];
              const iconColor = i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-500 dark:text-gray-400' : 'text-orange-400';
              return (
                <div
                  key={item.name}
                  className={`rounded-lg border ${TOP3_ACCENTS[i]} ${TOP3_BGS[i]} p-3 flex items-center gap-2.5 cursor-pointer hover:brightness-125 transition-all`}
                  onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(item.name)}`)}
                >
                  <IconComp className={`w-5 h-5 shrink-0 ${iconColor}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-[#8B8FFF]">{item.displayTokens}</span> 주간
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">{item.company}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 바 리스트 */}
        <div className="space-y-1.5">
          {rankingTab === 'usage' && usageBarData.slice(0, showAllRanking ? undefined : 8).map((item, i) => (
            <div
              key={item.name}
              className="flex items-center gap-2 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg px-2 py-1 transition-colors"
              onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(item.name)}`)}
            >
              <span className="w-5 text-center text-[10px] font-bold text-gray-400 dark:text-gray-600 shrink-0 font-mono">{i + 1}</span>
              <span className="w-20 sm:w-28 text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
              <div className="flex-1 h-5 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden relative">
                <div
                  className="h-full rounded transition-all duration-700 ease-out"
                  style={{
                    width: `${(item.tokens / maxTokens) * 100}%`,
                    backgroundColor: i < 3 ? '#5B5FEF' : i < 5 ? '#7C6AEF' : '#3A3D5C',
                  }}
                />
                <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                  {item.displayTokens}
                </span>
              </div>
            </div>
          ))}

          {rankingTab === 'arena' && arenaBarData.map((item, i) => (
            <div
              key={item.name}
              className="flex items-center gap-2 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg px-2 py-1 transition-colors"
              onClick={() => navigate(`/explore/compare?search=${encodeURIComponent(item.name)}`)}
            >
              <span className="w-5 text-center text-[10px] font-bold text-gray-400 dark:text-gray-600 shrink-0 font-mono">{i + 1}</span>
              <span className="w-20 sm:w-28 text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
              <div className="flex-1 h-5 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden relative">
                <div
                  className="h-full rounded transition-all duration-700 ease-out"
                  style={{
                    width: `${(item.score / maxArenaScore) * 100}%`,
                    backgroundColor: i < 3 ? '#5B5FEF' : i < 5 ? '#7C6AEF' : '#3A3D5C',
                  }}
                />
                <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                  {item.score}{item.ci} · {item.votes}표
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 */}
        {rankingTab === 'usage' && usageBarData.length > 8 && (
          <button
            onClick={() => setShowAllRanking(prev => !prev)}
            className="text-[11px] text-center w-full py-1.5 mt-1 text-gray-500 hover:text-[#8B8FFF] transition-colors"
          >
            {showAllRanking ? (
              <span className="inline-flex items-center gap-1">접기 <ChevronUp className="w-3 h-3" /></span>
            ) : (
              <span className="inline-flex items-center gap-1">더보기 ({usageBarData.length - 8}개) <ChevronDown className="w-3 h-3" /></span>
            )}
          </button>
        )}

        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2">업데이트: 2026년 4월 16일 · 출처: {RANKING_SOURCE}</p>
      </section>

      {/* ═══════════════════════════════════════
          5. NEWS TICKER — 컴팩트 뉴스
          ═══════════════════════════════════════ */}
      <section className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#5B5FEF]" />
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">뉴스 피드</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <Link to="/news" className="text-[10px] text-gray-500 hover:text-[#8B8FFF] transition-colors flex items-center gap-1">
            전체 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <ul className="space-y-0">
          {topNews.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 py-2 border-b border-gray-200 dark:border-gray-800 last:border-0"
              >
                <span className={`text-[9px] font-bold tracking-wider uppercase shrink-0 w-12 pt-0.5 ${CAT_COLORS[item.category] ?? 'text-gray-500'}`}>
                  {item.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#8B8FFF] transition-colors line-clamp-1 flex-1">
                  {item.title}
                </span>
                {item.date && (
                  <span className="text-[9px] text-gray-400 dark:text-gray-600 shrink-0 font-mono">{timeAgo(item.date)}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════════════════════════════════
          6. CTA BANNER — 인디고 그라디언트
          ═══════════════════════════════════════ */}
      <section
        className="rounded-xl p-5 md:p-6 text-center text-white animate-fade-in relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5B5FEF 0%, #7C6AEF 50%, #9B8AEF 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-base md:text-lg font-black mb-1">어떤 AI가 나에게 맞을까?</h2>
          <p className="text-xs text-white/70 mb-4 max-w-sm mx-auto">
            2가지만 선택하면 최적의 AI 모델을 추천해드립니다
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              to="/explore/guide"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#FFFFFF', color: '#5B5FEF' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              무료로 AI 찾기
            </Link>
            <Link
              to="/explore/compare"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold text-white border border-white/30 transition-all hover:bg-white/10"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              전체 모델 비교
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          DATA FRESHNESS WIDGET — 데이터 신선도
          ═══════════════════════════════════════ */}
      <DataFreshnessWidget />

      {/* ═══════════════════════════════════════
          FOOTER — 데이터 기준일
          ═══════════════════════════════════════ */}
      <footer className="text-center py-2">
        <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">
          DATA: 2026-04-16 · Updated weekly · onlyAI
        </p>
      </footer>
    </div>
  );
}
