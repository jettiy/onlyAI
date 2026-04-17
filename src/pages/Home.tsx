import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNewsRSS } from '../hooks/useNewsRSS';
import { models } from '../data/models';
import { strengths } from '../data/modelStrengths';
import { WEEKLY_RANKING, RANKING_SOURCE } from '../data/rankings';
import { CompanyLogo } from '../components/CompanyLogo';
import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from '../lib/safeRecharts';
import {
  Sparkles,
  Search,
  BarChart3,
  ArrowRight,
  DollarSign,
  Wrench,
  Trophy,
} from 'lucide-react';

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

function getModelMeta(modelId: string) {
  const m = models.find(x => x.id === modelId);
  if (!m) return null;
  return { company: m.company, companyId: m.companyId, name: m.name, tagline: m.description ?? '', contextWindow: m.contextWindow, inputPrice: m.inputPrice, outputPrice: m.outputPrice };
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

// ── 산점도 데이터 ──
const scatterData = strengths
  .filter(s => {
    const m = models.find(x => x.id === s.id);
    return m && m.inputPrice != null;
  })
  .map(s => {
    const m = models.find(x => x.id === s.id)!;
    const avgScore = Object.values(s.scores).reduce((sum, v) => sum + v, 0) / 6;
    const totalPrice = (m.inputPrice ?? 0) + (m.outputPrice ?? 0);
    return {
      name: s.name,
      companyId: s.companyId,
      price: totalPrice,
      score: Math.round(avgScore * 10) / 10,
    };
  });

function getScatterColor(score: number, price: number) {
  // 가성비 = 높은 점수 + 낮은 가격 → 초록, 반대 → 빨강
  const ratio = (score / 10) / Math.max(price, 0.1);
  if (ratio > 0.8) return '#22C55E';
  if (ratio > 0.4) return '#5B5FEF';
  if (ratio > 0.15) return '#F59E0B';
  return '#EF4444';
}

// ── 바 차트 데이터 ──
const barData = TOP_RANKING.map((r, i) => ({
  name: r.model,
  company: r.company,
  tokens: r.tokensNum,
  fill: i === 0 ? '#5B5FEF' : i === 1 ? '#7C6AEF' : i === 2 ? '#9B8AEF' : i < 5 ? '#B8AAEF' : '#D4CAEF',
}));

/* ── 커스텀 Tooltip ── */
function ScatterTooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ payload?: { name: string; price: number; score: number } }> }) {
  if (!active || !payload?.[0]?.payload) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-gray-900 dark:text-white">{d.name}</p>
      <p className="text-gray-500">가격: <span className="font-semibold text-gray-700 dark:text-gray-300">${d.price.toFixed(2)}/M</span></p>
      <p className="text-gray-500">종합점수: <span className="font-semibold text-gray-700 dark:text-gray-300">{d.score}/10</span></p>
    </div>
  );
}

