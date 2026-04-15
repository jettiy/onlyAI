import { useState } from "react";

type TimelineStatus = "released" | "expected" | "rumored";

interface TimelineEvent {
  id: string;
  date: string;
  displayDate: string;
  model: string;
  company: string;
  companyId: string;
  status: TimelineStatus;
  description: string;
  highlights: string[];
  category: "flagship" | "efficient" | "open" | "multimodal";
  isKoreanFriendly?: boolean;
}

const COMPANY_LOGOS: Record<string, string> = {
  openai: '/logos/openai.png',
  anthropic: '/logos/anthropic.jpg',
  google: '/logos/google.png',
  meta: '/logos/meta.jpg',
  xai: '/logos/xai.png',
  minimax: '/logos/minimax.png',
  deepseek: '/logos/deepseek.png',
  alibaba: '/logos/alibaba.png',
  moonshot: '/logos/moonshot.png',
  xiaomi: '/logos/xiaomi.png',
  mistral: '/logos/mistral.jpg',
  zhipu: '/logos/zhipu.png',
  cohere: '/logos/cohere.png',
  nvidia: '/logos/nvidia.png',
};

const STATUS_STYLE: Record<TimelineStatus, { bg: string; text: string; label: string; dot: string }> = {
  released: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", label: "출시됨", dot: "bg-emerald-500" },
  expected: { bg: "bg-brand-50 dark:bg-brand-900/20",    text: "text-brand-600 dark:text-brand-400",    label: "출시 예정", dot: "bg-brand-500" },
  rumored:  { bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-600 dark:text-amber-400",   label: "루머",     dot: "bg-amber-400" },
};

const CAT_COLORS: Record<string, { bar: string; label: string }> = {
  flagship:   { bar: "bg-violet-500", label: "플래그십" },
  efficient:  { bar: "bg-brand-400",   label: "경량·효율" },
  open:       { bar: "bg-emerald-500", label: "오픈소스" },
  multimodal: { bar: "bg-pink-500",   label: "멀티모달" },
};

const EVENTS: TimelineEvent[] = [
  {
    id: "gemma-4", date: "2026-04", displayDate: "2026년 4월 2일",
    model: "Gemma 4 (E2B / E4B / 26B-A4B / 31B)", company: "Google", companyId: "google",
    status: "released", category: "open", isKoreanFriendly: true,
    description: "4개 변종 오픈 가중치 모델. Apache 2.0 라이선스. 31B Dense는 AIME 2026 89.2%, Arena 오픈소스 #3. 하이브리드 어텐션 아키텍처. 엣지 모델은 네이티브 오디오 이해 지원.",
    highlights: ["Apache 2.0 오픈소스", "4개 변종 (2.3B~31B)", "AIME 2026 89.2%", "오디오 이해 (엣지)", "256K 컨텍스트"],
  },
  {
    id: "claude-mythos", date: "2026-03-26", displayDate: "2026년 3월 26일 (유출)",
    model: "Claude Mythos (Capybara)", company: "Anthropic", companyId: "anthropic",
    status: "expected", category: "flagship", isKoreanFriendly: true,
    description: "Anthropic 역대 최강 모델 유출. Opus보다 한 단계 위 티어. 코딩·사이버보안에서 압도적 성능. 보안파트너 우선 접근.",
    highlights: ["Opus보다 상위 티어", "코딩 압도적 성능", "사이버보안 최강", "단계적 출시 예정"],
  },
  {
    id: "mistral-small-4", date: "2026-03-20", displayDate: "2026년 3월 20일",
    model: "Mistral Small 4", company: "Mistral AI", companyId: "mistral",
    status: "released", category: "open", isKoreanFriendly: false,
    description: "119B 파라미터 MoE, 단 6.5B 활성. Apache 2.0 라이선스. 이미지+텍스트 입력, 하이브리드 추론.",
    highlights: ["Apache 2.0 오픈소스", "6.5B 활성 파라미터", "이미지+텍스트", "$0.65/1M 입력"],
  },
  {
    id: "mimo-v2-pro", date: "2026-03-18", displayDate: "2026년 3월 18일",
    model: "MiMo-V2-Pro", company: "Xiaomi", companyId: "xiaomi",
    status: "released", category: "flagship", isKoreanFriendly: false,
    description: "OpenRouter 'Hunter Alpha'로 일일 사용량 1위 달성 후 정체 공개. 1T+ 파라미터 MoE, 1M 컨텍스트.",
    highlights: ["1조 파라미터 MoE", "1M 컨텍스트", "에이전트 특화", "OpenRouter 일일 1위"],
  },
  {
    id: "minimax-m27", date: "2026-03-18", displayDate: "2026년 3월 18일",
    model: "MiniMax M2.7", company: "MiniMax", companyId: "minimax",
    status: "released", category: "flagship", isKoreanFriendly: false,
    description: "자가진화(Self-Evolution) AI. II 49.62, 환각률 최저 수준. $0.53/1M 초저가.",
    highlights: ["II 49.62", "자가진화 기능", "초저가 $0.53/1M", "환각률 최저 티어"],
  },
  {
    id: "grok-420", date: "2026-03-12", displayDate: "2026년 3월 12일",
    model: "Grok 4.20 Beta", company: "xAI", companyId: "xai",
    status: "released", category: "flagship", isKoreanFriendly: false,
    description: "환각률 22% — 역대 최저 기록. 265 tok/s 고속. 멀티 에이전트 아키텍처 도입.",
    highlights: ["환각률 22% 역대 최저", "265 tok/s", "멀티 에이전트 아키텍처", "$2/$6 per 1M"],
  },
  {
    id: "nemotron-3-super", date: "2026-03-11", displayDate: "2026년 3월 11일",
    model: "Nemotron 3 Super", company: "NVIDIA", companyId: "nvidia",
    status: "released", category: "open", isKoreanFriendly: false,
    description: "120B MoE, 12B 활성. GTC 2026 발표. Vera Rubin 플랫폼 기반. Nemotron Coalition 오픈 프론티어.",
    highlights: ["120B MoE (12B 활성)", "NVIDIA 오픈소스", "GTC 2026", "에이전트 툴킷 연동"],
  },
  {
    id: "gpt-5-4", date: "2026-03-06", displayDate: "2026년 3월 6일",
    model: "GPT-5.4", company: "OpenAI", companyId: "openai",
    status: "released", category: "flagship", isKoreanFriendly: true,
    description: "II 57.17로 Gemini와 공동 1위. 네이티브 컴퓨터 사용. 1.1M 컨텍스트. GPT-5.5 (Spud) 사전학습 완료.",
    highlights: ["II 57.17 공동 1위", "컴퓨터 사용 기능", "1.1M 컨텍스트", "$2.50/$15 per 1M"],
  },
  {
    id: "qwen-35", date: "2026-03-05", displayDate: "2026년 3월 5일",
    model: "Qwen 3.5 (0.8B~397B)", company: "Alibaba", companyId: "alibaba",
    status: "released", category: "open", isKoreanFriendly: true,
    description: "8개 변종 동시 출시. 0.8B~9B(밀집), 27B~397B(MoE). 397B II 45.05. 스마트폰 추론 가능.",
    highlights: ["8개 변종", "0.8B 스마트폰 추론", "397B II 45.05", "한국어 우수"],
  },
  {
    id: "gemini-flash-lite", date: "2026-03-03", displayDate: "2026년 3월 3일",
    model: "Gemini 3.1 Flash-Lite", company: "Google", companyId: "google",
    status: "released", category: "efficient", isKoreanFriendly: true,
    description: "Gemini 3.1의 초경량 버전. II 34. 빠른 응답 속도와 낮은 비용. 엣지 배포 최적화.",
    highlights: ["II 34", "초경량·고속", "엣지 배포", "저비용"],
  },
  {
    id: "gemini-3-1", date: "2026-02-19", displayDate: "2026년 2월 19일",
    model: "Gemini 3.1 Pro", company: "Google", companyId: "google",
    status: "released", category: "flagship", isKoreanFriendly: true,
    description: "II 57.18, 13/16 벤치마크 1위. ARC-AGI-2 77.1%, GPQA Diamond 94.3%. Deep Think 조정 가능.",
    highlights: ["II 57.18 종합 1위", "ARC-AGI-2 77.1%", "13/16 벤치마크 1위", "$2/$12 per 1M"],
  },
  {
    id: "kimi-k2-5", date: "2026-02-17", displayDate: "2026년 2월 17일",
    model: "Kimi K2.5", company: "Moonshot", companyId: "moonshot",
    status: "released", category: "multimodal", isKoreanFriendly: false,
    description: "오픈소스 네이티브 멀티모달 에이전트. 1.04T 파라미터. LMSYS Arena 오픈소스 최초 1위. $0.15/1M.",
    highlights: ["LMSYS Arena 오픈소스 1위", "1.04T 파라미터", "에이전트 스웜(100개)", "$0.15/1M"],
  },
  {
    id: "glm-5", date: "2026-02-11", displayDate: "2026년 2월 11일",
    model: "GLM-5", company: "Zhipu AI", companyId: "zhipu",
    status: "released", category: "flagship", isKoreanFriendly: false,
    description: "즈푸AI 최신 플래그십. 744B 파라미터. 에이전트·코딩·긴 작업 특화.",
    highlights: ["744B 파라미터", "에이전트 엔지니어링", "오픈소스", "203K 컨텍스트"],
  },
  {
    id: "claude-4-6", date: "2026-02-05", displayDate: "2026년 2월 5일",
    model: "Claude Opus 4.6 / Sonnet 4.6", company: "Anthropic", companyId: "anthropic",
    status: "released", category: "flagship", isKoreanFriendly: true,
    description: "Sonnet 4.6이 GDPval-AA Elo 1,633점 1위. Opus 4.6은 SWE-bench 80.8%+. Agent Teams(2~16인스턴스) 지원.",
    highlights: ["GDPval-AA Elo 1위", "Agent Teams", "SWE-bench 80.8%+", "1M 컨텍스트(베타)"],
  },
  {
    id: "deepseek-v4", date: "2026-02-05", displayDate: "2026년 2월 5일",
    model: "DeepSeek V4", company: "DeepSeek", companyId: "deepseek",
    status: "released", category: "open", isKoreanFriendly: false,
    description: "NVIDIA GPU 없이 화웨이 Ascend 칩으로 학습한 첫 프론티어 모델. HLE 50.4% 1위. 환각률 1.2%.",
    highlights: ["화웨이 Ascend 학습", "HLE 50.4% 1위", "환각률 1.2%", "$0.11/1M"],
  },
  {
    id: "gpt-5-3-codex", date: "2026-02-05", displayDate: "2026년 2월 5일",
    model: "GPT-5.3 Codex", company: "OpenAI", companyId: "openai",
    status: "released", category: "flagship", isKoreanFriendly: true,
    description: "자가개선 코딩 전용. Terminal-Bench 77.3%, SWE-Bench Pro SOTA. 1,000+ tok/s 초고속.",
    highlights: ["자가개선 코딩", "Terminal-Bench 77.3%", "1,000+ tok/s", "SWE-Bench Pro SOTA"],
  },
  {
    id: "qwen-3", date: "2026-01", displayDate: "2026년 1월",
    model: "Qwen 3-235B", company: "Alibaba", companyId: "alibaba",
    status: "released", category: "flagship", isKoreanFriendly: true,
    description: "MAU 2억 돌파 Qwen 앱 기반 모델. 한·중·영 3개국어 최상위 성능.",
    highlights: ["한국어 A등급", "235B 파라미터", "$0.5/1M 입력", "128K 컨텍스트"],
  },
  {
    id: "llama-4", date: "2025-04", displayDate: "2025년 4월",
    model: "Llama 4 Maverick / Scout", company: "Meta", companyId: "meta",
    status: "released", category: "open", isKoreanFriendly: false,
    description: "Meta 오픈소스 MoE. Scout는 10M(!) 컨텍스트로 업계 최장. 상업 무료.",
    highlights: ["Scout: 10M 컨텍스트", "오픈소스 MoE", "상업 무료", "$0.11/1M (Scout)"],
  },
  {
    id: "gpt-6", date: "2026-Q2", displayDate: "2026년 Q2~Q3 (예상)",
    model: "GPT-5.5 / GPT-6 (Spud)", company: "OpenAI", companyId: "openai",
    status: "expected", category: "flagship", isKoreanFriendly: true,
    description: "사전학습 완료. 안전 평가·레드팀 진행 중. Q2 2026 발표 예상.",
    highlights: ["사전학습 완료", "GPT-5.5 또는 GPT-6 브랜딩", "Q2 발표 예상", "슈퍼앱 통합 예정"],
  },
  {
    id: "claude-mythos-public", date: "2026-Q3", displayDate: "2026년 Q2~Q3 (예상)",
    model: "Claude Mythos 정식 출시", company: "Anthropic", companyId: "anthropic",
    status: "expected", category: "flagship", isKoreanFriendly: true,
    description: "IPO(10월 예상) 전 대규모 모델 출시 예상. Polymarket 6월 출시 확률 높음.",
    highlights: ["IPO 전 출시 예상", "보안 파트너 우선", "안전 평가 기반 출시", "10월 IPO 계획"],
  },
  {
    id: "gemini-3-2", date: "2026-Q2", displayDate: "2026년 Q2~Q3 (예상)",
    model: "Gemini 3.2", company: "Google", companyId: "google",
    status: "expected", category: "flagship", isKoreanFriendly: true,
    description: "Gemini 3.1의 후속. Google I/O 2026 전후 발표 예상.",
    highlights: ["Google I/O 발표 예상", "멀티모달 강화", "긴 컨텍스트"],
  },
  {
    id: "deepseek-v5", date: "2026-Q3", displayDate: "2026년 하반기 (예상)",
    model: "DeepSeek V5", company: "DeepSeek", companyId: "deepseek",
    status: "rumored", category: "open", isKoreanFriendly: false,
    description: "V4의 후속. 화웨이 Ascend 기반 학습 계속 예상.",
    highlights: ["오픈소스 예상", "루머 단계"],
  },
  {
    id: "llama-5", date: "2026-Q4", displayDate: "2026년 하반기 (예상)",
    model: "Llama 5", company: "Meta", companyId: "meta",
    status: "rumored", category: "open", isKoreanFriendly: false,
    description: "Meta 차세대 오픈소스 LLM. 구체적 정보는 아직 없음.",
    highlights: ["오픈소스 예상", "루머 단계"],
  },
];

const FILTER_OPTIONS = [
  { value: "all",      label: "전체" },
  { value: "released", label: "출시됨" },
  { value: "expected", label: "출시 예정" },
  { value: "rumored",  label: "루머" },
];

export default function ExploreTimeline() {
  const [filter, setFilter] = useState<TimelineStatus | "all">("all");
  const [catFilter, setCatFilter] = useState<string>("all");

  const filtered = EVENTS.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (catFilter !== "all" && e.category !== catFilter) return false;
    return true;
  });

  const released = filtered.filter((e) => e.status === "released");
  const upcoming = filtered.filter((e) => e.status !== "released");

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🗓️ AI 모델 출시 타임라인</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          최신 출시 모델 · 예정 모델 · 루머까지 한눈에 정리했어요
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value as typeof filter)}
            className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (
              filter === f.value
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
            )}>
            {f.label}
          </button>
        ))}
        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
        {(["all", "flagship", "efficient", "open", "multimodal"] as const).map((c) => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (
              catFilter === c
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-violet-200"
            )}>
            {c === "all" ? "전체 유형" : CAT_COLORS[c].label}
          </button>
        ))}
      </div>

      {released.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">출시된 모델</h2>
            <span className="text-xs text-gray-400">{released.length}개</span>
          </div>
          <div className="relative">
            <div className="absolute left-[5px] top-4 bottom-4 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-4">
              {released.map((event) => (
                <TimelineCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4 mt-6">
            <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">출시 예정 / 루머</h2>
            <span className="text-xs text-gray-400">{upcoming.length}개</span>
          </div>
          <div className="relative">
            <div
              className="absolute left-[5px] top-4 bottom-4"
              style={{ borderLeft: '1px dashed', borderColor: 'rgb(147 197 253 / 0.7)' }}
            />
            <div className="space-y-4">
              {upcoming.map((event) => (
                <TimelineCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">조건에 맞는 항목이 없어요.</div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
        출시 예정·루머 정보는 공개된 자료 기반이며, 변경될 수 있어요 · 마지막 업데이트: 2026-04-07
      </p>
    </div>
  );
}

function TimelineCard({ event }: { event: TimelineEvent }) {
  const status = STATUS_STYLE[event.status];
  const cat = CAT_COLORS[event.category];

  return (
    <div className="flex gap-4 items-start pl-6">
      <div
        className={`absolute w-[11px] h-[11px] rounded-full border-2 border-white dark:border-gray-950 ${status.dot} flex-shrink-0`}
        style={{ left: 0, marginTop: '14px' }}
      />
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${cat.bar}`} />
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[10px] font-mono text-gray-400">{event.displayDate}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                {event.status === "expected" ? "🔜 " : event.status === "rumored" ? "💬 " : "✅ "}
                {status.label}
              </span>
              <span className="text-[10px] text-gray-400">{cat.label}</span>
              {event.isKoreanFriendly && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded">
                  🇰🇷 한국어 우수
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              {COMPANY_LOGOS[event.companyId] && (
                <div className="w-6 h-6 rounded-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <img
                    src={COMPANY_LOGOS[event.companyId]}
                    alt={event.company}
                    className="w-full h-full object-contain p-[1px]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div>
                <span className="text-[10px] text-gray-400">{event.company}</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{event.model}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{event.description}</p>
            <div className="flex flex-wrap gap-1">
              {event.highlights.map((h) => (
                <span key={h} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
