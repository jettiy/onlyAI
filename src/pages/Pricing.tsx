import { useState, useEffect, useMemo } from "react";
import { cloudProviders } from '../data/cloudProviders';
import { models, DATA_UPDATED_AT } from '../data/models';
import { getLogoUrl } from '../lib/logoUtils';

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
  koreanBilling?: boolean | null;
}

const FALLBACK_PRICES: PriceRow[] = [
  // ── OpenAI ──
  { model: 'GPT-5.4', provider: 'OpenAI', input: 2.50, output: 15.0, cacheRead: 0.25, cacheWrite: 2.50, context: '270K', note: '최고 성능', isNew: true, koreanBilling: true,
  },
  { model: 'GPT-5.4 mini', provider: 'OpenAI', input: 0.75, output: 4.50, cacheRead: 0.075, cacheWrite: 0.75, context: '270K', note: '가성비', isNew: true, koreanBilling: true,
  },
  { model: 'GPT-5.4 nano', provider: 'OpenAI', input: 0.20, output: 1.25, cacheRead: 0.02, cacheWrite: 0.20, context: '270K', note: '최저가', isNew: true, koreanBilling: true,
  },
  { model: 'GPT-5.2', provider: 'OpenAI', input: 1.75, output: 14.0, cacheRead: 0.175, cacheWrite: 1.75, context: '200K', note: '검증됨', koreanBilling: true,
  },
  { model: 'GPT-5', provider: 'OpenAI', input: 0.625, output: 5.0, cacheRead: 0.0625, cacheWrite: 0.625, context: '400K', note: '균형', koreanBilling: true,
  },
  { model: 'GPT-4.1', provider: 'OpenAI', input: 3.0, output: 12.0, cacheRead: 0.375, cacheWrite: 3.00, context: '1M', note: '코딩 강자', koreanBilling: true,
  },
  { model: 'GPT-4.1 Mini', provider: 'OpenAI', input: 0.80, output: 3.20, cacheRead: 0.08, cacheWrite: 0.80, context: '1M', note: '가성비', koreanBilling: true,
  },
  { model: 'GPT-4o', provider: 'OpenAI', input: 2.50, output: 10.0, cacheRead: 1.25, cacheWrite: 2.50, context: '128K', note: '멀티모달', koreanBilling: true,
  },
  { model: 'GPT-4o mini', provider: 'OpenAI', input: 0.15, output: 0.60, cacheRead: 0.075, cacheWrite: 0.15, context: '128K', note: '초저가', koreanBilling: true,
  },
  { model: 'o3', provider: 'OpenAI', input: 2.0, output: 8.0, cacheRead: 0.50, cacheWrite: 2.50, context: '200K', note: '추론', koreanBilling: true,
  },
  // ── Anthropic ──
  { model: 'Claude Opus 4.6', provider: 'Anthropic', input: 5.0, output: 25.0, cacheRead: 0.50, cacheWrite: 6.25, context: '1M', note: '최고 성능', koreanBilling: true,
  },
  { model: 'Claude Opus 4.5', provider: 'Anthropic', input: 5.0, output: 25.0, cacheRead: 0.50, cacheWrite: 6.25, context: '200K', note: '검증됨', koreanBilling: true,
  },
  { model: 'Claude Sonnet 4.6', provider: 'Anthropic', input: 3.0, output: 15.0, cacheRead: 0.30, cacheWrite: 3.75, context: '1M', note: '균형', isNew: true, koreanBilling: true,
  },
  { model: 'Claude Haiku 4.5', provider: 'Anthropic', input: 1.0, output: 5.0, cacheRead: 0.10, cacheWrite: 1.25, context: '200K', note: '빠름', koreanBilling: true,
  },
  // ── Google ──
  { model: 'Gemini 3.1 Pro', provider: 'Google', input: 2.0, output: 12.0, cacheRead: 0.625, cacheWrite: 2.50, context: '1M', note: '멀티모달', isNew: true, koreanBilling: true,
  },
  { model: 'Gemini 2.5 Pro', provider: 'Google', input: 1.25, output: 10.0, cacheRead: 0.3125, cacheWrite: 1.25, context: '1M', note: '가성비', koreanBilling: true,
  },
  { model: 'Gemini 2.5 Flash', provider: 'Google', input: 0.30, output: 2.5, cacheRead: 0.075, cacheWrite: 0.30, context: '1M', note: '저가', koreanBilling: true,
  },
  { model: 'Gemini 2.5 Flash-Lite', provider: 'Google', input: 0.10, output: 0.40, cacheRead: 0.025, cacheWrite: 0.10, context: '1M', note: '최저가', koreanBilling: true,
  },
  // ── xAI ──
  { model: 'Grok 4.20', provider: 'xAI', input: 2.0, output: 6.0, cacheRead: 0.20, cacheWrite: 2.00, context: '2M', note: '실시간', isNew: true, koreanBilling: null,
  },
  { model: 'Grok 3', provider: 'xAI', input: 3.0, output: 15.0, cacheRead: 0.30, cacheWrite: 3.00, context: '131K', note: '검증됨', koreanBilling: null,
  },
  // ── Meta ──
  { model: 'Llama 4 Maverick', provider: 'Meta', input: 0.27, output: 0.85, cacheRead: 0.027, cacheWrite: 0.27, context: '1M', note: '오픈소스', koreanBilling: true,
  },
  { model: 'Llama 4 Scout', provider: 'Meta', input: 0.11, output: 0.34, cacheRead: 0.011, cacheWrite: 0.11, context: '10M', note: '초장문맥', koreanBilling: true,
  },
  // ── 중국 ──
  { model: 'MiniMax M2.7', provider: 'MiniMax', input: 0.30, output: 1.20, cacheRead: 0.03, cacheWrite: 0.30, context: '204K', note: '에이전트', isNew: true, koreanBilling: true,
  },
  { model: 'MiniMax M2.5', provider: 'MiniMax', input: 0.27, output: 0.95, cacheRead: 0.027, cacheWrite: 0.27, context: '197K', note: '검증됨', koreanBilling: true,
  },
  { model: 'DeepSeek V3.2', provider: 'DeepSeek', input: 0.28, output: 0.42, cacheRead: 0.028, context: '128K', note: '가성비', koreanBilling: true,
  },
  { model: 'DeepSeek R1', provider: 'DeepSeek', input: 0.55, output: 2.19, cacheRead: 0.14, context: '128K', note: '추론', koreanBilling: true,
  },
  { model: 'Qwen3 235B', provider: 'Alibaba', input: 0.40, output: 1.20, cacheRead: 0.04, cacheWrite: 0.40, context: '128K', note: '한·중 특화', koreanBilling: true,
  },
  { model: 'Qwen3 32B', provider: 'Alibaba', input: 0.10, output: 0.40, cacheRead: 0.01, cacheWrite: 0.10, context: '128K', note: '오픈소스', koreanBilling: true,
  },
  { model: 'Qwen3 7B', provider: 'Alibaba', input: 0.04, output: 0.12, context: '128K', note: '초저가', koreanBilling: true,
  },
  { model: 'GLM-5', provider: 'Zhipu AI', input: 1.00, output: 3.20, cacheRead: 0.10, cacheWrite: 1.00, context: '128K', note: '코딩 특화', koreanBilling: true,
  },
  { model: 'GLM-5 Turbo', provider: 'Zhipu AI', input: 0.96, output: 3.20, cacheRead: 0.096, cacheWrite: 0.96, context: '128K', note: '초고속', koreanBilling: true,
  },
  { model: 'Kimi K2.5', provider: 'Moonshot', input: 0.60, output: 2.10, cacheRead: 0.06, cacheWrite: 0.60, context: '262K', note: '에이전트', koreanBilling: true,
  },
  { model: 'MiMo V2 Pro', provider: 'Xiaomi', input: 1.00, output: 3.00, cacheRead: 0.10, cacheWrite: 1.00, context: '1M', note: '초장문맥', koreanBilling: true,
  },
  // ── 기타 ──
  { model: 'Mistral Large 3', provider: 'Mistral', input: 0.50, output: 1.50, cacheRead: 0.05, cacheWrite: 0.50, context: '262K', note: '유럽', koreanBilling: true,
  },
  { model: 'Mistral Small 3', provider: 'Mistral', input: 0.10, output: 0.30, cacheRead: 0.01, cacheWrite: 0.10, context: '32K', note: '경량', koreanBilling: true,
  },
  { model: 'Command R+', provider: 'Cohere', input: 2.50, output: 10.0, cacheRead: 0.25, cacheWrite: 2.50, context: '128K', note: 'RAG', koreanBilling: null,
  },
  { model: 'Command A', provider: 'Cohere', input: 2.50, output: 10.0, cacheRead: 0.25, cacheWrite: 2.50, context: '256K', note: 'RAG', koreanBilling: null,
  },
];

