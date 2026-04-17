import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNewsRSS } from '../hooks/useNewsRSS';
import { models } from '../data/models';
import { CompanyLogo } from '../components/CompanyLogo';
import { WEEKLY_RANKING, RANKING_SOURCE } from '../data/rankings';
import {
  Sparkles,
  Search,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

/* ── 상수 ── */
const TOP3_RANKING = WEEKLY_RANKING.slice(0, 3);

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

/* ── 헬퍼 ── */
function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff < 7) return `${diff}일 전`;
  return `${new Date(dateStr).getMonth() + 1}.${new Date(dateStr).getDate()}`;
}

/* ── TOP3 카드 메타데이터 ── */
function getTop3Meta(modelId: string) {
  const m = models.find(x => x.id === modelId);
  if (!m) return null;
  return {
    company: m.company,
    companyId: m.companyId,
    name: m.name,
    tagline: m.description ?? '',
    contextWindow: m.contextWindow,
    inputPrice: m.inputPrice,
    outputPrice: m.outputPrice,
  };
}

/* ── 컴포넌트 ── */
export default function Home() {
  const { news: allNews } = useNewsRSS();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const topNews = allNews.length > 0
    ? allNews.slice(0, 5)
    : DUMMY_NEWS.map((n, i) => ({ id: `d${i}`, title: n.title, category: n.cat, date: new Date().toISOString(), source: '더미', summary: '', url: '#', tags: [] }));

  // 가격 비교 테이블: 상위 5개
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
            AI 모델 비교 NO.1
          </span>

          {/* Heading */}
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-2">
            나에게 맞는 AI, 뭐가 제일 좋을까?
          </h1>

          {/* Subtitle — 브랜드 정체성 */}
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-6">
            AI가 너무 많아서 뭐가 좋은지 모르겠다면?
            <br className="hidden sm:block" />
            예산, 용도, 성능을 고려해 당신에게 딱 맞는 AI를 찾아드립니다.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="예: '블로그 글쓰기용 무료 AI'"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30 focus:border-[#5B5FEF] transition-all"
            />
          </form>

          {/* CTAs — 강화 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/explore/guide"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: '#5B5FEF', boxShadow: '0 8px 24px rgba(91,95,239,0.35)' }}
            >
              <Sparkles className="w-5 h-5" />
              나에게 맞는 AI 찾기
            </Link>
            <Link
              to="/explore/compare"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md"
            >
              <BarChart3 className="w-5 h-5" />
              58개 모델 전체 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 2. TOP 3 모델 카드 (확대 + 시각 강화) ═══ */}
      <section className="lg:col-span-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">🔥 이번주 가장 인기 있는 AI 모델</h2>
            <p className="text-xs text-gray-400 mt-0.5">OpenRouter 실제 사용량 기준 · 매주 업데이트</p>
          </div>
          <Link to="/explore/ranking" className="text-xs text-gray-500 hover:text-[#5B5FEF] dark:hover:text-[#8B8FFF] transition-colors flex items-center gap-1">
            전체 랭킹 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TOP3_RANKING.map((entry, idx) => {
            const meta = getTop3Meta(entry.model);
            const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
            const isFree = meta?.inputPrice === 0 && meta?.outputPrice === 0;
            return (
              <Link
                key={entry.model}
                to={`/explore/compare`}
                className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-xl hover:border-[#5B5FEF]/30 dark:hover:border-[#5B5FEF]/50 transition-all hover:-translate-y-0.5"
              >
                {/* 순위 + 로고 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <CompanyLogo company={entry.company} size={32} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.model}</p>
                      <p className="text-xs text-gray-400">{entry.company}</p>
                    </div>
                  </div>
                  <span className="text-3xl">{rankBadge}</span>
                </div>

                {/* 설명 */}
                {meta?.tagline && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{meta.tagline}</p>
                )}

                {/* 스펙 */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {meta?.contextWindow && (
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{meta.contextWindow}</span> 컨텍스트
                    </span>
                  )}
                  {meta && (
                    <span className={`font-semibold ${isFree ? 'text-emerald-500' : 'text-gray-700 dark:text-gray-300'}`}>
                      {isFree ? '무료' : `$${meta.inputPrice}/${meta.outputPrice}`}
                    </span>
                  )}
                </div>

                {/* 토큰 + 변화 */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-gray-900 dark:text-white">{entry.tokens}</span>
                    <span className="text-[11px] text-gray-400">토큰</span>
                  </div>
                  <span className={`text-xs font-bold ${entry.change === 'NEW' ? 'text-emerald-500' : entry.change.startsWith('+') ? 'text-red-500' : entry.change.startsWith('-') ? 'text-blue-500' : 'text-gray-400'}`}>
                    {entry.change}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ 3. 가격 한눈에 보기 ═══ */}
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

      {/* ═══ 4. 최근 업데이트 ═══ */}
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

      {/* ═══ 5. CTA 배너 ═══ */}
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
              to="/explore/guide"
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
    </div>
  );
}
