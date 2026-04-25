import { useEffect, useState } from "react";
import { CompanyLogo } from "./CompanyLogo";
import { tierColors, tierLabels, type AIModel } from "../data/models";
import { estimateMonthlyCost, formatMonthlyCost } from "../lib/estimatedMonthlyCost";
import { getAABenchmarks, type AABenchmarks } from "../lib/artificialAnalysis";

/** 모델 용도 기반 추천 질문 */
function getTryQuestions(model: AIModel): string[] {
  const name = model.name.toLowerCase();
  const strengths = model.strengths.map(s => s.toLowerCase());
  const questions: string[] = [];

  // 코딩/개발
  if (strengths.some(s => s.includes('코딩') || s.includes('개발') || s.includes('코드')) || name.includes('code') || name.includes('codex')) {
    questions.push("이 Python 코드에서 버그를 찾아줘", "REST API 엔드포인트를 작성해줘");
  }
  // 글쓰기/문서
  if (strengths.some(s => s.includes('글') || s.includes('문서') || s.includes('작성')) || name.includes('writer')) {
    questions.push("회의록을 5줄로 요약해줘", "블로그 글 주제 10개 추천해줘");
  }
  // 번역
  if (strengths.some(s => s.includes('번역')) || name.includes('translat')) {
    questions.push("이 영어 이메일을 한국어로 자연스럽게 번역해줘");
  }
  // 이미지
  if (strengths.some(s => s.includes('이미지') || s.includes('그림') || s.includes('이미지 생성')) || name.includes('dall') || name.includes('image') || name.includes('flux')) {
    questions.push("강아지가 우주복을 입고 있는 일러스트를 그려줘");
  }
  // 추론/분석
  if (strengths.some(s => s.includes('추론') || s.includes('분석') || s.includes('논리')) || name.includes('o3') || name.includes('o1') || name.includes('reason')) {
    questions.push("이 비즈니스 문제를 3가지 관점에서 분석해줘");
  }
  // 한국어
  if (strengths.some(s => s.includes('한국어')) || model.koreanSupport === 'A' || model.koreanSupport === 'B') {
    questions.push("존댓말로 정중한 이메일 초안을 작성해줘");
  }
  // 기본 질문 (항상)
  if (questions.length < 3) {
    questions.push("이메일을 공손하게 고쳐줘", "오늘 할 일을 우선순위대로 정리해줘", "어려운 개념을 초등학생도 이해할 수 있게 설명해줘");
  }
  return questions.slice(0, 4);
}

interface ModelDetailModalProps {
  model: AIModel;
  onClose: () => void;
}

const formatPrice = (price?: number | null) => {
  if (price === null || price === undefined) return "미공개";
  if (price === 0) return "무료";
  return `$${price}`;
};

