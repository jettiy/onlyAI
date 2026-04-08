import { useState, useEffect } from "react";
import { cloudProviders } from '../data/cloudProviders';

const LOGO_MAP: Record<string, string> = {
  openai: "openai.png", anthropic: "anthropic.jpg", google: "google.png",
  meta: "meta.jpg", xai: "xai.png", deepseek: "deepseek.png", minimax: "minimax.png",
  alibaba: "alibaba.png", moonshot: "moonshot.png", zhipu: "zhipu.png",
  xiaomi: "xiaomi.png", mistral: "mistral.jpg",
};

const PROVIDER_LOGO: Record<string, string> = {
  "OpenAI": "openai", "Anthropic": "anthropic", "Google": "google", "Meta": "meta",
  "xAI": "xai", "DeepSeek": "deepseek", "MiniMax": "minimax", "Alibaba": "alibaba",
  "Moonshot": "moonshot", "Zhipu AI": "zhipu", "Xiaomi": "xiaomi", "Mistral": "mistral",
};

interface PriceRow {
  model: string;
  provider: string;
  input: number;
  output: number;
  cacheRead?: number;
  cacheWrite?: number;
  context: string;
  note?: string;
  isNew?: boolean;
}

const FALLBACK_PRICES: PriceRow[] = [
  { model: 'GPT-5.4', provider: 'OpenAI', input: 2.50, output: 15.0, cacheRead: 0.25, cacheWrite: 2.50, context: '1M', note: '최고 성능', isNew: true },
  { model: 'GPT-5.4 mini', provider: 'OpenAI', input: 0.75, output: 4.50, cacheRead: 0.075, cacheWrite: 0.75, context: '128K', note: '가성비', isNew: true },
  { model: 'GPT-5.4 nano', provider: 'OpenAI', input: 0.20, output: 1.25, cacheRead: 0.02, cacheWrite: 0.20, context: '128K', note: '최저가', isNew: true },
  { model: 'Claude Opus 4.6', provider: 'Anthropic', input: 5.0, output: 25.0, cacheRead: 0.50, cacheWrite: 6.25, context: '1M', note: '긴 문맥' },
  { model: 'Claude Sonnet 4.6', provider: 'Anthropic', input: 3.0, output: 15.0, cacheRead: 0.30, cacheWrite: 3.75, context: '1M', note: '균형', isNew: true },
  { model: 'Claude Haiku 4.5', provider: 'Anthropic', input: 1.0, output: 5.0, cacheRead: 0.08, cacheWrite: 1.25, context: '200K', note: '빠름' },
  { model: 'Gemini 3.1 Pro', provider: 'Google', input: 2.0, output: 12.0, cacheRead: 0.625, cacheWrite: 2.50, context: '1M', note: '멀티모달', isNew: true },
  { model: 'Gemini 2.5 Flash', provider: 'Google', input: 0.15, output: 0.60, cacheRead: 0.0375, cacheWrite: 0.15, context: '1M', note: '최저가' },
  { model: 'Grok 4.20', provider: 'xAI', input: 3.0, output: 15.0, context: '2M', note: 'NEW', isNew: true },
  { model: 'o3', provider: 'OpenAI', input: 2.0, output: 8.0, cacheRead: 0.50, cacheWrite: 2.50, context: '200K', note: '추론' },
  { model: 'MiniMax M2.7', provider: 'MiniMax', input: 0.30, output: 1.20, cacheRead: 0.03, cacheWrite: 0.30, context: '204K', note: 'NEW', isNew: true },
  { model: 'DeepSeek V3.2', provider: 'DeepSeek', input: 0.28, output: 0.42, cacheRead: 0.028, context: '128K', note: '가성비', isNew: true },
  { model: 'DeepSeek R1', provider: 'DeepSeek', input: 0.55, output: 2.19, cacheRead: 0.14, context: '128K', note: '추론' },
  { model: 'Mistral Large 3', provider: 'Mistral', input: 2.0, output: 6.0, cacheRead: 0.50, cacheWrite: 2.00, context: '128K', note: '유럽' },
  { model: 'Mistral Small 3.1', provider: 'Mistral', input: 0.20, output: 0.60, cacheRead: 0.02, cacheWrite: 0.12, context: '128K', note: '경량' },
  { model: 'Llama 4 Maverick', provider: 'Meta', input: 0.88, output: 0.88, cacheRead: 0.088, context: '1M', note: '오픈소스', isNew: true },
  { model: 'Qwen3 235B', provider: 'Alibaba', input: 0.40, output: 1.20, cacheRead: 0.04, context: '128K', note: '중국 오픈소스' },
  { model: 'MiMo V2 Pro', provider: 'Xiaomi', input: 0.50, output: 1.50, context: '1M', note: '초장문맥' },
  { model: 'GLM-5', provider: 'Zhipu AI', input: 0.60, output: 2.0, context: '200K', note: '코딩 특화' },
  { model: 'Kimi K2.5', provider: 'Moonshot', input: 0.70, output: 2.10, context: '256K', note: '장문맥' },
];

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
  '코딩 특화': 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  '장문맥':  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
};

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === total || Math.abs(p - current) <= 1);
  const withDots: (number | '...')[] = [];
  for (let i = 0; i < visible.length; i++) {
    if (i > 0 && visible[i] - visible[i - 1] > 1) withDots.push('...');
    withDots.push(visible[i]);
  }
  return (
    <div className="flex items-center justify-center gap-1.5 py-3">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
        이전
      </button>
      {withDots.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-2 text-xs text-gray-400">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)}
            className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors ${
              p === current ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(current + 1)} disabled={current === total}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
        다음
      </button>
    </div>
  );
}

