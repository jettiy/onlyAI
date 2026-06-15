// OpenRouter 주간/월간 인기 랭킹 데이터
// 출처: OpenRouter Rankings (https://openrouter.ai/rankings)
// 최종 업데이트: 2026-06-01

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
  { rank: 1, modelId: 'claude-opus-4-8', name: 'Claude Opus 4.8', company: 'Anthropic', score: 1565, ci: '±15', votes: 8500, rankSpread: '1-3', license: 'proprietary' },
  { rank: 2, modelId: 'gpt-5-5', name: 'GPT-5.5', company: 'OpenAI', score: 1558, ci: '±18', votes: 6200, rankSpread: '2-5', license: 'proprietary' },
  { rank: 3, modelId: 'claude-opus-4-7', name: 'Claude Opus 4.7', company: 'Anthropic', score: 1540, ci: '±28', votes: 6256, rankSpread: '4-17', license: 'proprietary' },
  { rank: 4, modelId: 'gemini-3-1-pro-preview', name: 'Gemini 3.1 Pro Preview', company: 'Google', score: 1530, ci: '±20', votes: 4100, rankSpread: '5-12', license: 'proprietary' },
  { rank: 5, modelId: 'qwen-3-7-max', name: 'Qwen 3.7 Max', company: 'Alibaba', score: 1520, ci: '±22', votes: 3200, rankSpread: '6-15', license: 'proprietary' },
  { rank: 6, modelId: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', company: 'Anthropic', score: 1498, ci: '±10', votes: 5812, rankSpread: '10-19', license: 'proprietary' },
  { rank: 7, modelId: 'gemini-3-5-flash', name: 'Gemini 3.5 Flash', company: 'Google', score: 1490, ci: '±14', votes: 4500, rankSpread: '8-16', license: 'proprietary' },
  { rank: 8, modelId: 'kimi-k2-6', name: 'Kimi K2.6', company: 'Moonshot', score: 1488, ci: '±25', votes: 2800, rankSpread: '10-20', license: 'open' },
  { rank: 9, modelId: 'mimo-v2-5-pro', name: 'MiMo-V2.5-Pro', company: 'Xiaomi', score: 1486, ci: '±24', votes: 2600, rankSpread: '11-22', license: 'open' },
  { rank: 10, modelId: 'grok-4-3', name: 'Grok 4.3', company: 'xAI', score: 1482, ci: '±19', votes: 3800, rankSpread: '12-24', license: 'proprietary' },
  { rank: 11, modelId: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', company: 'DeepSeek', score: 1478, ci: '±23', votes: 3500, rankSpread: '14-26', license: 'open' },
  { rank: 12, modelId: 'glm-5.1', name: 'GLM-5.1', company: 'Zhipu AI', score: 1483, ci: '±26', votes: 489, rankSpread: '18-24', license: 'proprietary' },
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

// 주간 Top 10 (토큰 사용량 기준) — 2026-06-01 업데이트
export const WEEKLY_RANKING: RankingEntry[] = [
  { rank: 1,  model: "Claude Opus 4.8",          company: "Anthropic", tokens: "2.10T", tokensNum: 2.10, share: 28, change: "NEW",   category: "flagship", color: "from-amber-400 to-orange-500" },
  { rank: 2,  model: "GPT-5.5",                  company: "OpenAI",    tokens: "1.80T", tokensNum: 1.80, share: 22, change: "NEW",   category: "flagship", color: "from-emerald-400 to-green-500" },
  { rank: 3,  model: "Claude Sonnet 4.6",        company: "Anthropic", tokens: "1.40T", tokensNum: 1.40, share: 18, change: "+5%",   category: "flagship", color: "from-amber-400 to-orange-500" },
  { rank: 4,  model: "Gemini 3.5 Flash",         company: "Google",    tokens: "1.20T", tokensNum: 1.20, share: 12, change: "NEW",   category: "value",    color: "from-blue-400 to-cyan-500" },
  { rank: 5,  model: "DeepSeek V4 Pro",          company: "DeepSeek",  tokens: "1.10T", tokensNum: 1.10, share: 8,  change: "NEW",   category: "value",    color: "from-brand-400 to-violet-500" },
  { rank: 6,  model: "MiMo-V2.5-Pro",            company: "Xiaomi",    tokens: "0.95T", tokensNum: 0.95, share: 7,  change: "+18%",  category: "value",    color: "from-brand-400 to-violet-500" },
  { rank: 7,  model: "Qwen 3.7 Max",             company: "Alibaba",   tokens: "0.85T", tokensNum: 0.85, share: 6,  change: "NEW",   category: "flagship", color: "from-orange-400 to-red-500" },
  { rank: 8,  model: "Kimi K2.6",                company: "Moonshot",  tokens: "0.75T", tokensNum: 0.75, share: 5,  change: "NEW",   category: "value",    color: "from-indigo-400 to-purple-500" },
  { rank: 9,  model: "Grok 4.3",                 company: "xAI",       tokens: "0.65T", tokensNum: 0.65, share: 4,  change: "NEW",   category: "flagship", color: "from-gray-400 to-slate-500" },
  { rank: 10, model: "GLM-5.1",                  company: "Zhipu AI",  tokens: "0.50T", tokensNum: 0.50, share: 3,  change: "+8%",   category: "value",    color: "from-teal-400 to-emerald-500" },
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

// 시계열 더미 데이터 (향후 API 연동 시 교체)
export const RANKING_TIMELINE = [
  { week: "4월 W1", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.5])) },
  { week: "4월 W2", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.65])) },
  { week: "4월 W3", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.8])) },
  { week: "4월 W4", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.9])) },
  { week: "5월 W1", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.95])) },
  { week: "5월 W2", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum])) },
];

export const RANKING_SOURCE = "OpenRouter + arena.ai Expert (2026년 6월 15일)";
