import { useState, useEffect } from "react";
import { cloudProviders } from '../data/cloudProviders';

// Fallback hardcoded prices (used when API fails)
const FALLBACK_PRICES = [
  { model: 'GPT-5', provider: 'OpenAI', input: 1.25, output: 10.0, context: '128K', note: '최고 성능' },
  { model: 'GPT-5 Mini', provider: 'OpenAI', input: 0.25, output: 2.0, context: '128K', note: '가성비' },
  { model: 'GPT-5 Nano', provider: 'OpenAI', input: 0.05, output: 0.20, context: '128K', note: '최저가' },
  { model: 'Claude Opus 4.6', provider: 'Anthropic', input: 5.0, output: 25.0, context: '200K', note: '긴 문맥' },
  { model: 'Claude Sonnet 4.6', provider: 'Anthropic', input: 3.0, output: 15.0, context: '200K', note: '균형' },
  { model: 'Claude Haiku 4.5', provider: 'Anthropic', input: 1.0, output: 5.0, context: '200K', note: '빠름' },
  { model: 'Gemini 3.1 Pro', provider: 'Google', input: 2.0, output: 12.0, context: '1M', note: '멀티모달' },
  { model: 'Gemini 2.5 Flash', provider: 'Google', input: 0.15, output: 0.60, context: '1M', note: '최저가' },
  { model: 'Grok 3', provider: 'xAI', input: 3.0, output: 15.0, context: '128K', note: 'NEW' },
  { model: 'o3', provider: 'OpenAI', input: 2.0, output: 8.0, context: '200K', note: '추론' },
  { model: 'MiniMax M2.7', provider: 'MiniMax', input: 0.8, output: 2.4, context: '128K', note: 'NEW' },
  { model: 'DeepSeek V3.2', provider: 'DeepSeek', input: 0.27, output: 1.10, context: '128K', note: '가성비' },
  { model: 'DeepSeek R1', provider: 'DeepSeek', input: 0.55, output: 2.19, context: '128K', note: '추론' },
  { model: 'Mistral Large 3', provider: 'Mistral', input: 2.0, output: 6.0, context: '128K', note: '유럽' },
  { model: 'Mistral Small 3.1', provider: 'Mistral', input: 0.20, output: 0.60, context: '128K', note: '경량' },
  { model: 'Llama 3.3 70B', provider: 'Meta', input: 0.88, output: 0.88, context: '128K', note: '오픈소스' },
  { model: 'Qwen3 235B', provider: 'Alibaba', input: 0.40, output: 1.20, context: '128K', note: '중국 오픈소스' },
  { model: 'MiMo V2 Pro', provider: 'Xiaomi', input: 0.50, output: 1.50, context: '1M', note: '초장문맥' },
];

interface PriceRow {
  model: string;
  provider: string;
  input: number;
  output: number;
  context: string;
  note?: string;
}

const NOTE_STYLE: Record<string, string> = {
  '최고 성능': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  '긴 문맥':   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  '멀티모달':  'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
  '가성비':    'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  '최저가':    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  'NEW':       'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  '균형':      'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
  '빠름':      'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
  '추론':      'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  '오픈소스':  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  '유럽':      'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  '경량':      'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  '중국 오픈소스': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  '초장문맥':  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
};

const TIER_NOTES: Record<string, string> = {
  flagship: '최고 성능',
  strong: '균형',
  efficient: '가성비',
  local: '오픈소스',
};

export default function Pricing() {
  const [tab, setTab] = useState<'bar' | 'table' | 'api'>('bar');
  const [prices, setPrices] = useState<PriceRow[]>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch live prices from /api/models
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch('/api/models');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();

        if (data?.priceTable?.length > 0) {
          const mapped: PriceRow[] = data.priceTable.map((row: any) => ({
            model: row.model,
            provider: row.provider,
            input: row.input,
            output: row.output,
            context: row.context,
            note: TIER_NOTES[row.tier] ?? row.tier,
          }));
          setPrices(mapped);
          setLastUpdated(data.updatedAtKST ?? '');
        }
      } catch {
        // Keep fallback
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();

    // Refresh every 30 min
    const interval = setInterval(fetchPrices, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const maxInput = Math.max(...prices.map(p => p.input));
  const sorted = [...prices].sort((a, b) => a.input - b.input);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">💰 AI API 가격 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          OpenRouter 실시간 가격 기준{lastUpdated && ` · ${lastUpdated} 업데이트`}. 1M 토큰 ≈ 약 75만 글자.
        </p>
        {loading && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">OpenRouter 가격 불러오는 중...</span>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {([['bar','입력가 시각화'],['table','전체 가격표'],['api','API 서비스 비교']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === key
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      {tab === 'bar' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5">입력 토큰 가격 (1M당 USD)</h2>
          <div className="space-y-3">
            {sorted.map((row) => (
              <div key={row.model} className="flex items-center gap-3">
                <div className="w-36 text-sm text-gray-700 dark:text-gray-300 truncate shrink-0 font-medium">{row.model}</div>
                <div className="flex-1 relative h-7 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max((row.input / maxInput) * 100, 3)}%`,
                      backgroundColor: row.input < 0.5 ? '#22c55e' : row.input < 1.5 ? '#3b82f6' : row.input < 3 ? '#f59e0b' : '#ef4444'
                    }} />
                </div>
                <div className="w-14 text-right text-sm font-bold text-gray-900 dark:text-white shrink-0 font-mono">${row.input}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex-wrap">
            {[['#22c55e','$0.5 미만'],['#3b82f6','$0.5~1.5'],['#f59e0b','$1.5~3'],['#ef4444','$3 이상']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full price table */}
      {tab === 'table' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">모델</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">회사</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">입력</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">출력</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">컨텍스트</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">특징</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {prices.map((row) => (
                  <tr key={row.model} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.model}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.provider}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">${row.input}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">${row.output}</td>
                    <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{row.context}</td>
                    <td className="px-4 py-3 text-center">
                      {row.note && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${NOTE_STYLE[row.note] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                          {row.note}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-400 dark:text-gray-500">* 가격은 OpenRouter 실시간 API 기준. 캐시·배치 할인 적용 시 더 저렴할 수 있어요.</p>
          </div>
        </div>
      )}

      {/* API service comparison */}
      {tab === 'api' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {cloudProviders.map((provider) => (
            <div key={provider.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{provider.name}</h3>
                {provider.badge && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[11px] rounded-full font-semibold">{provider.badge}</span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{provider.description}</p>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 mb-3">
                🎁 {provider.freetier}
              </div>
              <div className="space-y-1.5">
                {provider.pros.map((p) => (
                  <div key={p} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{p}
                  </div>
                ))}
                {provider.cons.map((c) => (
                  <div key={c} className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span>{c}
                  </div>
                ))}
              </div>
              <p className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-blue-600 dark:text-blue-400 font-medium">
                추천 대상: {provider.bestFor}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
