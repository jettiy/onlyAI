import { useState } from "react";
import { models, type AIModel } from "../../data/models";
import { Search, Brain, Circle, Rabbit } from "lucide-react";

interface SelectedModel extends AIModel {
  benchScores?: {
    mmlu: number;
    humaneval: number;
    math: number;
    gpqa: number;
  };
}

const BENCH_DATA: Record<string, { mmlu: number; humaneval: number; math: number; gpqa: number }> = {
  "GPT-5": { mmlu: 92.1, humaneval: 95.3, math: 91.7, gpqa: 83.2 },
  "Claude Opus 4.6": { mmlu: 91.8, humaneval: 93.7, math: 89.5, gpqa: 84.1 },
  "Claude Sonnet 4.6": { mmlu: 90.3, humaneval: 92.1, math: 87.2, gpqa: 79.8 },
  "Gemini 3.1 Pro": { mmlu: 91.5, humaneval: 91.2, math: 90.8, gpqa: 82.0 },
  "DeepSeek R1": { mmlu: 90.8, humaneval: 90.5, math: 97.3, gpqa: 79.2 },
  "DeepSeek V3.2": { mmlu: 88.5, humaneval: 88.0, math: 89.0, gpqa: 74.1 },
  "Grok 3": { mmlu: 92.7, humaneval: 93.3, math: 93.6, gpqa: 84.6 },
  "MiniMax M2.7": { mmlu: 87.3, humaneval: 85.0, math: 84.0, gpqa: 72.0 },
  "Llama 3.3 70B": { mmlu: 86.0, humaneval: 80.5, math: 77.0, gpqa: 67.3 },
  "Mistral Large 3": { mmlu: 85.0, humaneval: 81.0, math: 79.2, gpqa: 64.0 },
  "GLM-5": { mmlu: 89.0, humaneval: 91.0, math: 88.5, gpqa: 76.0 },
  "MiMo V2 Pro": { mmlu: 86.5, humaneval: 87.0, math: 83.5, gpqa: 70.0 },
  "Qwen3 235B": { mmlu: 88.2, humaneval: 89.5, math: 90.2, gpqa: 75.5 },
  "Kimi K2.5": { mmlu: 87.0, humaneval: 86.0, math: 85.0, gpqa: 73.0 },
  "Gemma 4 31B": { mmlu: 84.5, humaneval: 82.0, math: 78.0, gpqa: 65.0 },
  "Gemini 2.5 Pro": { mmlu: 90.0, humaneval: 89.5, math: 91.0, gpqa: 81.7 },
};

