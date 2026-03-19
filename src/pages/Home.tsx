import { Link } from 'react-router-dom';
import { CURATED_NEWS } from '../hooks/useNewsRSS';

const TOP_NEWS = CURATED_NEWS.filter((n) => n.isNew).slice(0, 3);

const featuredCards = [
  { icon: '🤖', title: 'AI 모델 가이드',  desc: 'GPT-4.1부터 DeepSeek까지. 국가별·가격별 완벽 비교.',  to: '/models',  darkBg: 'dark:bg-blue-950/40',   lightBg: 'bg-blue-50',   border: 'border-blue-100 dark:border-blue-900 hover:border-blue-400 dark:hover:border-blue-600' },
  { icon: '📰', title: 'AI 뉴스룸',       desc: 'HuggingFace·AI타임스·GeekNews AI 기술 소식만 큐레이션.',  to: '/news',    darkBg: 'dark:bg-indigo-950/40', lightBg: 'bg-indigo-50',  border: 'border-indigo-100 dark:border-indigo-900 hover:border-indigo-400 dark:hover:border-indigo-600' },
  { icon: '💰', title: '클라우드 가격 비교', desc: '1M 토큰이 얼마인지, 내 작업에 실제로 얼마 드는지 계산.', to: '/pricing', darkBg: 'dark:bg-amber-950/40',  lightBg: 'bg-amber-50',   border: 'border-amber-100 dark:border-amber-900 hover:border-amber-400 dark:hover:border-amber-600' },
  { icon: '🔥', title: '이번 주 트렌딩',   desc: 'GitHub·OpenRouter 인기 AI 프로젝트와 실시간 모델 가격.', to: '/trending', darkBg: 'dark:bg-rose-950/40',   lightBg: 'bg-rose-50',    border: 'border-rose-100 dark:border-rose-900 hover:border-rose-400 dark:hover:border-rose-600' },
];

const quickFaq = [
  { q: '처음에 어떤 AI를 써야 하나요?',       a: '무료로 시작하려면 ChatGPT 무료 티어 또는 Claude 무료 티어를 추천해요. 개발자라면 Groq 무료 API로 Llama 4를 써보세요.' },
  { q: '로컬 AI가 클라우드보다 좋은 건가요?', a: '꼭 그렇지 않아요. 로컬은 무료·프라이버시 강점이 있지만 고사양 GPU가 필요해요. M 칩 맥북이나 고사양 PC가 없으면 클라우드를 추천해요.' },
  { q: '가장 저렴한 API는 어디인가요?',       a: 'DeepSeek V3 ($0.014/1M)와 Gemini 2.0 Flash($0.1/1M)가 최저가예요. 가격 계산기 탭에서 작업별 실제 비용을 확인해보세요.' },
];

const catBadgeColor: Record<string, string> = {
  '모델 출시': 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  '연구·논문': 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
  '에이전트':  'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
  '오픈소스':  'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
  '파인튜닝':  'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-500',
  '벤치마크':  'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
  '산업·정책': 'bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400',
  '인프라·하드웨어': 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  '개발 도구': 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400',
  '멀티모달':  'bg-pink-100 dark:bg-pink-900/40 text-pink-500 dark:text-pink-400',
};

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  if (diff < 7) return `${diff}일 전`;
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export default function Home() {
  return (
    <div className="space-y-10">

      {/* ── 히어로 섹션 ── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 p-6 md:p-8">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 80%, white 1px, transparent 1px)", backgroundSize:"60px 60px"}} />

        <div className="relative z-10">
          {/* 라이브 뱃지 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium mb-4 border border-white/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            2026.03.19 오전 07:00 업데이트
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* 헤드라인 */}
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
                AI이것만<br />
                <span className="text-blue-200">보면 다 알 수 있어요</span>
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-4">
                어떤 모델이 좋은지, 얼마나 드는지, 어디서 써야 하는지.<br />
                AI 입문자를 위한 모든 정보를 한곳에 모았어요.
              </p>

              {/* 오늘의 AI 한줄요약 */}
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-4">
                <p className="text-xs text-blue-200 font-medium mb-1">🎯 오늘의 AI 한줄요약</p>
                <p className="text-white text-sm font-semibold">엣지 GPU에서 BitNet LoRA 파인튜닝 가능해졌다 — 대형 GPU 없이도 로컬 AI 시대 본격화</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to="/guide" className="px-4 py-2 bg-white text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
                  시작 가이드 →
                </Link>
                <Link to="/models" className="px-4 py-2 bg-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors border border-white/30">
                  모델 비교
                </Link>
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: "8개", label: "이번 주\n신규 모델", icon: "🤖" },
                { n: "13건", label: "이번 주\n주요 논문", icon: "📄" },
                { n: "2건", label: "이번 주\n가격 변동", icon: "💰" },
              ].map((s) => (
                <div key={s.n} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-lg font-black text-white">{s.n}</div>
                  <div className="text-[10px] text-blue-200 whitespace-pre-line leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 오늘의 TOP 뉴스 3 ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            🔴 <span>오늘의 AI 뉴스</span>
          </h2>
          <Link to="/news" className="text-sm text-blue-500 hover:text-blue-700 font-medium">
            전체 보기 →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {TOP_NEWS.map((n, i) => (
            <a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                {i === 0 && <span className="text-xs font-black text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">HOT</span>}
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${catBadgeColor[n.category] ?? 'bg-gray-100 text-gray-500'}`}>
                  {n.category}
                </span>
                <span className="text-[10px] text-gray-400 ml-auto">{timeAgo(n.date)}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {n.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {n.summary}
              </p>
              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{n.source}</span>
                <span className="text-[10px] text-blue-400">읽기 →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── 둘러보기 카드 ── */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">둘러보기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`block p-6 rounded-xl border-2 transition-all ${card.lightBg} ${card.darkBg} ${card.border}`}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{card.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">자주 묻는 질문</h2>
        <div className="space-y-3">
          {quickFaq.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="font-semibold text-gray-900 dark:text-white mb-1.5 text-sm">Q. {faq.q}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
