import { useState, useMemo, useCallback, useRef } from 'react';
import { findCompatibleModels, searchGpu, VRAM_TIERS, GPUs, type LocalModel } from '../data/gpuModels';

function getModelTier(m: LocalModel, vram: number) {
  if (vram >= m.recVram) return { label: '✅ 추천', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' };
  if (vram >= m.minVram) return { label: '⚡ 가능', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900' };
  return { label: '❌ 부족', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900' };
}

// 텍스트에서 스펙 파싱
function parseSpecsText(text: string): { cpu: string; gpu: string; ram: number } | null {
  let cpu = '', gpu = '', ram = 0;

  // CPU 추출
  const cpuPatterns = [
    /(?:Processor|프로세서)\s*[:：]\s*(.+)/i,
    /(?:Intel|AMD|Apple)\s+\S+.*?(?:\n|$)/i,
    /(\d{1,2}(?:th|rd|st|nd)?\s+Gen\s+(?:Intel\s+)?Core\s+\S+.*?(?:@\s*[\d.]+\s*GHz)?)/i,
    /(Apple\s+M\d+\s+(?:Pro|Max|Ultra)?)/i,
    /(Ryzen\s+\d+\s+\w+.*?(?:\n|$))/i,
  ];
  for (const p of cpuPatterns) {
    const m = text.match(p);
    if (m) { cpu = m[1].trim().replace(/\n.*$/s, '').trim(); break; }
  }

  // GPU 추출
  const gpuPatterns = [
    /(?:Graphics|그래픽)\s*[:：]?\s*(.+)/i,
    /(NVIDIA\s+GeForce\s+(?:RTX|GTX)\s+\S+.*?(?:\n|$|\s*\/))/i,
    /(NVIDIA\s+(?:RTX|GTX)\s+\S+.*?(?:\n|$|\s*\/))/i,
    /(AMD\s+Radeon\s+RX\s+\S+.*?(?:\n|$|\s*\/))/i,
    /(Intel\s+Arc\s+\S+.*?(?:\n|$|\s*\/))/i,
    /(Apple\s+M\d+\s+(?:Pro|Max|Ultra)?)/i,
  ];
  for (const p of gpuPatterns) {
    const m = text.match(p);
    if (m) { gpu = m[1].trim().replace(/\n.*$/s, '').replace(/\s*\/.*$/, '').replace(/\d+\s*GB.*$/, '').trim(); break; }
  }

  // RAM 추출
  const ramPatterns = [
    /(?:Installed\s+RAM|설치된\s+RAM|RAM)\s*[:：]?\s*([\d.]+)\s*GB/i,
    /(\d+)\.?\d*\s*GB\s*(?:RAM|메모리|memory)/i,
  ];
  for (const p of ramPatterns) {
    const m = text.match(p);
    if (m) { ram = parseFloat(m[1]); break; }
  }

  if (!cpu && !gpu && ram === 0) return null;
  return { cpu, gpu, ram };
}

// WebGPU로 GPU 정보 감지
async function detectGpuViaWebGPU(): Promise<{ name: string; vram?: number } | null> {
  try {
    if (!navigator.gpu) return null;
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return null;
    const info = (adapter as any).info;
    if (!info) return null;
    const name = info.device || info.description || info.vendor || '';
    const vram = (info as any).dedicatedMemory?.inBytes
      ? Math.round((info as any).dedicatedMemory.inBytes / (1024 * 1024 * 1024))
      : undefined;
    return name ? { name, vram } : null;
  } catch { return null; }
}

interface DetectedSpecs {
  os: string;
  cpu: string;
  gpu: string;
  ram: number;
  source: 'auto' | 'ocr' | 'text';
}

export default function PcCheck() {
  const [gpuQuery, setGpuQuery] = useState('');
  const [customVram, setCustomVram] = useState('');
  const [ram, setRam] = useState('16');
  const [useTag, setUseTag] = useState('');
  const [detectedSpecs, setDetectedSpecs] = useState<DetectedSpecs | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [activeTab, setActiveTab] = useState<'auto' | 'manual' | 'image' | 'text'>('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const popularGpus = ['RTX 4060', 'RTX 4070', 'RTX 4090', 'RTX 5090', 'RX 7900 XTX', 'M3 Max', 'M4 Pro'];

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

  const tagFilter = (models: LocalModel[]) => {
    if (!useTag) return models;
    return models.filter(m => m.tags.includes(useTag));
  };

  const allTags = ['한국어', '코딩', '대화', '요약', '추론', '수학', '테스트', '검색', '다국어'];

  // 브라우저 자동 감지
  const handleAutoDetect = useCallback(async () => {
    setIsDetecting(true);
    try {
      const gpuInfo = await detectGpuViaWebGPU();
      const userAgent = navigator.userAgent;
      let os = 'Unknown';
      if (userAgent.includes('Win')) os = 'Windows';
      else if (userAgent.includes('Mac')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';

      const devMemory = (navigator as any).deviceMemory || 0;
      const cores = navigator.hardwareConcurrency || 0;

      const specs: DetectedSpecs = {
        os,
        cpu: cores ? `${cores}코어` : '감지 안됨',
        gpu: gpuInfo?.name || '감지 안됨',
        ram: devMemory || 0,
        source: 'auto',
      };

      // WebGPU에서 VRAM을 얻으면 바로 적용
      if (gpuInfo?.vram) {
        setGpuQuery(gpuInfo.name);
        setCustomVram(String(gpuInfo.vram));
        setRam(String(Math.max(devMemory, gpuInfo.vram)));
      } else if (gpuInfo?.name) {
        setGpuQuery(gpuInfo.name);
      }
      if (devMemory > 0) setRam(String(devMemory));

      setDetectedSpecs(specs);
    } catch {
      setDetectedSpecs({ os: 'Unknown', cpu: '', gpu: '감지 실패', ram: 0, source: 'auto' });
    }
    setIsDetecting(false);
  }, []);

  // 이미지 OCR
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          });
          const data = await res.json();
          if (data.specs) {
            const s = data.specs;
            if (s.gpu) setGpuQuery(s.gpu);
            if (s.ram) setRam(String(s.ram));
            setDetectedSpecs({ os: s.os || '', cpu: s.cpu || '', gpu: s.gpu || '', ram: s.ram || 0, source: 'ocr' });
          }
        } catch {
          alert('OCR 처리 중 오류가 발생했습니다.');
        }
        setOcrLoading(false);
      };
      reader.readAsDataURL(file);
    } catch { setOcrLoading(false); }
  }, []);

  // 텍스트 붙여넣기 파싱
  const handleTextParse = useCallback(() => {
    if (!pasteText.trim()) return;
    const parsed = parseSpecsText(pasteText);
    if (parsed) {
      if (parsed.gpu) setGpuQuery(parsed.gpu);
      if (parsed.ram > 0) setRam(String(parsed.ram));
      setDetectedSpecs({ os: '', cpu: parsed.cpu, gpu: parsed.gpu, ram: parsed.ram, source: 'text' });
    } else {
      alert('스펙 정보를 인식하지 못했습니다. GPU 이름이나 RAM 정보가 포함되어 있는지 확인해주세요.');
    }
  }, [pasteText]);

  const applySpecsFromDetected = useCallback(() => {
    if (!detectedSpecs) return;
    if (detectedSpecs.gpu && detectedSpecs.gpu !== '감지 안됨' && detectedSpecs.gpu !== '감지 실패') {
      const found = searchGpu(detectedSpecs.gpu);
      if (found) {
        setGpuQuery(found.name);
        if (!customVram) setCustomVram(String(found.vram));
      } else {
        setGpuQuery(detectedSpecs.gpu);
      }
    }
    if (detectedSpecs.ram > 0) setRam(String(detectedSpecs.ram));
    setActiveTab('manual');
  }, [detectedSpecs, customVram]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🖥️ 내 PC로 AI 돌려보기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">GPU와 RAM을 입력하면, 내 PC에서 구동 가능한 로컬 AI 모델을 추천해드립니다.</p>
      </div>

      {/* 입력 방법 탭 */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: 'auto' as const, label: '⚡ 자동 감지', desc: 'WebGPU' },
          { id: 'image' as const, label: '📸 스크린샷', desc: '이미지 업로드' },
          { id: 'text' as const, label: '📋 텍스트 붙여넣기', desc: '복사/붙여넣기' },
          { id: 'manual' as const, label: '✏️ 직접 입력', desc: '수동' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label} <span className="opacity-50 text-[10px] ml-1">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* === 자동 감지 탭 === */}
      {activeTab === 'auto' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center space-y-4">
          <div className="text-4xl">⚡</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">브라우저에서 내 PC 스펙 자동 감지</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            WebGPU API를 사용해 GPU와 RAM을 자동으로 감지합니다.<br />
            <span className="text-xs text-gray-400">Chrome 113+ 또는 Edge 113+ 필요</span>
          </p>
          <button
            onClick={handleAutoDetect}
            disabled={isDetecting}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm transition-all"
          >
            {isDetecting ? '🔄 감지 중...' : '🔍 내 PC 스펙 감지하기'}
          </button>

          {detectedSpecs && detectedSpecs.source === 'auto' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-left space-y-2">
              <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400">📋 감지 결과</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-500 dark:text-gray-400">OS</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.os}</div>
                <div className="text-gray-500 dark:text-gray-400">CPU</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.cpu}</div>
                <div className="text-gray-500 dark:text-gray-400">GPU</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.gpu}</div>
                <div className="text-gray-500 dark:text-gray-400">RAM</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.ram > 0 ? `${detectedSpecs.ram}GB` : '감지 안됨'}</div>
              </div>
              <button onClick={applySpecsFromDetected} className="mt-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all">
                ✅ 이 스펙으로 모델 추천 받기
              </button>
            </div>
          )}
        </div>
      )}

      {/* === 이미지 업로드 탭 === */}
      {activeTab === 'image' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center space-y-4">
          <div className="text-4xl">📸</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">스크린샷으로 스펙 감지</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Windows 설정 → 시스템 → 정보 또는 Mac → 이 Mac에 관하여 스크린샷
          </p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
          >
            {ocrLoading ? (
              <div className="space-y-2">
                <div className="animate-spin text-2xl">⏳</div>
                <p className="text-sm text-gray-500">AI가 스펙을 분석 중...</p>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-2">📁</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">클릭하여 이미지 업로드</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG 지원</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          {detectedSpecs && detectedSpecs.source === 'ocr' && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-left space-y-2">
              <h3 className="text-sm font-bold text-green-700 dark:text-green-400">✅ 인식 결과</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {detectedSpecs.os && <><div className="text-gray-500 dark:text-gray-400">OS</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.os}</div></>}
                {detectedSpecs.cpu && <><div className="text-gray-500 dark:text-gray-400">CPU</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.cpu}</div></>}
                {detectedSpecs.gpu && <><div className="text-gray-500 dark:text-gray-400">GPU</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.gpu}</div></>}
                {detectedSpecs.ram > 0 && <><div className="text-gray-500 dark:text-gray-400">RAM</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.ram}GB</div></>}
              </div>
              <button onClick={applySpecsFromDetected} className="mt-2 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-all">
                ✅ 이 스펙으로 모델 추천 받기
              </button>
            </div>
          )}
        </div>
      )}

      {/* === 텍스트 붙여넣기 탭 === */}
      {activeTab === 'text' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-4xl">📋</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">텍스트로 스펙 입력</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Windows 설정 → 정보 → 복사 버튼으로 복사한 텍스트를 붙여넣으세요
            </p>
          </div>
          <textarea
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            placeholder={`예시:\n프로세서: 12th Gen Intel(R) Core(TM) i9-12900K 3.20 GHz\n설치된 RAM: 64.0GB\n그래픽 카드: NVIDIA GeForce RTX 4090`}
            rows={6}
            className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 font-mono resize-none"
          />
          <button
            onClick={handleTextParse}
            disabled={!pasteText.trim()}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm transition-all"
          >
            🔍 스펙 파싱하기
          </button>

          {detectedSpecs && detectedSpecs.source === 'text' && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-left space-y-2">
              <h3 className="text-sm font-bold text-green-700 dark:text-green-400">✅ 파싱 결과</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {detectedSpecs.cpu && <><div className="text-gray-500 dark:text-gray-400">CPU</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.cpu}</div></>}
                {detectedSpecs.gpu && <><div className="text-gray-500 dark:text-gray-400">GPU</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.gpu}</div></>}
                {detectedSpecs.ram > 0 && <><div className="text-gray-500 dark:text-gray-400">RAM</div><div className="font-medium text-gray-900 dark:text-white">{detectedSpecs.ram}GB</div></>}
              </div>
              <button onClick={applySpecsFromDetected} className="mt-2 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-all">
                ✅ 이 스펙으로 모델 추천 받기
              </button>
            </div>
          )}
        </div>
      )}

      {/* === 직접 입력 탭 === */}
      {activeTab === 'manual' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          {/* 감지 결과 표시 */}
          {detectedSpecs && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex gap-3 text-xs">
                {detectedSpecs.gpu && detectedSpecs.gpu !== '감지 안됨' && (
                  <span className="text-blue-700 dark:text-blue-400 font-medium">🎮 {detectedSpecs.gpu}</span>
                )}
                {detectedSpecs.ram > 0 && (
                  <span className="text-blue-700 dark:text-blue-400 font-medium">🧠 {detectedSpecs.ram}GB</span>
                )}
              </div>
              <span className="text-[10px] text-gray-400">
                {detectedSpecs.source === 'auto' ? '⚡ 자동감지' : detectedSpecs.source === 'ocr' ? '📸 OCR' : '📋 텍스트'}
              </span>
            </div>
          )}

          {/* GPU 검색 */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">🎮 그래픽카드 (GPU)</label>
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">빠른 선택</p>
              <div className="flex flex-wrap gap-2">
                {popularGpus.map(gpu => (
                  <button
                    key={gpu}
                    type="button"
                    onClick={() => { setGpuQuery(gpu); setCustomVram(''); }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {gpu}
                  </button>
                ))}
              </div>
            </div>
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
      )}

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

      {vram === 0 && activeTab === 'manual' && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🖥️</div>
          <p className="text-sm">GPU를 입력하면 구동 가능한 모델을 보여드립니다</p>
        </div>
      )}

      {/* 안내 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 space-y-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          💡 <strong>로컬 AI란?</strong> 인터넷 없이 내 PC에서 직접 구동하는 AI 모델입니다. 데이터가 외부로 나가지 않아 보안이 좋고, API 비용이 들지 않습니다. 하지만 고성능 GPU가 필요합니다.
        </p>
        <details className="group">
          <summary className="text-xs font-semibold text-blue-600 dark:text-blue-400 cursor-pointer select-none">
            🚀 Ollama로 3분 만에 시작하기
          </summary>
          <ol className="mt-2 ml-4 list-decimal space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
            <li><strong>Ollama 설치하기</strong> — 운영체제에 맞는 Ollama 프로그램을 다운로드하여 설치합니다. <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ollama.com</a></li>
            <li><strong>AI 모델 다운로드</strong> — 터미널을 열고 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-[10px]">ollama run llama3</code> 명령어를 입력해 사용할 모델을 다운로드합니다.</li>
            <li><strong>대화 시작하기</strong> — 모델 준비가 완료되면 화면에 바로 질문을 입력하여 AI와 대화할 수 있습니다.</li>
          </ol>
          <p className="mt-2 text-[10px] text-gray-400">💡 더 많은 모델: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">ollama run gemma3</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">ollama run phi4</code></p>
        </details>
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