import { useState } from "react";

interface PromptResult {
  model: string;
  company: string;
  flag: string;
  score: number;
  response: string;
  time: string;
  strengths: string[];
  weaknesses: string[];
}

const PROMPTS = [
  {
    id: "summary",
    label: "📋 긴 글 요약",
    category: "활용",
    prompt: "다음 기사를 3문장으로 요약해줘.\n\n[삼성전자가 HBM4E 개발 완료... 300자 기사]",
  },
  {
    id: "translate",
    label: "🌐 영한 번역",
    category: "활용",
    prompt: "다음 영어 문장을 자연스러운 한국어로 번역해줘.\n\"The transformer architecture has fundamentally changed how we approach natural language processing.\"",
  },
  {
    id: "code",
    label: "💻 코드 작성",
    category: "기술",
    prompt: "React로 TODO 앱을 만들어줘. localStorage에 데이터를 저장하고, 완료/삭제/추가 기능을 포함해줘.",
  },
  {
    id: "reasoning",
    label: "🧩 논리 추론",
    category: "추론",
    prompt: "A, B, C 세 사람이 줄을 서 있다. A는 B보다 앞에 있고, C는 A보다 뒤에 있으며, B는 맨 앞이 아니다. 누가 맨 앞인가?",
  },
  {
    id: "creative",
    label: "✍️ 창의적 글쓰기",
    category: "창작",
    prompt: "2060년 서울의 하루를 묘사하는 SF 단편 소설을 500자로 써줘. AI와 인간이 공존하는 일상을 그려줘.",
  },
  {
    id: "korean",
    label: "🇰🇷 한국어 뉘앙스",
    category: "한국어",
    prompt: "\"그 사람 뭐래?\"라는 문장이 상황에 따라 어떤 뉘앙스를 가질 수 있는지 5가지 상황을 예시로 설명해줘.",
  },
];

