import { useState, useEffect, useMemo } from 'react';
import Pricing from '../Pricing';
import Benchmarks from '../Benchmarks';
import { models } from '../../data/models';
import { logoIdToPath } from '../../lib/logoUtils';

/* 1:1 비교 카드에 사용할 데이터 타입 */
interface CompareItem {
  model: string;
  provider: string;
  companyId?: string;
  logoId?: string;
  input: number | null;
  output: number | null;
  cacheRead?: number | null;
  cacheWrite?: number | null;
  context: string;
  isNew?: boolean;
  note?: string;
  benchmarks?: Partial<Record<string, number>>;
}

const BENCHMARK_LABELS: Record<string, string> = {
  mmlu: 'MMLU-Pro', gpqa: 'GPQA Diamond', math: 'MATH-500', ifeval: 'IFEval',
  humaneval: 'HumanEval+', coding: 'SWE-bench', swe: 'Aider polyglot', musr: 'MUSR',
};

/* 1:1 비교에서 보여줄 벤치마크 데이터 */
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
  // --- 추가 모델 ---
  'gpt-5.3 instant': { mmlu: 83.0, gpqa: 60.5, math: 88.0, ifeval: 89.5, humaneval: 92.0, coding: 55.0, swe: 65.0, musr: 70.0 },
  'gpt-5.2': { mmlu: 84.5, gpqa: 63.0, math: 89.5, ifeval: 90.0, humaneval: 93.5, coding: 57.0, swe: 66.0, musr: 72.0 },
  'gpt-5': { mmlu: 82.0, gpqa: 58.5, math: 86.5, ifeval: 88.5, humaneval: 91.0, coding: 52.0, swe: 62.0, musr: 68.0 },
  'gpt-4o': { mmlu: 77.5, gpqa: 51.0, math: 76.8, ifeval: 85.5, humaneval: 85.0, coding: 36.0, swe: 42.0, musr: 58.0 },
  'gpt-4o mini': { mmlu: 72.0, gpqa: 40.5, math: 68.5, ifeval: 82.0, humaneval: 78.0, coding: 22.0, swe: 28.0, musr: 48.0 },
  'gpt-4.1': { mmlu: 78.5, gpqa: 53.5, math: 80.0, ifeval: 87.0, humaneval: 88.0, coding: 40.0, swe: 48.0, musr: 61.0 },
  'gpt-4.1 mini': { mmlu: 74.5, gpqa: 45.0, math: 73.5, ifeval: 84.5, humaneval: 82.0, coding: 28.0, swe: 35.0, musr: 52.0 },
  'claude opus 4.5': { mmlu: 83.5, gpqa: 61.0, math: 85.0, ifeval: 89.0, humaneval: 92.5, coding: 60.0, swe: 65.0, musr: 69.0 },
  'gemini 3 pro': { mmlu: 85.5, gpqa: 88.0, math: 89.0, ifeval: 91.0, humaneval: 92.0, coding: 72.0, swe: 65.0, musr: 74.0 },
  'gemini 2.5 pro': { mmlu: 84.0, gpqa: 82.0, math: 88.5, ifeval: 90.0, humaneval: 91.5, coding: 68.0, swe: 60.0, musr: 72.0 },
  'gemini 2.5 flash-lite': { mmlu: 72.5, gpqa: 46.0, math: 72.0, ifeval: 80.0, humaneval: 78.5, coding: 22.0, swe: 28.0, musr: 48.0 },
  'llama 4 scout': { mmlu: 73.0, gpqa: 42.0, math: 70.5, ifeval: 79.0, humaneval: 77.0, coding: 22.0, swe: 28.0, musr: 50.0 },
  'grok 4.20 beta': { mmlu: 87.8, gpqa: 70.5, math: 94.5, ifeval: 88.5, humaneval: 94.0, coding: 52.0, swe: 58.0, musr: 73.5 },
  'grok 3': { mmlu: 82.5, gpqa: 60.0, math: 88.0, ifeval: 86.0, humaneval: 89.5, coding: 48.0, swe: 55.0, musr: 66.0 },
  'minimax m2.5': { mmlu: 73.5, gpqa: 43.5, math: 71.0, ifeval: 80.5, humaneval: 78.0, coding: 24.0, swe: 30.0, musr: 50.0 },
  'deepseek-v3.2': { mmlu: 83.0, gpqa: 58.0, math: 90.0, ifeval: 84.0, humaneval: 90.5, coding: 46.0, swe: 55.0, musr: 68.0 },
  'qwen 3-7b': { mmlu: 68.0, gpqa: 35.0, math: 72.0, ifeval: 72.0, humaneval: 70.0, coding: 14.0, swe: 18.0, musr: 42.0 },
  'qwen 3-32b': { mmlu: 74.5, gpqa: 46.0, math: 80.5, ifeval: 80.0, humaneval: 80.0, coding: 26.0, swe: 32.0, musr: 52.0 },
  'kimi k2': { mmlu: 77.0, gpqa: 51.0, math: 84.0, ifeval: 82.0, humaneval: 86.0, coding: 35.0, swe: 42.0, musr: 58.0 },
  'glm-5-turbo': { mmlu: 75.5, gpqa: 47.0, math: 84.0, ifeval: 78.0, humaneval: 88.0, coding: 32.0, swe: 40.0, musr: 58.0 },
  'glm-4.7': { mmlu: 72.0, gpqa: 41.0, math: 76.0, ifeval: 75.0, humaneval: 79.0, coding: 24.0, swe: 30.0, musr: 48.0 },
  'mimo-v2-omni': { mmlu: 74.5, gpqa: 46.5, math: 81.0, ifeval: 77.0, humaneval: 85.0, coding: 31.0, swe: 40.0, musr: 56.0 },
  'mimo-v2-flash': { mmlu: 70.0, gpqa: 38.0, math: 72.0, ifeval: 74.0, humaneval: 76.0, coding: 18.0, swe: 24.0, musr: 45.0 },
  'mistral small 3': { mmlu: 73.5, gpqa: 43.0, math: 72.5, ifeval: 80.0, humaneval: 78.0, coding: 24.0, swe: 30.0, musr: 50.0 },
  'command r+': { mmlu: 75.0, gpqa: 47.0, math: 68.0, ifeval: 82.0, humaneval: 80.0, coding: 28.0, swe: 35.0, musr: 54.0 },
  'command a': { mmlu: 72.5, gpqa: 42.0, math: 65.0, ifeval: 79.0, humaneval: 77.0, coding: 22.0, swe: 28.0, musr: 48.0 },
};

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
    benchmarks: BENCH_DATA[m.name.toLowerCase()] ?? BENCH_DATA[m.id] ?? undefined,
  };
}

