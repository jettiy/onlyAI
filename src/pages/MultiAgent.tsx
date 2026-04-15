import { useState, useEffect, useRef } from "react";

// ─── 타입 ───────────────────────────────────────────────────────────────────
interface AgentNode {
  id: string;
  role: string;
  model: string;
  emoji: string;
  color: string;        // tailwind bg class
  accent: string;       // tailwind text class
  bar: string;          // hex
  x: number; y: number; // 0~100 percent
  description: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  ts: number;
  type: "task" | "result" | "tool" | "review";
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  agents: AgentNode[];
  flow: {
    delay: number;         // ms after prev
    from: string;
    to: string;
    text: string;
    type: Message["type"];
  }[];
}

// ─── 시나리오 데이터 ──────────────────────────────────────────────────────────
const SCENARIOS: Scenario[] = [
  {
    id: "research",
    title: "AI 리서치 팀",
    description: "사용자 질문을 받아 검색·분석·요약·검증을 각 에이전트가 분담해요.",
    icon: "🔬",
    agents: [
      { id: "user",     role: "사용자",       model: "Human",           emoji: "👤", color: "bg-gray-100 dark:bg-gray-800", accent: "text-gray-700 dark:text-gray-300", bar: "#6B7280", x: 5, y: 42, description: "질문을 입력해요." },
      { id: "manager",  role: "매니저 에이전트", model: "GPT-5.4",        emoji: "🧠", color: "bg-violet-100 dark:bg-violet-900/40", accent: "text-violet-700 dark:text-violet-300", bar: "#7C3AED", x: 28, y: 42, description: "작업을 분해하고 서브에이전트에 배분해요." },
      { id: "searcher", role: "검색 에이전트",  model: "DeepSeek V3.2",  emoji: "🔍", color: "bg-brand-100 dark:bg-brand-900/40",   accent: "text-brand-700 dark:text-brand-300", bar: "#2563EB", x: 55, y: 14, description: "웹 검색·API 호출을 담당해요." },
      { id: "analyst",  role: "분석 에이전트",  model: "Claude Sonnet",  emoji: "📊", color: "bg-emerald-100 dark:bg-emerald-900/40", accent: "text-emerald-700 dark:text-emerald-300", bar: "#059669", x: 55, y: 50, description: "수집된 데이터를 분석·정리해요." },
      { id: "writer",   role: "작성 에이전트",  model: "Claude Opus",    emoji: "✍️", color: "bg-amber-100 dark:bg-amber-900/40",  accent: "text-amber-700 dark:text-amber-300", bar: "#D97706", x: 55, y: 82, description: "최종 보고서를 작성해요." },
      { id: "reviewer", role: "검증 에이전트",  model: "Gemini 3.1 Pro", emoji: "✅", color: "bg-pink-100 dark:bg-pink-900/40",   accent: "text-pink-700 dark:text-pink-300", bar: "#DB2777", x: 80, y: 42, description: "결과물의 사실 관계·품질을 검증해요." },
    ],
    flow: [
      { delay: 600,  from: "user",     to: "manager",  text: "2026년 AI 반도체 시장 동향 분석해줘", type: "task" },
      { delay: 900,  from: "manager",  to: "searcher", text: "엔비디아·AMD·TSMC 최신 데이터 수집", type: "task" },
      { delay: 900,  from: "manager",  to: "analyst",  text: "시장 점유율 트렌드 분석 준비", type: "task" },
      { delay: 1600, from: "searcher", to: "analyst",  text: "검색 결과 47건 전달 (H100·B200 출하량 포함)", type: "result" },
      { delay: 900,  from: "manager",  to: "writer",   text: "분석 완료되면 보고서 초안 작성", type: "task" },
      { delay: 1400, from: "analyst",  to: "writer",   text: "분석 완료: 엔비디아 72% 점유, YoY +34%", type: "result" },
      { delay: 1200, from: "writer",   to: "reviewer", text: "초안 완성 (2,400자) — 검증 요청", type: "result" },
      { delay: 1500, from: "reviewer", to: "manager",  text: "사실 확인 완료, 수치 2건 보정 후 승인", type: "review" },
      { delay: 700,  from: "manager",  to: "user",     text: "✅ 리서치 완료: AI 반도체 2026 시장 분석 보고서", type: "result" },
    ],
  },
  {
    id: "coding",
    title: "AI 소프트웨어 개발팀",
    description: "설계·코딩·테스트·배포 각 단계를 전문 에이전트가 파이프라인으로 처리해요.",
    icon: "💻",
    agents: [
      { id: "user",       role: "사용자",        model: "Human",           emoji: "👤", color: "bg-gray-100 dark:bg-gray-800", accent: "text-gray-700 dark:text-gray-300", bar: "#6B7280", x: 4, y: 42, description: "기능 요구사항을 전달해요." },
      { id: "architect",  role: "설계 에이전트",  model: "GPT-5.4",         emoji: "🏗️", color: "bg-violet-100 dark:bg-violet-900/40", accent: "text-violet-700 dark:text-violet-300", bar: "#7C3AED", x: 24, y: 42, description: "시스템 아키텍처·API 설계." },
      { id: "coder",      role: "코딩 에이전트",  model: "Claude Sonnet",   emoji: "💻", color: "bg-brand-100 dark:bg-brand-900/40",   accent: "text-brand-700 dark:text-brand-300", bar: "#2563EB", x: 48, y: 22, description: "실제 코드를 작성해요." },
      { id: "tester",     role: "테스트 에이전트", model: "DeepSeek V3.2",  emoji: "🧪", color: "bg-emerald-100 dark:bg-emerald-900/40", accent: "text-emerald-700 dark:text-emerald-300", bar: "#059669", x: 48, y: 62, description: "유닛·통합 테스트 자동 생성." },
      { id: "reviewer",   role: "코드 리뷰어",    model: "Gemini 3.1 Pro",  emoji: "🔍", color: "bg-amber-100 dark:bg-amber-900/40",  accent: "text-amber-700 dark:text-amber-300", bar: "#D97706", x: 72, y: 42, description: "보안·성능·가독성 리뷰." },
      { id: "deployer",   role: "배포 에이전트",  model: "MiMo-V2-Pro",    emoji: "🚀", color: "bg-pink-100 dark:bg-pink-900/40",   accent: "text-pink-700 dark:text-pink-300", bar: "#DB2777", x: 90, y: 42, description: "CI/CD 파이프라인 실행·배포." },
    ],
    flow: [
      { delay: 600,  from: "user",      to: "architect", text: "실시간 알림 시스템 API 만들어줘", type: "task" },
      { delay: 1000, from: "architect", to: "coder",     text: "WebSocket + Redis Pub/Sub 아키텍처 설계 완료", type: "task" },
      { delay: 800,  from: "architect", to: "tester",    text: "테스트 케이스 요구사항 전달", type: "task" },
      { delay: 1800, from: "coder",     to: "tester",    text: "구현 완료 (320줄) — 테스트 실행 요청", type: "result" },
      { delay: 1200, from: "tester",    to: "coder",     text: "테스트 23/25 통과, 2건 버그 리포트", type: "tool" },
      { delay: 900,  from: "coder",     to: "reviewer",  text: "버그 수정 완료, 리뷰 요청", type: "result" },
      { delay: 1400, from: "reviewer",  to: "deployer",  text: "리뷰 통과 (보안 취약점 없음)", type: "review" },
      { delay: 1000, from: "deployer",  to: "user",      text: "🚀 배포 완료: api.example.com/v1/notifications", type: "result" },
    ],
  },
  {
    id: "investment",
    title: "AI 투자 분석팀",
    description: "시황·뉴스·재무·리스크 에이전트가 협력해 투자 의견을 생성해요.",
    icon: "📈",
    agents: [
      { id: "user",      role: "투자자",        model: "Human",           emoji: "👤", color: "bg-gray-100 dark:bg-gray-800", accent: "text-gray-700 dark:text-gray-300", bar: "#6B7280", x: 4, y: 42, description: "종목·종합 분석 요청." },
      { id: "manager",   role: "리드 에이전트",  model: "GPT-5.4",         emoji: "🧠", color: "bg-violet-100 dark:bg-violet-900/40", accent: "text-violet-700 dark:text-violet-300", bar: "#7C3AED", x: 26, y: 42, description: "분석 조율·최종 판단." },
      { id: "market",    role: "시황 에이전트",  model: "Gemini 3.1 Pro",  emoji: "📊", color: "bg-brand-100 dark:bg-brand-900/40",   accent: "text-brand-700 dark:text-brand-300", bar: "#2563EB", x: 52, y: 12, description: "거시경제·시장 흐름 분석." },
      { id: "news",      role: "뉴스 에이전트",  model: "DeepSeek V3.2",  emoji: "📰", color: "bg-cyan-100 dark:bg-cyan-900/40",   accent: "text-cyan-700 dark:text-cyan-300", bar: "#0891B2", x: 52, y: 42, description: "실시간 뉴스·공시 수집." },
      { id: "financial", role: "재무 에이전트",  model: "Claude Opus",    emoji: "💰", color: "bg-emerald-100 dark:bg-emerald-900/40", accent: "text-emerald-700 dark:text-emerald-300", bar: "#059669", x: 52, y: 72, description: "재무제표·밸류에이션 분석." },
      { id: "risk",      role: "리스크 에이전트", model: "Qwen3-235B",    emoji: "⚠️", color: "bg-orange-100 dark:bg-orange-900/40", accent: "text-orange-700 dark:text-orange-300", bar: "#EA580C", x: 76, y: 42, description: "리스크 요인·시나리오 분석." },
      { id: "writer",    role: "보고서 에이전트", model: "Claude Sonnet",  emoji: "📋", color: "bg-amber-100 dark:bg-amber-900/40",  accent: "text-amber-700 dark:text-amber-300", bar: "#D97706", x: 90, y: 42, description: "투자 의견서 최종 작성." },
    ],
    flow: [
      { delay: 600,  from: "user",      to: "manager",   text: "텐센트 (00700.HK) 투자 의견 분석 요청", type: "task" },
      { delay: 800,  from: "manager",   to: "market",    text: "홍콩 IT 섹터 및 거시경제 현황 분석", type: "task" },
      { delay: 800,  from: "manager",   to: "news",      text: "텐센트 최근 30일 뉴스·공시 수집", type: "task" },
      { delay: 800,  from: "manager",   to: "financial", text: "Q4 2025 실적 + PER/PBR 분석", type: "task" },
      { delay: 1400, from: "market",    to: "risk",      text: "HSI 약세, 美中 무역 리스크 지속", type: "result" },
      { delay: 1200, from: "news",      to: "risk",      text: "규제 우려 3건, 게임 라이선스 2건 승인", type: "result" },
      { delay: 1600, from: "financial", to: "risk",      text: "EPS $7.2 어닝 비트, PER 16x (업종 평균 하회)", type: "result" },
      { delay: 1300, from: "risk",      to: "writer",    text: "리스크 점수 6.2/10 (중간), 밸류 매력 있음", type: "review" },
      { delay: 1100, from: "writer",    to: "user",      text: "📋 투자의견: 매수 (목표가 HK$580), 리스크 중간", type: "result" },
    ],
  },
  {
    id: "openclaw",
    title: "OpenClaw 자동화",
    description: "OpenClaw가 텔레그램 명령을 받아 크론·에이전트·알림을 자동 조율하는 실제 작동 방식이에요.",
    icon: "🦞",
    agents: [
      { id: "user",     role: "사용자",          model: "Telegram",        emoji: "📱", color: "bg-gray-100 dark:bg-gray-800",       accent: "text-gray-700 dark:text-gray-300",    bar: "#6B7280", x: 4,  y: 42, description: "텔레그램으로 명령·질문을 입력해요." },
      { id: "gateway",  role: "OpenClaw 게이트웨이", model: "OpenClaw Core",  emoji: "🦞", color: "bg-violet-100 dark:bg-violet-900/40", accent: "text-violet-700 dark:text-violet-300", bar: "#7C3AED", x: 26, y: 42, description: "메시지 라우팅·크론·세션 관리 담당." },
      { id: "main",     role: "메인 에이전트",    model: "MiniMax M2.7",    emoji: "🧠", color: "bg-brand-100 dark:bg-brand-900/40",    accent: "text-brand-700 dark:text-brand-300",    bar: "#2563EB", x: 50, y: 22, description: "자연어 이해·작업 분해·응답 생성." },
      { id: "subagent", role: "서브 에이전트",    model: "Claude Sonnet",   emoji: "⚡", color: "bg-cyan-100 dark:bg-cyan-900/40",    accent: "text-cyan-700 dark:text-cyan-300",    bar: "#0891B2", x: 50, y: 62, description: "복잡한 분석·코딩 등 전문 작업 처리." },
      { id: "cron",     role: "크론 스케줄러",    model: "OpenClaw Cron",   emoji: "⏰", color: "bg-amber-100 dark:bg-amber-900/40",  accent: "text-amber-700 dark:text-amber-300",  bar: "#D97706", x: 74, y: 22, description: "정해진 시간에 작업 자동 실행." },
      { id: "notify",   role: "알림 에이전트",    model: "Telegram Bot",    emoji: "🔔", color: "bg-emerald-100 dark:bg-emerald-900/40", accent: "text-emerald-700 dark:text-emerald-300", bar: "#059669", x: 74, y: 62, description: "보고서·알림을 텔레그램으로 전송." },
      { id: "skill",    role: "스킬 엔진",        model: "ClawHub Skills",  emoji: "🛠️", color: "bg-pink-100 dark:bg-pink-900/40",   accent: "text-pink-700 dark:text-pink-300",    bar: "#DB2777", x: 91, y: 42, description: "투자·날씨·뉴스 등 특화 기능 실행." },
    ],
    flow: [
      { delay: 600,  from: "user",     to: "gateway",  text: "오늘 홍콩 시장 마감 보고서 보내줘", type: "task" },
      { delay: 700,  from: "gateway",  to: "main",     text: "메시지 파싱 → 메인 에이전트 라우팅", type: "task" },
      { delay: 900,  from: "main",     to: "subagent", text: "HK 시장 데이터 수집 + 분석 요청", type: "task" },
      { delay: 1400, from: "main",     to: "skill",    text: "hk_postmarket_report 스킬 실행", type: "tool" },
      { delay: 1200, from: "skill",    to: "subagent", text: "EastMoney API 주가 데이터 취득", type: "tool" },
      { delay: 1500, from: "subagent", to: "main",     text: "HSI -1.2% · 관심종목 표 완성", type: "result" },
      { delay: 800,  from: "main",     to: "notify",   text: "마감 보고서 생성 완료 — 전송 준비", type: "result" },
      { delay: 700,  from: "notify",   to: "user",     text: "📊 [마감 보고서] HSI 25,502 (-1.2%)...", type: "result" },
      { delay: 1200, from: "cron",     to: "gateway",  text: "⏰ 크론 트리거: 내일 오전 9시 장전 보고서 예약", type: "tool" },
      { delay: 700,  from: "gateway",  to: "main",     text: "크론 작업 등록 완료", type: "review" },
    ],
  },
];