/* ── 컴포넌트 ── */
export default function Home() {
  const { news: allNews } = useNewsRSS();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="space-y-10">

      {/* ═══ 1. HERO — 컴팩트 & 미니멀 ═══ */}
      <section className="text-center py-10 md:py-16 animate-fade-in">
        {/* 로고 */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-2xl">🤖</span>
          <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">AI이것만</span>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-3">
          내게 맞는 AI 모델, <span className="text-[#5B5FEF] dark:text-[#8B8FFF]">한눈에 찾기</span>
        </h1>

        {/* 부제 */}
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          예산, 활용도, 성능을 비교해<br className="sm:hidden" /> 당신에게 딱 맞는 AI를 추천합니다
        </p>

        {/* 검색바 */}
        <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="어떤 용도로 쓰시나요? 예: 블로그 글쓰기"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30 focus:border-[#5B5FEF] transition-all shadow-sm"
          />
        </form>

        {/* 빠른 링크 */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <Link to="/explore/guide" className="hover:text-[#5B5FEF] transition-colors">✨ 추천받기</Link>
          <span>·</span>
          <Link to="/pricing" className="hover:text-[#5B5FEF] transition-colors">💰 가격비교</Link>
          <span>·</span>
          <Link to="/explore/compare" className="hover:text-[#5B5FEF] transition-colors">📊 전체 모델</Link>
        </div>
      </section>

      {/* ═══ 2. HIGHLIGHTS — 3카드 ═══ */}
      <section className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 경제성 카드 */}
          <Link to="/pricing" className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-xl hover:border-[#5B5FEF]/30 dark:hover:border-[#5B5FEF]/50 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">경제성</h3>
                <p className="text-[11px] text-gray-400">가장 저렴한 AI 모델</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {economyTop3.map((m) => {
                const isFree = m.inputPrice === 0 && m.outputPrice === 0;
                return (
                  <div key={m.id} className="flex items-center gap-2.5">
                    <CompanyLogo company={m.company} size={20} />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{m.name}</span>
                    <span className={`ml-auto text-[11px] font-bold ${isFree ? 'text-emerald-500' : 'text-gray-500'}`}>
                      {isFree ? '무료' : `$${(m.inputPrice! + m.outputPrice!).toFixed(2)}`}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-end mt-4 text-[11px] text-gray-400 group-hover:text-[#5B5FEF] transition-colors">
              자세히 보기 <ArrowRight className="w-3 h-3 ml-0.5" />
            </div>
          </Link>

          {/* 활용도 카드 */}
          <Link to="/recommend" className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-xl hover:border-[#5B5FEF]/30 dark:hover:border-[#5B5FEF]/50 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                <Wrench className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">활용도</h3>
                <p className="text-[11px] text-gray-400">용�도별 최적 모델</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {utilityTop3.map((s) => {
                const avg = Math.round(Object.values(s.scores).reduce((sum, v) => sum + v, 0) / 6 * 10) / 10;
                return (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <CompanyLogo company={s.companyId} size={20} />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{s.name}</span>
                    <span className="ml-auto text-[11px] font-bold text-gray-500">{avg}/10</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-end mt-4 text-[11px] text-gray-400 group-hover:text-[#5B5FEF] transition-colors">
              자세히 보기 <ArrowRight className="w-3 h-3 ml-0.5" />
            </div>
          </Link>

          {/* 성능 카드 */}
          <Link to="/explore" className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-xl hover:border-[#5B5FEF]/30 dark:hover:border-[#5B5FEF]/50 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                <Trophy className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">성능</h3>
                <p className="text-[11px] text-gray-400">벤치마크 순위</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {performanceTop3.map((s) => {
                const avg = Math.round(((s.scores.coding + s.scores.writing) / 2) * 10) / 10;
                return (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <CompanyLogo company={s.companyId} size={20} />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{s.name}</span>
                    <span className="ml-auto text-[11px] font-bold text-gray-500">{avg}/10</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-end mt-4 text-[11px] text-gray-400 group-hover:text-[#5B5FEF] transition-colors">
              자세히 보기 <ArrowRight className="w-3 h-3 ml-0.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* ═══ 3. 가성비 산점도 ═══ */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">💰 가격 vs 성능 — 가성비 한눈에</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">좌상단 = 가성비 최고 · 우하단 = 비싸고 약함 · 점수는 종합 평가 (코딩+글쓰기+요약 등)</p>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[480px] h-[320px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis
                  type="number"
                  dataKey="price"
                  name="가격"
                  unit="$/M"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  label={{ value: '가격 (입력+출력 $/1M토큰)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#9CA3AF' }}
                />
                <YAxis
                  type="number"
                  dataKey="score"
                  name="점수"
                  domain={[0, 10]}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  label={{ value: '종합 점수', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#9CA3AF' }}
                />
                <Tooltip content={<ScatterTooltipContent />} />
                <Scatter data={scatterData} name="모델">
                  {scatterData.map((entry, index) => (
                    <Cell key={index} fill={getScatterColor(entry.score, entry.price)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block" /> 가성비 최고</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#5B5FEF] inline-block" /> 보통</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block" /> 비싼 편</span>
        </div>
      </section>

      {/* ═══ 4. 이번주 인기 모델 — 바 차트 ═══ */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">🔥 이번주 인기 모델</h2>
          <Link to="/explore/ranking" className="text-xs text-gray-400 hover:text-[#5B5FEF] dark:hover:text-[#8B8FFF] transition-colors flex items-center gap-1">
            전체 랭킹 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs text-gray-400 mb-5">OpenRouter 실제 사용량 기준 · 매주 업데이트</p>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[400px] h-[340px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={barData}
                margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={(v: number) => `${v}T`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={120}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}T 토큰`, '주간 사용량']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="tokens" radius={[0, 6, 6, 0]} barSize={24}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ═══ 5. 뉴스 ═══ */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">📰 최근 AI 뉴스</h2>
          <Link to="/news" className="text-xs text-gray-400 hover:text-[#5B5FEF] dark:hover:text-[#8B8FFF] transition-colors flex items-center gap-1">
            전체 보기 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <ul className="space-y-1">
          {topNews.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
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
        className="rounded-2xl p-6 md:p-8 text-center text-white animate-fade-in relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5B5FEF 0%, #7C6AEF 50%, #9B8AEF 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10">
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

      {/* ═══ 데이터 기준일 ═══ */}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
        데이터 기준일: 2026년 4월 16일 · 모델 정보는 정기적으로 업데이트됩니다
      </p>
    </div>
  );
}
