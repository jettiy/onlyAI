export default function PromptsHow() {
  const frameworks = [
    {
      name: 'AIM',
      full: 'Audience · Intent · Message',
      icon: '🎯',
      desc: '누가(Audience) 어떤 목적으로(Intent) 어떤 메시지를(Message) 전달할지 명확히 정의하는 프레임워크.',
      example: 'Audience: 마케팅 초보 주니어\nIntent: 이메일 캠페인 작성 가이드\nMessage: 구체적인 템플릿과 팁 제공',
      tip: '타겟 독자를 먼저 정하면 응답 품질이 크게 올라가요',
    },
    {
      name: 'RISEN',
      full: 'Role · Instructions · Steps · End goal · Narrowing',
      icon: '🚀',
      desc: '역할·지시·단계·목표·제약을 체계적으로 구성해 복잡한 작업을 수행하는 프레임워크.',
      example: 'Role: 시니어 UX 리서처\nInstructions: 사용자 인터뷰 분석\nSteps: 1) 키워드 추출 2) 패턴 분석 3) 인사이트 도출\nEnd goal: 실행 가능한 디자인 제안\nNarrowing: B2B SaaS 제품으로 한정',
      tip: 'Steps를 구체적으로 쓸수록 AI가 놓치는 것이 줄어들어요',
    },
    {
      name: 'CARE',
      full: 'Context · Action · Result · Example',
      icon: '💡',
      desc: '맥락·행동·결과·예시를 제공해 AI가 정확한 형식과 품질로 응답하도록 유도합니다.',
      example: 'Context: 기술 블로그를 운영 중인 스타트업\nAction: SEO 최적화된 블로그 글 작성\nResult: 독자가 바로 실행할 수 있는 가이드\nExample: "5분 만에 Node.js API 만들기" 스타일',
      tip: 'Result에 "바로 사용 가능한 형태"를 명시하면 실용적인 답변이 나와요',
    },
    {
      name: 'COSTAR',
      full: 'Context · Objective · Style · Tone · Audience · Response',
      icon: '⭐',
      desc: '6가지 요소를 모두 명시해 가장 정교한 제어가 가능한 상세 프레임워크.',
      example: 'Context: AI 도입을 고려하는 중소기업 CEO\nObjective: 도입 우선순위 결정 보고서\nStyle: 전문적이고 간결한 보고서\nTone: 권위 있되 접근하기 쉽게\nAudience: 비기술 경영진\nResponse: 실행 계획이 포함된 요약 형식',
      tip: 'Style과 Tone을 따로 지정하면 뉘앙스 조절이 훨씬 쉬워요',
    },
  ];

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
        <p className="text-sm text-gray-500 dark:text-gray-400">검증된 프레임워크 4가지와 핵심 기법 6가지를 소개해요.</p>
      </div>

      {/* 프레임워크 섹션 */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">📋 프레임워크 (체계적 구조)</p>
        <div className="space-y-3">
          {frameworks.map(f => (
            <details key={f.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden group">
              <summary className="px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-gray-900 dark:text-white">{f.name}</h2>
                      <span className="text-[9px] px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded font-mono">{f.full}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl shrink-0">+</span>
              </summary>
              <div className="px-5 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-2 border-violet-400">
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">예시 프롬프트</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-mono whitespace-pre-line">{f.example}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-violet-600 dark:text-violet-400">
                  <span>💡</span><span>{f.tip}</span>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* 기법 섹션 */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🛠️ 핵심 기법 (빠르게 적용)</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {techniques.map(t => (
            <div key={t.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t.title}</h2>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t.desc}</p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-2 border-brand-400">
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

      {/* 팁 배너 */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">🎯 프롬프트 작성 순서 추천</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
          1) 프레임워크로 구조 잡기 → 2) 예시 추가 → 3) 제약 조건 명시 → 4) 결과 확인 → 5) 피드백으로 개선.
          처음엔 기법 몇 개만 써도 충분해요. 익숙해지면 프레임워크를 도입해보세요!
        </p>
      </div>
    </div>
  );
}