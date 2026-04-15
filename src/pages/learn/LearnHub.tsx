import { Link } from 'react-router-dom';

const ITEMS = [
  {
    path: '/learn/glossary', icon: '📖', label: '용어사전',
    desc: 'LLM·RAG·MoE·파인튜닝·임베딩. AI 핵심 용어 30개 이상을 쉽게 풀어서 정리했어요.',
    count: '30+ 용어',
  },
  {
    path: '/learn/simulator', icon: '🤝', label: '협업 시뮬레이터',
    desc: '여러 AI가 역할을 나눠 협력하는 멀티에이전트 구조를 직접 체험해볼 수 있어요.',
    count: '인터랙티브',
  },
];

const QUICK_TERMS = [
  { term: 'LLM', def: '대형 언어 모델' },
  { term: 'RAG', def: '검색 증강 생성' },
  { term: 'MoE', def: '전문가 혼합 구조' },
  { term: '파인튜닝', def: '모델 추가 학습' },
  { term: '컨텍스트 윈도우', def: '한 번에 처리하는 텍스트 최대 길이' },
  { term: '임베딩', def: '텍스트를 숫자 벡터로 변환' },
];

const TOPICS = [
  {
    icon: '🔍', label: '모델 선택 가이드',
    desc: '용도별 맞는 AI 모델 고르기 — 코딩, 글쓰기, 이미지, 요약에 최적화된 모델 추천',
    tags: ['실전 팁', '초심자'],
    color: 'text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-900',
    link: '/explore/compare',
  },
  {
    icon: '🧮', label: '토큰과 가격 이해하기',
    desc: '토큰이 뭔가요? 왜 길이마다 가격이 다른가요? 입력·출력 토큰 계산법과 실제 비용 예시',
    tags: ['비용 절감', '기본기'],
    color: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    link: '/explore/calculator',
  },
  {
    icon: '📡', label: 'API로 AI 쓰는 법',
    desc: 'OpenAI·Anthropic·Google·Zhipu API 키 발급부터 첫 요청까지. 코드 예시 포함',
    tags: ['개발자', 'API'],
    color: 'text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900',
    link: '/explore/side-by-side',
  },
  {
    icon: '📰', label: 'AI 뉴스 채널 추천',
    desc: '한국어·영어로 AI 동향을 파악하는 데 도움이 되는 뉴스 소스·커뮤니티·뉴스레터 모음',
    tags: ['정보 수집', '추천'],
    color: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    link: '/news',
  },
  {
    icon: '🧪', label: '벤치마크 읽는 법',
    desc: 'MMLU·HumanEval·GPQA 등 벤치마크 점수의 의미와 한계. 점수만 보면 안 되는 이유',
    tags: ['평가 지표', '핵심'],
    color: 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    link: '/explore/ranking',
  },
  {
    icon: '🖼️', label: '이미지·비디오 AI 가이드',
    desc: 'DALL·E·Midjourney·Kling·Runway 등 생성형 AI 모델 비교와 프롬프트 팁',
    tags: '생성형 AI',
    color: 'text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900',
    link: '/image',
  },
];

const FAQ = [
  { q: 'AI 코딩은 어떤 모델이 좋아요?', a: 'Claude Sonnet, GPT-5.2, GLM-5.1 코딩 모델이 성능이 좋습니다. 복잡한 프로젝트는 Claude Code나 Cursor를 활용하면 효율적이에요.' },
  { q: '무료로 AI를 쓸 수 있나요?', a: 'Google Gemini, Zhipu GLM(일정 한도), DeepSeek, Meta Llama 등 무료/프리티어 API를 제공하는 서비스가 많습니다. 프로모션 탭에서 혜택도 확인해보세요.' },
  { q: '텍스트 길이에 따라 비용이 얼마나 달라져요?', a: '1,000단어(약 1,300토큰) 기준 GPT-4.1은 약 $0.01, Claude Sonnet은 약 $0.006입니다. 토큰 계산기에서 직접 확인해보세요.' },
];

export default function LearnHub() {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">🧠 AI 정보 학습하기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
          AI를 쓰다 보면 모르는 용어들이 나와요. 개념을 잡고,
          모델 선택·비용·API까지 실전 지식을 쌓아보세요.
        </p>
      </div>

      {/* 용어 미리보기 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">오늘의 용어 미리보기</p>
          <Link to="/learn/glossary" className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">전체 보기 →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QUICK_TERMS.map(t => (
            <div key={t.term}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5">
              <p className="text-xs font-black text-gray-900 dark:text-white font-mono">{t.term}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{t.def}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 학습 주제 카드 */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">학습 주제</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOPICS.map(t => (
            <Link key={t.label} to={t.link}
              className={`group bg-white dark:bg-gray-900 rounded-xl border ${t.color} p-4 hover:shadow-md transition-all`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{t.icon}</span>
                <h2 className={`text-sm font-bold ${t.color.split(' ')[0]}`}>{t.label}</h2>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{t.desc}</p>
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(t.tags) ? t.tags : [t.tags]).map(tag => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded font-medium">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">자주 묻는 질문</p>
        <div className="space-y-2">
          {FAQ.map(f => (
            <details key={f.q} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <summary className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="px-4 pb-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-2">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* 메인 카드 (기존) */}
      <div className="space-y-3">
        {ITEMS.map(item => (
          <Link key={item.path} to={item.path}
            className="group flex items-center gap-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all">
            <span className="text-4xl shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.label}</h2>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">{item.count}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
            <span className="shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors text-xl">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}