import { useState, useMemo } from 'react';
import { findCompatibleModels, searchGpu, VRAM_TIERS, GPUs, type LocalModel } from '../data/gpuModels';

function getModelTier(m: LocalModel, vram: number) {
  if (vram >= m.recVram) return { label: '✅ 추천', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' };
  if (vram >= m.minVram) return { label: '⚡ 가능', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900' };
  return { label: '❌ 부족', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900' };
}

export default function PcCheck() {
  const [gpuQuery, setGpuQuery] = useState('');
  const [customVram, setCustomVram] = useState('');
  const [ram, setRam] = useState('16');
  const [useTag, setUseTag] = useState('');

  // GPU 자동 검색 또는 수동 VRAM
  const detectedGpu = useMemo(() => {
    if (customVram) return null;
    if (!gpuQuery.trim()) return null;
    return searchGpu(gpuQuery);
  }, [gpuQuery, customVram]);

  const vram = customVram ? parseFloat(customVram) || 0 : (detectedGpu?.vram || 0);
  const ramGb = parseFloat(ram) || 16;

  const { canRun, recommended, cannotRun } = useMemo(() => {
    if (vram <= 0) return { canRun: [], recommended: [], cannotRun: [] };
    return findCompatibleModels(vram, ramGb);
  }, [vram, ramGb]);

  const tier = VRAM_TIERS.find(t => vram < t.max);

  // 태그 필터링
  const tagFilter = (models: LocalModel[]) => {
    if (!useTag) return models;
    return models.filter(m => m.tags.includes(useTag));
  };

  const allTags = ['한국어', '코딩', '대화', '요약', '추론', '수학', '테스트', '검색', '다국어'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🖥️ 내 PC로 AI 돌려보기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">GPU와 RAM을 입력하면, 내 PC에서 구동 가능한 로컬 AI 모델을 추천해드립니다.</p>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
        {/* GPU 검색 */}
        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">🎮 그래픽카드 (GPU)</label>
          <input
            type="text"
            value={gpuQuery}
            onChange={e => setGpuQuery(e.target.value)}
            placeholder="예: RTX 4060, RX 7900 XTX, M3 Max"
            className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            list="gpu-list"
          />
          <datalist id="gpu-list">
            {GPUs.map(g => <option key={g.name} value={g.name} />)}
          </datalist>
          {detectedGpu && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-green-600 dark:text-green-400 font-bold">✅ 감지됨:</span>
              <span className="text-gray-700 dark:text-gray-300">{detectedGpu.name}</span>
              <span className="text-gray-400">({detectedGpu.vram}GB VRAM)</span>
              {detectedGpu.note && <span className="text-xs text-gray-400">· {detectedGpu.note}</span>}
            </div>
          )}
        </div>

        {/* VRAM 수동 입력 */}
        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">또는 VRAM 직접 입력 (GB)</label>
          <input
            type="number"
            value={customVram}
            onChange={e => setCustomVram(e.target.value)}
            placeholder="예: 12"
            min="0"
            max="128"
            className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          />
        </div>

        {/* RAM */}
        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">🧠 시스템 RAM (GB)</label>
          <select value={ram} onChange={e => setRam(e.target.value)}
            className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="8">8 GB</option>
            <option value="16">16 GB</option>
            <option value="32">32 GB</option>
            <option value="64">64 GB</option>
            <option value="128">128 GB</option>
          </select>
        </div>

        {/* 용도 필터 */}
        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">🎯 원하는 용도 (선택)</label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setUseTag('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!useTag ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
              전체
            </button>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setUseTag(useTag === tag ? '' : tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${useTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      {vram > 0 && (
        <>
          {/* 요약 카드 */}
          <div className={`rounded-2xl border p-5 ${tier?.color === 'text-red-500' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900' : tier?.color === 'text-orange-500' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900'}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tier?.icon || '🔵'}</span>
              <div>
                <p className={`text-lg font-black ${tier?.color}`}>VRAM {vram}GB · RAM {ramGb}GB</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tier?.desc}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm mt-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✅ 구동 가능: {canRun.length}개</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">⭐ 추천: {recommended.length}개</span>
            </div>
          </div>

          {/* 추천 모델 */}
          {tagFilter(recommended).length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⭐ 추천 모델 (권장 VRAM 충족)</h2>
              <div className="space-y-3">
                {tagFilter(recommended).map(m => (
                  <ModelCard key={m.id} model={m} vram={vram} />
                ))}
              </div>
            </div>
          )}

          {/* 구동 가능 (최소만) */}
          {tagFilter(canRun).filter(m => !recommended.includes(m)).length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚡ 구동 가능 (최소 VRAM)</h2>
              <div className="space-y-3">
                {tagFilter(canRun).filter(m => !recommended.includes(m)).map(m => (
                  <ModelCard key={m.id} model={m} vram={vram} />
                ))}
              </div>
            </div>
          )}

          {/* 구동 불가 */}
          {tagFilter(cannotRun).length > 0 && (
            <details className="group">
              <summary className="text-sm font-bold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                🔒 구동 불가 모델 ({tagFilter(cannotRun).length}개) — 클릭하여 펼치기
              </summary>
              <div className="mt-3 space-y-2 opacity-60">
                {tagFilter(cannotRun).map(m => (
                  <div key={m.id} className="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2">
                    <span className="font-medium">{m.name}</span>
                    <span className="ml-2">— 최소 {m.minVram}GB VRAM 필요</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}

      {vram === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🖥️</div>
          <p className="text-sm">GPU를 입력하면 구동 가능한 모델을 보여드립니다</p>
        </div>
      )}

      {/* 안내 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          💡 <strong>로컬 AI란?</strong> 인터넷 없이 내 PC에서 직접 구동하는 AI 모델입니다. Ollama, LM Studio 같은 프로그램을 설치하면 쉽게 실행할 수 있습니다.<br />
          데이터가 외부로 나가지 않아 보안이 좋고, API 비용이 들지 않습니다. 하지만 고성능 GPU가 필요합니다.
        </p>
      </div>
    </div>
  );
}

function ModelCard({ model, vram }: { model: LocalModel; vram: number }) {
  const tier = getModelTier(model, vram);
  return (
    <div className={`rounded-xl border p-4 ${tier.bg} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tier.color} bg-white/80 dark:bg-black/20`}>{tier.label}</span>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{model.name}</h3>
          <span className="text-[10px] text-gray-400">{model.provider}</span>
        </div>
        <span className="text-xs text-gray-400 font-mono">{model.size}</span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{model.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {model.tags.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-400">#{t}</span>
        ))}
      </div>
      <div className="flex gap-4 text-[10px] text-gray-400">
        <span>VRAM: 최소 {model.minVram}GB / 권장 {model.recVram}GB</span>
        <span>RAM: 최소 {model.minRam}GB</span>
        <span>양자화: {model.quant}</span>
      </div>
    </div>
  );
}
