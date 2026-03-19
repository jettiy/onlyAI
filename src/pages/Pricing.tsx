import { cloudProviders } from '../data/cloudProviders';

const priceTable = [
  { model: 'GPT-5', provider: 'OpenAI', input: 5.0, output: 15.0, context: '128K', note: '최고 성능' },
  { model: 'Claude Opus 4.6', provider: 'Anthropic', input: 15.0, output: 75.0, context: '200K', note: '긴 문맥' },
  { model: 'Gemini 3.0 Pro', provider: 'Google', input: 3.5, output: 10.5, context: '1M', note: '멀티모달' },
  { model: 'MiniMax M2.7', provider: 'MiniMax', input: 0.8, output: 2.4, context: '128K', note: 'NEW' },
  { model: 'DeepSeek V3.2', provider: 'DeepSeek', input: 0.27, output: 1.1, context: '128K', note: '가성비' },
  { model: 'Qwen Max', provider: 'Alibaba', input: 0.4, output: 1.2, context: '128K', note: 'NEW' },
  { model: 'Llama 3.3 70B', provider: 'Meta', input: 0.12, output: 0.4, context: '128K', note: '오픈소스' },
  { model: 'Mistral Large 2', provider: 'Mistral', input: 2.0, output: 6.0, context: '128K', note: '유럽' },
];

export default function Pricing() {
  const maxInput = Math.max(...priceTable.map(p => p.input));
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white dark:text-white mb-2">💰 클라우드 가격 비교</h1>
        <p className="text-gray-500">2026년 3월 기준 OpenRouter 표준가. 1M 토큰은 약 75만~100만 글자 분량이에요.</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 dark:text-gray-100 mb-4">입력 토큰 가격 비교 (1M당 USD)</h2>
        <div className="space-y-3">
          {[...priceTable].sort((a, b) => a.input - b.input).map((row) => (
            <div key={row.model} className="flex items-center gap-3">
              <div className="w-36 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 truncate shrink-0">{row.model}</div>
              <div className="flex-1 relative h-7 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(row.input / maxInput) * 100}%`, backgroundColor: row.input < 1 ? '#22c55e' : row.input < 5 ? '#3b82f6' : '#ef4444' }} />
              </div>
              <div className="w-16 text-right text-sm font-bold text-gray-900 dark:text-white dark:text-white shrink-0">${row.input}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800"><h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">전체 가격표</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">모델</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">회사</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">입력</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">출력</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">컨텍스트</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">특징</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {priceTable.map((row) => (
                <tr key={row.model} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.model}</td>
                  <td className="px-4 py-3 text-gray-500">{row.provider}</td>
                  <td className="px-4 py-3 text-right font-mono">${row.input}</td>
                  <td className="px-4 py-3 text-right font-mono">${row.output}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{row.context}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${row.note === '가성비' ? 'bg-green-50 text-green-600' : row.note === 'NEW' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 dark:text-gray-400'}`}>{row.note}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 dark:text-gray-100 mb-4">API 서비스별 비교</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {cloudProviders.map((provider) => (
            <div key={provider.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{provider.name}</h3>
                {provider.badge && <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">{provider.badge}</span>}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400 mb-3">{provider.description}</p>
              <div className="p-2 bg-green-50 rounded-lg text-xs text-green-700 mb-3">무료 혜택: {provider.freetier}</div>
              <div className="space-y-1">
                {provider.pros.map((p) => <div key={p} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><span className="text-green-500">✓</span>{p}</div>)}
                {provider.cons.map((c) => <div key={c} className="flex items-center gap-2 text-xs text-gray-400"><span className="text-red-400">✗</span>{c}</div>)}
              </div>
              <p className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-blue-600 dark:text-blue-400 font-medium">추천 대상: {provider.bestFor}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
