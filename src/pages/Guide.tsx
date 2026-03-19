const steps = [
  {
    step: '01',
    title: '목적을 먼저 정하세요',
    desc: 'AI로 무엇을 하고 싶으신가요?',
    options: [
      { label: '일상 대화·질문 답변', rec: 'ChatGPT 무료 / Claude 무료 → 바로 시작 가능' },
      { label: '코드 작성·디버깅', rec: 'GitHub Copilot 또는 Cursor (Claude 4.6 내장)' },
      { label: '이미지 생성', rec: 'Midjourney, DALL-E 3, Stable Diffusion (로컬)' },
      { label: '나만의 AI 앱 개발', rec: 'OpenRouter API + 코딩 → 모델 가이드 참고' },
    ],
  },
  {
    step: '02',
    title: '로컬 vs 클라우드',
    desc: '어디서 AI를 실행할지 결정하세요.',
    table: [
      { item: '비용', local: '무료 (전기료만)', cloud: '사용량 기반 과금' },
      { item: '성능', local: 'PC 사양에 따라 제한', cloud: '최상위 모델 사용 가능' },
      { item: '속도', local: 'GPU 없으면 느림', cloud: '빠름' },
      { item: '프라이버시', local: '내 PC에서만 처리', cloud: '서버로 데이터 전송' },
      { item: '설치 난이도', local: '다소 복잡', cloud: '회원가입만 하면 됨' },
    ],
  },
  {
    step: '03',
    title: '클라우드 선택',
    desc: '클라우드를 쓴다면 어디가 좋을까요?',
    guides: [
      { emoji: '🆓', title: '완전 무료로 시작', body: 'ChatGPT 무료, Claude 무료, Gemini 무료 — 가입 후 바로 사용. API 없이 웹에서만 사용 가능.' },
      { emoji: '🔌', title: 'API가 필요하다면', body: 'OpenRouter 추천. 하나의 API 키로 GPT, Claude, Llama, MiniMax 등 300개 이상의 모델을 사용할 수 있어요.' },
      { emoji: '⚡', title: '속도가 최우선이라면', body: 'Groq 무료 티어. LPU 칩 기반으로 업계 최고 속도. Llama 3.3 70B를 무료로 빠르게 사용 가능.' },
      { emoji: '💸', title: '비용이 최우선이라면', body: 'DeepSeek API. 입력 $0.27/1M 토큰으로 업계 최저가 수준. 가입 시 $5 무료 크레딧 제공.' },
    ],
  },
  {
    step: '04',
    title: '로컬 실행 (고급)',
    desc: 'PC에서 직접 AI를 실행하고 싶다면',
    tools: [
      { name: 'Ollama', desc: '가장 쉬운 로컬 AI 실행 도구. macOS/Linux/Windows 지원. Llama, Mistral 등 설치 가능.' },
      { name: 'LM Studio', desc: 'GUI 기반 로컬 AI 앱. 비개발자도 쉽게 사용 가능. Hugging Face 모델 다운로드 지원.' },
      { name: 'GPT4All', desc: '완전 오프라인 AI 채팅 앱. 인터넷 없이도 작동. 프라이버시 중시 사용자에게 추천.' },
    ],
    requirement: '권장 사양: RAM 16GB 이상, Apple Silicon M2 이상 또는 NVIDIA GPU 8GB 이상',
  },
];

export default function Guide() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white dark:text-white mb-2">📖 AI 처음 시작 가이드</h1>
        <p className="text-gray-500">AI를 처음 접하는 분을 위한 단계별 안내예요.</p>
      </div>

      <div className="space-y-6">
        {steps.map((s) => (
          <div key={s.step} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                {s.step}
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{s.title}</h2>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </div>

            {s.options && (
              <div className="space-y-2">
                {s.options.map((opt) => (
                  <div key={opt.label} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                    <span className="text-blue-500 text-xs mt-1">▶</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{opt.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {s.table && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium w-24">항목</th>
                      <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">🖥️ 로컬</th>
                      <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">☁️ 클라우드</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.map((row) => (
                      <tr key={row.item} className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-700 dark:text-gray-300">{row.item}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{row.local}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{row.cloud}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {s.guides && (
              <div className="grid sm:grid-cols-2 gap-3">
                {s.guides.map((g) => (
                  <div key={g.title} className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                    <p className="text-lg mb-2">{g.emoji}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-1">{g.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-400 leading-relaxed">{g.body}</p>
                  </div>
                ))}
              </div>
            )}

            {s.tools && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 rounded-lg text-xs text-amber-700">
                  {s.requirement}
                </div>
                {s.tools.map((t) => (
                  <div key={t.name} className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                    <p className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-1">{t.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-400 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 text-center">
        <p className="text-blue-800 font-medium mb-1">더 자세한 정보가 필요하신가요?</p>
        <p className="text-blue-600 text-sm">각 클라우드 서비스의 가격 비교는 클라우드 가격 페이지에서 확인하세요.</p>
      </div>
    </div>
  );
}
