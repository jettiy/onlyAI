import { useState, useEffect, useMemo } from 'react';
import Pricing from '../Pricing';
import Benchmarks from '../Benchmarks';
import { models } from '../../data/models';
import { logoIdToPath } from '../../lib/logoUtils';

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

const BENCHMARK_LABELS: Record<string, string> = {
  mmlu: 'MMLU-Pro', gpqa: 'GPQA Diamond', math: 'MATH-500', ifeval: 'IFEval',
  humaneval: 'HumanEval+', coding: 'SWE-bench', swe: 'Aider polyglot', musr: 'MUSR',
};

const BENCH_DATA: Record<string, Partial<Record<string, number>>> = {
  // ... (keep original bench data)
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

export default function ExploreCompare() {
  const [tab, setTab] = useState<'price'|'bench'|'vs'>('price');
  const [selectA, setSelectA] = useState('');
  const [selectB, setSelectB] = useState('');
  const [useCaseFilter, setUseCaseFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'price'|'lang'|'popular'>('price');
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
    
    return filtered.sort((a, b) => {
      if (sortBy === 'price') return (a.item.input ?? 999) - (b.item.input ?? 999);
      return 0;
    });
  }, [modelOptions, showKoreanOnly, sortBy]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">⚖️ 한눈에 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">필터와 정렬을 사용하여 최적의 모델을 찾으세요.</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-wrap gap-4 items-center">
          <select value={useCaseFilter} onChange={e => setUseCaseFilter(e.target.value)} className="text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <option value="all">모든 용도</option>
              <option value="coding">코딩</option>
              <option value="writing">글쓰기</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showKoreanOnly} onChange={e => setShowKoreanOnly(e.target.checked)} />
              한국 결제 가능 모델만
          </label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <option value="price">가격순</option>
              <option value="lang">한국어 성능순</option>
              <option value="popular">인기순</option>
          </select>
      </div>

      {/* ... tabs and content ... */}
    </div>
  );
}
