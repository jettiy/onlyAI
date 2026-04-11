import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNewsRSS } from '../hooks/useNewsRSS';
import { models, type AIModel } from '../data/models';
import { useCaseLabels, budgetLabels, type UseCase, type BudgetTier } from '../data/modelStrengths';
import { CompanyLogo } from '../components/CompanyLogo';

/* ── 상수 ── */
const TOP_MODEL_IDS = ['gpt-5-4', 'claude-sonnet-4-6', 'gemini-2-5-flash'];
const TOP_MODELS: AIModel[] = TOP_MODEL_IDS.map(id => models.find(m => m.id === id)).filter(Boolean) as AIModel[];

const QUICK_LINKS = [
  { icon: '⚖️', label: 'AI 비교하기', desc: '모델 가격·성능 비교', to: '/explore/compare', color: 'from-blue-500 to-blue-600' },
  { icon: '🖥️', label: 'PC 체크', desc: '내 PC에서 AI 구동 가능?', to: '/pc-check', color: 'from-emerald-500 to-teal-500' },
  { icon: '🎯', label: 'AI 추천', desc: '용도별 맞춤 추천', to: '/recommend', color: 'from-violet-500 to-purple-500' },
  { icon: '📰', label: '뉴스', desc: '오늘의 AI 소식', to: '/news', color: 'from-amber-500 to-orange-500' },
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
  '연구·논문': 'text-blue-500',
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
  const topNews = allNews.length > 0
    ? allNews.slice(0, 5)
    : DUMMY_NEWS.map((n, i) => ({ id: `d${i}`, title: n.title, category: n.cat, date: new Date().toISOString(), source: '더미', summary: '', url: '#', tags: [] }));

  // 하단 Pricing: 상위 5개 (입력가격 기준 정렬, null 제외)
  const topPriced = [...models]
    .filter(m => m.inputPrice != null && m.outputPrice != null)
    .sort((a, b) => (a.inputPrice! + a.outputPrice!) - (b.inputPrice! + b.outputPrice!))
    .slice(0, 5);

  return (
    <div className="space-y-8">

      {/* ═══ 1. HERO ═══ */}
      <section className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 md:p-8 text-white relative">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-2xl">
          <p className="text-[11px] tracking-[0.25em] font-bold text-gray-400 uppercase mb-2">onlyAI</p>
          <h1 className="text-2xl md:text-3xl font-black leading-tight mb-2">
            AI 모델 <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">한눈에 비교</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            가격, 성능, 용도까지 — 40+ AI 모델의 정보를 한 곳에서 확인하세요. 비교·추천·뉴스까지 모두 제공합니다.
          </p>
        </div>
      </section>

      {/* ═══ 2. TOP 3 모델 카드 ═══ */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">🏆 인기 모델 TOP 3</h2>
          <Link to="/explore/compare" className="text-xs text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            전체 비교 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TOP_MODELS.map((model, idx) => (
            <Link
              key={model.id}
              to={`/explore/compare?models=${model.id}`}
              className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <CompanyLogo company={model.company} size={28} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{model.name}</p>
                    <p className="text-[11px] text-gray-400">{model.company}</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-gray-200 dark:text-gray-700">#{idx + 1}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                {model.inputPrice != null && model.outputPrice != null ? (
                  <>
                    <span className="text-lg font-black text-gray-900 dark:text-white">
                      ${model.inputPrice}
                    </span>
                    <span className="text-[11px] text-gray-400">/ ${model.outputPrice} per 1M tok</span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">무료</span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {model.strengths?.[0] ?? model.description.slice(0, 40)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 3. 오늘의 AI 뉴스 ═══ */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">📰 오늘의 AI 뉴스</h2>
          <Link to="/news" className="text-xs text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            전체 보기 →
          </Link>
        </div>
        <ul className="space-y-2">
          {topNews.map((item, i) => (
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
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
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

      {/* ═══ 4. 빠른 시작 가이드 ═══ */}
      <section>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">⚡ 빠른 시작</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-lg transition-all text-center"
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-lg`}>
                {link.icon}
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{link.label}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 5. 하단 Pricing 요약 (상위 5개) ═══ */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">💰 가격 한눈에 보기</h2>
          <Link to="/pricing" className="text-xs text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            전체 가격표 →
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
              {topPriced.map(m => (
                <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <CompanyLogo company={m.company} size={18} />
                      <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">{m.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-2 px-2 font-mono text-xs text-gray-600 dark:text-gray-300">
                    ${m.inputPrice?.toFixed(2)}
                  </td>
                  <td className="text-right py-2 px-2 font-mono text-xs text-gray-600 dark:text-gray-300">
                    ${m.outputPrice?.toFixed(2)}
                  </td>
                  <td className="text-right py-2 pl-2 text-xs text-gray-500 dark:text-gray-400">
                    {m.contextWindow}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">USD per 1M tokens · 입력가격 기준 정렬</p>
      </section>

      {/* ═══ 미니 추천 퀴즈 ═══ */}
      <MiniRecommend navigate={navigate} />
    </div>
  );
}

/* ── 미니 추천 퀴즈 위젯 ── */
function MiniRecommend({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [useCase, setUseCase] = useState<UseCase | ''>('');
  const [budget, setBudget] = useState<BudgetTier | ''>('');

  const go = () => {
    const params = new URLSearchParams();
    if (useCase) params.set('useCase', useCase);
    if (budget) params.set('budget', budget);
    navigate(`/recommend${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">🎯 나에게 맞는 AI 찾기</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">2가지만 선택하면 추천해드려요</p>

      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">용도</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {QUIZ_USES.map(u => (
          <button key={u.key} onClick={() => setUseCase(useCase === u.key ? '' : u.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              useCase === u.key
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
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
                ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            <span>{b.icon}</span>{b.label}
          </button>
        ))}
      </div>

      <button onClick={go}
        className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/20 transition-all">
        ✨ AI 추천 결과 보기
      </button>
    </section>
  );
}