const RESULTS: Record<string, PromptResult[]> = {
  summary: [
    { model: "GPT-5", company: "OpenAI", flag: "🇺🇸", score: 95, response: "삼성전자가 HBM4E 양산을 2026년 하반기부터 시작한다. 이 칩은 엔비디아 블랙웰 울트라에 탑재될 전망이다. 성공 시 AI 반도체 시장 판도 변화가 예상된다.", time: "1.2s", strengths: ["핵심 정보 완벽 추출", "자연스러운 문장"], weaknesses: ["비용 정보 누락"] },
    { model: "Claude Sonnet 4.6", company: "Anthropic", flag: "🇺🇸", score: 93, response: "삼성전자가 차세대 AI 반도체 HBM4E 개발을 완료해 하반기 양산에 돌입한다. 엔비디아 최신 AI 칩에 탑재될 가능성이 높아 시장 재편이 예상된다.", time: "1.8s", strengths: ["문맥 이해 우수", "간결한 표현"], weaknesses: [] },
    { model: "Gemini 3.1 Pro", company: "Google", flag: "🇺🇸", score: 91, response: "삼성전자는 HBM4E를 통해 대역폭을 2배 향상시켰다. 2026년 하반기 양산 예정이며 엔비디아 블랙웰 울트라 탑재 전망이다. AI 반도체 시장 판도 변화 가능성이 있다.", time: "1.5s", strengths: ["수치 정확 반영", "구조적 요약"], weaknesses: ["약간 딱딱한 어조"] },
    { model: "DeepSeek R1", company: "DeepSeek", flag: "🇨🇳", score: 87, response: "삼성전자는 HBM4E 개발 완료. 2026년 하반기 양산. 엔비디아 블랙웰 울트라 탑재 예상. 성공 시 시장 판도 변화.", time: "2.1s", strengths: ["속도 비교적 빠름", "핵심 정보 포함"], weaknesses: ["문장이 끊김", "어색한 한국어"] },
    { model: "Qwen3 235B", company: "Alibaba", flag: "🇨🇳", score: 83, response: "삼성전자가 HBM4E를 개발 완료하고 2026 하반기에 양산한다고 발표했다. 대역폭이 HBM3E 대비 2배 향상되었고, 엔비디아 칩에 탑재될 전망이다.", time: "2.5s", strengths: ["정보 누락 없음"], weaknesses: ["중국어식 표현", "자연스럽지 않음"] },
    { model: "GLM-5", company: "Zhipu AI", flag: "🇨🇳", score: 80, response: "삼성전자 HBM4E 양산 계획 발표. 2026년 하반기부터 시작. 엔비디아 탑재 예상. AI 반도체 시장에 영향 예상.", time: "2.0s", strengths: ["빠른 응답"], weaknesses: ["요약 품질 낮음", "문법 오류"] },
  ],
  translate: [
    { model: "GPT-5", company: "OpenAI", flag: "🇺🇸", score: 96, response: "트랜스포머 아키텍처는 자연어 처리를 다루는 방식을 근본적으로 바꿔놓았다.", time: "0.8s", strengths: ["완벽한 한국어", "전문 용어 적절"], weaknesses: [] },
    { model: "Claude Sonnet 4.6", company: "Anthropic", flag: "🇺🇸", score: 95, response: "트랜스포머 구조는 자연어 처리에 접근하는 방식을 근본적으로 변화시켰다.", time: "1.0s", strengths: ["자연스러운 흐름", "정확한 의미 전달"], weaknesses: [] },
    { model: "Gemini 3.1 Pro", company: "Google", flag: "🇺🇸", score: 94, response: "트랜스포머 아키텍처는 우리가 자연어 처리를 다루는 방식을 근본적으로 바꿔놓았습니다.", time: "0.9s", strengths: ["정확한 번역"], weaknesses: ["존댓말 혼용"] },
    { model: "DeepSeek R1", company: "DeepSeek", flag: "🇨🇳", score: 82, response: "变换器架构从根本上改变了我们处理自然语言的方式。", time: "1.5s", strengths: [], weaknesses: ["한국어로 번역 실패", "중국어로 응답"] },
    { model: "Qwen3 235B", company: "Alibaba", flag: "🇨🇳", score: 78, response: "트랜스포머 아키텍처는 자연어 처리에 접근하는 우리의 방법을 근본적으로 바꾸었다.", time: "1.2s", strengths: ["의미 전달"], weaknesses: ["어색한 문장 구조"] },
  ],
  code: [
    { model: "GPT-5", company: "OpenAI", flag: "🇺🇸", score: 97, response: "✅ 완전한 TODO 앱 구현. TypeScript 타입 정의, 에러 핸들링, 반응형 UI 모두 포함.", time: "3.2s", strengths: ["완벽한 구현", "타입 안전성", "클린 코드"], weaknesses: ["응답 길이 약간 김"] },
    { model: "Claude Sonnet 4.6", company: "Anthropic", flag: "🇺🇸", score: 96, response: "✅ 완전한 TODO 앱 구현. 커스텀 훅 패턴, 접근성 고려.", time: "2.8s", strengths: ["구조화된 코드", "주석 풍부"], weaknesses: [] },
    { model: "Grok 3", company: "xAI", flag: "🇺🇸", score: 93, response: "✅ 기능 구현 완료. localStorage 연동 정상 동작.", time: "3.0s", strengths: ["깔끔한 UI 코드"], weaknesses: ["타입 정어 부족"] },
    { model: "DeepSeek R1", company: "DeepSeek", flag: "🇨🇳", score: 88, response: "✅ 기본 기능 구현. TODO 추가/완료/삭제 가능.", time: "4.5s", strengths: ["논리적 사고 과정 표시"], weaknesses: ["CSS 없음", "영어 주석"] },
    { model: "Gemini 3.1 Pro", company: "Google", flag: "🇺🇸", score: 91, response: "✅ 완전한 구현. 추가로 필터링 기능까지 포함.", time: "2.5s", strengths: ["빠른 구현", "추가 기능"], weaknesses: ["약간의 구식 패턴"] },
    { model: "GLM-5", company: "Zhipu AI", flag: "🇨🇳", score: 85, response: "✅ TODO 앱 기본 구현 완료.", time: "3.8s", strengths: ["동작하는 코드"], weaknesses: ["에러 처리 미흡", "중국어 변수명"] },
  ],
  reasoning: [
    { model: "GPT-5", company: "OpenAI", flag: "🇺🇸", score: 98, response: "C가 맨 앞입니다. 조건 분석: A>B, C>A이므로 C>A>B. B는 맨 앞이 아니므로 순서는 C>A>B가 확정됩니다.", time: "1.5s", strengths: ["정확한 추론", "명확한 설명"], weaknesses: [] },
    { model: "DeepSeek R1", company: "DeepSeek", flag: "🇨🇳", score: 97, response: "C가 맨 앞입니다. 단계별로 분석하면...[추론 과정 생략]...따라서 C>A>B의 순서가 됩니다.", time: "3.0s", strengths: ["상세한 추론 과정", "100% 정확"], weaknesses: ["추론 과정이 긺"] },
    { model: "Claude Opus 4.6", company: "Anthropic", flag: "🇺🇸", score: 97, response: "C가 맨 앞에 섭니다. A는 B 앞, C는 A 뒤이므로 C가 가장 뒤처 보이지만, \"B는 맨 앞이 아니다\"라는 조건에서 최종 순서는 C>A>B입니다.", time: "1.8s", strengths: ["정확", "설명 친절"], weaknesses: [] },
    { model: "Grok 3", company: "xAI", flag: "🇺🇸", score: 95, response: "C가 맨 앞입니다. A>B, C>A → C>A>B. B는 2번째 위치.", time: "1.2s", strengths: ["빠르고 정확"], weaknesses: ["설명이 간결함"] },
    { model: "Gemini 3.1 Pro", company: "Google", flag: "🇺🇸", score: 93, response: "C가 맨 앞입니다. 순서는 C>A>B입니다. A>B이고 C>A이므로 자연스럽게 C>A>B가 도출됩니다.", time: "1.3s", strengths: ["정확"], weaknesses: [] },
    { model: "Qwen3 235B", company: "Alibaba", flag: "🇨🇳", score: 85, response: "C가 맨 앞입니다. A>B, C>A, B≠맨앞. C>A>B.", time: "2.0s", strengths: ["정답 맞춤"], weaknesses: ["추론 과정 미흡"] },
  ],
  creative: [
    { model: "GPT-5", company: "OpenAI", flag: "🇺🇸", score: 94, response: "2060년의 서울, 용산구의 한 카페에서 AI 비서 '미래'가 주문을 받고 있었다. 테이블 앞의 지은은 손목의 바이오칩을 톡하자...", time: "2.5s", strengths: ["생생한 묘사", "자연스러운 한국어", "매력적인 전개"], weaknesses: [] },
    { model: "Claude Sonnet 4.6", company: "Anthropic", flag: "🇺🇸", score: 93, response: "2060년 서울의 아침은 AI가 지키고 있었다. 도시의 모든 시스템을 관리하는 '서울AI'가 한강의 수질을 점검하는 동안...", time: "3.0s", strengths: ["세계관 구축 훌륭", "감성적 글쓰기"], weaknesses: ["약간 긺"] },
    { model: "Gemini 3.1 Pro", company: "Google", flag: "🇺🇸", score: 90, response: "2060년, 서울의 지하철에는 더 이상 운전사가 없었다. AI가 모든 것을 관리하는 세상, 그 속에서도 사람들은 아침 출근길에...", time: "2.0s", strengths: ["현실적 설정"], weaknesses: ["클리셰적 전개"] },
    { model: "Grok 3", company: "xAI", flag: "🇺🇸", score: 88, response: "서울, 2060년. 반려 AI 로봇 '지훈'과 함께 한강 공원을 걷는 지수. AI와 인간이 함께 춤추는 거리...", time: "1.8s", strengths: ["독특한 시각"], weaknesses: ["SF 요소 부족"] },
    { model: "DeepSeek R1", company: "DeepSeek", flag: "🇨🇳", score: 75, response: "2060年的首尔，AI已经深入人们生活的方方面面。在一个普通的早晨，人工智能助手正在为用户准备早餐...", time: "2.5s", strengths: ["스토리 구조"], weaknesses: ["한국어로 안 씀", "중국어 응답"] },
  ],
  korean: [
    { model: "GPT-5", company: "OpenAI", flag: "🇺🇸", score: 96, response: "1. 놀람: \"뭐래? 진짜?\" 2. 분노: \"뭐래? 뭘 그렇게 말해?\" 3. 호기심: \"뭐래? 자세히 말해봐\" 4. 환영: \"뭐래? 잘했네!\" 5. 혼잣말: \"아이고, 뭐래...\"", time: "1.5s", strengths: ["완벽한 뉘앙스 구분", "자연스러운 예시"], weaknesses: [] },
    { model: "Claude Sonnet 4.6", company: "Anthropic", flag: "🇺🇸", score: 95, response: "1. 단순 호기심: 상대방 말을 놓쳤을 때 2. 놀람/경악: 믿기 어려운 내용을 들었을 때 3. 분노: 불쾌한 발언을 들었을 때...", time: "2.0s", strengths: ["구조적 설명", "상황 묘사 정확"], weaknesses: [] },
    { model: "Gemini 3.1 Pro", company: "Google", flag: "🇺🇸", score: 90, response: "1. 놀람: \"뭐래?! 진짜로?\" 2. 화남: \"뭐래? 어떻게 그런 말을...\" 3. 궁금: \"뭐래? 무슨 말이야?\"...", time: "1.3s", strengths: ["기본 뉘앙스 파악"], weaknesses: ["미묘한 차이 설명 부족"] },
    { model: "DeepSeek R1", company: "DeepSeek", flag: "🇨🇳", score: 70, response: "이 문장은 다양한 뉘앙스를 가집니다. 1. 의문 2. 놀람 3. 비난...", time: "2.5s", strengths: ["카테고리 분류"], weaknesses: ["한국어 미묘한 뉘앙스 부족", "구체성 부족"] },
    { model: "Qwen3 235B", company: "Alibaba", flag: "🇨🇳", score: 65, response: "\"그 사람 뭐래?\"는 여러 가지 의미가 있을 수 있습니다...", time: "2.0s", strengths: [], weaknesses: ["한국어 뉘앙스 이해 부족", "일반적인 설명만"] },
  ],
};

