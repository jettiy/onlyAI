import { Link } from 'react-router-dom';

const ITEMS = [
  {
    path: '/openclaw/intro', icon: '🌐', label: 'OpenClaw란?',
    desc: '텔레그램·WhatsApp으로 AI를 24시간 비서처럼 쓰는 개인 자동화 플랫폼.',
    tag: '개념 이해',
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    path: '/openclaw/guide', icon: '📖', label: '활용법',
    desc: '크론 자동화·스킬 설치·텔레그램 연결. 단계별로 따라하면 바로 쓸 수 있어요.',
    tag: '실전 가이드',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    path: '/openclaw/skills', icon: '🌳', label: '스킬트리 저장소',
    desc: '주식 모니터링·뉴스 수집·날씨·코딩 에이전트 등 커뮤니티 스킬 카탈로그.',
    tag: '15개+ 스킬',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    path: '/openclaw/devnews', icon: '🛠️', label: '개발자 소식',
    desc: 'OpenClaw 최신 릴리즈 업데이트와 앞으로의 로드맵을 확인해요.',
    tag: '최신 정보',
    color: 'text-brand-600 dark:text-brand-400',
  },
];

const USE_CASES = [
  { icon: '⏰', text: '매일 오전 9시 주식 리포트 자동 전송' },
  { icon: '📰', text: '6시간마다 AI 뉴스 수집 요약' },
  { icon: '🤖', text: '텔레그램으로 AI에게 파일 분석 요청' },
  { icon: '📊', text: '이란-이스라엘 전황 타임라인 자동 업데이트' },
];

export default function OpenClawHub() {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🦞</span>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">OpenClaw 활용하기</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
              AI를 텔레그램 메시지 하나로 자동화하는 플랫폼. 스킬을 설치하고,
              크론으로 예약하고, 채널에 결과를 보내요.
            </p>
          </div>
        </div>
      </div>

      {/* 실사용 예시 */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">실제 활용 사례</p>
        <div className="grid grid-cols-2 gap-2">
          {USE_CASES.map(u => (
            <div key={u.text}
              className="flex items-start gap-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-lg px-3 py-2.5">
              <span className="text-base shrink-0">{u.icon}</span>
              <p className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed font-medium">{u.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 메뉴 카드 */}
      <div className="grid sm:grid-cols-2 gap-3">
        {ITEMS.map(item => (
          <Link key={item.path} to={item.path}
            className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 ${item.color}`}>{item.tag}</span>
            </div>
            <h2 className={`text-sm font-bold group-hover:underline mb-1 ${item.color}`}>{item.label}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
