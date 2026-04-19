import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { models } from '../../data/models';
import { logoIdToPath } from '../../lib/logoUtils';

/* ── 타입 ── */
interface CompareItem {
  model: string;
  provider: string;
  companyId?: string;
  logoId?: string;
  input: number | null;
  output: number | null;
  context: string;
  isNew?: boolean;
  koreanBilling?: boolean;
  benchmarks?: Partial<Record<string, number>>;
}

/* ── 상수 ── */
const BENCH_DATA: Record<string, Partial<Record<string, number>>> = {
  'gpt-5.4': { mmlu: 88.5, gpqa: 71.0, math: 93.5, ifeval: 92.0, humaneval: 97.2, coding: 62.0, swe: 72.0, musr: 80.5 },
  'claude opus 4.6': { mmlu: 86.2, gpqa: 68.5, math: 89.8, ifeval: 90.5, humaneval: 96.0, coding: 75.0, swe: 78.5, musr: 76.2 },
  'claude sonnet 4.6': { mmlu: 84.3, gpqa: 62.5, math: 86.0, ifeval: 89.8, humaneval: 93.8, coding: 63.3, swe: 69.5, musr: 71.2 },
  'gemini 3.1 pro': { mmlu: 88.0, gpqa: 94.3, math: 92.8, ifeval: 93.0, humaneval: 94.5, coding: 80.6, swe: 70.0, musr: 79.5 },
  'gemini 2.5 flash': { mmlu: 77.0, gpqa: 55.0, math: 85.0, ifeval: 86.0, humaneval: 87.5, coding: 38.0, swe: 45.0, musr: 64.0 },
  'grok 4.20': { mmlu: 87.8, gpqa: 70.5, math: 94.5, ifeval: 88.5, humaneval: 94.0, coding: 52.0, swe: 58.0, musr: 73.5 },
  'gpt-5.4 mini': { mmlu: 81.5, gpqa: 57.0, math: 84.0, ifeval: 88.0, humaneval: 91.5, coding: 50.0, swe: 62.0, musr: 67.0 },
  'qwen3 235b': { mmlu: 79.5, gpqa: 53.0, math: 90.5, ifeval: 82.0, humaneval: 89.8, coding: 38.5, swe: 48.0, musr: 66.5 },
  'glm-5': { mmlu: 78.0, gpqa: 50.5, math: 88.5, ifeval: 80.0, humaneval: 91.5, coding: 36.0, swe: 45.0, musr: 62.0 },
  'mimo v2 pro': { mmlu: 76.5, gpqa: 48.0, math: 83.0, ifeval: 78.5, humaneval: 87.0, coding: 33.0, swe: 42.0, musr: 58.0 },
  'deepseek r1': { mmlu: 81.5, gpqa: 59.2, math: 97.8, ifeval: 85.0, humaneval: 91.0, coding: 49.2, swe: 58.5, musr: 82.3 },
  'claude haiku 4.5': { mmlu: 74.0, gpqa: 44.0, math: 72.5, ifeval: 87.0, humaneval: 84.0, coding: 22.0, swe: 30.0, musr: 52.0 },
};

const BENCH_LABELS: Record<string, string> = {
  mmlu: 'MMLU-Pro', gpqa: 'GPQA Diamond', math: 'MATH-500', ifeval: 'IFEVal',
  humaneval: 'HumanEval+', coding: 'SWE-bench', swe: 'Aider polyglot', musr: 'MUSR',
};

const TABS = [
  { key: 'price' as const, label: '💰 가격 비교' },
  { key: 'bench' as const, label: '📊 벤치마크' },
  { key: 'vs' as const, label: '⚔️ 1:1 대결' },
];

/* ── 헬퍼 ── */
function buildCompareItem(m: typeof models[0]): CompareItem {
  return {
    model: m.name,
    provider: m.company,
    companyId: m.companyId,
    logoId: m.companyId,
    input: m.inputPrice,
    output: m.outputPrice,
    context: m.contextWindow,
    isNew: m.isNew,
    koreanBilling: ['Zhipu AI', 'Alibaba', 'MiniMax'].includes(m.company),
    benchmarks: BENCH_DATA[m.name.toLowerCase()] ?? BENCH_DATA[m.id] ?? undefined,
  };
}

function BenchBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-brand-500' : pct >= 55 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300 w-12 text-right">{value}</span>
    </div>
  );
}

