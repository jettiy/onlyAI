export default function OpenClawGuide() {
  const useCases = [
    { icon: '📊', title: '투자 리포트 자동화', desc: '매일 오전 9시, 관심 종목 시세·뉴스를 분석해 텔레그램으로 자동 발송', badge: '크론 자동화' },
    { icon: '📰', title: 'AI 뉴스 일일 요약', desc: '주요 AI 뉴스를 수집·번역·요약해 매일 저녁 정리된 브리핑으로 수신', badge: 'RSS + 에이전트' },
    { icon: '🌤️', title: '날씨·일정 통합 알림', desc: '외출 전 날씨·당일 캘린더·준비물을 한 번에 요약해 아침에 수신', badge: '다중 API 연동' },
    { icon: '🤖', title: '멀티에이전트 리서치', desc: '여러 AI가 협력해 깊이 있는 리서치 보고서를 자동으로 생성', badge: '멀티에이전트' },
    { icon: '💬', title: '텔레그램 AI 비서', desc: '텔레그램에서 언제든 AI에게 질문·작업 지시, 결과를 즉시 수신', badge: '텔레그램 봇' },
    { icon: '🛠️', title: '스킬로 기능 확장', desc: '주식 분석, 번역, 코드 리뷰 등 특화 스킬을 설치해 기능 추가', badge: '스킬 생태계' },
    { icon: '🏠', title: '홈 오토메이션', desc: 'IoT 기기·스마트홈과 연동해 AI로 집을 제어하고 상태를 모니터링', badge: 'Node 연동' },
    { icon: '📧', title: '이메일 분류·요약', desc: '받은 이메일을 자동 분류하고 중요한 것만 요약해 알림', badge: 'Gmail 연동' },
  ];

  const steps = [
    { n: 1, title: 'OpenClaw 설치', desc: 'Node.js 18+가 필요합니다. npm으로 전역 설치합니다.', code: 'npm install -g openclaw@latest', note: 'Windows / macOS / Linux 모두 지원' },
    { n: 2, title: '초기 설정', desc: '설정 마법사로 AI 제공자와 API 키를 등록합니다.', code: 'openclaw init', note: 'ZAI, OpenAI, Google, Anthropic 등 지원' },
    { n: 3, title: '텔레그램 봇 연결', desc: '@BotFather에서 봇을 만들고 토큰을 설정에 입력합니다.', code: 'openclaw gateway start', note: 'WhatsApp, Discord, Slack도 지원' },
    { n: 4, title: '스킬 설치', desc: 'ClawHub에서 원하는 스킬을 검색하고 설치합니다.', code: 'openclaw skill install <이름>', note: '150개 이상의 커뮤니티 스킬' },
    { n: 5, title: '자동화 설정', desc: '크론으로 정기 작업을 예약합니다.', code: 'openclaw cron add --schedule "0 9 * * *"', note: '매일 특정 시간에 자동 실행' },
  ];

  const tips = [
    { icon: '💰', title: '비용 절약', desc: 'GLM, Gemini Flash 등 무료 API를 기본 모델로 설정하면 API 비용을 크게 줄일 수 있어요. 복잡한 작업만 유료 모델에 위임하세요.' },
    { icon: '🔄', title: '모델 분산 사용', desc: '대화는 GLM Turbo, 코딩은 GLM-5.1, 이미지는 Gemini Flash처럼 용도별로 모델을 나누면 효율적입니다.' },
    { icon: '⏰', title: '크론 활용', desc: '매일 아침 리포트, 주간 트렌드, 이메일 체크 등 반복 작업은 크론에 맡겨두세요.' },
    { icon: '🧠', title: '메모리 활용', desc: 'MEMORY.md에 선호사항·프로젝트 정보를 저장하면 매번 설명하지 않아도 AI가 문맥을 유지합니다.' },
  ];

  const faq = [
    { q: '어떤 언어를 지원하나요?', a: '한국어, 영어, 중국어, 일본어 등 주요 언어를 모두 지원합니다. 한국어 대화도 자연스럽게 처리해요.' },
    { q: 'VPS 없이 쓸 수 있나요?', a: '네! 자신의 PC(Windows, Mac, Linux)에서 바로 실행 가능합니다. 24시간 가동이 필요하면 Raspberry Pi나 저렴한 VPS도 추천해요.' },
    { q: '동시에 여러 채널에 보낼 수 있나요?', a: '하나의 크론 작업에서 텔레그램 개인채팅, 그룹, 채널에 동시 전송할 수 있습니다. Slack, Discord도 동시 연결 가능합니다.' },
    { q: '데이터는 어디에 저장되나요?', a: '모든 데이터는 로컬 PC에 저장됩니다. 메시지, 설정, 메모리 파일이 전부 내 컴퓨터에 있어서 프라이버시가 보장됩니다.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">📖 OpenClaw 활용법</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">설치부터 실전 자동화까지, 단계별 가이드와 꿀팁을 정리했어요.</p>
      </div>

      {/* 시작하기 */}
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
                <p className="text-[10px] text-violet-500 dark:text-violet-400 mt-1">💡 {s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 활용 사례 */}
      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">✨ 자동화할 수 있는 것들</h2>
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

      {/* 꿀팁 */}
      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">💡 꿀팁</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {tips.map(t => (
            <div key={t.title} className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span>{t.icon}</span>
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{t.title}</h3>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">❓ 자주 묻는 질문</h2>
        <div className="space-y-2">
          {faq.map(f => (
            <details key={f.q} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <summary className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="px-4 pb-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-2">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}