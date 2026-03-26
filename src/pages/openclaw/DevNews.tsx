export default function DevNews() {
  const updates = [
    { date: '2026-03-14', version: 'v2026.3.13', title: '게이트웨이 대시보드 v2 + GPT-5.4 지원', desc: '게이트웨이 대시보드를 모듈형으로 전면 개편: 개요·채팅·설정·에이전트·세션 뷰, 커맨드 팔레트, 모바일 바텀탭. OpenAI GPT-5.4 모델 지원 추가.', tag: '신기능' },
    { date: '2026-03-12', version: 'v2026.3.11', title: '보안 패치 — WebSocket 브라우저 원본 검증 강화', desc: '브라우저 프록시 헤더 유무 관계없이 모든 브라우저 연결에 원본 검증 강제 적용. trusted-proxy 모드 크로스사이트 WebSocket 취약점 수정.', tag: '보안' },
    { date: '2026-03-09', version: 'v2026.3.8', title: 'CLI 백업 기능 추가 + macOS 온보딩 개선', desc: 'openclaw backup create / verify 명령어 추가. --only-config, --no-include-workspace 옵션 지원. macOS 원격 게이트웨이 온보딩 개선.', tag: '신기능' },
    { date: '2026-03-08', version: 'v2026.3.7', title: 'Context Engine 플러그인 인터페이스 추가', desc: 'bootstrap·ingest·assemble·compact 등 전체 라이프사이클 훅 ContextEngine 플러그인 슬롯 추가. 설정 기반 슬롯 레지스트리로 교체 가능.', tag: '아키텍처' },
    { date: '2026-03-03', version: 'v2026.3.2', title: 'SecretRef 64개 확장 + 시크릿 감사 흐름', desc: 'SecretRef가 64개 대상으로 확장. openclaw secrets plan/apply/audit 흐름 추가. 미해결 참조는 즉시 오류 처리.', tag: '보안' },
  ];

  const roadmap = [
    { title: '음성 명령 지원', desc: '텔레그램 음성 메시지로 AI에게 명령하기', status: '개발 중', eta: 'Q2 2026' },
    { title: 'Windows 네이티브 앱', desc: 'MaxClaw Windows 데스크톱 앱', status: '계획 중', eta: 'Q3 2026' },
    { title: '팀 플랜', desc: '여러 명이 함께 쓰는 공유 워크스페이스', status: '계획 중', eta: 'Q3 2026' },
    { title: '플러그인 SDK', desc: '외부 개발자가 스킬을 쉽게 만들 수 있는 SDK', status: '계획 중', eta: 'Q4 2026' },
  ];

  const tagColors: Record<string, string> = {
    '신기능': 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    '보안': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    '아키텍처': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    'UX 개선': 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🛠️ 개발자 소식</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">OpenClaw GitHub 실제 릴리즈 기반 업데이트예요.</p>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">현재 실행 버전</p>
          <p className="text-sm font-bold font-mono text-gray-900 dark:text-white">v2026.3.3</p>
        </div>
        <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">최신: v2026.3.13</div>
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">📋 최근 업데이트</h2>
        <div className="space-y-3">
          {updates.map(u => (
            <div key={u.version} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">{u.version}</code>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${tagColors[u.tag] ?? 'bg-gray-100 text-gray-500'}`}>{u.tag}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{u.title}</h3>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{u.date}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">🗺️ 로드맵</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {roadmap.map(r => (
            <div key={r.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{r.title}</h3>
                <span className="text-[10px] text-gray-400">{r.eta}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{r.desc}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${r.status === '개발 중' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