/* ── 로고 컴포넌트 ── */
function ModelLogo({ companyId, size = 20 }: { companyId?: string; size?: number }) {
  const src = companyId ? logoIdToPath(companyId) : undefined;
  if (!src) return <div className={`w-${size/4} h-${size/4} bg-gray-200 dark:bg-gray-700 rounded`} />;
  return <img src={src} alt="" width={size} height={size} className="object-contain" loading="lazy" />;
}

/* ── 모델 선택 드롭다운 ── */
function ModelSelect({
  value,
  onChange,
  placeholder,
  exclude,
}: {
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  exclude?: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = value ? models.find(m => m.id === value) : null;

  const filtered = useMemo(() => {
    if (!query) return models.filter(m => m.id !== exclude).slice(0, 15);
    const q = query.toLowerCase();
    return models
      .filter(m => m.id !== exclude && (m.name.toLowerCase().includes(q) || m.company.toLowerCase().includes(q)))
      .slice(0, 15);
  }, [query, exclude]);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-left hover:border-[#5B5FEF]/50 dark:hover:border-[#5B5FEF]/50 transition-colors"
      >
        {selected ? (
          <>
            <ModelLogo companyId={selected.companyId} size={24} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{selected.name}</p>
              <p className="text-[11px] text-gray-400">{selected.company}</p>
            </div>
            {selected.isNew && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">NEW</span>}
          </>
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="모델 검색..."
              className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30"
              autoFocus
            />
          </div>
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 p-4 text-center">검색 결과 없음</p>
          )}
          {filtered.map(m => (
            <button
              key={m.id}
              onClick={() => { onChange(m.id); setOpen(false); setQuery(''); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${
                m.id === value ? 'bg-brand-50 dark:bg-brand-900/20' : ''
              }`}
            >
              <ModelLogo companyId={m.companyId} size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{m.name}</p>
                <p className="text-[11px] text-gray-400">{m.company}</p>
              </div>
              {m.inputPrice != null && (
                <span className="text-[10px] font-mono text-gray-400">${m.inputPrice}/M</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function ExploreCompare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'bench' ? 'bench' as const : searchParams.get('tab') === 'vs' ? 'vs' as const : 'price' as const;
  const [tab, setTab] = useState<'price' | 'bench' | 'vs'>(initialTab);
  const [selectA, setSelectA] = useState('');
  const [selectB, setSelectB] = useState('');
  const [useCaseFilter, setUseCaseFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'price' | 'lang' | 'popular'>('price');
  const [showKoreanOnly, setShowKoreanOnly] = useState(false);

  const modelOptions = useMemo(() => {
    return models.map(m => ({
      value: m.id,
      label: `${m.name} (${m.company})`,
      item: buildCompareItem(m),
    }));
  }, []);

  const filteredModels = useMemo(() => {
    let filtered = modelOptions;
    if (showKoreanOnly) filtered = filtered.filter(o => o.item.koreanBilling);
    if (useCaseFilter !== 'all') filtered = filtered.filter(o => {
      const m = models.find(m => m.id === o.value);
      return m?.useCases.includes(useCaseFilter);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') return (a.item.input ?? 999) - (b.item.input ?? 999);
      if (sortBy === 'lang') return (b.item.input ?? 0) - (a.item.input ?? 0);
      return 0;
    });
  }, [modelOptions, showKoreanOnly, sortBy, useCaseFilter]);

  const itemA = selectA ? buildCompareItem(models.find(m => m.id === selectA)!) : null;
  const itemB = selectB ? buildCompareItem(models.find(m => m.id === selectB)!) : null;

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">⚖️ 한눈에 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">필터와 정렬을 사용하여 최적의 모델을 찾으세요.</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
              tab === t.key
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 한눈에 결론 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '초보자에게 가장 쉬움', color: 'emerald', model: 'ChatGPT', reason: '가입만 하면 바로 사용 가능' },
          { label: '가성비 최고', color: 'violet', model: 'GLM-5', reason: '무료 + 한국어 성능 우수' },
          { label: '무료 시작 추천', color: 'blue', model: 'Gemini 2.5 Flash', reason: 'Google 계정으로 즉시 체험' },
          { label: '한국어 강함', color: 'amber', model: 'GPT-5.4', reason: '한국어 ₩ 결제 + 최고 성능' },
        ].map((c) => (
          <div key={c.label} className={`rounded-xl border p-3.5 ${
            c.color === 'emerald' ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10' :
            c.color === 'violet' ? 'border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-900/10' :
            c.color === 'blue' ? 'border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10' :
            'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10'
          }`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
              c.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
              c.color === 'violet' ? 'text-violet-600 dark:text-violet-400' :
              c.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
              'text-amber-600 dark:text-amber-400'
            }`}>{c.label}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{c.model}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{c.reason}</p>
          </div>
        ))}
      </div>

      {/* ═══ 가격 비교 탭 ═══ */}
      {tab === 'price' && (
        <div className="space-y-4">
          {/* 필터 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">용도</label>
                <select
                  value={useCaseFilter}
                  onChange={e => setUseCaseFilter(e.target.value)}
                  className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30"
                >
                  <option value="all">모든 용도</option>
                  <option value="coding">코딩</option>
                  <option value="writing">글쓰기</option>
                  <option value="chat">대화</option>
                  <option value="summary">요약</option>
                  <option value="image">이미지</option>
                </select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">정렬</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30"
                >
                  <option value="price">가격순</option>
                  <option value="lang">한국어 성능순</option>
                  <option value="popular">인기순</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer mt-5">
                <input
                  type="checkbox"
                  checked={showKoreanOnly}
                  onChange={e => setShowKoreanOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#5B5FEF] focus:ring-[#5B5FEF]/30"
                />
                한국 결제 가능
              </label>
            </div>
          </div>

          {/* 가격 테이블 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">모델</th>
                    <th className="text-right text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-3 py-3">입력</th>
                    <th className="text-right text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-3 py-3">출력</th>
                    <th className="text-right text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-3 py-3">컨텍스트</th>
                    <th className="text-center text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-3 py-3">한국어</th>
                    <th className="text-center text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-3 py-3">결제</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModels.map((opt, idx) => {
                    const m = models.find(mm => mm.id === opt.value);
                    const isFree = opt.item.input === 0 && opt.item.output === 0;
                    return (
                      <tr
                        key={opt.value}
                        className={`border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors hover:bg-brand-50/50 dark:hover:bg-brand-900/10 ${
                          idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <ModelLogo companyId={opt.item.companyId} size={22} />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white truncate">{opt.item.model}</p>
                              <p className="text-[11px] text-gray-400">{opt.item.provider}</p>
                            </div>
                            {opt.item.isNew && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">NEW</span>
                            )}
                          </div>
                        </td>
                        <td className={`text-right px-3 py-3 font-mono text-xs ${
                          isFree ? 'text-emerald-500 font-bold' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {isFree ? '무료' : `$${opt.item.input?.toFixed(2)}`}
                        </td>
                        <td className={`text-right px-3 py-3 font-mono text-xs ${
                          isFree ? 'text-emerald-500 font-bold' : (opt.item.output ?? 0) > 10 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {isFree ? '무료' : `$${opt.item.output?.toFixed(2)}`}
                        </td>
                        <td className="text-right px-3 py-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {opt.item.context}
                        </td>
                        <td className="text-center px-3 py-3">
                          {m?.koreanSupport && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              m.koreanSupport === 'A' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                              m.koreanSupport === 'B' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-500'
                            }`}>
                              {m.koreanSupport}
                            </span>
                          )}
                        </td>
                        <td className="text-center px-3 py-3">
                          {opt.item.koreanBilling ? (
                            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-1.5 py-0.5 rounded">₩</span>
                          ) : (
                            <span className="text-[10px] text-gray-400">US$</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredModels.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">해당 조건에 맞는 모델이 없습니다.</p>
            )}
            <p className="text-[10px] text-gray-400 px-4 py-2 border-t border-gray-100 dark:border-gray-800">
              USD per 1M tokens · {filteredModels.length}개 모델
            </p>
          </div>
        </div>
      )}

      {/* ═══ 벤치마크 탭 ═══ */}
      {tab === 'bench' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              주요 벤치마크 점수를 한눈에 확인하세요. 점수가 높을수록 성능이 좋습니다.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-5">
            {Object.entries(BENCH_LABELS).map(([key, label]) => {
              const entries = models
                .map(m => ({ model: m, score: BENCH_DATA[m.name.toLowerCase()]?.[key] ?? BENCH_DATA[m.id]?.[key] }))
                .filter(e => e.score != null)
                .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                .slice(0, 8);

              if (entries.length === 0) return null;

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{label}</h3>
                    <span className="text-[10px] text-gray-400">Top {entries.length}</span>
                  </div>
                  <div className="space-y-2">
                    {entries.map(({ model, score }, idx) => (
                      <div key={model.id} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-5 text-right">{idx + 1}</span>
                        <ModelLogo companyId={model.companyId} size={16} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-28 truncate">{model.name}</span>
                        <div className="flex-1">
                          <BenchBar value={score!} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ 1:1 대결 탭 ═══ */}
      {tab === 'vs' && (
        <div className="space-y-5">
          {/* 모델 선택 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">비교할 모델 2개를 선택하세요</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <ModelSelect
                value={selectA}
                onChange={setSelectA}
                placeholder="모델 A 선택..."
                exclude={selectB}
              />
              <div className="flex items-center justify-center">
                <span className="text-lg font-black text-gray-300 dark:text-gray-600">VS</span>
              </div>
              <ModelSelect
                value={selectB}
                onChange={setSelectB}
                placeholder="모델 B 선택..."
                exclude={selectA}
              />
            </div>
          </div>

          {/* 비교 결과 */}
          {itemA && itemB && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in">
              <div className="grid grid-cols-3 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="p-4">
                  <ModelLogo companyId={itemA.companyId} size={32} />
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-2">{itemA.model}</p>
                  <p className="text-[11px] text-gray-400">{itemA.provider}</p>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-xl font-black text-[#5B5FEF]">VS</span>
                </div>
                <div className="p-4">
                  <ModelLogo companyId={itemB.companyId} size={32} />
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-2">{itemB.model}</p>
                  <p className="text-[11px] text-gray-400">{itemB.provider}</p>
                </div>
              </div>

              {/* 비교 항목들 */}
              {[
                {
                  label: '입력 가격',
                  a: itemA.input,
                  b: itemB.input,
                  format: (v: number | null) => v === 0 ? '무료' : v != null ? `$${v.toFixed(2)}` : '-',
                  better: 'lower' as const,
                },
                {
                  label: '출력 가격',
                  a: itemA.output,
                  b: itemB.output,
                  format: (v: number | null) => v === 0 ? '무료' : v != null ? `$${v.toFixed(2)}` : '-',
                  better: 'lower' as const,
                },
                {
                  label: '컨텍스트',
                  a: itemA.context,
                  b: itemB.context,
                  format: (v: string) => v,
                  better: null,
                },
              ].map(row => {
                const aStr = row.format(row.a as never);
                const bStr = row.format(row.b as never);
                let winner: 'a' | 'b' | null = null;
                if (row.better === 'lower' && typeof row.a === 'number' && typeof row.b === 'number') {
                  winner = row.a < row.b ? 'a' : row.a > row.b ? 'b' : null;
                }
                return (
                  <div key={row.label} className="grid grid-cols-3 text-center border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className={`p-3 text-sm ${winner === 'a' ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {aStr}
                    </div>
                    <div className="p-3 text-[11px] font-semibold text-gray-400 flex items-center justify-center">
                      {row.label}
                    </div>
                    <div className={`p-3 text-sm ${winner === 'b' ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {bStr}
                    </div>
                  </div>
                );
              })}

              {/* 벤치마크 비교 */}
              {Object.entries(BENCH_LABELS).map(([key, label]) => {
                const scoreA = itemA.benchmarks?.[key];
                const scoreB = itemB.benchmarks?.[key];
                if (scoreA == null && scoreB == null) return null;
                const winner = scoreA != null && scoreB != null ? (scoreA > scoreB ? 'a' : scoreA < scoreB ? 'b' : null) : null;
                return (
                  <div key={key} className="grid grid-cols-3 text-center border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className={`p-3 text-sm font-mono ${winner === 'a' ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {scoreA ?? '-'}
                    </div>
                    <div className="p-3 text-[11px] font-semibold text-gray-400 flex items-center justify-center">
                      {label}
                    </div>
                    <div className={`p-3 text-sm font-mono ${winner === 'b' ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {scoreB ?? '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!itemA && !itemB && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">⚔️</p>
              <p className="text-sm text-gray-400">위에서 모델 2개를 선택하면 비교 결과가 표시됩니다</p>
            </div>
          )}
        </div>
      )}

      {/* 하단 링크 */}
      <div className="flex flex-wrap gap-3 justify-center pt-4">
        <Link to="/recommend" className="text-sm text-[#5B5FEF] dark:text-[#8B8FFF] font-medium hover:underline">
          🎯 용도별 추천 받기
        </Link>
        <Link to="/pricing" className="text-sm text-[#5B5FEF] dark:text-[#8B8FFF] font-medium hover:underline">
          💰 전체 가격표
        </Link>
      </div>
    </div>
  );
}