// ─── 메시지 타입 스타일 ────────────────────────────────────────────────────────
const MSG_STYLE: Record<Message["type"], { bg: string; text: string; label: string }> = {
  task:   { bg: "bg-brand-100 dark:bg-brand-900/40",    text: "text-brand-700 dark:text-brand-300",   label: "지시" },
  result: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", label: "결과" },
  tool:   { bg: "bg-amber-100 dark:bg-amber-900/40",  text: "text-amber-700 dark:text-amber-300", label: "도구" },
  review: { bg: "bg-violet-100 dark:bg-violet-900/40",text: "text-violet-700 dark:text-violet-300",label: "검토" },
};

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function MultiAgent() {
  const [scenarioId, setScenarioId] = useState("research");
  const [running, setRunning]       = useState(false);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [activeIds, setActiveIds]   = useState<string[]>([]);
  const [step, setStep]             = useState(-1);
  const [speed, setSpeed]           = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const logRef   = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  const clearAll = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setMessages([]);
    setActiveIds([]);
    setStep(-1);
    setRunning(false);
  };

  useEffect(() => { clearAll(); }, [scenarioId]);

  const runSimulation = () => {
    clearAll();
    setRunning(true);
    let cumMs = 0;
    const div = 1 / speed;
    scenario.flow.forEach((f, i) => {
      cumMs += f.delay * div;
      const t = setTimeout(() => {
        const msg: Message = {
          id: `msg-${i}`,
          from: f.from, to: f.to,
          text: f.text, ts: Date.now(),
          type: f.type,
        };
        setMessages((prev) => [...prev, msg]);
        setActiveIds([f.from, f.to]);
        setStep(i);
        if (logRef.current) {
          logRef.current.scrollTop = logRef.current.scrollHeight;
        }
        if (i === scenario.flow.length - 1) setRunning(false);
      }, cumMs);
      timerRef.current.push(t);
    });
  };

  const getAgent = (id: string) => scenario.agents.find((a) => a.id === id);

  // SVG 화살표 경로: from → to (퍼센트 좌표 → 픽셀 변환은 CSS로)
  const ArrowLayer = () => {
    const lastMsg = messages[messages.length - 1];
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#8B5CF6" />
          </marker>
          <marker id="arrow-dim" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#D1D5DB" />
          </marker>
        </defs>
        {/* 정적 연결선 (배경) */}
        {scenario.agents.slice(1).map((a, i) => {
          const prev = scenario.agents[i > 0 ? i : 0]; // 간단히 이전 에이전트
          return (
            <line key={`bg-${i}`}
              x1={`${prev.x + 8}%`} y1={`${prev.y + 5}%`}
              x2={`${a.x}%`} y2={`${a.y + 5}%`}
              stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4"
              className="dark:stroke-gray-700"
            />
          );
        })}
        {/* 활성 메시지 화살표 */}
        {lastMsg && (() => {
          const f = getAgent(lastMsg.from);
          const t = getAgent(lastMsg.to);
          if (!f || !t) return null;
          const fx = f.x + 8, fy = f.y + 5;
          const tx = t.x, ty = t.y + 5;
          return (
            <line
              x1={`${fx}%`} y1={`${fy}%`}
              x2={`${tx}%`} y2={`${ty}%`}
              stroke="#8B5CF6" strokeWidth="2.5"
              markerEnd="url(#arrow)"
              strokeLinecap="round"
            >
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.6s" />
            </line>
          );
        })()}
      </svg>
    );
  };

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🤝 멀티에이전트 협업 시뮬레이터</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">여러 AI가 역할을 나눠 협력하는 방식을 실시간으로 시각화해요</p>
      </div>

      {/* 시나리오 선택 */}
      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((s) => (
          <button key={s.id} onClick={() => setScenarioId(s.id)}
            className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all " + (
              scenarioId === s.id
                ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-violet-300"
            )}>
            <span>{s.icon}</span> {s.title}
          </button>
        ))}
      </div>

      {/* 설명 + 컨트롤 */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-gray-50 dark:bg-gray-900/50 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">{scenario.description}</p>
        <div className="flex items-center gap-2 shrink-0">
          {/* 속도 */}
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
            className="text-xs px-2 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400">
            <option value={0.5}>🐢 느리게</option>
            <option value={1}>▶️ 보통</option>
            <option value={2}>⚡ 빠르게</option>
          </select>
          <button onClick={clearAll} disabled={!running && messages.length === 0}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 disabled:opacity-40 transition-all">
            초기화
          </button>
          <button onClick={runSimulation} disabled={running}
            className={"px-4 py-1.5 text-xs font-bold rounded-lg transition-all " + (
              running
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30"
            )}>
            {running ? "⏳ 실행 중..." : "▶ 시뮬레이션 실행"}
          </button>
        </div>
      </div>

      {/* 메인 시각화 영역 */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* 에이전트 맵 — 2/3 */}
        <div className="md:col-span-2 relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden" style={{height: 360}}>
          <div className="absolute inset-0" style={{zIndex:2}}>
            {/* 배경 그리드 */}
            <div className="absolute inset-0 opacity-30 dark:opacity-10"
              style={{backgroundImage: "radial-gradient(circle, #D1D5DB 1px, transparent 1px)", backgroundSize: "28px 28px"}} />

            {/* 에이전트 노드 */}
            {scenario.agents.map((agent) => {
              const isActive = activeIds.includes(agent.id);
              return (
                <div key={agent.id}
                  style={{ left: `${agent.x}%`, top: `${agent.y}%`, position: "absolute", transform: "translate(-50%, -50%)", zIndex: 10, transition: "all 0.3s" }}>
                  <div className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 shadow-sm transition-all duration-300 text-center
                    ${agent.color}
                    ${isActive
                      ? "scale-110 shadow-lg border-current"
                      : "border-gray-200 dark:border-gray-700"
                    }`}
                    style={isActive ? { borderColor: agent.bar, boxShadow: `0 0 16px ${agent.bar}55` } : {}}>
                    {/* 활성 펄스 링 */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl animate-ping opacity-30"
                        style={{ backgroundColor: agent.bar }} />
                    )}
                    <span className="text-xl leading-none">{agent.emoji}</span>
                    <div className="leading-tight">
                      <div className={`text-[10px] font-black tracking-wide ${agent.accent}`}>{agent.role}</div>
                      <div className="text-[9px] text-gray-400 whitespace-nowrap">{agent.model}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG 화살표 레이어 */}
          <div className="absolute inset-0" style={{zIndex:1, pointerEvents:"none"}}>
            <ArrowLayer />
          </div>

          {/* 현재 메시지 플로팅 버블 */}
          {messages.length > 0 && (() => {
            const last = messages[messages.length - 1];
            const style = MSG_STYLE[last.type];
            return (
              <div className="absolute bottom-3 left-3 right-3 z-20">
                <div className={`${style.bg} ${style.text} rounded-xl px-3 py-2 text-xs font-medium flex items-start gap-2 border border-current border-opacity-20 shadow-sm`}>
                  <span className="shrink-0 font-bold opacity-70">{style.label}</span>
                  <span className="leading-relaxed">{last.text}</span>
                </div>
              </div>
            );
          })()}

          {/* 빈 상태 안내 */}
          {messages.length === 0 && !running && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-4xl mb-2">▶</div>
                <p className="text-sm text-gray-400 dark:text-gray-500">시뮬레이션 실행 버튼을 눌러보세요</p>
              </div>
            </div>
          )}
        </div>

        {/* 메시지 로그 — 1/3 */}
        <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300">메시지 로그</h3>
            {messages.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full font-semibold">{messages.length}개</span>
            )}
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-2" style={{maxHeight: 300}}>
            {messages.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-8">메시지가 여기 표시돼요</p>
            ) : messages.map((msg, i) => {
              const f = getAgent(msg.from);
              const t = getAgent(msg.to);
              const style = MSG_STYLE[msg.type];
              const isLast = i === messages.length - 1;
              return (
                <div key={msg.id}
                  className={`p-2 rounded-lg text-xs border transition-all ${style.bg} ${isLast ? "ring-1 ring-violet-400 dark:ring-violet-500" : ""}`}>
                  <div className="flex items-center gap-1 mb-1 flex-wrap">
                    <span style={{color: f?.bar}} className="font-bold">{f?.emoji} {f?.role}</span>
                    <span className="text-gray-400">→</span>
                    <span style={{color: t?.bar}} className="font-bold">{t?.emoji} {t?.role}</span>
                    <span className={`ml-auto text-[9px] px-1 py-0.5 rounded font-semibold ${style.text} opacity-80`}>{style.label}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{msg.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 에이전트 범례 */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">에이전트 구성</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {scenario.agents.map((a) => (
            <div key={a.id} className={`flex items-start gap-2 p-3 rounded-xl border ${
              activeIds.includes(a.id)
                ? "border-violet-300 dark:border-violet-700 shadow-sm"
                : "border-gray-200 dark:border-gray-800"
            } bg-white dark:bg-gray-900 transition-all`}>
              <span className="text-lg">{a.emoji}</span>
              <div className="min-w-0">
                <div className={`text-xs font-bold ${a.accent}`}>{a.role}</div>
                <div className="text-[10px] text-gray-400 mb-0.5">{a.model}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-500 leading-tight">{a.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 메시지 타입 범례 */}
      <div className="flex gap-3 flex-wrap">
        {(Object.entries(MSG_STYLE) as [Message["type"], typeof MSG_STYLE[Message["type"]]][]).map(([type, style]) => (
          <div key={type} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${style.bg} ${style.text}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {style.label}
          </div>
        ))}
        <span className="text-xs text-gray-400 self-center ml-2">메시지 타입</span>
      </div>

      {/* 개념 설명 */}
      <div className="bg-gradient-to-br from-violet-50 to-brand-50 dark:from-violet-950/30 dark:to-brand-950/30 rounded-2xl p-5 border border-violet-100 dark:border-violet-900/40">
        <h3 className="text-sm font-black text-gray-900 dark:text-white mb-3">🤝 멀티에이전트 협업이란?</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: "🏗️", title: "역할 분담", desc: "각 AI가 전문 역할을 맡아 병렬로 처리 → 단일 AI보다 복잡한 작업 수행 가능" },
            { icon: "🔄", title: "파이프라인", desc: "작업이 단계별로 흐르며 이전 에이전트 결과가 다음 에이전트의 입력이 됨" },
            { icon: "✅", title: "검증·피드백", desc: "검토 에이전트가 결과물을 확인하고 수정 요청 → 오류 자동 감소" },
          ].map((c) => (
            <div key={c.title} className="bg-white/60 dark:bg-gray-900/60 rounded-xl p-3">
              <div className="text-xl mb-1">{c.icon}</div>
              <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">{c.title}</div>
              <div className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
