import { useState } from "react";
import {
  models, companies, tierLabels, tierColors, priceExamples,
  type Region, type ModelTier, type AIModel
} from "../data/models";
import { LOGO_ID_TO_PATH } from "../lib/logoUtils";


type View = "featured" | "all" | string; // string = companyId

const regionGroups: { region: Region; flag: string; label: string; subFlags?: string }[] = [
  { region: "us",    flag: "🇺🇸", label: "미국" },
  { region: "china", flag: "🇨🇳", label: "중국" },
  { region: "other", flag: "🌏",  label: "기타 국가", subFlags: "🇫🇷🇨🇦" },
];

// ── 모델 비교 패널 ──────────────────────────────────────
function ComparePanel({ selectedIds, onClose, onRemove }: {
  selectedIds: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const compareModels = selectedIds.map((id) => models.find((m) => m.id === id)!).filter(Boolean);
  if (compareModels.length < 2) return null;

  const minInput = Math.min(...compareModels.filter((m) => m.inputPrice !== null).map((m) => m.inputPrice!));
  const maxCtx   = Math.max(...compareModels.map((m) => parseInt(m.contextWindow) || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">⚡ 모델 비교</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">✕</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 w-28">항목</th>
                {compareModels.map((m) => (
                  <th key={m.id} className="text-left px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-base">{companies.find((c) => c.id === m.companyId)?.flag}</span>
                      <span className="font-bold text-gray-900 dark:text-white text-xs">{m.name}</span>
                      <button onClick={() => onRemove(m.id)} className="ml-1 text-gray-400 hover:text-red-400 text-xs">✕</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium">회사</td>
                {compareModels.map((m) => (
                  <td key={m.id} className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">{m.company}</td>
                ))}
              </tr>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium">등급</td>
                {compareModels.map((m) => (
                  <td key={m.id} className="px-4 py-3">
                    <span className={tierColors[m.tier] + " px-2 py-0.5 text-xs rounded-full font-medium"}>
                      {tierLabels[m.tier]}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium">입력 가격<br /><span className="text-[10px]">($/1M 토큰)</span></td>
                {compareModels.map((m) => (
                  <td key={m.id} className={"px-4 py-3 text-xs font-bold " + (m.inputPrice === minInput ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300")}>
                    {m.inputPrice === 0 ? "🆓 무료" : m.inputPrice !== null ? `$${m.inputPrice}` : "미공개"}
                    {m.inputPrice === minInput && m.inputPrice !== null && (
                      <span className="ml-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 px-1 rounded">최저</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium">출력 가격<br /><span className="text-[10px]">($/1M 토큰)</span></td>
                {compareModels.map((m) => (
                  <td key={m.id} className="px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                    {m.outputPrice === 0 ? "🆓 무료" : m.outputPrice !== null ? `$${m.outputPrice}` : "미공개"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium">컨텍스트</td>
                {compareModels.map((m) => (
                  <td key={m.id} className={"px-4 py-3 text-xs font-bold " + (parseInt(m.contextWindow) === maxCtx ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300")}>
                    {m.contextWindow}
                    {parseInt(m.contextWindow) === maxCtx && (
                      <span className="ml-1 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1 rounded">최대</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium">강점</td>
                {compareModels.map((m) => (
                  <td key={m.id} className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {m.strengths.slice(0, 3).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] rounded-full">{s}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium">파라미터</td>
                {compareModels.map((m) => (
                  <td key={m.id} className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">{m.params ?? "미공개"}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-400">💡 초록색 = 해당 항목 최적값 · 가격은 2026-03-19 기준 공식 API 페이지</p>
        </div>
      </div>
    </div>
  );
}

export default function Models() {
  const [view, setView]           = useState<View>("featured");
  const [openRegion, setOpenRegion] = useState<Region | null>("us");
  const [tierFilter, setTierFilter] = useState<ModelTier | "all">("all");
  const [sortBy, setSortBy]         = useState<"tier" | "price">("tier");
  const [showPriceCalc, setShowPriceCalc] = useState(false);
  const [selectedExample, setSelectedExample] = useState(0);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const tierOrder: Record<ModelTier, number> = { flagship: 0, strong: 1, efficient: 2, local: 3 };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  };

  const selectedCompany = view !== "featured" && view !== "all"
    ? companies.find((c) => c.id === view) ?? null
    : null;

  const displayedModels = models
    .filter((m) => {
      if (view === "featured") return m.isFeatured;
      if (view === "all") return true;
      return m.companyId === view;
    })
    .filter((m) => tierFilter === "all" || m.tier === tierFilter)
    .filter((m) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.useCases.some((u) => u.toLowerCase().includes(q))
      );
    })
    .sort((a, b) =>
      sortBy === "price"
        ? (a.inputPrice ?? 999) - (b.inputPrice ?? 999)
        : tierOrder[a.tier] - tierOrder[b.tier]
    );

  const ex = priceExamples[selectedExample];

  return (
    <div className="space-y-6">
      {/* Compare Panel */}
      {showCompare && (
        <ComparePanel
          selectedIds={compareIds}
          onClose={() => setShowCompare(false)}
          onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        />
      )}

      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">🤖 AI 모델 가이드</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            2026년 3월 기준 · 최신 모델 데이터 · 가격은 공식 API 페이지 기준이에요.
          </p>
        </div>
        <button
          onClick={() => setShowCompare(true)}
          disabled={compareIds.length < 2}
          className={"flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-all " + (
            compareIds.length >= 2
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed"
          )}
        >
          <span>⚡</span>
          모델 비교
          {compareIds.length > 0 && (
            <span className={"text-xs font-bold px-1.5 py-0.5 rounded-full " + (compareIds.length >= 2 ? "bg-white/30 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500")}>
              {compareIds.length}/3
            </span>
          )}
        </button>
      </div>

      {compareIds.length > 0 && compareIds.length < 2 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-300">
          ⚡ 모델을 하나 더 선택하면 비교할 수 있어요. (최대 3개)
        </div>
      )}
      {compareIds.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">비교 중:</span>
          {compareIds.map((id) => {
            const m = models.find((m) => m.id === id);
            return m ? (
              <span key={id} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                {m.name}
                <button onClick={() => toggleCompare(id)} className="ml-0.5 text-blue-400 hover:text-blue-600">✕</button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* 가격 계산기 배너 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl border border-blue-100 dark:border-blue-900 p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-300 text-sm">💡 1M 토큰이 뭔가요?</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">실제 사용 예시로 비용을 직접 계산해보세요.</p>
          </div>
          <button
            onClick={() => setShowPriceCalc(!showPriceCalc)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showPriceCalc ? "닫기" : "비용 계산기 열기"}
          </button>
        </div>

        {showPriceCalc && (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">사용 사례 선택</p>
              <div className="flex flex-wrap gap-2">
                {priceExamples.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedExample(i)}
                    className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border " + (
                      selectedExample === i
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                    )}
                  >
                    {e.icon} {e.useCase}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{ex.icon} {ex.useCase}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{ex.description}</p>

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 grid grid-cols-3 gap-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-900 dark:text-white">{ex.tokensInput.toLocaleString()}</p>
                  <p>입력 토큰/회</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-900 dark:text-white">{ex.tokensOutput.toLocaleString()}</p>
                  <p>출력 토큰/회</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-900 dark:text-white">{ex.timesPerMonth.toLocaleString()}회</p>
                  <p>월 사용횟수</p>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">모델별 월 예상 비용 비교</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {[...models]
                  .filter((m) => m.inputPrice !== null)
                  .sort((a, b) => {
                    const costA = ((a.inputPrice! * ex.tokensInput + a.outputPrice! * ex.tokensOutput) / 1_000_000) * ex.timesPerMonth;
                    const costB = ((b.inputPrice! * ex.tokensInput + b.outputPrice! * ex.tokensOutput) / 1_000_000) * ex.timesPerMonth;
                    return costA - costB;
                  })
                  .slice(0, 10)
                  .map((m) => {
                    const monthlyCost = ((m.inputPrice! * ex.tokensInput + m.outputPrice! * ex.tokensOutput) / 1_000_000) * ex.timesPerMonth;
                    return (
                      <div key={m.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                            {companies.find((c) => c.id === m.companyId)?.flag}
                          </span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{m.name}</span>
                        </div>
                        <span className={"text-xs font-bold shrink-0 " + (monthlyCost < 1 ? "text-green-600" : monthlyCost < 5 ? "text-blue-600" : "text-gray-700 dark:text-gray-300")}>
                          {monthlyCost < 0.01 ? "< $0.01" : `$${monthlyCost.toFixed(2)}`}
                          <span className="text-gray-400 font-normal">/월</span>
                        </span>
                      </div>
                    );
                  })
                }
              </div>
              <p className="text-[10px] text-gray-400 mt-2">* 상위 10개 저가 모델만 표시 · 실제 비용은 프로바이더·캐싱에 따라 다를 수 있어요</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-6 items-start">

        {/* ── 좌측 사이드바: 국가 → 회사 ── */}
        <aside className="space-y-2">
          {/* 주요 모델 */}
          <button
            onClick={() => setView("featured")}
            className={"w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all " + (
              view === "featured"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-blue-300"
            )}
          >
            <span>⭐</span> 주요 모델 추천
            <span className="ml-auto text-xs opacity-70">{models.filter((m) => m.isFeatured).length}개</span>
          </button>

          {/* 전체 모델 */}
          <button
            onClick={() => setView("all")}
            className={"w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all " + (
              view === "all"
                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-400"
            )}
          >
            <span>📋</span> 전체 모델 보기
            <span className="ml-auto text-xs opacity-70">{models.length}개</span>
          </button>

          {/* 국가 아코디언 */}
          {regionGroups.map(({ region, flag, label, subFlags }) => {
            const regionCompanies = companies.filter((c) => c.region === region);
            const isOpen = openRegion === region;
            const hasActiveCompany = regionCompanies.some((c) => c.id === view);

            return (
              <div key={region} className={"rounded-xl border-2 overflow-hidden transition-all " + (
                hasActiveCompany
                  ? "border-blue-300 dark:border-blue-700"
                  : "border-gray-200 dark:border-gray-800"
              )}>
                <button
                  onClick={() => setOpenRegion(isOpen ? null : region)}
                  className={"w-full flex items-center justify-between px-4 py-3 transition-colors " + (
                    hasActiveCompany
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <span className="flex items-center gap-2 font-semibold text-sm text-gray-800 dark:text-gray-200">
                    <span className="text-xl">{flag}</span>
                    {label}
                    {subFlags && !isOpen && (
                      <span className="text-sm tracking-tight opacity-70">{subFlags}</span>
                    )}
                    <span className="text-xs font-normal text-gray-400">({regionCompanies.length}개사)</span>
                  </span>
                  <span className={"text-gray-400 text-xs transition-transform duration-200 " + (isOpen ? "rotate-180" : "")}>▼</span>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-2 flex flex-col gap-1">
                    {regionCompanies.map((company) => {
                      const count = models.filter((m) => m.companyId === company.id).length;
                      const isActive = view === company.id;
                      return (
                        <button
                          key={company.id}
                          onClick={() => setView(company.id)}
                          className={"w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all " + (
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
                          )}
                        >
                          <span className="flex items-center gap-2 font-medium">
                            {LOGO_ID_TO_PATH[company.id] ? (
                              <div className="w-5 h-5 rounded overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex-shrink-0">
                                <img src={LOGO_ID_TO_PATH[company.id]} alt={company.name} className="w-full h-full object-contain p-[1px]" />
                              </div>
                            ) : (
                              <span className="text-base">{company.flag}</span>
                            )}
                            {company.name}
                          </span>
                          <span className={"text-xs px-1.5 py-0.5 rounded-full font-medium " + (
                            isActive
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          )}>{count}개</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* ── 우측: 모델 목록 ── */}
        <div className="space-y-4">

          {/* 선택 회사 정보 */}
          {selectedCompany ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
              <span className="text-5xl">{selectedCompany.flag}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedCompany.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCompany.country} · {selectedCompany.description}</p>
                <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 mt-1 inline-block">
                  공식 가격 페이지 →
                </a>
              </div>
            </div>
          ) : view === "featured" ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-4">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">⭐ 각 국가 대표 추천 모델만 선별했어요. 좌측에서 회사·전체 보기를 선택하세요.</p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">📋 전체 모델 {models.length}개 · 모든 회사 포함</p>
            </div>
          )}

          {/* 필터 */}
          <div className="flex flex-col gap-2">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="모델명, 회사, 용도로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">
                  ✕
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "flagship", "strong", "efficient"] as const).map((t) => (
                <button key={t} onClick={() => setTierFilter(t)}
                  className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (
                    tierFilter === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
                  )}>
                  {t === "all" ? "전체 등급" : tierLabels[t]}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {[{v:"tier",l:"등급순"},{v:"price",l:"가격순"}].map((s) => (
                <button key={s.v} onClick={() => setSortBy(s.v as "tier"|"price")}
                  className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (
                    sortBy === s.v
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
                  )}>
                  {s.l}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 self-center">{displayedModels.length}개</span>
            </div>
          </div>

          {/* 모델 카드 목록 */}
          {displayedModels.length === 0 && searchQuery ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-gray-600 dark:text-gray-400">"{searchQuery}"에 해당하는 모델이 없어요</p>
              <button onClick={() => setSearchQuery("")} className="mt-3 text-sm text-blue-500 hover:underline">검색 초기화</button>
            </div>
          ) : displayedModels.length === 0 ? (
            <div className="text-center py-16 text-gray-400">조건에 맞는 모델이 없어요.</div>
          ) : (
            <div className="space-y-3">
              {displayedModels.map((m) => (
                <ModelCard
                  key={m.id}
                  model={m}
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                  onCompanyClick={(id) => {
                    const c = companies.find((c) => c.id === id);
                    if (c) setOpenRegion(c.region);
                    setView(id);
                  }}
                />
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-600 text-center pt-2">
            가격은 공식 API 페이지 기준 (2026-03-19). 변동될 수 있어요.
          </p>
        </div>
      </div>

      {compareIds.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-200 p-3 flex items-center gap-3">
            <div className="flex-1 flex gap-2 flex-wrap">
              {compareIds.map((id) => {
                const m = models.find((m) => m.id === id);
                const co = companies.find((c) => c.id === m?.companyId);
                return m ? (
                  <span key={id} className="flex items-center gap-1 px-2 py-1 bg-white/10 dark:bg-black/10 rounded-full text-xs font-medium">
                    <span>{co?.flag}</span>
                    {m.name}
                    <button onClick={() => toggleCompare(id)} className="ml-0.5 opacity-50 hover:opacity-100 text-xs">x</button>
                  </span>
                ) : null;
              })}
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {compareIds.length < 2 && (
                <span className="text-xs opacity-50 whitespace-nowrap">1개 더 선택하세요</span>
              )}
              <button
                onClick={() => { if (compareIds.length >= 2) setShowCompare(true); }}
                disabled={compareIds.length < 2}
                className={"px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap " + (
                  compareIds.length >= 2
                    ? "bg-blue-500 hover:bg-blue-400 text-white cursor-pointer"
                    : "bg-white/20 dark:bg-black/20 opacity-50 cursor-not-allowed"
                )}
              >
                비교 ({compareIds.length}/3)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


function ModelCard({ model, onCompanyClick, compareIds, onToggleCompare }: { model: AIModel; onCompanyClick: (id: string) => void; compareIds: string[]; onToggleCompare: (id: string) => void }) {
  const companyData = companies.find((c) => c.id === model.companyId);
  const isSelected = compareIds.includes(model.id);
  const canAdd = compareIds.length < 3 || isSelected;
  return (
    <div className={"bg-white dark:bg-gray-900 rounded-xl border-2 p-4 transition-colors " + (isSelected ? "border-blue-400 dark:border-blue-600" : "border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700")}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Real Logo */}
            {LOGO_ID_TO_PATH[model.companyId] ? (
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={LOGO_ID_TO_PATH[model.companyId]}
                  alt={model.company}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            ) : (
              <span className="text-base">{companyData?.flag ?? ""}</span>
            )}
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              {companyData?.name ?? model.company}
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{model.name}</h3>
            <span className={tierColors[model.tier] + " px-2 py-0.5 text-xs rounded-full font-medium"}>{tierLabels[model.tier]}</span>
            {model.isNew && <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-red-50 dark:bg-red-900/30 text-red-500">NEW</span>}
            {model.isLocal && <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-orange-50 dark:bg-orange-900/30 text-orange-500">로컬 가능</span>}
            {model.inputPrice === 0 && <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-green-50 dark:bg-green-900/30 text-green-600">무료</span>}
          </div>
          <button
            onClick={() => onCompanyClick(model.companyId)}
            className="text-xs text-blue-500 hover:text-blue-700 mb-1.5 underline underline-offset-2"
          >
            {model.company} 전체 모델 →
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
            {model.releaseDate} 출시 · {model.contextWindow} 컨텍스트{model.params ? " · " + model.params : ""}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{model.description}</p>
          <div className="flex flex-wrap gap-1">
            {model.koreanSupport && (
              <span className={
                "px-2 py-0.5 text-[10px] font-bold rounded-full border " +
                (model.koreanSupport === 'A'
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  : model.koreanSupport === 'B'
                  ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                )
              }>
                🇰🇷 한국어 {model.koreanSupport}등급
              </span>
            )}
            {model.strengths.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">{s}</span>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 min-w-[120px] text-right">
            <p className="text-[10px] text-gray-400 mb-1">1M 토큰당</p>
            {model.inputPrice === 0
              ? <p className="text-sm font-bold text-green-600">무료</p>
              : model.inputPrice !== null
                ? <>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">입력 ${model.inputPrice}</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">출력 ${model.outputPrice}</p>
                  </>
                : <p className="text-xs text-gray-400">미공개</p>
            }
            <a href={model.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-blue-400 hover:text-blue-600 mt-1 block">
              출처 →
            </a>
            {companyData?.playgroundUrl && (
              <a href={companyData.playgroundUrl} target="_blank" rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors w-full">
                바로 사용하기 →
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-1 items-center">
        {model.useCases.map((u) => (
          <span key={u} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">{u}</span>
        ))}
        <button
          onClick={() => onToggleCompare(model.id)}
          disabled={!canAdd}
          className={"ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all " + (
            isSelected
              ? "bg-blue-600 text-white border-blue-600"
              : canAdd
                ? "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600"
                : "opacity-30 cursor-not-allowed bg-white dark:bg-gray-800 text-gray-400 border-gray-200"
          )}
        >
          {isSelected ? "✓ 비교 중" : "+ 비교"}
        </button>
      </div>
    </div>
  );
}