const NOTE_STYLE: Record<string, string> = {
  '최고 성능': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  '긴 문맥':   'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300',
  '멀티모달':  'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
  '가성비':    'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  '최저가':    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  'NEW':       'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  '균형':      'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
  '빠름':      'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
  '초고속':    'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
  '추론':      'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  '오픈소스':  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  '유럽':      'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300',
  '경량':      'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  '중국 오픈소스': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  '초장문맥':  'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300',
  '코딩 특화': 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  '장문맥':    'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300',
  '코딩 강자': 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  '한·중 특화': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  '에이전트':  'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300',
  '검증됨':    'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  '실시간':    'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  'RAG':       'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300',
  '초저가':    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
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

function formatKRW(usd: number, rate: number): string {
  const won = usd * rate;
  if (won >= 1000) return `₩${Math.round(won).toLocaleString('ko-KR')}`;
  if (won >= 1) return `₩${won.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`;
  return `₩${won.toFixed(1)}`;
}

export default function Pricing() {
  const [tab, setTab] = useState<'bar' | 'table' | 'cache' | 'api' | 'calc'>('bar');
  const [prices, setPrices] = useState<PriceRow[]>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [tablePage, setTablePage] = useState(1);
  const [showCacheCols, setShowCacheCols] = useState(false);
  const [showKRW, setShowKRW] = useState(true);
  const [krwRate, setKrwRate] = useState<number>(1400);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (res.ok) {
          const data = await res.json();
          const rate = data?.rates?.KRW;
          if (rate && rate > 1000 && rate < 10000) setKrwRate(Math.round(rate * 100) / 100);
        }
      } catch { /* keep default */ }
    }
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
            koreanBilling: row.koreanBilling,
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

  // Helper: get logo URL from provider name
  const providerLogoMap: Record<string, string | null> = {};
  prices.forEach(p => {
    if (!providerLogoMap[p.provider]) {
      providerLogoMap[p.provider] = getLogoUrl(undefined, p.provider);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">💰 AI API 가격 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          countless.dev 방식 참고. 입력/출력/캐시 가격 분리{lastUpdated && ` · ${lastUpdated} 업데이트`}.
        </p>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs text-gray-400">데이터 기준일: {DATA_UPDATED_AT}</p>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" checked={showKRW} onChange={e => setShowKRW(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">원화(₩) 병기</span>
          </label>
          {showKRW && <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">1$ = {krwRate.toLocaleString()}₩</span>}
        </div>
        {loading && <div className="mt-2 flex items-center gap-2"><div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /><span className="text-xs text-gray-400">가격 불러오는 중...</span></div>}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([['bar','입력가 시각화'],['table','전체 가격표'],['cache','캐시 가격 비교'],['api','API 서비스 비교'],['calc','가격 계산기']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === key ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Z.AI Coding Plan */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-2xl border border-violet-200 dark:border-violet-800 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">💡</span>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">더 저렴하게 AI를 쓰는 방법</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Z.AI Coding Plan — 한 가정 요금제처럼 AI를 무제한으로. Claude Code, Cline, OpenClaw 등 지원.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-violet-200 dark:border-violet-700">
                <th className="text-left px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">플랜</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">월 가격</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">5시간당</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">주간</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">모델</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100 dark:divide-violet-800">
              {[
                { plan: 'Lite', price: '$10', per5h: '~80회', weekly: '~400회' },
                { plan: 'Pro', price: '$18', per5h: '~400회', weekly: '~2,000회' },
                { plan: 'Max', price: '$80', per5h: '~1,600회', weekly: '~8,000회' },
              ].map(r => (
                <tr key={r.plan}>
                  <td className="px-3 py-2 font-bold text-gray-900 dark:text-white">{r.plan}</td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-violet-600 dark:text-violet-400">{r.price}{showKRW && <span className="block text-[9px] text-gray-400 font-normal">{formatKRW(Number(r.price.replace('$','')), krwRate)}</span>}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-700 dark:text-gray-300">{r.per5h}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-700 dark:text-gray-300">{r.weekly}</td>
                  <td className="px-3 py-2 text-gray-500 dark:text-gray-400">GLM-5.1, Turbo, 4.7, 4.5-Air</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-violet-600 dark:text-violet-400 mt-3 font-medium">💰 월 실제 가치: 구독료의 15~30배 ($150~$2,400). 1프롬프트 = 모델 15~20회 호출. Vision, Web Search, Web Reader, Zread MCP 포함.</p>
      </div>

      {/* Bar chart */}
      {tab === 'bar' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5">입력 토큰 가격 ($/1M tokens)</h2>
          <div className="space-y-3">
            {sorted.map((row) => {
              const logoSrc = providerLogoMap[row.provider];
              return (
                <div key={row.model} className="flex items-center gap-3">
                  <div className="w-28 sm:w-44 flex items-center gap-2 shrink-0">
                    {logoSrc && <img src={logoSrc} alt="" className="w-4 h-4 rounded-sm object-contain" onError={e => (e.target as HTMLImageElement).style.display='none'} />}
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{row.model}</span>
                    {row.koreanBilling === true && <span className="shrink-0 text-[8px] px-1 py-0.5 rounded bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-semibold whitespace-nowrap">₩</span>}
                    {row.koreanBilling === null && <span className="shrink-0 text-[8px] px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold whitespace-nowrap">🔍</span>}
                  </div>
                  <div className="flex-1 relative h-7 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max((row.input / maxInput) * 100, 3)}%`,
                        backgroundColor: row.input < 0.5 ? '#22c55e' : row.input < 1.5 ? '#3b82f6' : row.input < 3 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <div className="w-14 text-right text-sm font-bold text-gray-900 dark:text-white shrink-0 font-mono">${row.input}</div>
                  {showKRW && <div className="hidden sm:block w-20 text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 shrink-0">{formatKRW(row.input, krwRate)}</div>}
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
      {tab === 'table' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">전체 가격표</h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={showCacheCols} onChange={e => setShowCacheCols(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer" />
                <span className="text-[11px] text-gray-500 dark:text-gray-400">캐시 읽기/쓰기 표시</span>
              </label>
              <p className="text-[10px] text-gray-400">{prices.length}개 모델 중 {(tablePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(tablePage * ITEMS_PER_PAGE, prices.length)}개 표시</p>
            </div>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">모델</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">입력</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">출력</th>
                  {showCacheCols && <th className="text-right px-3 py-3 font-semibold text-emerald-600 dark:text-emerald-400">캐시 읽기</th>}
                  {showCacheCols && <th className="text-right px-3 py-3 font-semibold text-orange-600 dark:text-orange-400">캐시 쓰기</th>}
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">컨텍스트</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">특징</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {prices.slice((tablePage - 1) * ITEMS_PER_PAGE, tablePage * ITEMS_PER_PAGE).map((row) => {
                  const logoSrc = providerLogoMap[row.provider];
                  return (
                    <tr key={row.model} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${prices.indexOf(row) % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {logoSrc && <img src={logoSrc} alt="" className="w-5 h-5 rounded-sm object-contain" onError={e => (e.target as HTMLImageElement).style.display='none'} />}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{row.model} {row.isNew && <span className="text-[8px] font-bold text-red-500 ml-1">NEW</span>}
                              {row.koreanBilling === true && <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-semibold">₩ 결제 가능</span>}
                              {row.koreanBilling === null && <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold">🔍 확인필요</span>}
                            </div>
                            <div className="text-[10px] text-gray-400">{row.provider}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-gray-900 dark:text-white">${row.input}{showKRW && <span className="block text-[10px] text-gray-400 font-normal">{formatKRW(row.input, krwRate)}</span>}</td>
                      <td className="px-3 py-3 text-right font-mono text-gray-900 dark:text-white">${row.output}{showKRW && <span className="block text-[10px] text-gray-400 font-normal">{formatKRW(row.output, krwRate)}</span>}</td>
                      {showCacheCols && <td className="px-3 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">{row.cacheRead ? <>{`$${row.cacheRead}`}{showKRW && <span className="block text-[10px] text-gray-400 font-normal">{formatKRW(row.cacheRead, krwRate)}</span>}</> : '—'}</td>}
                      {showCacheCols && <td className="px-3 py-3 text-right font-mono text-orange-600 dark:text-orange-400">{row.cacheWrite ? <>{`$${row.cacheWrite}`}{showKRW && <span className="block text-[10px] text-gray-400 font-normal">{formatKRW(row.cacheWrite, krwRate)}</span>}</> : '—'}</td>}
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
            <p className="text-xs text-gray-400 dark:text-gray-500">* 가격은 $/1M 토큰{showKRW && ` (1$ = ${krwRate.toLocaleString()}₩)`}. 캐시 읽기 = 이전 대화 재사용 시 (최대 90% 할인). 캐시 쓰기 = 첫 프롬프트 저장 비용.</p>
          </div>
          {Math.ceil(prices.length / ITEMS_PER_PAGE) > 1 && <Pagination current={tablePage} total={Math.ceil(prices.length / ITEMS_PER_PAGE)} onChange={setTablePage} />}
          {/* Mobile cards */}
          <div className="md:hidden grid gap-3 p-4">
            {prices.slice((tablePage - 1) * ITEMS_PER_PAGE, tablePage * ITEMS_PER_PAGE).map((row) => {
              const logoSrc = providerLogoMap[row.provider];
              return (
                <div key={row.model} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {logoSrc && <img src={logoSrc} alt="" className="w-4 h-4 rounded-sm object-contain" onError={e => (e.target as HTMLImageElement).style.display='none'} />}
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{row.model}</span>
                    {row.isNew && <span className="text-[8px] font-bold text-red-500">NEW</span>}
                    {row.koreanBilling === true && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-semibold">₩</span>}
                    {row.koreanBilling === null && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold">🔍</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><div className="text-[10px] text-gray-400">입력</div><div className="text-xs font-bold text-gray-900 dark:text-white font-mono">${row.input}</div>{showKRW && <div className="text-[9px] text-gray-400">{formatKRW(row.input, krwRate)}</div>}</div>
                    <div><div className="text-[10px] text-gray-400">출력</div><div className="text-xs font-bold text-gray-900 dark:text-white font-mono">${row.output}</div>{showKRW && <div className="text-[9px] text-gray-400">{formatKRW(row.output, krwRate)}</div>}</div>
                    <div><div className="text-[10px] text-gray-400">컨텍스트</div><div className="text-xs font-bold text-gray-900 dark:text-white">{row.context}</div></div>
                  </div>
                  {row.note && <div className="mt-2"><span className={`px-2 py-0.5 text-[9px] rounded-full font-semibold ${NOTE_STYLE[row.note] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>{row.note}</span></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                {prices.filter(p => p.cacheRead).sort((a, b) => a.cacheRead! - b.cacheRead!).map((row, idx) => (
                  <tr key={row.model} className={idx % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{row.model}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-600">${row.input}{showKRW && <div className="text-[9px] text-gray-400 font-normal">{formatKRW(row.input, krwRate)}</div>}</td>
                    <td className="px-3 py-2 text-right font-mono text-emerald-600 font-bold">${row.cacheRead}{showKRW && <div className="text-[9px] text-emerald-500/60 font-normal">{formatKRW(row.cacheRead!, krwRate)}</div>}</td>
                    <td className="px-3 py-2 text-right font-mono text-emerald-600">
                      -{Math.round((1 - row.cacheRead! / row.input) * 100)}%
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-orange-600">{row.cacheWrite ? `$${row.cacheWrite}` : '—'}{showKRW && row.cacheWrite && <div className="text-[9px] text-orange-500/60 font-normal">{formatKRW(row.cacheWrite, krwRate)}</div>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">💡 캐싱 활용 팁</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">동일한 시스템 프롬프트를 반복 사용할 때 캐시 읽기를 활용하면 비용을 크게 줄일 수 있습니다. Claude는 캐시 읽기가 90% 할인되며, Gemini도 비슷한 수준의 할인을 제공합니다.</p>
          </div>
          {/* Mobile cache cards */}
          <div className="grid gap-3 mt-4 md:hidden">
            {prices.filter(p => p.cacheRead).sort((a, b) => a.cacheRead! - b.cacheRead!).map((row) => (
              <div key={row.model} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{row.model}</span>
                  <span className="text-xs font-bold text-emerald-600">-{Math.round((1 - row.cacheRead! / row.input) * 100)}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><div className="text-[10px] text-gray-400">일반 입력</div><div className="font-mono font-bold">${row.input}</div>{showKRW && <div className="text-[9px] text-gray-400">{formatKRW(row.input, krwRate)}</div>}</div>
                  <div><div className="text-[10px] text-emerald-500">캐시 읽기</div><div className="font-mono font-bold text-emerald-600">${row.cacheRead}</div>{showKRW && <div className="text-[9px] text-gray-400">{formatKRW(row.cacheRead!, krwRate)}</div>}</div>
                  <div><div className="text-[10px] text-orange-500">캐시 쓰기</div><div className="font-mono font-bold text-orange-600">{row.cacheWrite ? `$${row.cacheWrite}` : '—'}</div></div>
                </div>
              </div>
            ))}
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
                {provider.badge && <span className="px-2 py-0.5 bg-brand-600 text-white text-[11px] rounded-full font-semibold">{provider.badge}</span>}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{provider.description}</p>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 mb-3">
                🎁 {provider.freetier}
              </div>
              <div className="space-y-1.5">
                {provider.pros.map((p) => <div key={p} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"><span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{p}</div>)}
                {provider.cons.map((c) => <div key={c} className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500"><span className="text-red-400 mt-0.5 shrink-0">✗</span>{c}</div>)}
              </div>
              <p className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-brand-600 dark:text-brand-400 font-medium">
                추천 대상: {provider.bestFor}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Token cost calculator */}
      {tab === 'calc' && <PriceCalculator prices={prices} showKRW={showKRW} krwRate={krwRate} />}
    </div>
  );
}

/* ── 가격 계산기 컴포넌트 ── */
function PriceCalculator({ prices, showKRW, krwRate }: { prices: PriceRow[]; showKRW: boolean; krwRate: number }) {
  const [inputTokens, setInputTokens] = useState<string>('');
  const [outputTokens, setOutputTokens] = useState<string>('');
  const inputNum = Number(inputTokens) || 0;
  const outputNum = Number(outputTokens) || 0;

  const calculations = useMemo(() => {
    if (inputNum === 0 && outputNum === 0) return [];
    return prices
      .map(p => ({
        ...p,
        monthlyCost: (inputNum / 1_000_000) * p.input + (outputNum / 1_000_000) * p.output,
      }))
      .sort((a, b) => a.monthlyCost - b.monthlyCost);
  }, [inputNum, outputNum, prices]);

  const maxCost = calculations.length > 0 ? calculations[calculations.length - 1].monthlyCost : 1;

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">🔢 월간 토큰 사용량 입력</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">입력 토큰 수</label>
            <input
              type="number"
              min="0"
              placeholder="월간 입력 토큰 수"
              value={inputTokens}
              onChange={e => setInputTokens(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {inputNum > 0 && (
              <p className="text-[10px] text-gray-400 mt-1">
                ≈ {(inputNum / 1_000_000).toFixed(2)}M 토큰
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">출력 토큰 수</label>
            <input
              type="number"
              min="0"
              placeholder="월간 출력 토큰 수"
              value={outputTokens}
              onChange={e => setOutputTokens(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {outputNum > 0 && (
              <p className="text-[10px] text-gray-400 mt-1">
                ≈ {(outputNum / 1_000_000).toFixed(2)}M 토큰
              </p>
            )}
          </div>
        </div>
        {(inputNum > 0 || outputNum > 0) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span>총 {(inputNum + outputNum).toLocaleString()} 토큰</span>
            <span>·</span>
            <span>입력 {(inputNum / 1_000_000).toFixed(2)}M + 출력 {(outputNum / 1_000_000).toFixed(2)}M</span>
          </div>
        )}
      </div>

      {/* Results */}
      {calculations.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">💰 월간 예상 비용 (저렴한 순)</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">* 가격은 $/1M 토큰 기준</p>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-8">#</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-500 dark:text-gray-400">모델</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-500 dark:text-gray-400">입력 단가</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-500 dark:text-gray-400">출력 단가</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">월간 비용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {calculations.map((row, idx) => {
                  const barPct = maxCost > 0 ? Math.max((row.monthlyCost / maxCost) * 100, 2) : 0;
                  const barColor = idx === 0 ? '#22c55e' : idx <= 2 ? '#3b82f6' : '#94a3b8';
                  return (
                    <tr key={row.model} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${idx % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                      <td className="px-4 py-3 text-xs font-bold text-gray-400">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">{row.model}</div>
                        <div className="text-[10px] text-gray-400">{row.provider}</div>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-gray-600 dark:text-gray-400 text-xs">${row.input}/M</td>
                      <td className="px-3 py-3 text-right font-mono text-gray-600 dark:text-gray-400 text-xs">${row.output}/M</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${barPct}%`, backgroundColor: barColor }} />
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`font-mono font-bold block ${idx === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                              ${row.monthlyCost < 0.01 ? '<0.01' : row.monthlyCost.toFixed(2)}
                            </span>
                            {showKRW && <span className="font-mono text-[10px] text-gray-400">{formatKRW(row.monthlyCost, krwRate)}</span>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile calculator cards */}
          <div className="md:hidden grid gap-2 p-4">
            {calculations.slice(0, 15).map((row, idx) => {
              const barPct = maxCost > 0 ? Math.max((row.monthlyCost / maxCost) * 100, 2) : 0;
              return (
                <div key={row.model} className={`rounded-lg border p-3 ${idx === 0 ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{row.model}</span>
                    </div>
                    <span className={`text-sm font-bold font-mono ${idx === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>${row.monthlyCost < 0.01 ? '<0.01' : row.monthlyCost.toFixed(2)}</span>
                  </div>
                  {showKRW && <div className="text-[10px] text-gray-400 mb-2">{formatKRW(row.monthlyCost, krwRate)}/월</div>}
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${barPct}%`, backgroundColor: idx === 0 ? '#22c55e' : idx <= 2 ? '#3b82f6' : '#94a3b8' }} />
                  </div>
                </div>
              );
            })}
          </div>
          {calculations.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 가장 저렴한 모델: <strong className="text-emerald-600 dark:text-emerald-400">{calculations[0].model}</strong> (${calculations[0].monthlyCost < 0.01 ? '<0.01' : calculations[0].monthlyCost.toFixed(2)}/월){showKRW && <span className="text-gray-400"> ({formatKRW(calculations[0].monthlyCost, krwRate)}/월)</span>}
                {calculations.length > 1 && (
                  <> · 가장 비싼 모델: <strong className="text-red-500">{calculations[calculations.length - 1].model}</strong> (${calculations[calculations.length - 1].monthlyCost.toFixed(2)}/월){showKRW && <span className="text-gray-400"> ({formatKRW(calculations[calculations.length - 1].monthlyCost, krwRate)}/월)</span>}</>
                )}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-10 text-center">
          <div className="text-4xl mb-3">🧮</div>
          <p className="text-sm text-gray-400">위에 월간 토큰 사용량을 입력하면 모델별 비용이 계산됩니다.</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {[
              { label: '소규모 (100K/50K)', input: '100000', output: '50000' },
              { label: '중간 (1M/500K)', input: '1000000', output: '500000' },
              { label: '대규모 (10M/5M)', input: '10000000', output: '5000000' },
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => { setInputTokens(preset.input); setOutputTokens(preset.output); }}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
