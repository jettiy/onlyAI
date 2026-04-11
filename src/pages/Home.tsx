import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNewsRSS } from '../hooks/useNewsRSS';
import { models } from '../data/models';
import { useCaseLabels, useCaseIcons, budgetLabels, type UseCase, type BudgetTier } from '../data/modelStrengths';
import { CompanyLogo } from '../components/CompanyLogo';
import ModelDetailModal from '../components/ModelDetailModal';

const CAT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  '모델 출시':       { bg: 'bg-violet-50 dark:bg-violet-950/30',  text: 'text-violet-600 dark:text-violet-400',  bar: 'bg-violet-500' },
  '연구·논문':       { bg: 'bg-blue-50 dark:bg-blue-950/30',       text: 'text-blue-600 dark:text-blue-400',      bar: 'bg-blue-500' },
  '에이전트':        { bg: 'bg-cyan-50 dark:bg-cyan-950/30',        text: 'text-cyan-600 dark:text-cyan-400',      bar: 'bg-cyan-500' },
  '오픈소스':       { bg: 'bg-emerald-50 dark:bg-emerald-950/30',  text: 'text-emerald-600 dark:text-emerald-400',bar: 'bg-emerald-500' },
  '파인튜닝':       { bg: 'bg-amber-50 dark:bg-amber-950/30',      text: 'text-amber-600 dark:text-amber-400',    bar: 'bg-amber-500' },
  '벤치마크':       { bg: 'bg-orange-50 dark:bg-orange-950/30',    text: 'text-orange-600 dark:text-orange-400',  bar: 'bg-orange-500' },
  '인프라·하드웨어': { bg: 'bg-slate-50 dark:bg-slate-900/30',      text: 'text-slate-600 dark:text-slate-400',    bar: 'bg-slate-500' },
  '산업·정책':       { bg: 'bg-red-50 dark:bg-red-950/30',          text: 'text-red-600 dark:text-red-400',        bar: 'bg-red-500' },
  '개발 도구':       { bg: 'bg-sky-50 dark:bg-sky-950/30',          text: 'text-sky-600 dark:text-sky-400',        bar: 'bg-sky-500' },
  '멀티모달':        { bg: 'bg-pink-50 dark:bg-pink-950/30',         text: 'text-pink-600 dark:text-pink-400',      bar: 'bg-pink-500' },
};

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
    icon: '📊',
    label: 'AI 모델 비교',
    desc: '비교·랭킹·가격 계산기',
    to: '/explore/compare',
    color: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
    textColor: 'text-blue-700 dark:text-blue-300',
    wide: true as const,
  },
  {
    icon: '📰',
    label: '뉴스 브리핑',
    desc: 'AI 소식·GitHub 트렌딩',
    to: '/news',
    color: 'from-gray-600 to-gray-700',
    light: 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800',
    textColor: 'text-gray-700 dark:text-gray-300',
    wide: false as const,
  },
  {
    icon: '📋',
    label: '프롬프트 적용하기',
    desc: '작성법·프레임워크·저장소',
    to: '/prompts',
    color: 'from-violet-500 to-violet-600',
    light: 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900',
    textColor: 'text-violet-700 dark:text-violet-300',
    wide: false as const,
  },
  {
    icon: '🎬',
    label: '비디오 AI',
    desc: '타임라인·모델 비교',
    to: '/video',
    color: 'from-pink-500 to-rose-500',
    light: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900',
    textColor: 'text-pink-700 dark:text-pink-300',
    wide: false as const,
  },
  {
    icon: '🦞',
    label: 'OpenClaw 활용하기',
    desc: '설치·스킬·자동화·크론',
    to: '/openclaw',
    color: 'from-orange-500 to-amber-500',
    light: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900',
    textColor: 'text-orange-700 dark:text-orange-300',
    wide: false as const,
  },
  {
    icon: '🧠',
    label: 'AI 정보 학습하기',
    desc: '용어사전·협업 시뮬레이터',
    to: '/learn',
    color: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    wide: false as const,
  },
];

const TOP_MODEL_IDS = ['gpt-5.4', 'claude-sonnet-4.6', 'gemini-2.5-flash'];
const TOP_MODELS = TOP_MODEL_IDS.map(id => models.find(m => m.id === id)).filter(Boolean) as typeof models;

