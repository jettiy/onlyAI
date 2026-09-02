import { useState } from 'react';
import { models } from '../data/models';

const CATEGORIES = [
  { id: 'coding', label: '코딩', icon: '💻', matchFn: (m: typeof models[0]) => m.useCases.some(u => u.includes('코딩') || u.includes('코드') || u.includes('개발')) },
  { id: 'writing', label: '글쓰기', icon: '✍️', matchFn: (m: typeof models[0]) => m.useCases.some(u => u.includes('글쓰기') || u.includes('문서') || u.includes('작성')) },
  { id: 'analysis', label: '분석·연구', icon: '📊', matchFn: (m: typeof models[0]) => m.useCases.some(u => u.includes('분석') || u.includes('연구') || u.includes('추론')) },
  { id: 'chatbot', label: '챗봇', icon: '💬', matchFn: (m: typeof models[0]) => m.useCases.some(u => u.includes('챗봇') || u.includes('응답')) },
  { id: 'cheap', label: '저렴한', icon: '💰', matchFn: (m: typeof models[0]) => (m.inputPrice ?? 0) > 0 && (m.inputPrice ?? 999) <= 0.5 },
  { id: 'korean', label: '한국어 최고', icon: '🇰🇷', matchFn: (m: typeof models[0]) => m.koreanSupport === 'A' },
];

export default function ModelRecommend() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);

  const currentCat = CATEGORIES.find(c => c.id === activeCat)!;
  const recommended = models
    .filter(currentCat.matchFn)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">🎯 용도별 AI 모델 추천</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">용도에 맞는 최적의 AI 모델을 추천해드려요</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCat === cat.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommended.map((m, idx) => (
          <div key={m.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-all relative overflow-hidden">
            {idx === 0 && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-bl-xl">
                🥇 추천 1위
              </div>
            )}
            {idx === 1 && (
              <div className="absolute top-0 right-0 bg-gray-300 text-gray-700 text-[10px] font-black px-3 py-1 rounded-bl-xl">
                🥈 2위
              </div>
            )}
            {idx === 2 && (
              <div className="absolute top-0 right-0 bg-amber-200 text-amber-800 text-[10px] font-black px-3 py-1 rounded-bl-xl">
                🥉 3위
              </div>
            )}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">{m.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{m.company} · {m.contextWindow}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{m.description}</p>
              </div>
              <div className="text-right shrink-0">
                {m.inputPrice !== null ? (
                  <>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">${m.inputPrice}</p>
                    <p className="text-[10px] text-gray-400">/ 1M 입력 토큰</p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-emerald-600">무료</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {m.strengths.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-medium">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {recommended.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-400">해당 카테고리에 추천할 모델이 없어요</p>
        </div>
      )}
    </div>
  );
}
