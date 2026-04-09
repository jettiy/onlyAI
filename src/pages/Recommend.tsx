import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { recommend, type RecommendResult } from '../lib/recommendEngine';
import { useCaseLabels, useCaseIcons, budgetLabels, type UseCase, type BudgetTier } from '../data/modelStrengths';
import { CompanyLogo } from '../components/CompanyLogo';

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

function ResultCard({ result, rank }: { result: RecommendResult; rank: number }) {
  const isTop3 = rank < 3;
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border ${
      rank === 0 ? 'border-blue-400 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-900 shadow-lg' : 'border-gray-200 dark:border-gray-800'
    } p-6 ${isTop3 ? '' : 'opacity-80'}`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl">{MEDALS[rank]}</span>
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 dark:border-gray-700 shrink-0">
          {result.logoId && <CompanyLogo company={result.companyId} size={40} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{result.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold">
              {result.score}점
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              {result.monthlyEst}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.tagline}</p>

          {/* 점수 상세 */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { label: '용도', value: result.detailScores.useCase, max: 40 },
              { label: '가격', value: result.detailScores.budget, max: 30 },
              { label: '한국어', value: result.detailScores.korean, max: 15 },
              { label: '개인정보', value: result.detailScores.privacy, max: 15 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[10px] text-gray-400 mb-1">{s.label}</p>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(s.value / s.max) * 100}%` }} />
                </div>
                <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 mt-0.5">{Math.round(s.value)}</p>
              </div>
            ))}
          </div>

          {/* 매칭된 용도 */}
          {result.matchedUseCases.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {result.matchedUseCases.map(uc => (
                <span key={uc} className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full font-medium">
                  {useCaseIcons[uc]} {useCaseLabels[uc]}
                </span>
              ))}
            </div>
          )}

          {/* 한국어 + 개인정보 */}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>🇰🇷 한국어 {result.korean}/10</span>
            <span>🔐 {result.privacy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecommendPage() {
  const [params] = useSearchParams();

  const results = useMemo(() => {
    const useCases = (params.get('useCases') || '').split(',').filter(Boolean) as UseCase[];
    const budget = (params.get('budget') || 'free') as BudgetTier;
    const privacy = (params.get('privacy') || 'medium') as 'high' | 'medium' | 'low';
    return recommend({ useCases, budget, privacy });
  }, [params]);

  const useCases = (params.get('useCases') || '').split(',').filter(Boolean);
  const budget = params.get('budget') || 'free';
  const privacy = params.get('privacy') || 'medium';

  const budgetLabel: Record<string, string> = { free: '무료', cheap: '월 1만원 이하', mid: '월 5만원 이하', premium: '상관없음' };
  const privacyLabel: Record<string, string> = { high: '매우 중요', medium: '보통', low: '상관없음' };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 선택 요약 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-900">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI 추천 결과</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {useCases.length > 0 ? useCases.map(uc => (
            <span key={uc} className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 rounded-lg font-medium shadow-sm">
              {useCaseIcons[uc as UseCase]} {useCaseLabels[uc as UseCase]}
            </span>
          )) : (
            <span className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 rounded-lg font-medium shadow-sm">
              🎯 전체
            </span>
          )}
          <span className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 rounded-lg font-medium shadow-sm">
            💰 {budgetLabel[budget]}
          </span>
          <span className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-400 rounded-lg font-medium shadow-sm">
            🔐 {privacyLabel[privacy]}
          </span>
        </div>
      </div>

      {/* 결과 */}
      <div className="space-y-4">
        {results.map((r, i) => (
          <ResultCard key={r.id} result={r} rank={i} />
        ))}
      </div>

      {/* 하단 액션 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        <Link to="/" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
          ← 다시 추천받기
        </Link>
        <Link to="/explore/compare" className="text-sm text-gray-500 dark:text-gray-400 font-medium hover:underline">
          전체 모델 비교하기 →
        </Link>
      </div>

      {/* 안내 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          💡 추천 점수는 용도 매칭(40점), 가격 적합도(30점), 한국어 성능(15점), 개인정보 보호(15점)로 계산됩니다.
          가격은 2026년 4월 기준이며 변경될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