export default function ModelDetailModal({ model, onClose }: ModelDetailModalProps) {
  const [isDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [aaData, setAaData] = useState<AABenchmarks | null>(null);

  useEffect(() => {
    getAABenchmarks(model.name).then(setAaData);
  }, [model.name]);

  const inputPriceValue = model.inputPrice ?? 0;
  const outputPriceValue = model.outputPrice ?? 0;
  const averagePrice = (inputPriceValue + outputPriceValue) / 2;
  const baseline = averagePrice > 0 ? averagePrice : 1;
  const inputPct = Math.min(100, (inputPriceValue / baseline) * 100);
  const outputPct = Math.min(100, (outputPriceValue / baseline) * 100);

  const cardBg = isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const cardBorder = isDark ? "border-gray-800" : "border-gray-200";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const subtleBg = isDark ? "bg-gray-800" : "bg-gray-50";

  const koreanGradeStyles: Record<NonNullable<AIModel["koreanSupport"]>, string> = {
    A: isDark
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : "bg-emerald-50 text-emerald-700 border-emerald-200",
    B: isDark
      ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
      : "bg-yellow-50 text-yellow-700 border-yellow-200",
    C: isDark
      ? "bg-red-500/15 text-red-300 border-red-500/30"
      : "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${cardBg} ${cardBorder}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className={`h-9 w-9 rounded-xl ${subtleBg} flex items-center justify-center`}>
                <CompanyLogo company={model.company} size={22} />
              </div>
              <div>
                <p className={`text-xs font-semibold ${mutedText}`}>{model.company}</p>
                <h2 className="text-lg font-bold">{model.name}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className={`${tierColors[model.tier]} px-2.5 py-0.5 text-xs rounded-full font-semibold`}>
                {tierLabels[model.tier]}
              </span>
              {model.isNew && (
                <span className="px-2.5 py-0.5 text-xs rounded-full font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
                  NEW
                </span>
              )}
            </div>
          </div>

          {/* Price section */}
          <div className={`rounded-xl border ${cardBorder} ${subtleBg} p-4 space-y-3`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className={`text-xs ${mutedText}`}>입력 가격 (1M 토큰)</p>
                <p className="text-base font-semibold">{formatPrice(model.inputPrice)}</p>
              </div>
              <div>
                <p className={`text-xs ${mutedText}`}>출력 가격 (1M 토큰)</p>
                <p className="text-base font-semibold">{formatPrice(model.outputPrice)}</p>
              </div>
              {model.cachedInputPrice !== null && model.cachedInputPrice !== undefined && (
                <div>
                  <p className={`text-xs ${mutedText}`}>캐시 입력 가격</p>
                  <p className="text-base font-semibold text-emerald-400">{`$${model.cachedInputPrice}`}</p>
                </div>
              )}
              <div>
                <p className={`text-xs ${mutedText}`}>컨텍스트</p>
                <p className="text-base font-semibold">{model.contextWindow}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={mutedText}>가격 비교 (평균 대비)</span>
                <span className={mutedText}>입력/출력 기준</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className={`h-2 w-full rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${inputPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] mt-1">
                    <span className={mutedText}>입력</span>
                    <span className={mutedText}>{formatPrice(model.inputPrice)}</span>
                  </div>
                </div>
                <div>
                  <div className={`h-2 w-full rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${outputPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] mt-1">
                    <span className={mutedText}>출력</span>
                    <span className={mutedText}>{formatPrice(model.outputPrice)}</span>
                  </div>
                </div>
              </div>
              {/* 월 예상 비용 */}
              <div className={`mt-2 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>💡 하루 30분 대화 기준 월 예상 비용</span>
                  <span className={`text-sm font-bold ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>{formatMonthlyCost(estimateMonthlyCost(model.inputPrice, model.outputPrice).total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${mutedText}`}>강점</p>
            <div className="flex flex-wrap gap-2">
              {model.strengths.map((strength) => (
                <span
                  key={strength}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"}`}
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          {/* Use cases */}
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${mutedText}`}>추천 사용처</p>
            <div className="flex flex-wrap gap-2">
              {model.useCases.map((useCase) => (
                <span
                  key={useCase}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isDark ? "bg-brand-500/15 text-brand-200" : "bg-brand-50 text-brand-700"}`}
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          {/* Korean support */}
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm font-semibold ${mutedText}`}>한국어 지원</p>
            {model.koreanSupport ? (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${koreanGradeStyles[model.koreanSupport]}`}
              >
                {model.koreanSupport} 등급
              </span>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                정보 없음
              </span>
            )}
          </div>

          {/* Arena Expert */}
          {model.arenaScore != null && model.arenaScore != undefined && (
            <div className={`rounded-xl border ${cardBorder} ${subtleBg} p-4 space-y-3`}>
              <p className={`text-xs font-semibold ${mutedText}`}>Arena Expert</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className={`text-[11px] ${mutedText}`}>점수</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{model.arenaScore}</p>
                </div>
                <div>
                  <p className={`text-[11px] ${mutedText}`}>신뢰구간</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{model.arenaCI ?? '-'}</p>
                </div>
                <div>
                  <p className={`text-[11px] ${mutedText}`}>투표수</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {model.arenaVotes != null ? `${model.arenaVotes.toLocaleString()}표` : '-'}
                  </p>
                </div>
                <div>
                  <p className={`text-[11px] ${mutedText}`}>순위범위</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {model.arenaRankSpread ? `${model.arenaRankSpread}위` : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Artificial Analysis 벤치마크 */}
          {aaData && (aaData.intelligenceIndex || aaData.codingIndex || aaData.mmluPro) && (
            <div className={`rounded-xl border ${cardBorder} ${subtleBg} p-4 space-y-3`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-semibold ${mutedText}`}>📊 성능 분석</p>
                <span className="text-[10px] opacity-50">Artificial Analysis</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {aaData.intelligenceIndex && (
                  <div>
                    <p className={`text-[11px] ${mutedText}`}>지능 지수</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{aaData.intelligenceIndex}</p>
                  </div>
                )}
                {aaData.codingIndex && (
                  <div>
                    <p className={`text-[11px] ${mutedText}`}>코딩 지수</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{aaData.codingIndex}</p>
                  </div>
                )}
                {aaData.mmluPro && (
                  <div>
                    <p className={`text-[11px] ${mutedText}`}>MMLU-Pro</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{aaData.mmluPro}%</p>
                  </div>
                )}
                {aaData.speed && (
                  <div>
                    <p className={`text-[11px] ${mutedText}`}>응답 속도</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{aaData.speed} t/s</p>
                  </div>
                )}
              </div>
              {aaData.updatedAt && (
                <p className={`text-[10px] ${mutedText}`}>데이터: {aaData.updatedAt}</p>
              )}
            </div>
          )}

          {/* 바로 써볼 질문 */}
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${mutedText}`}>💡 바로 써볼 질문</p>
            <div className="space-y-1.5">
              {getTryQuestions(model).map((q, i) => (
                <button
                  key={i}
                  onClick={() => navigator.clipboard.writeText(q)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                  title="클릭하면 복사됩니다"
                >
                  <span className="opacity-50 mr-1.5">{i + 1}.</span>{q}
                  <span className="float-right opacity-30 text-[10px]">복사</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className={`text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {model.description}
          </p>

          {/* Footer */}
          <div className={`flex flex-wrap items-center gap-3 pt-2 border-t border-dashed ${isDark ? "border-gray-700/40" : "border-gray-200"}`}>
            {model.sourceUrl && (
              <a
                href={model.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-brand-400 hover:text-brand-300"
              >
                공식 문서 →
              </a>
            )}
            {model.url && (
              <a
                href={model.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                바로 써보기 →
              </a>
            )}
            <button
              onClick={onClose}
              className={`ml-auto h-9 w-9 rounded-full border text-sm font-semibold transition ${isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"}`}
              aria-label="닫기"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