export default function ExplorePromptBench() {
  const [activePrompt, setActivePrompt] = useState("summary");
  const data = RESULTS[activePrompt] || [];
  const sorted = [...data].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🎯 프롬프트 벤치마크</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          같은 프롬프트를 여러 모델에 입력한 결과를 직관적으로 비교해보세요.
        </p>
      </div>

      {/* Prompt selector */}
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePrompt(p.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePrompt === p.id
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Active prompt display */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded">
            {PROMPTS.find(p => p.id === activePrompt)?.category}
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
          {PROMPTS.find(p => p.id === activePrompt)?.prompt}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {sorted.map((r, idx) => {
          const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "";
          const barColor = r.score >= 90 ? "#22c55e" : r.score >= 80 ? "#3b82f6" : r.score >= 70 ? "#f59e0b" : "#ef4444";
          return (
            <div key={r.model} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{medal || `#${idx + 1}`}</span>
                  <span className="text-sm">{r.flag}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{r.model}</span>
                  <span className="text-[10px] text-gray-400">{r.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{r.time}</span>
                  <span className="px-2 py-0.5 text-xs font-black rounded-full" style={{
                    backgroundColor: r.score >= 90 ? "#dcfce7" : r.score >= 80 ? "#dbeafe" : "#fef3c7",
                    color: r.score >= 90 ? "#166534" : r.score >= 80 ? "#1e40af" : "#92400e",
                  }}>
                    {r.score}점
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.score}%`, backgroundColor: barColor }} />
              </div>

              {/* Response preview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 mb-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{r.response}</p>
              </div>

              {/* Strengths / Weaknesses */}
              <div className="flex flex-wrap gap-1">
                {r.strengths.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] rounded-full font-medium">
                    ✓ {s}
                  </span>
                ))}
                {r.weaknesses.map(w => (
                  <span key={w} className="px-2 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] rounded-full font-medium">
                    ✗ {w}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl px-4 py-3">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">⚠️ 주의사항</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
          결과는 2026년 4월 기준의 예시 응답이며, 모델 업데이트에 따라 실제 결과와 다를 수 있습니다.
          점수는 응답 품질·정확도·속도를 종합 평가한 것입니다.
        </p>
      </div>
    </div>
  );
}
