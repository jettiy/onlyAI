import { useState } from "react";
import { Link } from "react-router-dom";
import { models, companies } from "../../data/models";

type Answer = {
  step: number;
  value: string;
};

const STEPS = [
  {
    id: "usecase",
    question: "주로 어떤 용도로 AI를 쓰실 건가요?",
    emoji: "🎯",
    options: [
      { value: "coding", label: "코딩 / 개발", icon: "💻" },
      { value: "writing", label: "글쓰기 / 번역", icon: "✍️" },
      { value: "analysis", label: "분석 / 연구", icon: "🔬" },
      { value: "chat", label: "대화 / 질문", icon: "💬" },
      { value: "image", label: "이미지 / 멀티모달", icon: "🖼️" },
    ],
  },
  {
    id: "korean",
    question: "한국어로 자주 사용하실 건가요?",
    emoji: "🇰🇷",
    options: [
      { value: "always", label: "항상 한국어로 사용해요", icon: "🇰🇷" },
      { value: "sometimes", label: "한국어·영어 반반", icon: "🌏" },
      { value: "rarely", label: "주로 영어로 사용해요", icon: "🇺🇸" },
    ],
  },
  {
    id: "budget",
    question: "예산은 어느 정도인가요?",
    emoji: "💰",
    options: [
      { value: "free", label: "완전 무료로만 쓰고 싶어요", icon: "🆓" },
      { value: "low", label: "월 1~2만원 정도는 괜찮아요", icon: "💵" },
      { value: "medium", label: "월 5~10만원까지 투자할 수 있어요", icon: "💳" },
      { value: "high", label: "성능이 좋으면 비용은 상관없어요", icon: "🚀" },
    ],
  },
  {
    id: "skill",
    question: "AI 사용 경험이 어느 정도인가요?",
    emoji: "📊",
    options: [
      { value: "beginner", label: "처음 써봐요", icon: "🌱" },
      { value: "intermediate", label: "ChatGPT 등 써봤어요", icon: "⭐" },
      { value: "advanced", label: "API나 코드로도 써봤어요", icon: "🔧" },
    ],
  },
];

