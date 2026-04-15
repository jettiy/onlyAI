import { Link } from 'react-router-dom';

const FEATURED_FRAMEWORKS = ['AIM', 'RISEN', 'CARE', 'COSTAR'];

const ITEMS = [
  {
    path: '/prompts/intro', icon: '💡', label: '프롬프트가 뭔가요?',
    desc: 'AI에게 말 거는 방식이 결과를 바꿔요. 개념부터 좋은 예시·나쁜 예시까지.',
    tag: '입문 필독',
    color: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-900',
  },
  {
    path: '/prompts/how', icon: '✏️', label: '프롬프트 작성법',
    desc: `AIM·RISEN·CARE 등 검증된 프레임워크로 원하는 답변을 이끌어내는 방법.`,
    tag: '핵심 스킬',
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-900',
  },
  {
    path: '/prompts/library', icon: '📚', label: '프롬프트 저장소',
    desc: '코딩·글쓰기·마케팅·AI 활용 등 21개 실전 프롬프트. 복붙해서 바로 써요.',
    tag: '21개 수록',
    color: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-900',
  },
];

export default function PromptsHub() {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">📋 프롬프트 적용하기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
          AI를 제대로 활용하는 첫 번째 기술은 프롬프트예요.<br />
          개념을 이해하고, 작성법을 익히고, 저장소에서 바로 활용해보세요.
        </p>
      </div>

      {/* 프레임워크 프리뷰 */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">수록된 프레임워크</p>
        <div className="flex flex-wrap gap-2">
          {FEATURED_FRAMEWORKS.map(f => (
            <Link key={f} to="/prompts/how"
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-300 rounded-lg text-sm font-bold transition-colors">
              {f}
            </Link>
          ))}
        </div>
      </div>

      {/* 카드 */}
      <div className="space-y-3">
        {ITEMS.map((item, i) => (
          <Link key={item.path} to={item.path}
            className={`group flex items-start gap-4 bg-white dark:bg-gray-900 rounded-2xl border ${item.border} p-5 hover:shadow-md transition-all`}>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center text-2xl bg-gray-50 dark:bg-gray-800 rounded-xl">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className={`text-sm font-bold group-hover:underline ${item.color}`}>{item.label}</h2>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 ${item.color}`}>{item.tag}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
            <span className={`shrink-0 text-lg font-black opacity-30 group-hover:opacity-80 transition-opacity ${item.color}`}>→</span>
          </Link>
        ))}
      </div>

      {/* 팁 배너 */}
      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
        <span className="text-xl shrink-0">💡</span>
        <div>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-0.5">프롬프트는 반복 수정이 핵심이에요</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            첫 답변이 마음에 들지 않아도 괜찮아요. 조건을 추가하거나 예시를 넣어 다시 시도해보세요.
            좋은 프롬프트는 대화처럼 발전해요.
          </p>
        </div>
      </div>
    </div>
  );
}