const TIERS: Record<string, { label: string; color: string }> = {
  flagship: { label: "최고 성능", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  strong: { label: "강력", color: "bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300" },
  efficient: { label: "효율", color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  local: { label: "로컬", color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" },
};

const KOREAN_LABELS: Record<string, string> = {
  A: "🇰🇷 매우 우수",
  B: "🇰🇷 우수",
  C: "🇰🇷 보통",
};

function ScoreBar({ label, scores }: { label: string; scores: Record<string, number> }) {
  const maxScore = 100;
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</h4>
      {Object.entries(scores).map(([key, val]) => {
        const pct = (val / maxScore) * 100;
        const color = val >= 90 ? "#22c55e" : val >= 80 ? "#3b82f6" : val >= 70 ? "#f59e0b" : "#ef4444";
        return (
          <div key={key} className="flex items-center gap-2">
            <div className="w-16 text-[10px] text-gray-400 shrink-0 font-mono">{key.toUpperCase()}</div>
            <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <div className="w-10 text-right text-xs font-bold text-gray-900 dark:text-white shrink-0 font-mono">{val.toFixed(1)}</div>
          </div>
        );
      })}
    </div>
  );
}

function ModelCard({ model, rank }: { model: SelectedModel; rank: number }) {
  const bench = model.benchScores || { mmlu: 0, humaneval: 0, math: 0, gpqa: 0 };
  const tier = TIERS[model.tier] || TIERS.strong;
  const hasPrices = model.inputPrice !== null && model.outputPrice !== null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{model.companyId === 'openai' ? <Brain className="inline w-5 h-5" /> : model.companyId === 'anthropic' ? <Brain className="inline w-5 h-5" /> : model.companyId === 'google' ? <Circle className="inline w-5 h-5 fill-blue-500 text-blue-500" /> : model.companyId === 'meta' ? <Rabbit className="inline w-5 h-5" /> : model.companyId === 'deepseek' ? <Rabbit className="inline w-5 h-5" /> : <Brain className="inline w-5 h-5" />}</span>
            <h3 className="text-base font-black text-gray-900 dark:text-white">{model.name}</h3>
            {model.isNew && <span className="text-[9px] font-bold text-red-500">NEW</span>}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{model.company} · {model.region === 'us' ? '🇺🇸' : model.region === 'china' ? '🇨🇳' : '🌍'}</p>
        </div>
        <span className={`px-2 py-0.5 text-[10px] rounded-full font-semibold ${tier.color}`}>{tier.label}</span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{model.description}</p>

      {/* Korean support */}
      {model.koreanSupport && (
        <div className="mb-3 px-3 py-2 bg-brand-50 dark:bg-brand-950/30 rounded-xl">
          <span className="text-xs font-semibold">{KOREAN_LABELS[model.koreanSupport] || `🇰🇷 ${model.koreanSupport}`}</span>
        </div>
      )}

      {/* Specs */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
          <div className="text-[10px] text-gray-400">컨텍스트</div>
          <div className="text-xs font-bold text-gray-900 dark:text-white">{model.contextWindow}</div>
        </div>
        {model.params && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            <div className="text-[10px] text-gray-400">파라미터</div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">{model.params}</div>
          </div>
        )}
        {hasPrices && (
          <>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              <div className="text-[10px] text-gray-400">입력 가격</div>
              <div className="text-xs font-bold text-emerald-600">${model.inputPrice}/1M</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              <div className="text-[10px] text-gray-400">출력 가격</div>
              <div className="text-xs font-bold text-orange-600">${model.outputPrice}/1M</div>
            </div>
          </>
        )}
      </div>

      {/* Benchmarks */}
      {model.benchScores && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <ScoreBar label="벤치마크" scores={bench} />
        </div>
      )}

      {/* Strengths */}
      <div className="mt-3 flex flex-wrap gap-1">
        {model.strengths.slice(0, 4).map((s) => (
          <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 dark:text-gray-400 rounded-full">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ExploreSideBySide() {
  const [selected, setSelected] = useState<SelectedModel[]>([]);

  const allModels = models
    .filter(m => m.isFeatured || m.tier === 'flagship' || m.tier === 'strong')
    .map(m => ({
      ...m,
      benchScores: BENCH_DATA[m.name],
    }));

  const toggle = (m: SelectedModel) => {
    if (selected.find(s => s.id === m.id)) {
      setSelected(prev => prev.filter(s => s.id !== m.id));
    } else if (selected.length < 3) {
      setSelected(prev => [...prev, m]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
          <Search className="inline w-6 h-6 mr-1.5 -mt-0.5 text-brand-500" /> 사이드바이사이드 비교</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          최대 3개 모델을 선택하여 스펙, 가격, 벤치마크를 나란히 비교하세요.
        </p>
      </div>

      {/* Model Selector */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          모델 선택 ({selected.length}/3)
        </h3>
        <div className="flex flex-wrap gap-2">
          {allModels.map(m => {
            const isSelected = selected.some(s => s.id === m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggle(m)}
                disabled={!isSelected && selected.length >= 3}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-brand-600 text-white ring-2 ring-brand-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])} className="mt-2 text-xs text-red-500 hover:text-red-600">
            선택 초기화 ✕
          </button>
        )}
      </div>

      {/* Comparison Cards */}
      {selected.length >= 2 ? (
        <div className="flex flex-col lg:flex-row gap-4">
          {selected.map((m, i) => (
            <ModelCard key={m.id} model={m} rank={i + 1} />
          ))}
        </div>
      ) : selected.length === 1 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-sm text-gray-400">모델을 하나 더 선택하면 비교가 시작됩니다</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-3xl mb-3">👆</p>
          <p className="text-sm text-gray-400">위에서 비교할 모델을 2~3개 선택하세요</p>
        </div>
      )}
    </div>
  );
}
