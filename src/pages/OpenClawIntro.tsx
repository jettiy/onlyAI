import { useState } from "react";

// ─── 데이터 ──────────────────────────────────────────────────────────────────

const INVITE_LINKS = {
  zhipu: {
    name: "즈푸AI (Z.ai / GLM)",
    logo: "/logos/zhipu.png",
    url: "https://z.ai/subscribe?ic=ODRIAQZZSF",
    benefit: "Claude Code·Cline 등 20개 이상 코딩 도구 완전 지원 · 월 $10부터 시작",
    badge: "특가 코딩 플랜",
    color: "from-brand-600 to-violet-600",
    bgLight: "bg-brand-50 dark:bg-brand-950/30",
    border: "border-brand-200 dark:border-brand-800",
    accent: "text-brand-700 dark:text-brand-300",
    bar: "bg-brand-500",
    cta: "GLM 코딩 플랜 가입하기",
    desc: "초대 코드 포함 링크로 가입하면 한정 특가 할인을 받을 수 있어요.",
  },
  minimax: {
    name: "MiniMax (미니맥스)",
    logo: "/logos/minimax.png",
    url: "https://platform.minimax.io/register?group_id=2028654236509679678",
    benefit: "M2.7 모델 포함 API 이용 · 레퍼럴 가입 시 10% 할인 + API 크레딧 지급",
    badge: "레퍼럴 초대",
    color: "from-violet-600 to-pink-500",
    bgLight: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    accent: "text-violet-700 dark:text-violet-300",
    bar: "bg-violet-500",
    cta: "MiniMax 가입하기",
    desc: "초대 링크로 가입하면 첫 결제 10% 할인 및 API 크레딧을 받을 수 있어요.",
  },
};

interface InstallStep {
  step: number;
  title: string;
  desc: string;
  code?: string;
  badge?: string;
}

const LOCAL_STEPS: InstallStep[] = [
  {
    step: 1,
    title: "Node.js 설치 확인",
    desc: "OpenClaw는 Node.js 18 이상이 필요해요. 터미널에서 버전을 확인하세요.",
    code: "node --version  # v18.0.0 이상이어야 해요",
    badge: "필수",
  },
  {
    step: 2,
    title: "OpenClaw CLI 설치",
    desc: "npm으로 OpenClaw CLI를 전역 설치해요.",
    code: "npm install -g @openclaw/cli",
    badge: "설치",
  },
  {
    step: 3,
    title: "초기 설정",
    desc: "설치 후 처음 실행하면 설정 파일이 생성돼요.",
    code: "openclaw init",
    badge: "설정",
  },
  {
    step: 4,
    title: "Telegram 봇 연결 (선택)",
    desc: "@BotFather에서 봇을 만들고 토큰을 입력하면 텔레그램으로 제어할 수 있어요.",
    code: "openclaw gateway start",
    badge: "선택",
  },
  {
    step: 5,
    title: "실행 확인",
    desc: "브라우저에서 대시보드를 열어 정상 작동 여부를 확인해요.",
    code: "# 기본 주소: http://localhost:18789",
    badge: "완료",
  },
];

const CLOUD_STEPS: InstallStep[] = [
  {
    step: 1,
    title: "MiniMax 가입",
    desc: "아래 초대 링크로 MiniMax 계정을 만들어요. 레퍼럴 가입 시 10% 할인과 크레딧이 지급돼요.",
    badge: "필수",
  },
  {
    step: 2,
    title: "OpenClaw 클라우드 플랜 선택",
    desc: "개인용은 Free 플랜, 자동화·에이전트 기능은 Pro 플랜을 선택하세요. MiniMax 결제와 연동돼요.",
    badge: "플랜",
  },
  {
    step: 3,
    title: "Telegram 봇 연결",
    desc: "@BotFather에서 봇을 만들고 토큰을 OpenClaw 설정에 입력해요. 텔레그램으로 AI와 대화할 수 있어요.",
    badge: "연결",
  },
  {
    step: 4,
    title: "채널·알림 설정",
    desc: "크론 작업, 투자 알림, 뉴스 모니터링 등을 텔레그램 채널로 자동 전달받을 수 있어요.",
    badge: "설정",
  },
  {
    step: 5,
    title: "즉시 사용 시작",
    desc: "설치 없이 바로 시작해요. 서버 관리·업데이트·보안 모두 클라우드에서 자동 처리돼요.",
    badge: "완료",
  },
];

