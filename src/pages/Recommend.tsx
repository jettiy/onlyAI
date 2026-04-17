import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { recommend, type RecommendResult } from '../lib/recommendEngine';
import { useCaseLabels, useCaseIcons, budgetLabels, envLabels, type UseCase, type BudgetTier, type EnvPreference } from '../data/modelStrengths';
import { CompanyLogo } from '../components/CompanyLogo';
import { models, companies, DATA_UPDATED_AT } from '../data/models';

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

// companyId → playground URL 맵
const companyPlaygroundMap = new Map<string, string>();
for (const c of companies) {
  if (c.playgroundUrl) companyPlaygroundMap.set(c.id, c.playgroundUrl);
}

function ResultCard({ result, rank }: { result: RecommendResult; rank: number }) {
  const isTop3 = rank < 3;
  const officialUrl = companyPlaygroundMap.get(result.companyId);
  const companyName = companies.find(c => c.id === result.companyId)?.name ?? result.companyId;
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border ${
      rank === 0 ? 'border-brand-400 dark:border-brand-600 ring-2 ring-brand-200 dark:ring-brand-900 shadow-lg' : 'border-gray-200 dark:border-gray-800'
    } p-6 ${isTop3 ? '' : 'opacity-80'}`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl">{MEDALS[rank]}</span>
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-center">
                <CompanyLogo company={companyName} size={40} />
              </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{result.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold">
              {result.score}점
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              {result.monthlyEst}
            </span>
            {result.isLocal && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">
                🖥️ 로컬
              </span>
            )}
          </div>

          {result.reason && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{result.reason}</p>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.tagline}</p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: '활용도', value: result.detailScores.useCase, max: 35 },
              { label: '경제성', value: result.detailScores.budget, max: 35 },
              { label: '한국어', value: result.detailScores.korean, max: 30 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[10px] text-gray-400 mb-1">{s.label}</p>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${(s.value / s.max) * 100}%` }} />
                </div>
                <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 mt-0.5">{Math.round(s.value)}/{s.max}</p>
              </div>
            ))}
          </div>

          {result.matchedUseCases.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {result.matchedUseCases.map(uc => (
                <span key={uc} className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full font-medium">
                  {useCaseIcons[uc]} {useCaseLabels[uc]}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>🇰🇷 한국어 {result.korean}/10</span>
            <span>🖥️ {result.envLabel}</span>
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto px-3 py-1 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-medium text-xs transition-colors"
              >
                바로 써보기 →
              </a>
            )}
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
    const env = (params.get('env') || 'both') as EnvPreference;
    return recommend({ useCases, budget, env });
  }, [params]);

  const useCases = (params.get('useCases') || '').split(',').filter(Boolean);
  const budget = params.get('budget') || 'free';
  const env = params.get('env') || 'both';

  const privacyLabel: Record<string, string> = { cloud: '웹 브라우저', local: '내 컴퓨터', both: '둘 다' };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-5 border border-brand-200 dark:border-brand-900">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI 추천 결과</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {useCases.length > 0 ? useCases.map(uc => (
            <span key={uc} className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-brand-700 dark:text-brand-400 rounded-lg font-medium shadow-sm">
              {useCaseIcons[uc as UseCase]} {useCaseLabels[uc as UseCase]}
            </span>
          )) : (
            <span className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-brand-700 dark:text-brand-400 rounded-lg font-medium shadow-sm">
              🎯 전체
            </span>
          )}
          <span className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 rounded-lg font-medium shadow-sm">
            💰 {budgetLabels[budget as BudgetTier] ?? budget}
          </span>
          <span className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 rounded-lg font-medium shadow-sm">
            🖥️ {privacyLabel[env] ?? env}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((r, i) => (
          <ResultCard key={r.id} result={r} rank={i} />
        ))}
      </div>

      {/* 다른 모델 제안 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💡 다른 모델도 봐야 해요</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          선택하신 조건 외에도 다양한 특징을 가진 모델들이 있습니다. 전체 모델 비교 페이지에서 더 많은 모델을 확인해보세요.
        </p>
        <Link to="/explore/compare" className="inline-block px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
          전체 비교하기 →
        </Link>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        <Link to="/" className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">
          ← 다시 추천받기
        </Link>
      </div>
    </div>
  );
}
