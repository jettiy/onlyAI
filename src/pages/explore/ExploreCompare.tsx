import { useState } from 'react';
import Pricing from '../Pricing';
import Benchmarks from '../Benchmarks';
export default function ExploreCompare() {
  const [tab, setTab] = useState<'price'|'bench'>('price');
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">⚖️ 한눈에 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">AI 모델의 가격과 성능을 한곳에서 비교하세요.</p>
      </div>
      <div className="flex gap-2">
        {([['price','💰 가격 비교'],['bench','📊 벤치마크']] as const).map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab===k ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'price' ? <Pricing/> : <Benchmarks/>}
    </div>
  );
}
