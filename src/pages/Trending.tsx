import { useState } from "react";
import { useOpenRouterModels } from "../hooks/useOpenRouterModels";

const githubTrending = [
  { rank: 1, name: "browser-use/browser-use", url: "https://github.com/browser-use/browser-use", stars: "56.7k", weeklyStars: "+8.3k", desc: "AI가 브라우저를 직접 조작하는 라이브러리. Playwright 기반 웹 에이전트.", lang: "Python", tags: ["AI 에이전트", "브라우저"] },
  { rank: 2, name: "langchain-ai/open-swe", url: "https://github.com/langchain-ai/open-swe", stars: "48.2k", weeklyStars: "+8.1k", desc: "오픈소스 소프트웨어 엔지니어 에이전트. GitHub 이슈를 AI가 자동 해결.", lang: "Python", tags: ["에이전트", "코딩"] },
  { rank: 3, name: "unslothai/unsloth", url: "https://github.com/unslothai/unsloth", stars: "41.7k", weeklyStars: "+5.3k", desc: "LLM 파인튜닝을 2~5배 빠르게. 메모리 70% 절감.", lang: "Python", tags: ["파인튜닝", "효율화"] },
  { rank: 4, name: "deepseek-ai/DeepSeek-V3", url: "https://github.com/deepseek-ai/DeepSeek-V3", stars: "94.1k", weeklyStars: "+4.6k", desc: "DeepSeek V3 공식 모델 저장소. MoE 아키텍처로 오픈소스 1위 탈환.", lang: "Python", tags: ["LLM", "오픈소스"] },
  { rank: 5, name: "Significant-Gravitas/AutoGPT", url: "https://github.com/Significant-Gravitas/AutoGPT", stars: "183k", weeklyStars: "+3.9k", desc: "자율 AI 에이전트의 선구자. 목표를 주면 스스로 계획·실행.", lang: "Python", tags: ["에이전트", "자율화"] },
  { rank: 6, name: "ggerganov/llama.cpp", url: "https://github.com/ggerganov/llama.cpp", stars: "78.3k", weeklyStars: "+3.2k", desc: "CPU에서 LLM을 실행하는 경량 C++ 구현체. 로컬 AI의 핵심.", lang: "C++", tags: ["로컬 AI", "추론"] },
  { rank: 7, name: "microsoft/BitNet", url: "https://github.com/microsoft/BitNet", stars: "15.4k", weeklyStars: "+2.8k", desc: "1-bit 가중치로 LLM을 경량화. CPU 추론 속도 혁신.", lang: "C++", tags: ["효율화", "경량화"] },
];

const clawhubTrending = [
  { rank: 1, name: "minimax-docx", url: "https://clawhub.com/skills/minimax-docx", stars: "4.2k", desc: "Word 문서 자동 생성 스킬. 보고서·계약서 양식 자동화.", installs: "18.7k", badge: "인기" },
  { rank: 2, name: "china-stock-analysis", url: "https://clawhub.com/skills/china-stock-analysis", stars: "3.1k", desc: "중국·홍콩 주식 실시간 분석. EastMoney API 기반.", installs: "12.3k", badge: "" },
  { rank: 3, name: "web-scraper-pro", url: "https://clawhub.com/skills/web-scraper-pro", stars: "2.8k", desc: "고급 웹 스크래핑. Playwright 기반, 동적 페이지 지원.", installs: "9.8k", badge: "" },
  { rank: 4, name: "rss-aggregator", url: "https://clawhub.com/skills/rss-aggregator", stars: "2.4k", desc: "RSS 피드 수집·요약 자동화. 뉴스 모니터링에 최적.", installs: "8.2k", badge: "" },
  { rank: 5, name: "eastmoney-stock", url: "https://clawhub.com/skills/eastmoney-stock", stars: "1.9k", desc: "이스트머니 주식 실시간 데이터. 중국A주·홍콩 종목 조회.", installs: "6.5k", badge: "신규" },
];

