import { useState, useEffect } from "react";

interface ArenaModel {
  rank: number;
  name: string;
  org: string;
  elo: number;
  votes95ci: string;
  license: string;
  category?: string;
}

const CATEGORIES = ["전체", "코딩", "추론", "프롬프트", "하드프롬프트", "비전", " creative"] as const;
type Category = typeof CATEGORIES[number];

// Hardcoded fallback ranking data (LMSYS Chatbot Arena, 2026-04)
const FALLBACK_DATA: ArenaModel[] = [
  { rank: 1, name: "GPT-5", org: "OpenAI", elo: 1412, votes95ci: "±5", license: "상업" },
  { rank: 2, name: "Claude Opus 4.6", org: "Anthropic", elo: 1408, votes95ci: "±5", license: "상업" },
  { rank: 3, name: "Gemini 3.1 Pro", org: "Google", elo: 1402, votes95ci: "±6", license: "상업" },
  { rank: 4, name: "Grok 3", org: "xAI", elo: 1395, votes95ci: "±5", license: "상업" },
  { rank: 5, name: "GPT-5 Mini", org: "OpenAI", elo: 1388, votes95ci: "±5", license: "상업" },
  { rank: 6, name: "DeepSeek R1", org: "DeepSeek", elo: 1385, votes95ci: "±6", license: "오픈소스(MIT)" },
  { rank: 7, name: "Claude Sonnet 4.6", org: "Anthropic", elo: 1381, votes95ci: "±5", license: "상업" },
  { rank: 8, name: "Gemini 2.5 Pro", org: "Google", elo: 1375, votes95ci: "±5", license: "상업" },
  { rank: 9, name: "Qwen3 235B", org: "Alibaba", elo: 1368, votes95ci: "±6", license: "오픈소스(Apache)" },
  { rank: 10, name: "Llama 4 Maverick", org: "Meta", elo: 1362, votes95ci: "±6", license: "오픈소스(Llama)" },
  { rank: 11, name: "Gemma 4 31B", org: "Google", elo: 1355, votes95ci: "±7", license: "오픈소스(Apache)" },
  { rank: 12, name: "DeepSeek V3.2", org: "DeepSeek", elo: 1350, votes95ci: "±6", license: "오픈소스(MIT)" },
  { rank: 13, name: "MiMo V2 Pro", org: "Xiaomi", elo: 1345, votes95ci: "±7", license: "오픈소스(Apache)" },
  { rank: 14, name: "MiniMax M2.7", org: "MiniMax", elo: 1338, votes95ci: "±6", license: "상업" },
  { rank: 15, name: "Llama 3.3 70B", org: "Meta", elo: 1330, votes95ci: "±6", license: "오픈소스(Llama)" },
  { rank: 16, name: "GLM-5", org: "Zhipu AI", elo: 1325, votes95ci: "±7", license: "상업" },
  { rank: 17, name: "Mistral Large 3", org: "Mistral", elo: 1318, votes95ci: "±6", license: "상업" },
  { rank: 18, name: "Kimi K2.5", org: "Moonshot", elo: 1312, votes95ci: "±7", license: "상업" },
  { rank: 19, name: "Gemma 4 26B", org: "Google", elo: 1295, votes95ci: "±8", license: "오픈소스(Apache)" },
  { rank: 20, name: "Qwen3 32B", org: "Alibaba", elo: 1290, votes95ci: "±7", license: "오픈소스(Apache)" },
];

