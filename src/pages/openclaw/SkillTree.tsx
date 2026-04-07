import { useState, useEffect } from "react";

interface ClawHubSkill {
  name: string;
  desc: string;
  downloads: string;
  stars: number;
  install: string;
  category: string;
  badge: string;
}

// ClawHub Top 20 스킬 (2026년 4월 기준, clawoneclick.com/openclaw-hub.org 데이터)
const CLAWHUB_SKILLS: ClawHubSkill[] = [
  // 🤖 AI/머신러닝
  { name: 'capability-evolver', desc: 'AI 자가 진화 엔진 — 에이전트가 스스로 능력을 향상시킵니다', downloads: '35,581+', stars: 33, install: 'clawhub install capability-evolver', category: '🤖 AI/ML', badge: '인기 1위' },
  { name: 'self-improving-agent', desc: '자율 학습 프레임워크 — 상호작용에서 학습하고 응답을 최적화합니다', downloads: '15,962+', stars: 132, install: 'clawhub install self-improving-agent', category: '🤖 AI/ML', badge: '⭐ 최다 스타' },
  { name: 'free-ride', desc: '무료 AI 기능 — 추가 비용 없이 AI 기능을 활용합니다', downloads: '7,927+', stars: 0, install: 'clawhub install free-ride', category: '🤖 AI/ML', badge: '' },
  { name: 'proactive-agent', desc: '프로액티브 에이전트 — 사전에 행동하는 스마트 에이전트', downloads: '7,010+', stars: 0, install: 'clawhub install proactive-agent', category: '🤖 AI/ML', badge: '' },
  { name: 'auto-updater', desc: '자동 업데이트 — 스킬과 시스템을 자동으로 최신으로 유지합니다', downloads: '6,601+', stars: 0, install: 'clawhub install auto-updater-skill', category: '🤖 AI/ML', badge: '' },
  // 🛠️ 유틸리티
  { name: 'wacli', desc: '만능 CLI 도구 — 개발과 시스템 관리를 위한 스위스 아미 나이프', downloads: '16,415+', stars: 37, install: 'clawhub install wacli', category: '🛠️ 유틸리티', badge: '인기' },
  { name: 'byterover', desc: '멀티태스크 핸들러 — 유틸리티와 개발 기능을 하나로 통합', downloads: '16,004+', stars: 36, install: 'clawhub install byterover', category: '🛠️ 유틸리티', badge: '인기' },
  { name: 'atxp', desc: '고급 유틸리티 — 전문 시스템 수준 기능 확장', downloads: '14,453+', stars: 0, install: 'clawhub install atxp', category: '🛠️ 유틸리티', badge: '' },
  { name: 'bird', desc: '경량 유틸리티 — 빠르고 가벼운 도구 모음', downloads: '7,767+', stars: 0, install: 'clawhub install bird', category: '🛠️ 유틸리티', badge: '' },
  { name: 'find-skills', desc: '스킬 검색기 — ClawHub에서 필요한 스킬을 빠르게 찾습니다', downloads: '7,077+', stars: 0, install: 'clawhub install find-skills', category: '🛠️ 유틸리티', badge: '' },
  // 🌐 웹
  { name: 'agent-browser', desc: '브라우저 자동화 — 웹 탐색, 폼 입력, 데이터 추출 자동화', downloads: '11,836+', stars: 43, install: 'clawhub install agent-browser', category: '🌐 웹', badge: '인기' },
  { name: 'tavily-web-search', desc: '웹 검색 — Tavily API 기반 고급 웹 검색', downloads: '8,142+', stars: 0, install: 'clawhub install tavily-web-search', category: '🌐 웹', badge: '' },
  // 💻 개발
  { name: 'gog', desc: '구글 워크스페이스 — Gmail, 캘린더, 드라이브, 시트, 독스 통합', downloads: '14,313+', stars: 48, install: 'clawhub install gog', category: '💻 개발', badge: '인기' },
  { name: 'github', desc: '깃허브 관리 — 이슈, PR, CI/CD, API 쿼리를 자연어로 제어', downloads: '10,611+', stars: 0, install: 'clawhub install github', category: '💻 개발', badge: '' },
  // 📊 생산성
  { name: 'summarize', desc: '지능형 요약 — 긴 문서, 기사, 대화를 간결하게 요약', downloads: '10,956+', stars: 0, install: 'clawhub install summarize', category: '📊 생산성', badge: '인기' },
  { name: 'humanize-ai-text', desc: 'AI 텍스트 자연스럽게 — AI가 쓴 글을 사람처럼 자연스럽게', downloads: '8,771+', stars: 0, install: 'clawhub install humanize-ai-text', category: '📊 생산성', badge: '' },
  { name: 'obsidian', desc: '옵시디언 연동 — 노트 생성, 검색, 관리를 터미널에서', downloads: '5,791+', stars: 0, install: 'clawhub install obsidian', category: '📊 생산성', badge: '' },
  { name: 'nano-banana-pro', desc: '생산성 도구 — 경량 다목적 생산성 어시스턴트', downloads: '5,704+', stars: 0, install: 'clawhub install nano-banana-pro', category: '📊 생산성', badge: '' },
  // 🌤️ 기타
  { name: 'weather', desc: '날씨 조회 — wttr.in 기반 전세계 날씨와 예보', downloads: '9,002+', stars: 0, install: 'clawhub install weather', category: '🌤️ 기타', badge: '' },
  { name: 'sonoscli', desc: '오디오 시스템 제어 — Sonos 스피커 재생, 그룹, 볼륨 관리', downloads: '10,304+', stars: 0, install: 'clawhub install sonoscli', category: '🌤️ 기타', badge: '' },
];

