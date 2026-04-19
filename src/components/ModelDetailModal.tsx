import { useEffect, useState } from "react";
import { CompanyLogo } from "./CompanyLogo";
import { tierColors, tierLabels, type AIModel } from "../data/models";
import { estimateMonthlyCost, formatMonthlyCost } from "../lib/estimatedMonthlyCost";

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
