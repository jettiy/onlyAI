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
};

const STATUS_STYLE: Record<TimelineStatus, { bg: string; text: string; label: string; dot: string }> = {
  released: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", label: "출시됨", dot: "bg-emerald-500" },
  expected: { bg: "bg-blue-50 dark:bg-blue-900/20",    text: "text-blue-600 dark:text-blue-400",    label: "출시 예정", dot: "bg-blue-500" },
  rumored:  { bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-600 dark:text-amber-400",   label: "루머",     dot: "bg-amber-400" },
};

const CAT_COLORS: Record<string, { bar: string; label: string }> = {
  flagship:   { bar: "bg-violet-500", label: "플래그십" },
  efficient:  { bar: "bg-blue-400",   label: "경량·효율" },
  open:       { bar: "bg-emerald-500", label: "오픈소스" },
  multimodal: { bar: "bg-pink-500",   label: "멀티모달" },
};

const EVENTS: TimelineEvent[] = [
  {
    id: "mimo-v2-pro", date: "2026-03", displayDate: "2026년 3월 18일",
    model: "MiMo-V2-Pro", company: "Xiaomi", companyId: "xiaomi",
    status: "released", category: "flagship", isKoreanFriendly: false,
    description: "OpenRouter 'Hunter Alpha'로 일일 사용량 1위 달성 후 정체 공개. 1T+ 파라미터 MoE, 1M 컨텍스트.",
    highlights: ["1조 파라미터 MoE", "1M 컨텍스트", "에이전트 특화", "OpenRouter 일일 1위"],
  },
  {
    id: "minimax-m27", date: "2026-03", displayDate: "2026년 3월 17일",
    model: "MiniMax M2.7", company: "MiniMax", companyId: "minimax",
    status: "released", category: "flagship", isKoreanFriendly: false,
    description: "자가진화(Self-Evolution) AI. 소프트웨어 엔지니어링 50% 자동화. Agent Teams 기능.",
    highlights: ["자가진화 기능", "에이전트 팀", "소프트웨어 엔지니어링", "$0.30/1M 입력"],
  },
  {
    id: "gpt-5-4", date: "2026-03", displayDate: "2026년 3월 5일",
    model: "GPT-5.4", company: "OpenAI", companyId: "openai",
    status: "released", category: "flagship", isKoreanFriendly: true,
    description: "네이티브 컴퓨터 사용 기능 탑재. 1.1M 컨텍스트. 전문 업무 에이전트 최강.",
    highlights: ["컴퓨터 사용 기능", "1.1M 컨텍스트", "GPT-5.4 mini 동시 출시", "$2.50/1M 입력"],
  },
  {
    id: "claude-4-6", date: "2026-02", displayDate: "2026년 2월 5일",
    model: "Claude Opus 4.6 / Sonnet 4.6", company: "Anthropic", companyId: "anthropic",
    status: "released", category: "flagship", isKoreanFriendly: true,
    description: "500개 이상 오픈소스 보안취약점 자동 발견. Opus급 코딩을 Sonnet 가격에.",
    highlights: ["보안 취약점 탐지", "Sonnet = Opus급 코딩", "컴퓨터 사용 강화", "$5/$25 (Opus)"],
  },
  {
    id: "gemini-3-1", date: "2026-02", displayDate: "2026년 2월 19일",
    model: "Gemini 3.1 Pro", company: "Google", companyId: "google",
    status: "released", category: "flagship", isKoreanFriendly: true,
    description: "개선된 추론·코딩·에이전트 코딩. Deep Think 조정 가능. 1M 컨텍스트.",
    highlights: ["에이전트 코딩 강화", "조정 가능한 Deep Think", "1M 컨텍스트", "$2/$12 입력/출력"],
  },
  {
    id: "kimi-k2-5", date: "2026-02", displayDate: "2026년 2월 17일",
    model: "Kimi K2.5", company: "Moonshot", companyId: "moonshot",
    status: "released", category: "multimodal", isKoreanFriendly: false,
    description: "오픈소스 네이티브 멀티모달 에이전트. Agent Swarm 기술. 1T 파라미터 MoE.",
    highlights: ["오픈소스 1T MoE", "네이티브 멀티모달", "Agent Swarm", "256K 컨텍스트"],
  },
  {
    id: "glm-5", date: "2026-02", displayDate: "2026년 2월 11일",
    model: "GLM-5", company: "Zhipu AI", companyId: "zhipu",
    status: "released", category: "flagship", isKoreanFriendly: false,
    description: "즈푸AI 최신 플래그십. 744B 파라미터. 에이전트·코딩·긴 작업 특화.",
    highlights: ["744B 파라미터", "에이전트 엔지니어링", "오픈소스", "203K 컨텍스트"],
  },
  {
    id: "deepseek-v3-2", date: "2026-01", displayDate: "2026년 1월",
    model: "DeepSeek V3.2", company: "DeepSeek", companyId: "deepseek",
    status: "released", category: "open", isKoreanFriendly: false,
    description: "1,800개 환경·85K 복잡 명령어로 에이전트 훈련. 오픈소스. 캐시 히트 $0.028/1M.",
    highlights: ["에이전트 특화 훈련", "오픈소스", "$0.028 캐시 히트", "685B MoE"],
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
    id: "gpt-4-1", date: "2025-04", displayDate: "2025년 4월",
    model: "GPT-4.1 시리즈", company: "OpenAI", companyId: "openai",
    status: "released", category: "efficient", isKoreanFriendly: true,
    description: "코딩·지시 이행 최적화. 1M 컨텍스트. Nano는 $0.20/1M 초저가.",
    highlights: ["1M 컨텍스트", "코딩 최적화", "GPT-4.1 Nano $0.20/1M", "파인튜닝 지원"],
  },
  {
    id: "gpt-6", date: "2026-Q3", displayDate: "2026년 하반기 (예상)",
    model: "GPT-6", company: "OpenAI", companyId: "openai",
    status: "expected", category: "flagship", isKoreanFriendly: true,
    description: "OpenAI 차세대 메이저 버전. 추론·에이전트·멀티모달 전면 강화 예상.",
    highlights: ["메이저 업그레이드", "멀티모달 강화", "자율 에이전트", "출시 미확인"],
  },
  {
    id: "claude-5", date: "2026-Q3", displayDate: "2026년 중후반 (예상)",
    model: "Claude 5 시리즈", company: "Anthropic", companyId: "anthropic",
    status: "expected", category: "flagship", isKoreanFriendly: true,
    description: "Anthropic 차세대 메이저 모델. 현재 Claude 4.x 시리즈 이후 다음 세대.",
    highlights: ["차세대 아키텍처", "에이전트 강화", "안전성 업그레이드"],
  },
  {
    id: "gemini-3-2", date: "2026-Q2", displayDate: "2026년 Q2~Q3 (예상)",
    model: "Gemini 3.2", company: "Google", companyId: "google",
    status: "expected", category: "flagship", isKoreanFriendly: true,
    description: "Gemini 3.1의 후속. Google I/O 2026 전후 발표 예상.",
    highlights: ["Google I/O 발표 예상", "멀티모달 강화", "긴 컨텍스트"],
  },
  {
    id: "deepseek-v4", date: "2026-Q2", displayDate: "2026년 Q2 (예상)",
    model: "DeepSeek V4", company: "DeepSeek", companyId: "deepseek",
    status: "rumored", category: "open", isKoreanFriendly: false,
    description: "코딩 특화 V4 루머. 2026년 초 Reuters 보도로 알려진 예정 모델.",
    highlights: ["코딩 특화", "오픈소스 예상", "루머 단계"],
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
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
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
        출시 예정·루머 정보는 공개된 자료 기반이며, 변경될 수 있어요 · 마지막 업데이트: 2026-03-20
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
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
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