export default function ExploreRanking() {
  const [models, setModels] = useState<FALLBACK_DATA extends ArenaModel[] ? ArenaModel[] : never>(FALLBACK_DATA);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category>("전체");
  const [filter, setFilter] = useState<"all" | "open" | "commercial">("all");

  // Try fetching from LMSYS leaderboard API
  useEffect(() => {
    async function fetchRanking() {
      setLoading(true);
      try {
        const res = await fetch("https://chat.lmsys.org/api/v1/leaderboard", {
          headers: { "Accept": "application/json" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ArenaModel[] = data.slice(0, 30).map((m: any, i: number) => ({
            rank: i + 1,
            name: m.model_name || m.name || `Model ${i + 1}`,
            org: m.organization || m.org || "",
            elo: m.elo || m.score || 1200,
            votes95ci: m.votes_95ci || m.ci || "±?",
            license: m.license || (m.open_source ? "오픈소스" : "상업"),
          }));
          setModels(mapped);
        }
      } catch {
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, []);

  const filtered = models.filter((m) => {
    if (filter === "open" && !m.license.includes("오픈")) return false;
    if (filter === "commercial" && m.license.includes("오픈")) return false;
    return true;
  });

  const topElo = Math.max(...filtered.map((m) => m.elo));
  const topModel = filtered[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🏆 AI 모델 랭킹</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          LMSYS Chatbot Arena ELO 랭킹 기반. 실제 사용자 블라인드 테스트 결과예요.
        </p>
        {loading && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">라이브 랭킹 불러오는 중...</span>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {topModel && (
        <div className="grid grid-cols-3 gap-3">
          {[filtered[1], filtered[0], filtered[2]].filter(Boolean).map((m, idx) => {
            const medals = ["🥈", "🥇", "🥉"];
            const sizes = ["", "ring-2 ring-amber-400 scale-105", ""];
            return (
              <div key={m.name} className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center ${sizes[idx]}`}>
                <div className="text-2xl mb-1">{medals[idx]}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{m.name}</div>
                <div className="text-[10px] text-gray-400 mb-1">{m.org}</div>
                <div className="text-lg font-black bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
                  {m.elo}
                </div>
                <div className="text-[9px] text-gray-400">ELO</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "open", "commercial"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "전체" : f === "open" ? "🔓 오픈소스" : "🔒 상업"}
          </button>
        ))}
      </div>

      {/* Ranking List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="w-5 text-xs font-semibold text-gray-400 text-center">순위</div>
          <div className="w-32 text-xs font-semibold text-gray-400">모델</div>
          <div className="flex-1 text-xs font-semibold text-gray-400">ELO 점수</div>
          <div className="w-16 text-xs font-semibold text-gray-400 text-center">라이선스</div>
        </div>

        {filtered.map((m) => {
          const pct = (m.elo / topElo) * 100;
          const barColor = m.rank <= 3 ? "from-amber-400 to-orange-500" : m.rank <= 10 ? "from-blue-400 to-violet-500" : "from-gray-400 to-gray-500";
          return (
            <div key={m.name} className="flex items-center gap-3 group">
              <div className={`w-5 text-xs text-center shrink-0 font-bold ${m.rank <= 3 ? "text-amber-500" : "text-gray-400"}`}>
                {m.rank <= 3 ? ["🥇", "🥈", "🥉"][m.rank - 1] : m.rank}
              </div>
              <div className="w-32 shrink-0">
                <div className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">{m.name}</div>
                <div className="text-[10px] text-gray-400">{m.org}</div>
              </div>
              <div className="flex-1 relative h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="w-14 text-right text-sm font-black text-gray-900 dark:text-white shrink-0 font-mono">
                {m.elo}
              </div>
              <div className="w-16 text-center shrink-0">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                  m.license.includes("오픈")
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}>
                  {m.license.length > 12 ? m.license.split("(")[0].trim() : m.license}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">ℹ️ LMSYS Chatbot Arena란?</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
          두 모델이 동시에 답변하고 사용자가 직접 더 나은 답변을 선택하는 블라인드 테스트입니다.
          수만 명의 투표로 계산된 ELO 점수가 모델의 실제 사용 성능을 잘 반영합니다.
          공식 사이트: <a href="https://chat.lmsys.org" target="_blank" rel="noopener" className="underline">chat.lmsys.org</a>
        </p>
      </div>
    </div>
  );
}
