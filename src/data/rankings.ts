// OpenRouter 주간/월간 인기 랭킹 데이터
// 출처: OpenRouter Rankings (https://openrouter.ai/rankings)
// 최종 업데이트: 2026-06-15

export interface ArenaExpertEntry {
  rank: number;
  modelId: string;
  name: string;
  company: string;
  score: number;
  ci: string;
  votes: number;
  rankSpread: string;
  license: 'proprietary' | 'open';
}

export const ARENA_EXPERT_TOP20: ArenaExpertEntry[] = [
  { rank: 1, modelId: 'claude-fable-5', name: 'Claude Fable 5', company: 'Anthropic', score: 1582, ci: '±12', votes: 9200, rankSpread: '1-2', license: 'proprietary' },
  { rank: 2, modelId: 'gpt-5-5-pro', name: 'GPT-5.5 Pro', company: 'OpenAI', score: 1568, ci: '±16', votes: 7800, rankSpread: '1-4', license: 'proprietary' },
  { rank: 3, modelId: 'claude-opus-4-8', name: 'Claude Opus 4.8', company: 'Anthropic', score: 1565, ci: '±15', votes: 8500, rankSpread: '2-6', license: 'proprietary' },
  { rank: 4, modelId: 'claude-mythos-5', name: 'Claude Mythos 5', company: 'Anthropic', score: 1555, ci: '±18', votes: 3200, rankSpread: '3-8', license: 'proprietary' },
  { rank: 5, modelId: 'claude-opus-4-7', name: 'Claude Opus 4.7', company: 'Anthropic', score: 1540, ci: '±28', votes: 6256, rankSpread: '5-17', license: 'proprietary' },
  { rank: 6, modelId: 'gemini-3-5-pro', name: 'Gemini 3.5 Pro', company: 'Google', score: 1535, ci: '±17', votes: 4800, rankSpread: '4-10', license: 'proprietary' },
  { rank: 7, modelId: 'gemini-3-1-pro-preview', name: 'Gemini 3.1 Pro Preview', company: 'Google', score: 1530, ci: '±20', votes: 4100, rankSpread: '5-12', license: 'proprietary' },
  { rank: 8, modelId: 'qwen-3-7-max', name: 'Qwen 3.7 Max', company: 'Alibaba', score: 1520, ci: '±22', votes: 3200, rankSpread: '6-15', license: 'proprietary' },
  { rank: 9, modelId: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', company: 'Anthropic', score: 1498, ci: '±10', votes: 5812, rankSpread: '10-19', license: 'proprietary' },
  { rank: 10, modelId: 'gemini-3-5-flash', name: 'Gemini 3.5 Flash', company: 'Google', score: 1490, ci: '±14', votes: 4500, rankSpread: '8-16', license: 'proprietary' },
  { rank: 11, modelId: 'kimi-k2-6', name: 'Kimi K2.6', company: 'Moonshot', score: 1488, ci: '±25', votes: 2800, rankSpread: '10-20', license: 'open' },
  { rank: 12, modelId: 'nvidia-nemotron-3-ultra', name: 'NVIDIA Nemotron 3 Ultra', company: 'NVIDIA', score: 1487, ci: '±21', votes: 2100, rankSpread: '9-18', license: 'proprietary' },
  { rank: 13, modelId: 'mimo-v2-5-pro', name: 'MiMo-V2.5-Pro', company: 'Xiaomi', score: 1486, ci: '±24', votes: 2600, rankSpread: '11-22', license: 'open' },
  { rank: 14, modelId: 'grok-4-3', name: 'Grok 4.3', company: 'xAI', score: 1482, ci: '±19', votes: 3800, rankSpread: '12-24', license: 'proprietary' },
  { rank: 15, modelId: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', company: 'DeepSeek', score: 1478, ci: '±23', votes: 3500, rankSpread: '14-26', license: 'open' },
  { rank: 16, modelId: 'glm-5.1', name: 'GLM-5.1', company: 'Zhipu AI', score: 1483, ci: '±26', votes: 489, rankSpread: '18-24', license: 'proprietary' },
];

export interface RankingEntry {
  rank: number;
  model: string;
  company: string;
  tokens: string;       // e.g. "1.39T"
  tokensNum: number;    // 수치 (T 단위) — 바 차트용
  share: number;        // 점유율 % (e.g. 36)
  change: string;       // e.g. "+12%", "-3%", "NEW"
  category: string;     // e.g. "flagship", "value", "free"
  color: string;        // 차트 색상 (tailwind gradient)
}

// 주간 Top 10 (토큰 사용량 기준) — 2026-06-15 업데이트
export const WEEKLY_RANKING: RankingEntry[] = [
  { rank: 1,  model: "Claude Fable 5",            company: "Anthropic", tokens: "2.50T", tokensNum: 2.50, share: 30, change: "NEW",   category: "flagship", color: "from-amber-400 to-orange-500" },
  { rank: 2,  model: "GPT-5.5 Pro",              company: "OpenAI",    tokens: "1.90T", tokensNum: 1.90, share: 22, change: "+5%",   category: "flagship", color: "from-emerald-400 to-green-500" },
  { rank: 3,  model: "Claude Opus 4.8",          company: "Anthropic", tokens: "1.55T", tokensNum: 1.55, share: 16, change: "-10%",  category: "flagship", color: "from-amber-400 to-orange-500" },
  { rank: 4,  model: "Claude Sonnet 4.6",        company: "Anthropic", tokens: "1.30T", tokensNum: 1.30, share: 14, change: "-4%",   category: "flagship", color: "from-amber-400 to-orange-500" },
  { rank: 5,  model: "Gemini 3.5 Pro",          company: "Google",    tokens: "1.15T", tokensNum: 1.15, share: 10, change: "NEW",   category: "flagship", color: "from-blue-400 to-cyan-500" },
  { rank: 6,  model: "Gemini 3.5 Flash",         company: "Google",    tokens: "1.05T", tokensNum: 1.05, share: 9,  change: "-3%",   category: "value",    color: "from-blue-400 to-cyan-500" },
  { rank: 7,  model: "DeepSeek V4 Pro",          company: "DeepSeek",  tokens: "0.98T", tokensNum: 0.98, share: 8,  change: "+12%",  category: "value",    color: "from-brand-400 to-violet-500" },
  { rank: 8,  model: "MiniMax M3",               company: "MiniMax",   tokens: "0.82T", tokensNum: 0.82, share: 7,  change: "NEW",   category: "value",    color: "from-pink-400 to-rose-500" },
  { rank: 9,  model: "Kimi K2.6",                company: "Moonshot",  tokens: "0.72T", tokensNum: 0.72, share: 5,  change: "-8%",   category: "value",    color: "from-indigo-400 to-purple-500" },
  { rank: 10, model: "Qwen 3.7 Max",             company: "Alibaba",   tokens: "0.65T", tokensNum: 0.65, share: 4,  change: "-15%",  category: "value",    color: "from-orange-400 to-red-500" },
];

// 월간 Top 10 (주간 × 4 추정 — 실제 월간 크롤링 데이터로 교체 필요)
export const MONTHLY_RANKING: RankingEntry[] = WEEKLY_RANKING.map((e) => {
  const monthNum = Math.round(e.tokensNum * 4 * 100) / 100;
  return {
    ...e,
    tokens: `${monthNum}T`,
    tokensNum: monthNum,
  };
});

// ───────────────────────── 카테고리별 랭킹 ─────────────────────────

export interface CategoryRankingEntry {
  rank: number;
  model: string;
  modelId: string;
  company: string;
  highlight: string;   // 주요 성능 지표 (e.g. "SWE-bench 78%")
  badge?: string;       // "NEW", "↑3", "HOT"
}

// 코딩 랭킹 — 2026-06-15
export const CODING_RANKING: CategoryRankingEntry[] = [
  { rank: 1, model: "Claude Fable 5",          modelId: "claude-fable-5",        company: "Anthropic",  highlight: "SWE-bench 92%",   badge: "NEW" },
  { rank: 2, model: "GPT-5.5 Pro",            modelId: "gpt-5-5-pro",           company: "OpenAI",      highlight: "SWE-bench 88%" },
  { rank: 3, model: "MAI-Code-1-Flash",       modelId: "mai-code-1-flash",      company: "MAI",        highlight: "SWE-bench 85%",   badge: "NEW" },
  { rank: 4, model: "Claude Opus 4.8",        modelId: "claude-opus-4-8",       company: "Anthropic",  highlight: "SWE-bench 83%" },
  { rank: 5, model: "Kimi K2.7 Code",         modelId: "kimi-k2-7-code",        company: "Moonshot",   highlight: "SWE-bench 81%",   badge: "NEW" },
  { rank: 6, model: "Claude Sonnet 4.6",      modelId: "claude-sonnet-4-6",     company: "Anthropic",  highlight: "SWE-bench 79%" },
  { rank: 7, model: "Gemini 3.5 Pro",         modelId: "gemini-3-5-pro",        company: "Google",     highlight: "SWE-bench 76%" },
  { rank: 8, model: "DeepSeek V4 Pro",        modelId: "deepseek-v4-pro",       company: "DeepSeek",   highlight: "SWE-bench 74%" },
  { rank: 9, model: "NVIDIA Nemotron 3 Ultra", modelId: "nvidia-nemotron-3-ultra", company: "NVIDIA",  highlight: "SWE-bench 72%",   badge: "NEW" },
  { rank: 10, model: "MiMo-V2.5-Pro",         modelId: "mimo-v2-5-pro",         company: "Xiaomi",     highlight: "SWE-bench 69%" },
];

// 추론 랭킹 — 2026-06-15
export const REASONING_RANKING: CategoryRankingEntry[] = [
  { rank: 1, model: "MAI-Thinking-1",         modelId: "mai-thinking-1",        company: "MAI",        highlight: "AIME 97%",       badge: "NEW" },
  { rank: 2, model: "Claude Fable 5",         modelId: "claude-fable-5",        company: "Anthropic",  highlight: "AIME 96%",       badge: "NEW" },
  { rank: 3, model: "GPT-5.5 Pro",           modelId: "gpt-5-5-pro",           company: "OpenAI",     highlight: "AIME 95%" },
  { rank: 4, model: "Claude Opus 4.8",        modelId: "claude-opus-4-8",       company: "Anthropic",  highlight: "AIME 94%" },
  { rank: 5, model: "Claude Mythos 5",        modelId: "claude-mythos-5",       company: "Anthropic",  highlight: "AIME 93%",       badge: "NEW" },
  { rank: 6, model: "Gemini 3.5 Pro",         modelId: "gemini-3-5-pro",        company: "Google",     highlight: "AIME 91%" },
  { rank: 7, model: "Claude Opus 4.7",        modelId: "claude-opus-4-7",       company: "Anthropic",  highlight: "AIME 89%" },
  { rank: 8, model: "Qwen 3.7 Max",           modelId: "qwen-3-7-max",          company: "Alibaba",    highlight: "AIME 87%" },
  { rank: 9, model: "DeepSeek V4 Pro",        modelId: "deepseek-v4-pro",       company: "DeepSeek",   highlight: "AIME 85%" },
  { rank: 10, model: "Kimi K2.6",             modelId: "kimi-k2-6",             company: "Moonshot",   highlight: "AIME 83%" },
];

// 가성비 랭킹 — 2026-06-15
export const VALUE_RANKING: CategoryRankingEntry[] = [
  { rank: 1, model: "DeepSeek V4 Pro",        modelId: "deepseek-v4-pro",       company: "DeepSeek",   highlight: "$0.08/M tokens (75% off)", badge: "HOT" },
  { rank: 2, model: "MiniMax M3",             modelId: "minimax-m3",            company: "MiniMax",    highlight: "$0.05/M tokens",       badge: "NEW" },
  { rank: 3, model: "Gemini 3.5 Flash",       modelId: "gemini-3-5-flash",      company: "Google",     highlight: "$0.10/M tokens" },
  { rank: 4, model: "MAI-Code-1-Flash",       modelId: "mai-code-1-flash",      company: "MAI",        highlight: "$0.06/M tokens",       badge: "NEW" },
  { rank: 5, model: "Kimi K2.6",              modelId: "kimi-k2-6",             company: "Moonshot",   highlight: "$0.08/M tokens" },
  { rank: 6, model: "Kimi K2.7 Code",         modelId: "kimi-k2-7-code",        company: "Moonshot",   highlight: "$0.07/M tokens",       badge: "NEW" },
  { rank: 7, model: "Qwen 3.7 Max",           modelId: "qwen-3-7-max",          company: "Alibaba",    highlight: "$0.12/M tokens" },
  { rank: 8, model: "GLM-5.1",                modelId: "glm-5.1",               company: "Zhipu AI",   highlight: "$0.10/M tokens" },
  { rank: 9, model: "MiMo-V2.5-Pro",          modelId: "mimo-v2-5-pro",         company: "Xiaomi",     highlight: "$0.09/M tokens" },
  { rank: 10, model: "Claude Sonnet 4.6",     modelId: "claude-sonnet-4-6",     company: "Anthropic",  highlight: "$3.00/M tokens" },
];

// 시계열 더미 데이터 (향후 API 연동 시 교체)
export const RANKING_TIMELINE = [
  { week: "5월 W1", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.55])) },
  { week: "5월 W2", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.65])) },
  { week: "5월 W3", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.75])) },
  { week: "5월 W4", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.88])) },
  { week: "6월 W1", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.95])) },
  { week: "6월 W2", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum])) },
];

export const RANKING_SOURCE = "OpenRouter + arena.ai Expert (2026년 6월 15일)";
