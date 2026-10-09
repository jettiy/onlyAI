import { useState } from 'react';
import { models, tierLabels, tierColors, regionLabels, type AIModel } from '../data/models';

export default function ModelCompare() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleModel = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedModels = selected.map(id => models.find(m => m.id === id)!).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
 <h1 className="text-2xl font-black text-gray-900 dark:text-white"> 모델 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">최대 3개 모델을 선택해서 나란히 비교하세요</p>
      </div>

      {/* Model Selector */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
          모델 선택 ({selected.length}/3)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
          {models.map(m => {
            const isSelected = selected.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModel(m.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-blue-400'
                }`}
              >
                <div className="font-bold">{m.name}</div>
                <div className={`text-[10px] ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>{m.company}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedModels.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-3 px-3 text-xs font-bold text-gray-500 dark:text-gray-400 w-28">항목</th>
                {selectedModels.map(m => (
                  <th key={m.id} className="text-left py-3 px-3 text-xs font-black text-gray-900 dark:text-white">
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <Row label="회사" values={selectedModels.map(m => m.company)} />
              <Row label="티어" values={selectedModels.map(m => tierLabels[m.tier])} />
              <Row label="지역" values={selectedModels.map(m => regionLabels[m.region])} />
              <Row label="컨텍스트" values={selectedModels.map(m => m.contextWindow)} />
              <Row label="입력 가격" values={selectedModels.map(m => m.inputPrice !== null ? `$${m.inputPrice}/1M` : '무료')} />
              <Row label="출력 가격" values={selectedModels.map(m => m.outputPrice !== null ? `$${m.outputPrice}/1M` : '무료')} />
              <Row label="한국어" values={selectedModels.map(m => m.koreanSupport ?? '-')} />
              <Row label="출시일" values={selectedModels.map(m => m.releaseDate)} />
            </tbody>
          </table>
        </div>
      )}

      {selectedModels.length === 0 && (
        <div className="text-center py-12">
 <div className="text-3xl mb-2"></div>
          <p className="text-sm text-gray-400">비교할 모델을 선택해주세요</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="py-2.5 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-2.5 px-3 text-xs text-gray-700 dark:text-gray-300">{v}</td>
      ))}
    </tr>
  );
}
