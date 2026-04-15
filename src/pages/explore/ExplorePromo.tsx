export default function ExplorePromo() {
  const services = [
    { name: '즈푸AI (Z.ai / GLM)', logo: '/logos/zhipu.png', status: 'active', benefit: 'GLM 코딩 플랜 특가 · 월 $10부터', url: 'https://z.ai/subscribe?ic=ODRIAQZZSF', code: 'ODRIAQZZSF' },
    { name: 'MiniMax', logo: '/logos/minimax.png', status: 'active', benefit: '레퍼럴 가입 시 10% 할인 + API 크레딧', url: 'https://platform.minimax.io/register?group_id=2028654236509679678', code: null },
    { name: 'Google AI Pro', logo: '/logos/google.png', status: 'user', benefit: '초대받은 사람 4개월 무료 ($80 상당)', url: 'https://one.google.com/ai/invite', code: null },
    { name: 'Claude (Anthropic)', logo: '/logos/anthropic.jpg', status: 'user', benefit: 'Claude Code 게스트 패스 1주일 무료', url: 'https://claude.ai/settings', code: null },
    { name: 'Alibaba Cloud', logo: '/logos/alibaba.png', status: 'user', benefit: '크레딧 보상 (결제금액 비례)', url: 'https://www.alibabacloud.com/en/referral', code: null },
    { name: 'ChatGPT (OpenAI)', logo: '/logos/openai.png', status: 'none', benefit: '파트너사 프로모 코드만 존재 · 개인 생성 불가', url: null, code: null },
    { name: 'DeepSeek', logo: '/logos/deepseek.png', status: 'none', benefit: '가입 자동 $5 크레딧 지급', url: 'https://platform.deepseek.com', code: null },
    { name: 'xAI (Grok)', logo: '/logos/xai.png', status: 'none', benefit: 'X Premium 구독으로 Grok 접근 가능', url: null, code: null },
  ];
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    user: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
    none: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  };
  const statusLabels: Record<string, string> = { active: '✅ 바로 사용 가능', user: '🔗 계정에서 발급', none: '❌ 레퍼럴 없음' };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">🎁 프로모션 현황</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">주요 AI 서비스의 레퍼럴·초대 코드 현황을 정리했어요.</p>
      </div>
      <div className="space-y-3">
        {services.map(s => (
          <div key={s.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 dark:border-gray-700 shrink-0">
              <img src={s.logo} alt={s.name} className="w-full h-full object-contain p-0.5" onError={e => { (e.target as HTMLImageElement).style.display='none'; }}/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColors[s.status]}`}>{statusLabels[s.status]}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{s.benefit}</p>
              {s.code && <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg"><span className="text-[10px] text-gray-500 dark:text-gray-400">코드</span><code className="text-xs font-mono font-bold text-gray-900 dark:text-white">{s.code}</code></div>}
            </div>
            {s.url && (
              <a href={s.url} target="_blank" rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300 hover:text-brand-600 transition-colors whitespace-nowrap">
                바로가기 →
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">📌 안내</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
          레퍼럴 혜택은 운영사 정책에 따라 변경될 수 있어요. 가입 전 해당 서비스의 공식 안내를 확인해주세요.
        </p>
      </div>
    </div>
  );
}
