import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { findCompatibleModels, searchGpu, VRAM_TIERS, GPUs, type LocalModel } from '../data/gpuModels';

function getModelTier(m: LocalModel, vram: number) {
  if (vram >= m.recVram) return { label: '✅ 추천', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' };
  if (vram >= m.minVram) return { label: '⚡ 가능', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900' };
  return { label: '❌ 부족', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900' };
}

// WebGL로 GPU 이름 감지 (대부분 브라우저에서 작동)
function detectGpuViaWebGL(): { name: string } | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return null;
    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
    if (!renderer) return null;
    return { name: renderer };
  } catch { return null; }
}

// WebGL GPU 이름 → GPU DB 매칭
function matchGpuFromWebGL(renderer: string): { name: string; vram: number } | null {
  const r = renderer.toLowerCase();

  // NVIDIA 매칭
  const nvidiaMatch = r.match(/nvidia\s+(geforce\s+)?(rtx|gtx)\s+(\w+\s+\w+|\w+)/);
  if (nvidiaMatch) {
    const fullName = `NVIDIA ${nvidiaMatch[2].toUpperCase()} ${nvidiaMatch[3]}`.replace(/\s+(Ti|Super|Ti\s+Super)$/, ' $1');
    const found = GPUs.find(g => g.name.toLowerCase().includes(fullName.toLowerCase()));
    if (found) return { name: found.name, vram: found.vram };
    // VRAM이 안 맞아도 이름 반환
    return { name: `NVIDIA ${nvidiaMatch[2].toUpperCase()} ${nvidiaMatch[3]}`, vram: 0 };
  }

  // AMD 매칭
  const amdMatch = r.match(/amd\s+radeon\s+(rx)\s+(\w+)/i);
  if (amdMatch) {
    const found = GPUs.find(g => g.name.toLowerCase().includes(amdMatch[0].toLowerCase()));
    if (found) return { name: found.name, vram: found.vram };
  }

  // Apple Silicon 매칭
  const appleMatch = r.match(/apple\s+(m\d+)/i);
  if (appleMatch) {
    const found = GPUs.find(g => g.name.toLowerCase().includes(appleMatch[0].toLowerCase()));
    if (found) return { name: found.name, vram: found.vram };
  }

  return null;
}

// 텍스트에서 스펙 파싱
function parseSpecsText(text: string): { cpu: string; gpu: string; ram: number } | null {
  let cpu = '', gpu = '', ram = 0;
  const cpuPatterns = [
    /(?:Processor|프로세서)\s*[:：]\s*(.+)/i,
    /(\d{1,2}(?:th|rd|st|nd)?\s+Gen\s+(?:Intel\s+)?Core\s+\S+.*?(?:@\s*[\d.]+\s*GHz)?)/i,
    /(Apple\s+M\d+\s+(?:Pro|Max|Ultra)?)/i,
  ];
  for (const p of cpuPatterns) {
    const m = text.match(p);
    if (m) { cpu = m[1].trim().replace(/\n.*$/s, '').trim(); break; }
  }
  const gpuPatterns = [
    /(?:Graphics|그래픽)\s*[:：]?\s*(.+)/i,
    /(NVIDIA\s+GeForce\s+(?:RTX|GTX)\s+\S+.*?(?:\n|$|\s*\/))/i,
    /(NVIDIA\s+(?:RTX|GTX)\s+\S+.*?(?:\n|$|\s*\/))/i,
    /(AMD\s+Radeon\s+RX\s+\S+.*?(?:\n|$|\s*\/))/i,
  ];
  for (const p of gpuPatterns) {
    const m = text.match(p);
    if (m) { gpu = m[1].trim().replace(/\n.*$/s, '').replace(/\s*\/.*$/, '').replace(/\d+\s*GB.*$/, '').trim(); break; }
  }
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

interface DetectedSpecs {
  gpu: string;
  vram: number;
  ram: number;
  source: 'auto' | 'ocr' | 'text';
  rawGpu?: string;
}

export default function PcCheck() {
  const [gpuQuery, setGpuQuery] = useState('');
  const [customVram, setCustomVram] = useState('');
  const [ram, setRam] = useState('16');
  const [useTag, setUseTag] = useState('');
  const [detectedSpecs, setDetectedSpecs] = useState<DetectedSpecs | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [activeTab, setActiveTab] = useState<'auto' | 'manual' | 'image' | 'text'>('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const popularGpus = ['RTX 4060', 'RTX 4070', 'RTX 4090', 'RTX 5090', 'RX 7900 XTX', 'M3 Max', 'M4 Pro'];

  // 페이지 로드 시 자동 감지 시도
  useEffect(() => {
    const result = detectGpuViaWebGL();
    if (result) {
      const match = matchGpuFromWebGL(result.name);
      if (match) {
        setDetectedSpecs({
          gpu: match.name,
          vram: match.vram,
          ram: 0,
          source: 'auto',
          rawGpu: result.name,
        });
      }
    }
  }, []);

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

  const allTags = ['코딩', '대화', '요약', '추론', '수학', '테스트', '검색', '다국어', '창작'];

  // 감지된 스펙 적용
  const applySpecs = useCallback(() => {
    if (!detectedSpecs) return;
    if (detectedSpecs.gpu) {
      const found = searchGpu(detectedSpecs.gpu);
      if (found) {
        setGpuQuery(found.name);
        setCustomVram(String(found.vram));
      } else {
        setGpuQuery(detectedSpecs.gpu);
      }
    }
    if (detectedSpecs.ram > 0) setRam(String(detectedSpecs.ram));
    setActiveTab('manual');
  }, [detectedSpecs]);

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
            setDetectedSpecs({ gpu: s.gpu || '', vram: 0, ram: s.ram || 0, source: 'ocr' });
          }
        } catch { alert('OCR 처리 중 오류가 발생했습니다.'); }
        setOcrLoading(false);
      };
      reader.readAsDataURL(file);
    } catch { setOcrLoading(false); }
  }, []);

  // 텍스트 파싱
  const handleTextParse = useCallback(() => {
    if (!pasteText.trim()) return;
    const parsed = parseSpecsText(pasteText);
    if (parsed) {
      setDetectedSpecs({ gpu: parsed.gpu, vram: 0, ram: parsed.ram, source: 'text' });
    } else {
      alert('스펙 정보를 인식하지 못했습니다. GPU 이름이나 RAM 정보가 포함되어 있는지 확인해주세요.');
    }
  }, [pasteText]);

  // 빠른 GPU 선택
  const handleQuickGpu = useCallback((name: string) => {
    setGpuQuery(name);
    setCustomVram('');
    setDetectedSpecs(null);
    const found = searchGpu(name);
    if (found) setCustomVram(String(found.vram));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🖥️ 내 PC로 AI 돌려보기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">GPU를 선택하면, 내 PC에서 구동 가능한 로컬 AI 모델을 추천해드립니다.</p>
      </div>

      {/* 자동 감지 배너 (맨 위에 노출) */}
      {detectedSpecs && detectedSpecs.source === 'auto' && (
        <div className="bg-gradient-to-r from-brand-50 to-brand-50 dark:from-brand-900/20 dark:to-brand-900/20 rounded-2xl border border-brand-200 dark:border-brand-900 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">내 GPU 자동 감지됨</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{detectedSpecs.gpu}{detectedSpecs.vram > 0 ? ` (${detectedSpecs.vram}GB)` : ''}</p>
                {detectedSpecs.rawGpu && detectedSpecs.rawGpu !== detectedSpecs.gpu && (
                  <p className="text-[10px] text-gray-400 mt-0.5">원본: {detectedSpecs.rawGpu}</p>
                )}
              </div>
            </div>
            <button onClick={applySpecs} className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap">
              ✅ 이 GPU로 추천
            </button>
          </div>
        </div>
      )}

      {/* 입력 방법 탭 */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: 'auto' as const, label: '⚡ 자동 감지', desc: 'WebGL' },
          { id: 'image' as const, label: '📸 스크린샷', desc: '이미지' },
          { id: 'text' as const, label: '📋 텍스트', desc: '붙여넣기' },
          { id: 'manual' as const, label: '✏️ 직접 입력', desc: '수동' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            {tab.label} <span className="opacity-50 text-[10px] ml-1">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* === 자동 감지 탭 === */}
      {activeTab === 'auto' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center space-y-4">
          <div className="text-4xl">⚡</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">브라우저에서 내 GPU 자동 감지</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            WebGL을 사용해 설치된 그래픽카드를 감지합니다.<br />
            <span className="text-xs text-gray-400">Chrome, Edge, Firefox, Safari 모두 지원</span>
          </p>

          {/* 즉시 감지 결과 표시 */}
          {detectedSpecs && detectedSpecs.source === 'auto' ? (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <span className="text-lg">✅</span>
                <span className="font-bold text-sm">감지 성공!</span>
              </div>
              <div className="text-left space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">GPU</span>
                  <span className="font-medium text-gray-900 dark:text-white">{detectedSpecs.gpu}</span>
                </div>
                {detectedSpecs.vram > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">VRAM</span>
                    <span className="font-medium text-gray-900 dark:text-white">{detectedSpecs.vram}GB</span>
                  </div>
                )}
                {detectedSpecs.rawGpu && (
                  <p className="text-[10px] text-gray-400 mt-2">WebGL 원본: {detectedSpecs.rawGpu}</p>
                )}
              </div>
              <button onClick={applySpecs} className="w-full px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition-all">
                ✅ 이 스펙으로 모델 추천 받기
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                ⚠️ GPU를 자동으로 감지하지 못했습니다.<br />
                아래 방법으로 스펙을 입력해주세요.
              </p>
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
            Windows: 설정 → 시스템 → 정보 &nbsp;|&nbsp; Mac: 이 Mac에 관하여
          </p>
          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all">
            {ocrLoading ? (
              <div className="space-y-2">
                <div className="animate-spin text-2xl inline-block">⏳</div>
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
              {detectedSpecs.gpu && <p className="text-sm text-gray-700 dark:text-gray-300">GPU: <strong>{detectedSpecs.gpu}</strong></p>}
              {detectedSpecs.ram > 0 && <p className="text-sm text-gray-700 dark:text-gray-300">RAM: <strong>{detectedSpecs.ram}GB</strong></p>}
              <button onClick={applySpecs} className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-all">✅ 이 스펙으로 추천 받기</button>
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Windows 설정 → 정보 → 복사 버튼으로 복사한 텍스트를 붙여넣으세요</p>
          </div>
          <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
            placeholder={`예시:\n프로세서: 12th Gen Intel(R) Core(TM) i9-12900K 3.20 GHz\n설치된 RAM: 64.0GB\n그래픽: NVIDIA GeForce RTX 4090`}
            rows={5}
            className="w-full text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-400 font-mono resize-none"
          />
          <button onClick={handleTextParse} disabled={!pasteText.trim()}
            className="w-full px-4 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm transition-all">
            🔍 스펙 파싱하기
          </button>
          {detectedSpecs && detectedSpecs.source === 'text' && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-left space-y-2">
              <h3 className="text-sm font-bold text-green-700 dark:text-green-400">✅ 파싱 결과</h3>
              {detectedSpecs.gpu && <p className="text-sm text-gray-700 dark:text-gray-300">GPU: <strong>{detectedSpecs.gpu}</strong></p>}
              {detectedSpecs.ram > 0 && <p className="text-sm text-gray-700 dark:text-gray-300">RAM: <strong>{detectedSpecs.ram}GB</strong></p>}
              <button onClick={applySpecs} className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-all">✅ 이 스펙으로 추천 받기</button>
            </div>
          )}
        </div>
      )}

      {/* === 직접 입력 탭 (메인) === */}
      {activeTab === 'manual' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          {/* 감지된 스펙 표시 */}
          {detectedSpecs && (
            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex gap-3 text-xs">
                <span className="text-brand-700 dark:text-brand-400 font-medium">🎮 {detectedSpecs.gpu}</span>
                {detectedSpecs.ram > 0 && <span className="text-brand-700 dark:text-brand-400 font-medium">🧠 {detectedSpecs.ram}GB</span>}
              </div>
              <span className="text-[10px] text-gray-400">
                {detectedSpecs.source === 'auto' ? '⚡ 자동' : detectedSpecs.source === 'ocr' ? '📸 OCR' : '📋 텍스트'}
              </span>
            </div>
          )}

          {/* 빠른 GPU 선택 */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">🎮 그래픽카드 (GPU)</label>
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {popularGpus.map(gpu => (
                  <button key={gpu} type="button" onClick={() => handleQuickGpu(gpu)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      gpuQuery.includes(gpu.split(' ')[0])
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}>
                    {gpu}
                  </button>
                ))}
              </div>
            </div>
            <input type="text" value={gpuQuery} onChange={e => { setGpuQuery(e.target.value); setCustomVram(''); }}
              placeholder="또는 GPU 이름 직접 입력 (예: RTX 4060, M3 Max)"
              className="w-full text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-400"
              list="gpu-list"
            />
            <datalist id="gpu-list">{GPUs.map(g => <option key={g.name} value={g.name} />)}</datalist>
            {detectedGpu && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-green-600 dark:text-green-400 font-bold">✅ 감지됨:</span>
                <span className="text-gray-700 dark:text-gray-300">{detectedGpu.name}</span>
                <span className="text-gray-400">({detectedGpu.vram}GB VRAM)</span>
                {detectedGpu.note && <span className="text-xs text-gray-400">· {detectedGpu.note}</span>}
              </div>
            )}
          </div>

          {/* VRAM 수동 */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">또는 VRAM 직접 입력 (GB)</label>
            <input type="number" value={customVram} onChange={e => setCustomVram(e.target.value)}
              placeholder="예: 12" min="0" max="128"
              className="w-full text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-400"
            />
          </div>

          {/* RAM */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">🧠 시스템 RAM (GB)</label>
            <select value={ram} onChange={e => setRam(e.target.value)}
              className="w-full text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!useTag ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>전체</button>
              {allTags.map(tag => (
                <button key={tag} onClick={() => setUseTag(useTag === tag ? '' : tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${useTag === tag ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>{tag}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 결과 */}
      {vram > 0 && (
        <>
          <div className={`rounded-2xl border p-5 ${tier?.color === 'text-red-500' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900' : tier?.color === 'text-orange-500' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900' : 'bg-brand-50 dark:bg-brand-900/10 border-brand-200 dark:border-brand-900'}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tier?.icon || '🔵'}</span>
              <div>
                <p className={`text-lg font-black ${tier?.color}`}>VRAM {vram}GB · RAM {ramGb}GB</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tier?.desc}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm mt-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✅ 구동 가능: {canRun.length}개</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">⭐ 추천: {recommended.length}개</span>
            </div>
          </div>

          {tagFilter(recommended).length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⭐ 추천 모델 (권장 VRAM 충족)</h2>
              <div className="space-y-3">{tagFilter(recommended).map(m => <ModelCard key={m.id} model={m} vram={vram} />)}</div>
            </div>
          )}

          {tagFilter(canRun).filter(m => !recommended.includes(m)).length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚡ 구동 가능 (최소 VRAM)</h2>
              <div className="space-y-3">{tagFilter(canRun).filter(m => !recommended.includes(m)).map(m => <ModelCard key={m.id} model={m} vram={vram} />)}</div>
            </div>
          )}

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
          <summary className="text-xs font-semibold text-brand-600 dark:text-brand-400 cursor-pointer select-none">
            🚀 Ollama로 3분 만에 시작하기
          </summary>
          <ol className="mt-2 ml-4 list-decimal space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
            <li><strong>Ollama 설치하기</strong> — <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">ollama.com</a>에서 다운로드하여 설치합니다.</li>
            <li><strong>AI 모델 다운로드</strong> — 터미널에서 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-[10px]">ollama run llama3</code> 입력</li>
            <li><strong>대화 시작하기</strong> — 모델 준비 완료 후 바로 질문 가능합니다.</li>
          </ol>
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
          {model.isNew && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold">NEW</span>}
        </div>
        <span className="text-xs text-gray-400 font-mono">{model.size}</span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{model.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {model.tags.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-400">#{t}</span>
        ))}
      </div>
      <div className="flex gap-4 text-[10px] text-gray-400 mb-3">
        <span>VRAM: 최소 {model.minVram}GB / 권장 {model.recVram}GB</span>
        <span>RAM: 최소 {model.minRam}GB</span>
        <span>양자화: {model.quant}</span>
      </div>
      {/* Ollama 실행 버튼 */}
      <div className="flex items-center gap-2">
        <code className="flex-1 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded font-mono truncate">{model.ollamaCmd}</code>
        <a href={model.ollamaUrl} target="_blank" rel="noopener noreferrer"
          className="px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-[10px] font-bold hover:opacity-80 transition-opacity whitespace-nowrap">
          Ollama에서 실행 →
        </a>
      </div>
    </div>
  );
}