export default function Pricing() {
  const [tab, setTab] = useState<'bar' | 'table' | 'cache' | 'api'>('bar');
  const [prices, setPrices] = useState<PriceRow[]>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [tablePage, setTablePage] = useState(1);
  const ITEMS_PER_PAGE = 8;

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
            cacheRead: row.cacheRead,
            cacheWrite: row.cacheWrite,
            context: row.context,
            note: row.tier,
            isNew: row.isNew,
          }));
          setPrices(mapped);
          setLastUpdated(data.updatedAtKST ?? '');
        }
      } catch { /* keep fallback */ } finally { setLoading(false); }
    }
    fetchPrices();
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
          countless.dev 방식 참고. 입력/출력/캐시 가격 분리{lastUpdated && ` · ${lastUpdated} 업데이트`}.
        </p>
        {loading && <div className="mt-2 flex items-center gap-2"><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /><span className="text-xs text-gray-400">가격 불러오는 중...</span></div>}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([['bar','입력가 시각화'],['table','전체 가격표'],['cache','캐시 가격 비교'],['api','API 서비스 비교']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === key ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      {tab === 'bar' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5">입력 토큰 가격 ($/1M tokens)</h2>
          <div className="space-y-3">
            {sorted.map((row) => {
              const logoId = PROVIDER_LOGO[row.provider] || '';
              const logoSrc = LOGO_MAP[logoId];
              return (
                <div key={row.model} className="flex items-center gap-3">
                  <div className="w-36 flex items-center gap-2 shrink-0">
                    {logoSrc && <img src={`/logos/${logoSrc}`} alt="" className="w-4 h-4 rounded-sm object-contain" onError={e => (e.target as HTMLImageElement).style.display='none'} />}
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{row.model}</span>
                  </div>
                  <div className="flex-1 relative h-7 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max((row.input / maxInput) * 100, 3)}%`,
                        backgroundColor: row.input < 0.5 ? '#22c55e' : row.input < 1.5 ? '#3b82f6' : row.input < 3 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <div className="w-14 text-right text-sm font-bold text-gray-900 dark:text-white shrink-0 font-mono">${row.input}</div>
                </div>
              );
            })}
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

      {/* Full price table — 페이지네이션 적용 */}
      {tab === 'table' && (() => {
        const totalPages = Math.ceil(prices.length / ITEMS_PER_PAGE);
        const paged = prices.slice((tablePage - 1) * ITEMS_PER_PAGE, tablePage * ITEMS_PER_PAGE);
        return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">전체 가격표</h2>
            <p className="text-[10px] text-gray-400">{prices.length}개 모델 중 {(tablePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(tablePage * ITEMS_PER_PAGE, prices.length)}개 표시</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">모델</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">입력</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">출력</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">캐시 읽기</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">캐시 쓰기</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">컨텍스트</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">특징</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paged.map((row) => {
                  const logoId = PROVIDER_LOGO[row.provider] || '';
                  const logoSrc = LOGO_MAP[logoId];
                  return (
                    <tr key={row.model} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {logoSrc && <img src={`/logos/${logoSrc}`} alt="" className="w-5 h-5 rounded-sm object-contain" onError={e => (e.target as HTMLImageElement).style.display='none'} />}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{row.model} {row.isNew && <span className="text-[8px] font-bold text-red-500 ml-1">NEW</span>}</div>
                            <div className="text-[10px] text-gray-400">{row.provider}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-gray-900 dark:text-white">${row.input}</td>
                      <td className="px-3 py-3 text-right font-mono text-gray-900 dark:text-white">${row.output}</td>
                      <td className="px-3 py-3 text-right font-mono text-emerald-600">{row.cacheRead ? `$${row.cacheRead}` : '—'}</td>
                      <td className="px-3 py-3 text-right font-mono text-orange-600">{row.cacheWrite ? `$${row.cacheWrite}` : '—'}</td>
                      <td className="px-3 py-3 text-center text-gray-500 dark:text-gray-400">{row.context}</td>
                      <td className="px-3 py-3 text-center">
                        {row.note && <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${NOTE_STYLE[row.note] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>{row.note}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-400 dark:text-gray-500">* 가격은 $/1M 토큰. 캐시 읽기 = 이전 대화 재사용 시 (최대 90% 할인). 캐시 쓰기 = 첫 프롬프트 저장 비용.</p>
          </div>
          {totalPages > 1 && <Pagination current={tablePage} total={totalPages} onChange={setTablePage} />}
        </div>
        );
      })()}

      {/* Cache price comparison */}
      {tab === 'cache' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">💰 캐시 가격 비교</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">프롬프트 캐싱을 활용하면 입력 가격을 최대 90% 절약할 수 있어요.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left px-3 py-2 font-semibold text-gray-500">모델</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-500">일반 입력</th>
                  <th className="text-right px-3 py-2 font-semibold text-emerald-600">캐시 읽기</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-500">할인율</th>
                  <th className="text-right px-3 py-2 font-semibold text-orange-600">캐시 쓰기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {prices.filter(p => p.cacheRead).sort((a, b) => a.cacheRead! - b.cacheRead!).map(row => (
                  <tr key={row.model}>
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{row.model}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-600">${row.input}</td>
                    <td className="px-3 py-2 text-right font-mono text-emerald-600 font-bold">${row.cacheRead}</td>
                    <td className="px-3 py-2 text-right font-mono text-emerald-600">
                      -{Math.round((1 - row.cacheRead! / row.input) * 100)}%
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-orange-600">${row.cacheWrite || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">💡 캐싱 활용 팁</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">동일한 시스템 프롬프트를 반복 사용할 때 캐시 읽기를 활용하면 비용을 크게 줄일 수 있습니다. Claude는 캐시 읽기가 90% 할인되며, Gemini도 비슷한 수준의 할인을 제공합니다.</p>
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
                {provider.badge && <span className="px-2 py-0.5 bg-blue-600 text-white text-[11px] rounded-full font-semibold">{provider.badge}</span>}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{provider.description}</p>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 mb-3">
                🎁 {provider.freetier}
              </div>
              <div className="space-y-1.5">
                {provider.pros.map((p) => <div key={p} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"><span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{p}</div>)}
                {provider.cons.map((c) => <div key={c} className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500"><span className="text-red-400 mt-0.5 shrink-0">✗</span>{c}</div>)}
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
