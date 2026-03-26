export default function PromptsHow() {
  const techniques = [
    { icon: '🎭', title: '역할 부여', desc: 'AI에게 특정 전문가 역할을 맡기면 전문적인 응답이 나와요.', example: '당신은 10년 경력의 재무 분석가입니다. 아래 재무제표를 분석해주세요.', tip: '"당신은 [역할]입니다" 로 시작해보세요' },
    { icon: '🔢', title: '단계별 지시', desc: 'AI가 복잡한 문제를 단계적으로 생각하도록 유도하면 정확도가 올라가요.', example: '이 수학 문제를 풀되, 단계별로 풀이 과정을 보여주세요.', tip: '"단계별로 생각해줘" 한 마디로도 효과 있어요' },
    { icon: '📝', title: '예시 제공 (Few-shot)', desc: '원하는 출력 형식의 예시를 1~3개 보여주면 AI가 패턴을 파악해요.', example: '입력: "사과" → 출력: "🍎 사과 (apple)"\n입력: "바나나" → 출력:', tip: '출력 형식이 중요할 때 특히 효과적' },
    { icon: '📋', title: '형식 지정', desc: '출력 형식을 명확히 지정하면 바로 사용 가능한 결과물이 나와요.', example: '결과를 마크다운 표 형식으로 작성해줘. 열은 모델명, 가격, 특징으로 구성해.', tip: 'JSON, 표, 불릿 포인트 등 원하는 형식을 직접 말하세요' },
    { icon: '🎯', title: '제약 조건', desc: '글자 수, 언어, 어조 등 제약 조건을 명시하면 원하는 결과를 얻기 쉬워요.', example: '아래 글을 200자 이내로 요약해줘. 초등학생도 이해할 수 있게.', tip: '제약이 많을수록 AI는 더 집중해요' },
    { icon: '🔄', title: '반복 개선', desc: '처음부터 완벽한 프롬프트를 쓰려 하지 말고, 피드백을 주며 점진적으로 개선해요.', example: '"좋은데, 더 친근한 톤으로 바꿔줘"\n"3번 항목을 더 구체적으로 설명해줘"', tip: '대화하듯 피드백을 주며 결과를 다듬어요' },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">✏️ 프롬프트 작성법</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">전문가들이 쓰는 핵심 프롬프트 기법 6가지를 소개해요.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {techniques.map(t => (
          <div key={t.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{t.icon}</span>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t.title}</h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t.desc}</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-2 border-blue-400">
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">예시</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-mono whitespace-pre-line">{t.example}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-violet-600 dark:text-violet-400">
              <span>💡</span><span>{t.tip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