const FEATURES = [
  {
    icon: "🤖",
    title: "AI 에이전트",
    desc: "Claude·GPT·Gemini 등 모든 주요 AI를 하나의 인터페이스로 제어해요",
  },
  {
    icon: "📱",
    title: "텔레그램 통합",
    desc: "텔레그램으로 AI에게 명령하고 보고서·알림을 받을 수 있어요",
  },
  {
    icon: "⏰",
    title: "크론 자동화",
    desc: "정해진 시간에 투자 리포트·뉴스 요약·날씨 알림 등을 자동 생성해요",
  },
  {
    icon: "🔗",
    title: "멀티에이전트",
    desc: "여러 AI가 협력해 복잡한 작업을 자동으로 처리하는 파이프라인 구성 가능",
  },
  {
    icon: "🛠️",
    title: "스킬 생태계",
    desc: "ClawHub에서 커뮤니티가 만든 스킬을 설치해 기능을 빠르게 확장해요",
  },
  {
    icon: "🔒",
    title: "개인 데이터 보호",
    desc: "로컬 설치 시 모든 데이터가 내 기기에만 저장돼요. 클라우드도 암호화 저장",
  },
];

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

function InviteCard({ type }: { type: "zhipu" | "minimax" }) {
  const link = INVITE_LINKS[type];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${link.border} ${link.bgLight} p-5`}>
      {/* 상단 컬러 바 */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${link.color}`} />

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-gray-200 dark:border-gray-700 flex-shrink-0">
          <img src={link.logo} alt={link.name}
            className="w-full h-full object-contain p-1"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-gray-900 border ${link.border} ${link.accent}`}>
              🎟️ {link.badge}
            </span>
          </div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white">{link.name}</h3>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{link.desc}</p>

      <div className={`text-[11px] font-semibold ${link.accent} mb-4 flex items-start gap-1.5`}>
        <span>✨</span>
        <span>{link.benefit}</span>
      </div>

      <div className="flex gap-2">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 text-center py-2 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${link.color} hover:opacity-90 transition-opacity shadow-sm`}
        >
          {link.cta} →
        </a>
        <button
          onClick={handleCopy}
          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
            copied
              ? "bg-green-500 text-white border-green-500"
              : `border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400`
          }`}
        >
          {copied ? "✓" : "🔗"}
        </button>
      </div>
    </div>
  );
}

function StepCard({ step, isLast }: { step: InstallStep; isLast: boolean }) {
  const BADGE_COLOR: Record<string, string> = {
    "필수": "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    "설치": "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400",
    "설정": "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    "선택": "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
    "완료": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    "플랜": "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
    "연결": "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  };

  return (
    <div className="flex gap-4">
      {/* 스텝 인디케이터 */}
      <div className="flex flex-col items-center gap-0">
        <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm shadow-violet-200 dark:shadow-violet-900/40">
          {step.step}
        </div>
        {!isLast && <div className="w-px flex-1 bg-violet-200 dark:bg-violet-900/40 mt-1 min-h-[32px]" />}
      </div>

      {/* 내용 */}
      <div className="flex-1 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{step.title}</h4>
          {step.badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${BADGE_COLOR[step.badge] || "bg-gray-100 text-gray-500"}`}>
              {step.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{step.desc}</p>
        {step.code && (
          <div className="bg-gray-900 dark:bg-gray-950 rounded-xl px-4 py-3 font-mono text-xs text-emerald-400 border border-gray-800">
            <span className="text-gray-500 select-none mr-2">$</span>{step.code}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────────────────────

export default function OpenClawIntro() {
  const [tab, setTab] = useState<"local" | "cloud">("cloud");

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-brand-600 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🦞</span>
            <div>
              <h1 className="text-2xl font-black tracking-tight">OpenClaw</h1>
              <p className="text-violet-200 text-sm">나만의 AI 에이전트 플랫폼</p>
            </div>
          </div>
          <p className="text-sm text-violet-100 leading-relaxed max-w-xl">
            텔레그램·Slack으로 제어하는 개인 AI 비서 플랫폼이에요. 투자 알림, 뉴스 요약, 멀티에이전트 자동화까지 — 설정 한 번으로 24시간 작동해요.
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            {["GPT·Claude·Gemini 전부 지원", "텔레그램 통합", "크론 자동화", "멀티에이전트"].map((t) => (
              <span key={t} className="text-[11px] px-2.5 py-1 bg-white/20 rounded-full font-medium">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 특징 그리드 */}
      <div>
        <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">주요 기능</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition-all">
              <span className="text-2xl block mb-2">{f.icon}</span>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 초대 링크 섹션 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">AI 서비스 레퍼럴 가이드</h2>
          <span className="text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-bold">초대 코드 할인</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          AI 서비스마다 레퍼럴·초대 코드 운영 방식이 달라요. 아래에서 각 서비스의 초대 혜택과 발급 방법을 확인하세요.
        </p>

        {/* 활성 초대 링크 (준석님 보유) */}
        <h3 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">✅ 활성 초대 링크 (바로 사용 가능)</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <InviteCard type="zhipu" />
          <InviteCard type="minimax" />
        </div>

        {/* 다른 서비스 레퍼럴 정보 */}
        <h3 className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-3">🔗 기타 AI 서비스 레퍼럴 현황</h3>
        <div className="space-y-2">
          {[
            {
              logo: "/logos/google.png", name: "Google AI Pro (Gemini)", status: "available",
              reward: "초대받은 사람: 4개월 무료 구독 ($80 상당) · 발급자: 3개까지 발급 가능",
              how: "Google One 앱 → 멤버십 탭 → 친구 초대 → 고유 링크 발급 (구독자만)",
              url: "https://one.google.com/ai/invite",
            },
            {
              logo: "/logos/anthropic.jpg", name: "Claude (Anthropic)", status: "limited",
              reward: "Claude Code 게스트 패스 1주일 무료 체험 · 구독자만 발급 가능",
              how: "Claude Pro/Max 구독자의 계정 설정에서 게스트 패스 발급 가능 (수량 한정)",
              url: "https://claude.ai/settings",
            },
            {
              logo: "/logos/openai.png", name: "ChatGPT Plus (OpenAI)", status: "partner-only",
              reward: "파트너사 프로모 코드만 존재 · 개인 레퍼럴 링크 없음",
              how: "OpenAI 공식 파트너(기업·교육기관)를 통해서만 프로모 코드 발급 — 개인 생성 불가",
              url: null,
            },
            {
              logo: "/logos/deepseek.png", name: "DeepSeek", status: "none",
              reward: "레퍼럴 없음 · 신규 가입 시 무료 API 크레딧 $5 자동 지급",
              how: "가입 후 자동 지급, 초대 코드 없음",
              url: "https://platform.deepseek.com",
            },
            {
              logo: "/logos/alibaba.png", name: "Alibaba Cloud (Qwen)", status: "available",
              reward: "초대받은 사람: 쿠폰 지급 · 발급자: 크레딧 보상 (결제금액 비례)",
              how: "Alibaba Cloud 콘솔 로그인 → Invite & Earn → 개인 초대 링크 발급",
              url: "https://www.alibabacloud.com/en/referral",
            },
            {
              logo: "/logos/mistral.jpg", name: "Mistral AI", status: "none",
              reward: "개인 레퍼럴 없음 · 앰배서더 프로그램 신청 가능 (선발 방식)",
              how: "공개 레퍼럴 없음. 앰배서더 프로그램: docs.mistral.ai/ambassadors",
              url: null,
            },
            {
              logo: "/logos/xai.png", name: "xAI (Grok)", status: "none",
              reward: "개인 레퍼럴 없음 · X Premium 구독으로 Grok 접근 가능",
              how: "레퍼럴 없음. X(트위터) 프리미엄 구독 후 Grok 이용",
              url: null,
            },
          ].map((s) => {
            const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
              available: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", label: "레퍼럴 있음" },
              limited:   { bg: "bg-brand-100 dark:bg-brand-900/30",    text: "text-brand-700 dark:text-brand-400",    label: "제한적 가능" },
              "partner-only": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "파트너 전용" },
              none:      { bg: "bg-gray-100 dark:bg-gray-800",       text: "text-gray-500 dark:text-gray-400",    label: "레퍼럴 없음" },
            };
            const style = STATUS_STYLE[s.status];
            return (
              <div key={s.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <img src={s.logo} alt={s.name} className="w-full h-full object-contain p-0.5"
                    onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{s.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>{style.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">{s.reward}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{s.how}</p>
                </div>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 text-[11px] text-brand-600 dark:text-brand-400 hover:underline whitespace-nowrap">
                    바로가기 →
                  </a>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">* 레퍼럴 정책은 서비스마다 수시로 변경될 수 있어요. 초대 코드를 받으시면 언제든 추가해드릴게요.</p>
      </div>

      {/* 설치 방법 */}
      <div>
        <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">시작하는 방법</h2>

        {/* 탭 */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          {[
            { key: "cloud" as const, label: "☁️ 클라우드 (추천)", desc: "설치 없이 바로" },
            { key: "local" as const, label: "💻 로컬 설치", desc: "내 서버에 직접" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t.key
                  ? "bg-white dark:bg-gray-900 text-violet-600 dark:text-violet-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <span>{t.label}</span>
              <span className="text-[10px] font-normal opacity-70">{t.desc}</span>
            </button>
          ))}
        </div>

        {/* 클라우드 vs 로컬 비교 배너 */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className={`rounded-xl p-4 border transition-all ${tab === "cloud" ? "border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/30" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">☁️</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">클라우드</span>
              {tab === "cloud" && <span className="text-[10px] px-1.5 py-0.5 bg-violet-500 text-white rounded font-bold ml-auto">현재 선택</span>}
            </div>
            <ul className="space-y-1">
              {["설치 불필요, 즉시 시작", "서버 관리·업데이트 자동", "어디서나 접근 가능", "비용: MiniMax 구독 포함"].map((t) => (
                <li key={t} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> {t}
                </li>
              ))}
              <li className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-1">
                <span>⚠</span> 데이터 클라우드 보관
              </li>
            </ul>
          </div>
          <div className={`rounded-xl p-4 border transition-all ${tab === "local" ? "border-brand-400 dark:border-brand-600 bg-brand-50 dark:bg-brand-950/30" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💻</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">로컬 설치</span>
              {tab === "local" && <span className="text-[10px] px-1.5 py-0.5 bg-brand-500 text-white rounded font-bold ml-auto">현재 선택</span>}
            </div>
            <ul className="space-y-1">
              {["완전한 데이터 프라이버시", "인터넷 없이도 작동", "커스터마이징 무제한", "비용: API 사용료만"].map((t) => (
                <li key={t} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> {t}
                </li>
              ))}
              <li className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-1">
                <span>⚠</span> Node.js 설치 및 터미널 사용 필요
              </li>
            </ul>
          </div>
        </div>

        {/* 스텝 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="text-xs font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            {tab === "cloud" ? "☁️ 클라우드로 시작하기" : "💻 로컬에 설치하기"}
            <span className="text-[10px] text-gray-400 font-normal">— 5단계</span>
          </h3>
          {(tab === "cloud" ? CLOUD_STEPS : LOCAL_STEPS).map((step, i, arr) => (
            <StepCard key={step.step} step={step} isLast={i === arr.length - 1} />
          ))}
        </div>

        {/* 클라우드 탭일 때 MiniMax 가입 CTA */}
        {tab === "cloud" && (
          <div className="mt-4 bg-gradient-to-r from-violet-600 to-brand-600 rounded-xl p-4 text-white flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-bold">MiniMax로 클라우드 시작하기</p>
              <p className="text-violet-200 text-xs mt-0.5">초대 링크로 가입하면 10% 할인 + API 크레딧 지급</p>
            </div>
            <a
              href="https://platform.minimax.io/register?group_id=2028654236509679678"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4 py-2 bg-white text-violet-700 rounded-xl text-xs font-bold hover:bg-violet-50 transition-colors shadow-sm"
            >
              지금 가입하기 →
            </a>
          </div>
        )}
      </div>

      {/* 링크 */}
      <div className="flex gap-3 flex-wrap text-xs">
        <a href="https://docs.openclaw.ai" target="_blank" rel="noopener noreferrer"
          className="text-brand-600 dark:text-brand-400 hover:underline">📖 공식 문서</a>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer"
          className="text-brand-600 dark:text-brand-400 hover:underline">🔗 GitHub</a>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <a href="https://discord.com/invite/clawd" target="_blank" rel="noopener noreferrer"
          className="text-brand-600 dark:text-brand-400 hover:underline">💬 Discord 커뮤니티</a>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <a href="https://clawhub.com" target="_blank" rel="noopener noreferrer"
          className="text-brand-600 dark:text-brand-400 hover:underline">🛠️ ClawHub 스킬</a>
      </div>
    </div>
  );
}