// Scoring logic
function scoreModel(modelId: string, answers: Answer[]): number {
  let score = 0;
  const usecase = answers.find((a) => a.step === 0)?.value;
  const korean  = answers.find((a) => a.step === 1)?.value;
  const budget  = answers.find((a) => a.step === 2)?.value;
  const skill   = answers.find((a) => a.step === 3)?.value;

  // Coding usecase
  if (usecase === "coding") {
    if (["gpt-5-4", "gpt-4-1", "claude-opus-4-6", "claude-sonnet-4-6", "gemini-3-1-pro"].includes(modelId)) score += 40;
    if (["deepseek-v3-2", "deepseek-r1", "kimi-k2-5", "glm-5", "minimax-m2-7"].includes(modelId)) score += 35;
    if (["qwen-3-235b", "mimo-v2-pro"].includes(modelId)) score += 30;
  }
  // Writing usecase
  if (usecase === "writing") {
    if (["claude-opus-4-6", "claude-sonnet-4-6", "gpt-5-4"].includes(modelId)) score += 40;
    if (["gpt-5-4-mini", "claude-haiku-4-5", "qwen-3-235b"].includes(modelId)) score += 25;
    if (["minimax-m2-7", "glm-5"].includes(modelId)) score += 20;
  }
  // Analysis usecase
  if (usecase === "analysis") {
    if (["claude-opus-4-6", "gpt-5-4", "gemini-3-1-pro"].includes(modelId)) score += 40;
    if (["gpt-5-2", "gemini-2-5-pro", "kimi-k2-5", "deepseek-r1"].includes(modelId)) score += 30;
    if (["qwen-3-235b", "minimax-m2-7"].includes(modelId)) score += 25;
  }
  // Chat usecase
  if (usecase === "chat") {
    if (["gpt-5-4-mini", "claude-haiku-4-5", "gemini-2-5-flash"].includes(modelId)) score += 35;
    if (["gpt-4-1-mini", "glm-4-7-flash", "qwen-3-32b"].includes(modelId)) score += 30;
    if (["minimax-m2-5", "deepseek-v3-2"].includes(modelId)) score += 25;
  }
  // Image/Multimodal
  if (usecase === "image") {
    if (["gemini-3-1-pro", "gemini-3-pro", "gemini-2-5-pro", "gpt-5-4"].includes(modelId)) score += 40;
    if (["mimo-v2-omni", "kimi-k2-5", "qwen-3-235b"].includes(modelId)) score += 35;
    if (["minimax-m2-7"].includes(modelId)) score += 25;
  }

  // Korean
  const m = models.find((x) => x.id === modelId);
  if (!m) return 0;
  if (korean === "always" && m.koreanSupport === "A") score += 25;
  if (korean === "always" && m.koreanSupport === "B") score += 10;
  if (korean === "always" && m.koreanSupport === "C") score -= 10;
  if (korean === "sometimes" && (m.koreanSupport === "A" || m.koreanSupport === "B")) score += 15;

  // Budget
  const price = m.inputPrice ?? 999;
  if (budget === "free" && price === 0) score += 30;
  if (budget === "free" && price > 0) score -= 20;
  if (budget === "low" && price <= 0.5) score += 20;
  if (budget === "low" && price > 3) score -= 15;
  if (budget === "medium" && price <= 3) score += 20;
  if (budget === "medium" && price > 10) score -= 10;
  if (budget === "high") score += 5; // no penalty

  // Skill
  if (skill === "beginner") {
    if (["gpt-5-4", "gpt-5-4-mini", "claude-sonnet-4-6"].includes(modelId)) score += 15;
    // Chinese models: small penalty for beginners (Korean support docs/community less)
    if (m.region === "china") score -= 5;
    if (m.isLocal) score -= 15;
  }
  if (skill === "intermediate") {
    if (["deepseek-v3-2", "qwen-3-235b", "kimi-k2-5"].includes(modelId)) score += 10;
  }
  if (skill === "advanced") {
    if (m.isLocal) score += 10;
    if (m.inputPrice !== null && m.inputPrice < 0.5) score += 10;
    // Chinese models often have best API pricing — reward for advanced users
    if (m.region === "china" && m.inputPrice !== null && m.inputPrice < 1) score += 10;
  }

  return score;
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
  cohere: '/logos/cohere.png',
  zhipu: '/logos/deepseek.png',
};

const TIER_COLORS: Record<string, string> = {
  flagship: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800',
  strong: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
  efficient: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  local: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
};

const TIER_LABELS: Record<string, string> = {
  flagship: '플래그십',
  strong: '고성능',
  efficient: '효율',
  local: '로컬 전용',
};