const langColors: Record<string, string> = {
  "TypeScript": "bg-blue-100 text-blue-600",
  "Python": "bg-yellow-100 text-yellow-700",
  "C++": "bg-red-100 text-red-600",
};

type Tab = "github" | "clawhub" | "openrouter";

export default function Trending() {
  const [tab, setTab] = useState<Tab>("github");
  const { data: orModels, loading: orLoading, lastUpdated } = useOpenRouterModels();

  const tabs = [
    { id: "github" as Tab, label: "GitHub 트렌딩" },
    { id: "clawhub" as Tab, label: "ClawHub 스킬" },
    { id: "openrouter" as Tab, label: "실시간 모델 가격", badge: "LIVE" },
  ];

  const btnClass = (t: Tab) =>
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors " + (
      tab === t ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">이번 주 트렌딩</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">2026년 3월 셋째 주 기준. OpenRouter 탭은 실시간 데이터예요.</p>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={btnClass(t.id)}>
            {t.label}
            {t.badge && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded-full font-bold animate-pulse">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "github" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">주간 Star 수 기준 AI 카테고리 상위 5개</p>
          {githubTrending.map((repo) => (
            <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-2xl font-bold text-gray-200 dark:text-gray-700">#{repo.rank}</span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{repo.name}</h3>
                    {repo.lang && <span className={(langColors[repo.lang] || "bg-gray-100 text-gray-600") + " px-2 py-0.5 text-xs rounded-full font-medium"}>{repo.lang}</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{repo.desc}</p>
                  <div className="flex flex-wrap gap-1 items-center">
                    {repo.tags.map((t) => <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">{t}</span>)}
                    <span className="ml-auto text-xs text-blue-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">GitHub에서 보기 ↗</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-gray-900 dark:text-white">⭐ {repo.stars}</p>
                  <p className="text-sm text-green-600 font-medium">{repo.weeklyStars} 이번 주</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {tab === "clawhub" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">ClawHub 주간 설치수 기준 상위 5개 스킬</p>
          {clawhubTrending.map((skill) => (
            <a key={skill.name} href={skill.url} target="_blank" rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-2xl font-bold text-gray-200 dark:text-gray-700">#{skill.rank}</span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white font-mono group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{skill.name}</h3>
                    {skill.badge && <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">{skill.badge}</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{skill.desc}</p>
                  <span className="text-xs text-purple-400 group-hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1 inline-block">ClawHub에서 보기 ↗</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-gray-900 dark:text-white">⭐ {skill.stars}</p>
                  <p className="text-sm text-gray-400">{skill.installs} 설치</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {tab === "openrouter" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-gray-400">OpenRouter API 실시간 모델 목록 (최저가순)</p>
            {lastUpdated && <span className="text-xs text-green-500 font-medium">· {lastUpdated.toLocaleTimeString("ko-KR")} 갱신</span>}
          </div>
          {orLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : orModels.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-gray-400 text-sm">OpenRouter API를 불러오지 못했어요.</p>
            </div>
          ) : (
            [...orModels]
              .sort((a, b) => parseFloat(a.pricing.prompt) - parseFloat(b.pricing.prompt))
              .map((model, i) => {
                const inp = parseFloat(model.pricing.prompt) * 1_000_000;
                const out = parseFloat(model.pricing.completion) * 1_000_000;
                return (
                  <div key={model.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-200 transition-colors">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-300 dark:text-gray-600">#{i + 1}</span>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{model.name}</h3>
                          {inp === 0 && <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">무료</span>}
                        </div>
                        <p className="text-xs text-gray-400 truncate font-mono">{model.id}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {inp === 0
                          ? <p className="text-sm font-bold text-green-600">무료</p>
                          : <>
                              <p className="text-xs font-semibold text-gray-900 dark:text-white">입력 ${inp.toFixed(3)}</p>
                              <p className="text-xs font-semibold text-gray-900 dark:text-white">출력 ${out.toFixed(3)}</p>
                            </>
                        }
                        <p className="text-xs text-gray-400">{(model.context_length / 1000).toFixed(0)}K ctx</p>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
}
