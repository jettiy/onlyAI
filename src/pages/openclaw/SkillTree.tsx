export default function SkillTree() {
  const categories = [
    {
      name: '📊 투자·금융',
      skills: [
        { name: 'stock-monitor', desc: '주식 가격 모니터링 및 알림', badge: '인기' },
        { name: 'china-stock-analysis', desc: 'A주·홍콩 종목 분석 및 추천', badge: '인기' },
        { name: 'eastmoney-stock', desc: '동방재부 주가 데이터 조회', badge: '' },
        { name: 'tencent-finance', desc: '텐센트 파이낸스 API 연동', badge: '' },
      ],
    },
    {
      name: '📰 뉴스·정보',
      skills: [
        { name: 'ai-news-zh', desc: 'AI 뉴스 수집 및 중문 번역 요약', badge: '인기' },
        { name: 'hot-news-aggregator', desc: '국내외 핫이슈 뉴스 수집', badge: '' },
        { name: 'news-summary', desc: 'RSS 피드 기반 뉴스 요약', badge: '' },
        { name: 'cctv-news-fetcher', desc: 'CCTV 뉴스 하이라이트 수집', badge: '' },
      ],
    },
    {
      name: '🌤️ 날씨·생활',
      skills: [
        { name: 'weather', desc: 'wttr.in 기반 날씨 조회 및 예보', badge: '' },
      ],
    },
    {
      name: '🛠️ 개발·자동화',
      skills: [
        { name: 'coding-agent', desc: 'Codex/Claude Code 서브에이전트 위임', badge: '고급' },
        { name: 'docker', desc: 'Docker 컨테이너 관리 및 배포', badge: '' },
        { name: 'rss-ai-reader', desc: 'RSS 자동 수집·요약·채널 푸시', badge: '' },
        { name: 'skill-creator', desc: '새 스킬 설계 및 패키징 도구', badge: '개발자' },
      ],
    },
    {
      name: '🔒 보안·관리',
      skills: [
        { name: 'healthcheck', desc: 'OpenClaw 보안 점검 및 강화', badge: '' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🌳 스킬트리 저장소</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">OpenClaw에 설치할 수 있는 스킬 목록이에요. 각 스킬은 특화된 기능을 추가해줘요.</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4 text-xs text-blue-700 dark:text-blue-300">
        <span className="font-bold">💡 스킬 설치 방법:</span>{' '}
        <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded font-mono">openclaw skill install [스킬명]</code> 으로 설치해요.
      </div>

      <div className="space-y-5">
        {categories.map(cat => (
          <div key={cat.name}>
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{cat.name}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {cat.skills.map(skill => (
                <div key={skill.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <code className="text-xs font-mono font-bold text-gray-900 dark:text-white">{skill.name}</code>
                      {skill.badge && <span className="text-[9px] px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded font-bold">{skill.badge}</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
