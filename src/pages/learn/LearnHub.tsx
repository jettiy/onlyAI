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

export default function LearnHub() {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">🧠 AI 정보 학습하기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
          AI를 쓰다 보면 모르는 용어들이 나와요. 여기서 개념을 잡고,
          멀티에이전트 구조를 직접 체험해보세요.
        </p>
      </div>

      {/* 용어 미리보기 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">오늘의 용어 미리보기</p>
          <Link to="/learn/glossary" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">전체 보기 →</Link>
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

      {/* 메인 카드 */}
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
