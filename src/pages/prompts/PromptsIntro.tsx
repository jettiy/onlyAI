export default function PromptsIntro() {
  const concepts = [
    { icon: '💬', title: '프롬프트란?', desc: 'AI에게 보내는 메시지 전체예요. 질문, 지시, 맥락, 예시 등 모든 입력이 프롬프트입니다.' },
    { icon: '🎯', title: '왜 중요한가요?', desc: '같은 AI라도 어떻게 말하느냐에 따라 결과가 완전히 달라져요. 프롬프트가 AI 출력의 품질을 결정해요.' },
    { icon: '🔄', title: '프롬프트 엔지니어링', desc: 'AI에게 더 좋은 답변을 이끌어내도록 프롬프트를 설계·최적화하는 기술이에요.' },
  ];
  const examples = [
    {
      bad: '번역해줘',
      good: '아래 한국어 문장을 자연스러운 영어로 번역해줘. 격식체(formal)로 작성하고, 의미가 모호한 부분이 있으면 두 가지 번역 예시를 줘.',
      label: '번역 요청'
    },
    {
      bad: '코드 고쳐줘',
      good: 'Python 3.11 환경에서 아래 코드가 TypeError를 발생시켜요. 오류 원인을 설명하고 수정된 코드를 제공해줘. 주석도 추가해줘.',
      label: '코드 디버깅'
    },
    {
      bad: '요약해줘',
      good: '아래 기사를 3줄로 요약해줘. 각 줄은 핵심 사실 하나씩을 담고, 숫자/이름 등 구체적 정보를 포함해.',
      label: '문서 요약'
    },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">💡 프롬프트가 뭔가요?</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">AI를 잘 쓰려면 먼저 프롬프트를 이해해야 해요.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {concepts.map(c => (
          <div key={c.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <span className="text-2xl mb-3 block">{c.icon}</span>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{c.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔍 좋은 프롬프트 vs 나쁜 프롬프트</h2>
        <div className="space-y-4">
          {examples.map(ex => (
            <div key={ex.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{ex.label}</span>
              </div>
              <div className="p-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-4 h-4 bg-red-100 dark:bg-red-900/30 text-red-500 text-[9px] font-bold flex items-center justify-center rounded">✗</span>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">모호한 프롬프트</span>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-gray-300 font-mono">{ex.bad}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-4 h-4 bg-green-100 dark:bg-green-900/30 text-green-500 text-[9px] font-bold flex items-center justify-center rounded">✓</span>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">구체적인 프롬프트</span>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{ex.good}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-5">
        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">💡 핵심 원칙</h3>
        <ul className="space-y-1.5">
          {['구체적으로 말하세요 — "좀 더" 보다 "3줄로" 가 낫습니다', '맥락을 제공하세요 — 왜, 누구를 위해, 어떤 형식으로', '역할을 부여하세요 — "전문 번역가로서"', '예시를 보여주세요 — AI는 패턴을 학습해요'].map(tip => (
            <li key={tip} className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <span className="text-blue-400 shrink-0 mt-0.5">▸</span>{tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
