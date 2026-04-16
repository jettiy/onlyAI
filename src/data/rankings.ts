// OpenRouter 주간/월간 인기 랭킹 데이터
// 출처: OpenRouter Rankings (https://openrouter.ai/rankings)
// 최종 업데이트: 2026-04-16

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

// 주간 Top 10 (토큰 사용량 기준) — 2026-04-16 크롤링
export const WEEKLY_RANKING: RankingEntry[] = [
  { rank: 1,  model: "Claude Opus 4.6",          company: "Anthropic", tokens: "1.39T", tokensNum: 1.39, share: 36, change: "NEW",   category: "flagship", color: "from-amber-400 to-orange-500" },
  { rank: 2,  model: "Claude Sonnet 4.6",        company: "Anthropic", tokens: "1.30T", tokensNum: 1.30, share: 21, change: "+8%",   category: "flagship", color: "from-amber-400 to-orange-500" },
  { rank: 3,  model: "DeepSeek V3.2",            company: "DeepSeek",  tokens: "1.30T", tokensNum: 1.30, share: 7,  change: "+3%",   category: "value",    color: "from-brand-400 to-violet-500" },
  { rank: 4,  model: "MiniMax M2.7",             company: "MiniMax",   tokens: "1.10T", tokensNum: 1.10, share: 4,  change: "+5%",   category: "value",    color: "from-brand-400 to-violet-500" },
  { rank: 5,  model: "MiniMax M2.5",             company: "MiniMax",   tokens: "1.10T", tokensNum: 1.10, share: 4,  change: "+2%",   category: "value",    color: "from-brand-400 to-violet-500" },
  { rank: 6,  model: "Gemini 3 Flash Preview",   company: "Google",    tokens: "1.09T", tokensNum: 1.09, share: 10, change: "NEW",   category: "flagship", color: "from-emerald-400 to-cyan-500" },
  { rank: 7,  model: "MiMo-V2-Pro",              company: "Xiaomi",    tokens: "0.91T", tokensNum: 0.91, share: 17, change: "+12%",  category: "value",    color: "from-brand-400 to-violet-500" },
  { rank: 8,  model: "Nemotron 3 Super",         company: "NVIDIA",    tokens: "0.65T", tokensNum: 0.65, share: 29, change: "NEW",   category: "free",     color: "from-emerald-400 to-green-500" },
  { rank: 9,  model: "Gemini 2.5 Flash",         company: "Google",    tokens: "0.57T", tokensNum: 0.57, share: 19, change: "-5%",   category: "value",    color: "from-brand-400 to-violet-500" },
  { rank: 10, model: "Gemini 2.5 Flash Lite",    company: "Google",    tokens: "0.56T", tokensNum: 0.56, share: 9,  change: "+15%",  category: "value",    color: "from-brand-400 to-violet-500" },
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
  { week: "3월 W1", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.7])) },
  { week: "3월 W2", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.8])) },
  { week: "3월 W3", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.9])) },
  { week: "3월 W4", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum * 0.95])) },
  { week: "4월 W1", ...Object.fromEntries(WEEKLY_RANKING.slice(0, 5).map(m => [m.model, m.tokensNum])) },
];

export const RANKING_SOURCE = "OpenRouter (2026년 4월 16일 크롤링)";
