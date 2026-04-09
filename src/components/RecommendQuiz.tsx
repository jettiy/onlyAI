import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseLabels, useCaseIcons, budgetLabels, type UseCase, type BudgetTier } from '../data/modelStrengths';

const STEPS = ['용도', '예산', '환경', '개인정보'] as const;

const USE_CASES: { key: UseCase | 'all'; icon: string; label: string }[] = [
  { key: 'writing', icon: '✍️', label: '글쓰기·번역' },
  { key: 'coding', icon: '💻', label: '코딩·개발' },
  { key: 'image', icon: '🖼️', label: '이미지 생성' },
  { key: 'video', icon: '🎬', label: '비디오 생성' },
  { key: 'summary', icon: '📊', label: '문서 요약·분석' },
  { key: 'chat', icon: '💬', label: '대화·상담' },
  { key: 'all', icon: '🎯', label: '전부 다' },
];

const BUDGETS: { key: BudgetTier; icon: string; label: string; desc: string }[] = [
  { key: 'free', icon: '🆓', label: '무료만', desc: '비용 없이 사용' },
  { key: 'cheap', icon: '💰', label: '월 1만원 이하', desc: '가성비 우선' },
  { key: 'mid', icon: '💳', label: '월 5만원 이하', desc: '품질까지 고려' },
  { key: 'premium', icon: '💎', label: '상관없음', desc: '성능 최우선' },
];

const PRIVACY_OPTIONS = [
  { key: 'high', icon: '🔒', label: '매우 중요', desc: '데이터를 보내고 싶지 않아' },
  { key: 'medium', icon: '📋', label: '보통', desc: '상용 서비스는 괜찮아' },
  { key: 'low', icon: '🌐', label: '상관없음', desc: '최고 성능이 중요해' },
];

export default function RecommendQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([]);
  const [budget, setBudget] = useState<BudgetTier>('free');
  const [privacy, setPrivacy] = useState<'high' | 'medium' | 'low'>('medium');

  const toggleUseCase = (uc: UseCase | 'all') => {
    if (uc === 'all') {
      setSelectedUseCases([]);
      return;
    }
    setSelectedUseCases(prev =>
      prev.includes(uc as UseCase)
        ? prev.filter(u => u !== uc)
        : [...prev, uc as UseCase]
    );
  };

  const handleSubmit = () => {
    const params = new URLSearchParams();
    params.set('useCases', selectedUseCases.join(','));
    params.set('budget', budget);
    params.set('privacy', privacy);
    navigate(`/recommend?${params.toString()}`);
  };

  const canNext = () => {
    if (step === 0) return true; // 전부 다도 허용
    if (step === 1) return true;
    if (step === 2) return true;
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: 용도 */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">어떤 용도로 AI를 쓰시나요?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">복수 선택 가능합니다.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {USE_CASES.map(uc => (
              <button key={uc.key} onClick={() => toggleUseCase(uc.key as UseCase | 'all')}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  (uc.key === 'all' && selectedUseCases.length === 0) || selectedUseCases.includes(uc.key as UseCase)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800'
                }`}>
                <span className="text-2xl block mb-1">{uc.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{uc.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: 예산 */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">월 예산은 어느 정도인가요?</h2>
          <div className="space-y-3">
            {BUDGETS.map(b => (
              <button key={b.key} onClick={() => setBudget(b.key)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  budget === b.key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}>
                <span className="text-2xl">{b.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{b.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{b.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: 환경 */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">어디서 AI를 사용하시나요?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">클라우드 API면 웹에서 바로 사용, 로컬이면 컴퓨터에 직접 설치합니다.</p>
          <div className="space-y-3">
            {[
              { icon: '🌐', label: '웹 브라우저', desc: '클라우드 API 사용 (ChatGPT, Claude 등)', key: 'cloud' },
              { icon: '🖥️', label: '내 컴퓨터', desc: '로컬에서 직접 실행 (Ollama 등)', key: 'local' },
              { icon: '🔍', label: '둘 다 궁금해', desc: '비교해보고 싶어', key: 'both' },
            ].map(opt => (
              <button key={opt.key}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-all"
                onClick={() => setStep(3)}>
                <span className="text-2xl">{opt.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                </div>
                <span className="ml-auto text-gray-400">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 개인정보 */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">개인정보 보호가 중요한가요?</h2>
          <div className="space-y-3">
            {PRIVACY_OPTIONS.map(opt => (
              <button key={opt.key} onClick={() => setPrivacy(opt.key as typeof privacy)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  privacy === opt.key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}>
                <span className="text-2xl">{opt.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            ← 이전
          </button>
        ) : <div />}
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} disabled={!canNext()}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            다음 →
          </button>
        ) : (
          <button onClick={handleSubmit}
            className="px-8 py-3 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
            🎯 결과 보기
          </button>
        )}
      </div>
    </div>
  );
}