export default function ExploreGuide() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [done, setDone] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (value: string) => {
    if (animating) return;
    const newAnswers = [...answers.filter((a) => a.step !== step), { step, value }];
    setAnswers(newAnswers);
    setAnimating(true);
    if (step < STEPS.length - 1) {
      setTimeout(() => {
        setStep(step + 1);
        setAnimating(false);
      }, 300);
    } else {
      setTimeout(() => {
        setDone(true);
        setAnimating(false);
      }, 300);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setDone(false);
    setAnimating(false);
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Compute results
  const results = done
    ? models
        .map((m) => ({ model: m, score: scoreModel(m.id, answers) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
    : [];

  const currentStep = STEPS[step];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🎯 나에게 맞는 AI 찾기</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          4가지 질문으로 최적의 AI 모델을 추천해드려요.
        </p>
      </div>

      {!done ? (
        <>
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>질문 {step + 1} / {STEPS.length}</span>
              <span>{Math.round(((step) / STEPS.length) * 100)}% 완료</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((step) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block">{currentStep.emoji}</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentStep.question}</h2>
            </div>

            <div className="space-y-3">
              {currentStep.options.map((opt) => {
                const isSelected = answers.find((a) => a.step === step)?.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={
                      "w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] " +
                      (isSelected
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 bg-white dark:bg-gray-800")
                    }
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className={"font-semibold text-sm " + (isSelected ? "text-brand-700 dark:text-brand-300" : "text-gray-700 dark:text-gray-300")}>
                      {opt.label}
                    </span>
                    {isSelected && <span className="ml-auto text-brand-500 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm hover:border-gray-400 transition-colors"
              >
                ← 이전
              </button>
            )}
            <Link
              to="/models"
              className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 self-center underline"
            >
              전체 모델 보기
            </Link>
          </div>

          {/* Answered steps summary */}
          {answers.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1">
              {answers.sort((a,b) => a.step - b.step).map((ans) => {
                const s = STEPS[ans.step];
                const opt = s.options.find((o) => o.value === ans.value);
                return (
                  <div key={ans.step} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{s.emoji}</span>
                    <span className="text-gray-400">{s.question.replace('?', '')}:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{opt?.icon} {opt?.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Results */
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-brand-50 to-brand-50 dark:from-brand-950/40 dark:to-brand-950/40 rounded-2xl border border-brand-100 dark:border-brand-900 p-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">추천 결과</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">내 답변 기준으로 가장 잘 맞는 모델 TOP 5예요.</p>
          </div>

          {/* Answer summary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">📋 내 선택</p>
            {answers.sort((a,b) => a.step - b.step).map((ans) => {
              const s = STEPS[ans.step];
              const opt = s.options.find((o) => o.value === ans.value);
              return (
                <div key={ans.step} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span>{s.emoji}</span>
                  <span className="font-medium">{opt?.icon} {opt?.label}</span>
                </div>
              );
            })}
          </div>

          {/* Result cards */}
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🤔</p>
              <p className="font-medium">조건에 맞는 모델을 찾기 어려워요.</p>
              <p className="text-sm mt-1">예산이나 조건을 조금 조정해보세요.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(({ model: m, score }, idx) => {
                const co = companies.find((c) => c.id === m.companyId);
                const medal = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][idx];
                return (
                  <div
                    key={m.id}
                    className={"bg-white dark:bg-gray-900 rounded-xl border-2 p-4 transition-all " + (
                      idx === 0
                        ? "border-yellow-400 dark:border-yellow-600 shadow-md"
                        : "border-gray-200 dark:border-gray-800"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Medal */}
                      <span className="text-2xl shrink-0 mt-0.5">{medal}</span>

                      {/* Logo */}
                      {COMPANY_LOGOS[m.companyId] ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-center p-0.5 mt-0.5">
                          <img src={COMPANY_LOGOS[m.companyId]} alt={m.company} className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                        </div>
                      ) : (
                        <span className="text-xl shrink-0 mt-0.5">{co?.flag}</span>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm">{m.name}</h3>
                          <span className={TIER_COLORS[m.tier] + " px-2 py-0.5 text-[10px] rounded-full font-medium"}>
                            {TIER_LABELS[m.tier]}
                          </span>
                          {m.isNew && <span className="px-2 py-0.5 text-[10px] rounded-full font-medium bg-red-50 dark:bg-red-900/30 text-red-500">NEW</span>}
                          {m.koreanSupport && (
                            <span className={
                              "px-2 py-0.5 text-[10px] font-bold rounded-full border " +
                              (m.koreanSupport === 'A'
                                ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800"
                                : m.koreanSupport === 'B'
                                ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                                : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700")
                            }>
                              🇰🇷 한국어 {m.koreanSupport}등급
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{m.description}</p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {m.strengths.slice(0, 3).map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] rounded-full">{s}</span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {m.inputPrice === 0
                              ? <span className="text-green-600 font-bold">🆓 무료</span>
                              : m.inputPrice !== null
                              ? <span>입력 <strong className="text-gray-700 dark:text-gray-300">${m.inputPrice}</strong> / 출력 <strong className="text-gray-700 dark:text-gray-300">${m.outputPrice}</strong> (1M 토큰)</span>
                              : <span>가격 미공개</span>
                            }
                          </div>
                          <div className="flex gap-2">
                            {co?.playgroundUrl && (
                              <a href={co.playgroundUrl} target="_blank" rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                바로 사용 →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Score badge */}
                      <div className="shrink-0 text-right">
                        <div className={"text-lg font-black " + (idx === 0 ? "text-yellow-500" : "text-gray-400 dark:text-gray-500")}>
                          {score}점
                        </div>
                        <div className="text-[10px] text-gray-400">적합도</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              🔄 다시 하기
            </button>
            <Link
              to="/models"
              className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 font-semibold text-sm text-white text-center transition-colors"
            >
              📋 전체 모델 보기
            </Link>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            추천 점수는 선택 답변 기반 알고리즘이에요. 실제 사용 목적에 따라 다를 수 있어요.
          </p>
        </div>
      )}
    </div>
  );
}
