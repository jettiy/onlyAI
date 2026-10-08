import {Rocket, Target, TrendingUp} from "lucide-react";

export default function GuidePrompts() {
  return (
    <div className="space-y-8">
      <div>
 <h1 className="text-2xl font-black text-gray-900 dark:text-white"> 프롬프트 작성법</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI에게 원하는 결과를 정확하게 전달하는 방법</p>
      </div>

      {/* Basics */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4"><Target className="inline-block shrink-0 align-text-bottom" size={16} /> 기초: 프롬프트란?</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          프롬프트는 AI에게 주는 <strong>지시사항</strong>이에요. 레스토랑에서 주문할 때 메뉴판만 보는 것보다
          "매콤한 걸로, 매운 정도 3단계, 곱빼기로 주세요"라고 구체적으로 말하면 원하는 걸 정확히 받듯이,
          AI도 구체적으로 지시할수록 더 좋은 결과를 줘요.
        </p>
        <div className="space-y-3">
          <TipBox
            title="구체적으로 작성하세요"
            bad="글 써줘"
            good="블로그 포스팅 주제 '2026년 AI 트렌드'로 2000자 분량, 전문적이면서 읽기 쉬운 톤으로 작성해줘"
          />
          <TipBox
            title="역할을 부여하세요"
            bad="코드 리뷰해줘"
            good="너는 10년 차 시니어 개발자야. 다음 코드의 성능, 보안, 가독성 관점에서 리뷰해줘"
          />
          <TipBox
            title="형식을 지정하세요"
            bad="비교해줘"
            good="비교 결과를 마크다운 표로 정리해줘. 열: 항목, A, B. 행: 가격, 성능, 한국어 지원"
          />
        </div>
      </section>

      {/* Intermediate */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4"><TrendingUp className="inline-block shrink-0 align-text-bottom" size={16} />  중급: 더 좋은 결과 얻기</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Few-shot 예시 주기</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              AI에게 예시를 2~3개 보여주면 패턴을 빠르게 이해해요.
              "이런 식으로 답변해줘"라고 예시를 보여주면 형식과 톤을 정확히 맞춰줘요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">단계별로 나누기</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              복잡한 작업은 여러 단계로 나누어 지시하세요.
              "1단계: 분석, 2단계: 요약, 3단계: 제안" 식으로 나누면 정확도가 올라가요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">제약 조건 설정하기</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              글자 수, 톤, 대상 독자, 포맷 등 제약을 걸어두면 결과가 훨씬 일관성 있어요.
              "초등학생도 이해할 수 있게", "500자 이내로" 같은 제약이 도움돼요.
            </p>
          </div>
        </div>
      </section>

      {/* Advanced */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4"><Rocket className="inline-block shrink-0 align-text-bottom" size={16} /> 고급: 시스템 프롬프트 & 체인</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">시스템 프롬프트 활용</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              API를 사용할 때 시스템 프롬프트로 AI의 기본 성격과 규칙을 정할 수 있어요.
              "너는 항상 한국어로 답하고, 모르는 건 모른다고 해" 같은 기본 규칙을 설정하면 일관된 응답을 받을 수 있어요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">체인 오브 쏘트 (Chain of Thought)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              "단계별로 생각해보자"라고 하면 AI가 추론 과정을 보여주면서 더 정확한 답을 내놓아요.
              수학, 논리, 복잡한 분석에 특히 효과적이에요.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TipBox({ title, bad, good }: { title: string; bad: string; good: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{title}</p>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
 <span className="text-red-500 shrink-0"></span>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-through">{bad}</p>
        </div>
        <div className="flex items-start gap-2">
 <span className="text-emerald-500 shrink-0"></span>
          <p className="text-xs text-gray-700 dark:text-gray-300">{good}</p>
        </div>
      </div>
    </div>
  );
}
