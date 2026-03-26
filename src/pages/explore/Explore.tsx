import { Link } from 'react-router-dom';

const STATS = [
  { value: '300+', label: '비교 모델 수' },
  { value: '8개', label: 'API 서비스' },
  { value: '무료', label: '추천 AI 있음' },
];

const ITEMS = [
  {
    path: '/explore/timeline', icon: '🗓️', label: '타임라인',
    desc: 'GPT-2부터 Gemini 3까지. AI 모델 출시 역사를 연대순으로 정리했어요.',
    badge: '전체 흐름 보기',
    bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
    text: 'text-blue-700 dark:text-blue-300',
  },
  {
    path: '/explore/compare', icon: '⚖️', label: '한눈에 비교',
    desc: '입력 토큰 가격·벤치마크·컨텍스트 길이를 모델별로 직접 비교해요.',
    badge: '가격 + 성능',
    bg: 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900',
    text: 'text-violet-700 dark:text-violet-300',
  },
  {
    path: '/explore/promo', icon: '🎁', label: '프로모션 현황',
    desc: '즈푸AI·MiniMax·Google 등 주요 서비스의 레퍼럴·초대 혜택을 정리했어요.',
    badge: '혜택 모아보기',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    path: '/explore/guide', icon: '🎯', label: '시작 가이드',
    desc: '4문항으로 내 용도에 딱 맞는 AI 모델을 추천받고, 시작하는 방법을 알아봐요.',
    badge: 'AI 추천 받기',
    bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900',
    text: 'text-amber-700 dark:text-amber-300',
  },
];

export default function Explore() {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">🔭 AI 모델 탐색하기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
          AI 모델의 역사부터 가격·성능 비교, 레퍼럴 혜택, 추천까지.<br />
          탐색을 시작해보세요.
        </p>
      </div>

      {/* 통계 스트립 */}
      <div className="flex gap-6">
        {STATS.map(s => (
          <div key={s.label}>
            <p className="text-xl font-black text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 카드 그리드 */}
      <div className="grid sm:grid-cols-2 gap-4">
        {ITEMS.map(item => (
          <Link key={item.path} to={item.path}
            className={`group block rounded-2xl border p-5 hover:shadow-md transition-all ${item.bg}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-3xl">{item.icon}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-white/60 dark:bg-black/20 ${item.text}`}>
                {item.badge}
              </span>
            </div>
            <h2 className={`text-base font-bold mb-1 group-hover:underline ${item.text}`}>{item.label}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* 추천 경로 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">처음이라면 이 순서로</p>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { step: '01', label: '시작 가이드', to: '/explore/guide' },
            { step: '02', label: '타임라인', to: '/explore/timeline' },
            { step: '03', label: '한눈에 비교', to: '/explore/compare' },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-2">
              <Link to={s.to}
                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span className="text-[10px] font-mono text-gray-400">{s.step}</span>
                {s.label}
              </Link>
              {i < 2 && <span className="text-gray-300 dark:text-gray-600">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