const ALL_CATEGORIES = Array.from(new Set(CLAWHUB_SKILLS.map(s => s.category)));

export default function SkillTree() {
  const [filter, setFilter] = useState<string>('전체');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = CLAWHUB_SKILLS.filter(s => {
    const matchCat = filter === '전체' || s.category === filter;
    const matchSearch = !search || s.name.includes(search.toLowerCase()) || s.desc.includes(search);
    return matchCat && matchSearch;
  });

  const copyInstall = (cmd: string, name: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  const totalDownloads = '130,000+';
  const totalStars = CLAWHUB_SKILLS.reduce((a, s) => a + s.stars, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🌳 스킬트리 저장소</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ClawHub에서 가장 인기 있는 스킬들 · 총 {CLAWHUB_SKILLS.length}개 스킬 · ⭐ {totalStars}스타
        </p>
      </div>

      {/* 설치 안내 */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4 text-xs text-blue-700 dark:text-blue-300">
        <span className="font-bold">💡 설치 방법:</span>{' '}
        <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded font-mono">clawhub install [스킬명]</code>{' '}
        또는 <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded font-mono">openclaw skill install [스킬명]</code>
      </div>

      {/* 검색 */}
      <div className="relative">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="스킬 검색..."
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        {['전체', ...ALL_CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${filter === cat
              ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* 스킬 목록 */}
      <div className="space-y-4">
        {filtered.map(skill => (
          <div key={skill.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <code className="text-sm font-bold font-mono text-gray-900 dark:text-white">{skill.name}</code>
                  {skill.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold">{skill.badge}</span>}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{skill.category}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{skill.desc}</p>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span>📥 {skill.downloads} 다운로드</span>
                  {skill.stars > 0 && <span>⭐ {skill.stars}</span>}
                </div>
              </div>
              <button onClick={() => copyInstall(skill.install, skill.name)}
                className="shrink-0 text-[10px] px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors font-mono">
                {copied === skill.name ? '✅ 복사됨' : '📋 복사'}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-400">
            {search ? '검색 결과가 없어요' : '이 카테고리에 등록된 스킬이 없어요'}
          </div>
        )}
      </div>

      {/* 더 보기 */}
      <div className="text-center pt-2">
        <a href="https://clawhub.ai" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-medium">
          🔍 ClawHub에서 더 많은 스킬 보기
          <span className="text-xs">→</span>
        </a>
      </div>
    </div>
  );
}
