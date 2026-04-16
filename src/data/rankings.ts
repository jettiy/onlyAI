// OpenRouter 주간/월간 인기 랭킹 데이터 (2026년 4월 기준)
// 출처: OpenRouter (https://openrouter.ai)

export interface RankingEntry {
  rank: number;
  model: string;
  company: string;
  tokens: string;       // e.g. "4.65T"
  tokensNum: number;    // 수치 (T 단위) — 주간 기준
  change: string;       // e.g. "+12%", "-3%", "NEW"
}

// 주간 Top 10 (토큰 사용량 기준)
export const WEEKLY_RANKING: RankingEntry[] = [
  { rank: 1,  model: "MiMo-V2-Pro",            company: "Xiaomi",   tokens: "4.65T", tokensNum: 4.65, change: "+12%" },
  { rank: 2,  model: "Claude Sonnet 4.6",       company: "Anthropic", tokens: "2.18T", tokensNum: 2.18, change: "-3%" },
  { rank: 3,  model: "MiniMax M2.7",            company: "MiniMax",   tokens: "1.92T", tokensNum: 1.92, change: "+5%" },
  { rank: 4,  model: "DeepSeek V3.2",           company: "DeepSeek",  tokens: "1.22T", tokensNum: 1.22, change: "+3%" },
  { rank: 5,  model: "Qwen 3.6 Plus",           company: "Alibaba",   tokens: "1.10T", tokensNum: 1.10, change: "NEW" },
  { rank: 6,  model: "Claude Opus 4.6",          company: "Anthropic", tokens: "1.01T", tokensNum: 1.01, change: "+1%" },
  { rank: 7,  model: "GPT-5.4",                 company: "OpenAI",    tokens: "0.98T", tokensNum: 0.98, change: "-8%" },
  { rank: 8,  model: "Gemini 3.1 Pro",           company: "Google",    tokens: "0.87T", tokensNum: 0.87, change: "+2%" },
  { rank: 9,  model: "Kimi K2",                 company: "Moonshot",  tokens: "0.74T", tokensNum: 0.74, change: "-1%" },
  { rank: 10, model: "Gemini 3.1 Flash Lite",    company: "Google",    tokens: "0.68T", tokensNum: 0.68, change: "+15%" },
];

// 월간 Top 10 (주간 × 4 추정)
export const MONTHLY_RANKING: RankingEntry[] = WEEKLY_RANKING.map((e) => {
  const monthNum = Math.round(e.tokensNum * 4 * 100) / 100;
  return {
    ...e,
    tokens: `${monthNum}T`,
    tokensNum: monthNum,
  };
});

export const RANKING_SOURCE = "OpenRouter (2026년 4월 기준)";