// 랜덤 추천 모델 2개
const featuredModels = models.filter(m => m.isFeatured);
function getRandomPair() {
  const shuffled = [...featuredModels].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

export default function Home() {
  const { news: allNews, lastUpdated } = useNewsRSS();
  const TOP_NEWS = allNews.slice(0, 5);
  const secondary = TOP_NEWS.slice(1, 3);
  const [heroIdx, setHeroIdx] = useState(0);
  const [selectedModel, setSelectedModel] = useState<typeof models[0] | null>(null);
  const hero = TOP_NEWS[heroIdx] ?? TOP_NEWS[0];

  const nextHero = useCallback(() => {
    setHeroIdx(i => (i + 1) % Math.max(TOP_NEWS.length, 1));
  }, [TOP_NEWS.length]);

  useEffect(() => {
    if (TOP_NEWS.length < 2) return;
    const timer = setInterval(nextHero, 3000);
    return () => clearInterval(timer);
  }, [TOP_NEWS.length, nextHero]);
  const navigate = useNavigate();

  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [randomPair] = useState(() => getRandomPair());

  const curDate = lastUpdated
    ? lastUpdated.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '자동 수집';

  const handleCompare = () => {
    if (compareA && compareB) {
      navigate(`/explore/compare?models=${compareA},${compareB}`);
    }
  };

  return (
    <div className="space-y-8">

      {/* ── HERO SECTION ── */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-7 text-white relative">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <p className="text-[11px] tracking-[0.3em] font-bold text-gray-400 uppercase mb-2">AI Intelligence Guide</p>
          <h1 className="text-2xl md:text-3xl font-black leading-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
            나에게 <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">맞는 AI</span>를 찾아보세요
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md">
            4가지 질문만 답하면, 내 용도에 딱 맞는 AI 모델을 추천해드립니다.
          </p>

          {/* ── 미니 추천 퀴즈 위젯 ── */}
          <MiniRecommend navigate={navigate} />
          {selectedModel && <ModelDetailModal model={selectedModel} onClose={() => setSelectedModel(null)} />}

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">인기 AI 모델 TOP 3</p>
              <Link to="/explore/compare" className="text-[11px] text-gray-400 hover:text-gray-200 transition-colors">
                자세히 보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TOP_MODELS.map(model => {
                return (
                  <div
                    key={model.name}
                    onClick={() => setSelectedModel(model)}
                    className="rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] transition-colors p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                        <CompanyLogo company={model.company} size={24} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{model.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{model.strengths?.[0] ?? model.description.slice(0, 30)}</p>
                      </div>
                    </div>
                    <Link to="/explore/compare" className="mt-2 inline-flex text-[11px] text-blue-300 hover:text-blue-200">
                      자세히 보기 →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/recommend"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20">
              📝 전체 퀴즈로 추천받기
            </Link>
            <Link to="/explore/compare"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20">
              ⚖️ 모델 비교하기
            </Link>
          </div>

          {/* ── 오늘의 핫뉴스 (자동 슬라이드) ── */}
          {TOP_NEWS.length > 0 && hero && (
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase">📌 오늘의 핫뉴스</p>
                <div className="flex items-center gap-1.5">
                  {TOP_NEWS.map((_, i) => (
                    <button key={i} onClick={() => setHeroIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === heroIdx ? 'bg-blue-400 w-4' : 'bg-gray-600 hover:bg-gray-500'}`} />
                  ))}
                </div>
              </div>
              <a href={hero.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 transition-opacity duration-300">
                <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded shrink-0 ${CAT_COLORS[hero.category]?.bg ?? 'bg-gray-800'} ${CAT_COLORS[hero.category]?.text ?? 'text-gray-400'}`}>
                  {hero.category}
                </span>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors line-clamp-1">
                  {hero.title}
                </span>
                <span className="text-[10px] text-gray-500 shrink-0">→</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── 6 SECTION CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {SECTIONS.map((s, i) => {
          // 첫 번째 카드 (AI 모델 탐색하기)와 뉴스 브리핑은 첫 줄에
          const isFirstRow = i <= 1;
          return (
            <Link
              key={s.to}
              to={s.to}
              className={`group relative block rounded-xl border p-4 hover:shadow-md transition-all ${s.light} ${
                i === 0 ? 'sm:col-span-2 md:col-span-2' : ''
              }`}
            >
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <p className={`text-sm font-bold mb-0.5 ${s.textColor}`}>{s.label}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{s.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* ── ⚡ 빠른 모델 비교 위젯 ── */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚡</span>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">빠른 모델 비교</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 block">모델 A</label>
            <select
              value={compareA}
              onChange={e => setCompareA(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.company})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 block">모델 B</label>
            <select
              value={compareB}
              onChange={e => setCompareB(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.company})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCompare}
            disabled={!compareA || !compareB}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl text-sm font-bold hover:from-blue-600 hover:to-violet-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⚖️ 비교하기
          </button>
          <Link to="/explore/compare" className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            전체 비교 페이지 →
          </Link>
        </div>
        {randomPair[0] && randomPair[1] && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-2">💡 추천 비교</p>
            <button
              onClick={() => { setCompareA(randomPair[0].id); setCompareB(randomPair[1].id); }}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="font-semibold">{randomPair[0].name}</span>
              <span className="text-gray-300 dark:text-gray-600">vs</span>
              <span className="font-semibold">{randomPair[1].name}</span>
              <span className="text-[10px]">클릭하여 선택 →</span>
            </button>
          </div>
        )}
      </div>

      {/* ── DIVIDER ── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">AI 뉴스 브리핑</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">
            {curDate} 기준 자동 수집
          </span>
        </div>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* ── NEWS EMPTY / LOADING ── */}
      {allNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-3xl mb-2">📡</div>
          <p className="text-sm text-gray-400">뉴스를 불러오는 중이에요...</p>
          <Link to="/news" className="text-xs text-blue-500 hover:underline mt-2 block">전체 뉴스 브리핑 보기 →</Link>
        </div>
      )}

      {/* ── HERO NEWS ── */}
      {hero && (() => {
        const cat = CAT_COLORS[hero.category] ?? CAT_COLORS['연구·논문'];
        return (
          <a href={hero.url} target="_blank" rel="noopener noreferrer" className="group block">
            <div className={`relative overflow-hidden rounded-2xl ${cat.bg} border border-gray-200 dark:border-gray-800 p-4 md:p-6 hover:shadow-xl transition-all duration-300`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${cat.bar} rounded-l-2xl`} />
              <div className="pl-3">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded ${cat.bg} ${cat.text} border border-current border-opacity-20`}>
                    {hero.category}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{timeAgo(hero.date)} · {hero.source}</span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-current transition-colors" style={{ letterSpacing: '-0.02em' }}>
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

/* ── 미니 추천 퀴즈 위젯 (Hero 인라인) ── */
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

function MiniRecommend({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [useCase, setUseCase] = useState<UseCase | ''>('');
  const [budget, setBudget] = useState<BudgetTier | ''>('');

  const go = () => {
    const params = new URLSearchParams();
    if (useCase) params.set('useCase', useCase);
    if (budget) params.set('budget', budget);
    if (useCase && budget) {
      navigate(`/recommend?${params.toString()}`);
    } else {
      navigate('/recommend');
    }
  };

  return (
    <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl border border-white/10 p-4">
      <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase mb-3">🎯 나는 AI를 이렇게 쓰고 싶어요</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {QUIZ_USES.map(u => (
          <button key={u.key} onClick={() => setUseCase(useCase === u.key ? '' : u.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              useCase === u.key
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}>
            <span>{u.icon}</span>{u.label}
          </button>
        ))}
      </div>
      <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase mb-3">💰 예산은 어떻게 되시나요?</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {QUIZ_BUDGETS.map(b => (
          <button key={b.key} onClick={() => setBudget(budget === b.key ? '' : b.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              budget === b.key
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}>
            <span>{b.icon}</span>{b.label}
          </button>
        ))}
      </div>
      <button onClick={go}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/20">
        ✨ AI 추천 결과 보기
      </button>
    </div>
  );
}