export default function ExploreCompare() {
  const [tab, setTab] = useState<'price'|'bench'|'vs'>('price');
  const [selectA, setSelectA] = useState('');
  const [selectB, setSelectB] = useState('');

  // URL 쿼리 파라미터: ?models=gpt-5.4,claude-opus-4.6
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('models');
    if (raw) {
      const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
      if (parts[0]) setSelectA(parts[0]);
      if (parts[1]) setSelectB(parts[1]);
    }
  }, []);

  // 모델 목록
  const modelOptions = useMemo(() => {
    return models.map(m => ({
      value: m.id,
      label: `${m.name} (${m.company})`,
      item: buildCompareItem(m),
    }));
  }, []);

  const itemA = useMemo(() => modelOptions.find(o => o.value === selectA)?.item, [selectA, modelOptions]);
  const itemB = useMemo(() => modelOptions.find(o => o.value === selectB)?.item, [selectB, modelOptions]);

  // 어느 쪽이 더 나은지 판별 (가격은 낮을수록, 벤치마크는 높을수록)
  function betterTag(a: number | null | undefined, b: number | null | undefined, lowerIsBetter = false): 'a' | 'b' | null {
    if (a == null && b == null) return null;
    if (a == null) return 'b';
    if (b == null) return 'a';
    if (a === b) return null;
    return lowerIsBetter ? (a < b ? 'a' : 'b') : (a > b ? 'a' : 'b');
  }

  // 양쪽 모델이 공통으로 가진 벤치마크 키
  const commonBenchKeys = useMemo(() => {
    if (!itemA?.benchmarks && !itemB?.benchmarks) return [];
    const keys = new Set([...Object.keys(itemA?.benchmarks ?? {}), ...Object.keys(itemB?.benchmarks ?? {})]);
    return [...keys].filter(k => BENCHMARK_LABELS[k]);
  }, [itemA, itemB]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">⚖️ 한눈에 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">AI 모델의 가격과 성능을 한곳에서 비교하세요.</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {([['price','💰 가격 비교'],['bench','📊 벤치마크'],['vs','🆚 1:1 비교']] as const).map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab===k ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'price' && <Pricing/>}
      {tab === 'bench' && <Benchmarks/>}

      {/* 1:1 비교 카드 */}
      {tab === 'vs' && (
        <div className="space-y-5">
          {/* 선택 UI */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">모델 2개를 선택하세요</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">모델 A</label>
                <select value={selectA} onChange={e => setSelectA(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="">선택...</option>
                  {modelOptions.filter(o => o.value !== selectB).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">모델 B</label>
                <select value={selectB} onChange={e => setSelectB(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="">선택...</option>
                  {modelOptions.filter(o => o.value !== selectA).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">링크로 공유: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">?models=gpt-5.4,claude-opus-4.6</code></p>
          </div>

          {/* 비교 카드 */}
          {itemA && itemB && (
            <div className="grid sm:grid-cols-2 gap-4">
              {/* 카드 A */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4 relative">
                <div className="absolute top-3 right-3 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">A</div>
                <div className="flex items-center gap-3">
                  {itemA.logoId && (() => {
                    const path = logoIdToPath(itemA.logoId);
                    return path ? <img src={path} alt="" className="w-10 h-10 rounded-xl object-contain" onError={e => (e.target as HTMLImageElement).style.display='none'} /> : null;
                  })()}
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-lg">{itemA.model}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{itemA.provider}</div>
                  </div>
                  {itemA.isNew && <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">NEW</span>}
                </div>

                {/* 가격 */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">가격($/1M 토큰)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-400 mb-0.5">입력</div>
                      <div className="font-mono font-bold text-gray-900 dark:text-white">
                        ${itemA.input ?? '-'}
                        {betterTag(itemA.input, itemB.input, true) === 'a' && <span className="ml-1">✅</span>}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-400 mb-0.5">출력</div>
                      <div className="font-mono font-bold text-gray-900 dark:text-white">
                        ${itemA.output ?? '-'}
                        {betterTag(itemA.output, itemB.output, true) === 'a' && <span className="ml-1">✅</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 컨텍스트 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">컨텍스트</span>
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{itemA.context}</span>
                </div>

                {/* 벤치마크 */}
                {commonBenchKeys.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">벤치마크</h3>
                    {commonBenchKeys.map(key => {
                      const scoreA = itemA?.benchmarks?.[key];
                      const scoreB = itemB?.benchmarks?.[key];
                      const winner = betterTag(scoreA, scoreB);
                      return (
                        <div key={key} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{BENCHMARK_LABELS[key]}</span>
                          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                            {scoreA != null ? scoreA.toFixed(1) : '-'}
                            {winner === 'a' && <span className="ml-1">✅</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 카드 B */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4 relative">
                <div className="absolute top-3 right-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">B</div>
                <div className="flex items-center gap-3">
                  {itemB.logoId && (() => {
                    const path = logoIdToPath(itemB.logoId);
                    return path ? <img src={path} alt="" className="w-10 h-10 rounded-xl object-contain" onError={e => (e.target as HTMLImageElement).style.display='none'} /> : null;
                  })()}
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-lg">{itemB.model}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{itemB.provider}</div>
                  </div>
                  {itemB.isNew && <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">NEW</span>}
                </div>

                {/* 가격 */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">가격($/1M 토큰)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-400 mb-0.5">입력</div>
                      <div className="font-mono font-bold text-gray-900 dark:text-white">
                        ${itemB.input ?? '-'}
                        {betterTag(itemB.input, itemA.input, true) === 'b' && <span className="ml-1">✅</span>}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-400 mb-0.5">출력</div>
                      <div className="font-mono font-bold text-gray-900 dark:text-white">
                        ${itemB.output ?? '-'}
                        {betterTag(itemB.output, itemA.output, true) === 'b' && <span className="ml-1">✅</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 컨텍스트 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">컨텍스트</span>
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{itemB.context}</span>
                </div>

                {/* 벤치마크 */}
                {commonBenchKeys.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">벤치마크</h3>
                    {commonBenchKeys.map(key => {
                      const scoreA = itemA?.benchmarks?.[key];
                      const scoreB = itemB?.benchmarks?.[key];
                      const winner = betterTag(scoreA, scoreB);
                      return (
                        <div key={key} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{BENCHMARK_LABELS[key]}</span>
                          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                            {scoreB != null ? scoreB.toFixed(1) : '-'}
                            {winner === 'b' && <span className="ml-1">✅</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 선택 전 안내 */}
          {(!itemA || !itemB) && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
              <div className="text-4xl mb-3">⚖️</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">위에서 모델 A와 모델 B를 선택하면 비교 카드가 표시됩니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
