import { Coins } from "lucide-react";
import { useState } from 'react';
import { models, tierLabels, tierColors, companies } from '../data/models';

export default function DevPricing() {
  const [sortBy, setSortBy] = useState<'input' | 'output' | 'name'>('input');

  const priced = models.filter(m => m.inputPrice !== null && m.inputPrice > 0);

  const sorted = [...priced].sort((a, b) => {
    if (sortBy === 'input') return (a.inputPrice ?? 0) - (b.inputPrice ?? 0);
    if (sortBy === 'output') return (a.outputPrice ?? 0) - (b.outputPrice ?? 0);
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white"><Coins className="inline-block shrink-0 align-text-bottom" size={16} /> API 가격 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">모델별 API 가격을 1M 토큰 기준으로 비교하세요</p>
      </div>

      {/* Sort */}
      <div className="flex gap-2">
        {[
          { key: 'input' as const, label: '입력 가격순' },
          { key: 'output' as const, label: '출력 가격순' },
          { key: 'name' as const, label: '이름순' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortBy === opt.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-xs font-bold text-gray-500 dark:text-gray-400">모델</th>
              <th className="text-left py-3 px-2 text-xs font-bold text-gray-500 dark:text-gray-400">회사</th>
              <th className="text-left py-3 px-2 text-xs font-bold text-gray-500 dark:text-gray-400">티어</th>
              <th className="text-right py-3 px-2 text-xs font-bold text-gray-500 dark:text-gray-400">입력 ($/1M)</th>
              <th className="text-right py-3 px-2 text-xs font-bold text-gray-500 dark:text-gray-400">출력 ($/1M)</th>
              <th className="text-right py-3 px-2 text-xs font-bold text-gray-500 dark:text-gray-400">컨텍스트</th>
              <th className="text-center py-3 px-2 text-xs font-bold text-gray-500 dark:text-gray-400">한국어</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sorted.map(m => {
              const company = companies.find(c => c.id === m.companyId);
              return (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="py-2.5 px-2 text-xs font-bold text-gray-900 dark:text-white">
                    {m.name}
                    {m.isNew && <span className="ml-1 text-[9px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1 py-0.5 rounded">NEW</span>}
                  </td>
                  <td className="py-2.5 px-2 text-xs text-gray-600 dark:text-gray-400">
                    {company?.flag} {m.company}
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${tierColors[m.tier]}`}>
                      {tierLabels[m.tier]}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-xs text-right font-mono font-bold text-gray-900 dark:text-white">
                    ${m.inputPrice?.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-xs text-right font-mono text-gray-700 dark:text-gray-300">
                    ${m.outputPrice?.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-xs text-right text-gray-500 dark:text-gray-400">
                    {m.contextWindow}
                  </td>
                  <td className="py-2.5 px-2 text-xs text-center">
                    {m.koreanSupport ? (
                      <span className={`font-bold ${m.koreanSupport === 'A' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                        {m.koreanSupport}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-gray-400">
        * 가격은 2026년 3월 기준 공식 API 가격이며, 제공사 정책에 따라 변경될 수 있어요.
      </p>
    </div>
  );
}
