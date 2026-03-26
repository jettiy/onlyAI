export default function OpenClawGuide() {
  const useCases = [
    { icon: '📊', title: '투자 리포트 자동화', desc: '매일 오전 9시, 관심 종목 시세·뉴스를 분석해 텔레그램으로 자동 발송', badge: '크론 자동화' },
    { icon: '📰', title: 'AI 뉴스 일일 요약', desc: '주요 AI 뉴스를 수집·번역·요약해 매일 저녁 정리된 브리핑으로 수신', badge: 'RSS + 에이전트' },
    { icon: '🌤️', title: '날씨·일정 통합 알림', desc: '외출 전 날씨·당일 캘린더·준비물을 한 번에 요약해 아침에 수신', badge: '다중 API 연동' },
    { icon: '🤖', title: '멀티에이전트 리서치', desc: '여러 AI가 협력해 깊이 있는 리서치 보고서를 자동으로 생성', badge: '멀티에이전트' },
    { icon: '💬', title: '텔레그램 AI 비서', desc: '텔레그램에서 언제든 AI에게 질문·작업 지시, 결과를 즉시 수신', badge: '텔레그램 봇' },
    { icon: '🛠️', title: '스킬로 기능 확장', desc: '주식 분석, 번역, 코드 리뷰 등 특화 스킬을 설치해 기능 추가', badge: '스킬 생태계' },
  ];

  const steps = [
    { n: 1, title: 'OpenClaw 설치', desc: 'npm install -g @openclaw/cli 로 CLI를 설치해요', code: 'npm install -g @openclaw/cli' },
    { n: 2, title: '초기 설정', desc: 'openclaw init 으로 설정 파일 생성 및 AI API 키 입력', code: 'openclaw init' },
    { n: 3, title: '텔레그램 봇 연결', desc: '@BotFather에서 봇을 만들고 토큰을 설정에 입력해요', code: 'openclaw gateway start' },
    { n: 4, title: '스킬 설치', desc: '원하는 스킬을 ClawHub에서 찾아 설치해요', code: 'openclaw skill install stock-monitor' },
    { n: 5, title: '자동화 시작!', desc: '텔레그램에서 AI에게 명령하거나 크론으로 자동 실행', code: '# 텔레그램에서: "오늘 날씨 알려줘"' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">📖 OpenClaw 활용법</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">설치부터 실제 자동화까지, OpenClaw로 할 수 있는 것들을 소개해요.</p>
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">🚀 시작하기 (5단계)</h2>
        <div className="space-y-3">
          {steps.map(s => (
            <div key={s.n} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4">
              <span className="w-8 h-8 bg-violet-600 text-white text-sm font-bold rounded-full flex items-center justify-center shrink-0">{s.n}</span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{s.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{s.desc}</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-gray-700 dark:text-gray-300">{s.code}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">✨ 이런 것들을 자동화할 수 있어요</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {useCases.map(u => (
            <div key={u.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{u.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{u.title}</h3>
                    <span className="text-[9px] px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded font-bold">{u.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{u.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
