import { cloudProviders } from '../data/cloudProviders';

export default function DevProviders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">☁️ 클라우드 제공사</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI API를 제공하는 클라우드 서비스 비교</p>
      </div>

      <div className="space-y-4">
        {cloudProviders.map(p => (
          <div key={p.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-gray-900 dark:text-white">{p.name}</h3>
                {p.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.badge === '추천' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' :
                    p.badge === '가성비' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' :
                    'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                  }`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <a href={p.url} target="_blank" rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-100 shrink-0">
                방문 →
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{p.description}</p>

            {/* Free Tier */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 mb-3">
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                <span className="font-bold">🎁 무료:</span> {p.freetier}
              </p>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">장점</p>
                <ul className="space-y-1">
                  {p.pros.map(pro => (
                    <li key={pro} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <span className="text-emerald-500 shrink-0">✓</span>{pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1.5">단점</p>
                <ul className="space-y-1">
                  {p.cons.map(con => (
                    <li key={con} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <span className="text-red-500 shrink-0">✗</span>{con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-bold">🎯 추천:</span> {p.bestFor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
