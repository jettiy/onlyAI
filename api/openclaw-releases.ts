// Vercel Edge Function — OpenClaw GitHub Releases (한글 요약)
// GET /api/openclaw-releases

export const config = { runtime: 'edge' };
const CACHE_DURATION = 3600;

// 번역 사전 (영어→한글)
const TERMS: Record<string, string> = {
  'security':'보안','vulnerability':'취약점','websocket':'WebSocket','injection':'인젝션',
  'authentication':'인증','authorization':'인가','dashboard':'대시보드','plugin':'플러그인',
  'context engine':'컨텍스트 엔진','interface':'인터페이스','slot':'슬롯','refactor':'리팩토링',
  'cli':'CLI','command':'명령어','backup':'백업','verify':'검증','onboarding':'온보딩',
  'secret':'시크릿','audit':'감사','model':'모델','support':'지원','feature':'기능',
  'fix':'수정','bug':'버그','improvement':'개선','update':'업데이트','release':'릴리즈',
  'version':'버전','config':'설정','mobile':'모바일','bottom tab':'하단 탭',
  'command palette':'커맨드 팔레트','proxy':'프록시','header':'헤더','browser':'브라우저',
  'cross-site':'크로스사이트','trusted':'신뢰된','gateway':'게이트웨이','session':'세션',
  'agent':'에이전트','compaction':'압축','chat':'채팅','view':'뷰','setting':'설정',
  'module':'모듈','deploy':'배포','install':'설치','remove':'제거','add':'추가',
  'enable':'활성화','disable':'비활성화','compaction':'압축','provider':'공급자',
  'startup':'시작','trigger':'트리거','cron':'크론','workflow':'워크플로우',
  'heartbeat':'하트비트','node':'노드','device':'디바이스','pairing':'페어링',
  'message':'메시지','channel':'채널','group':'그룹','policy':'정책',
  'permission':'권한','elevation':'승격','sandbox':'샌드박스','runtime':'런타임',
  'memory':'메모리','prompt':'프롬프트','tool':'도구','response':'응답',
  'request':'요청','handler':'핸들러','middleware':'미들웨어','transport':'전송',
  'media':'미디어','attachment':'첨부파일','notification':'알림','event':'이벤트',
  'listener':'리스너','callback':'콜백','logger':'로거','formatter':'포매터',
  'parser':'파서','tokenizer':'토크나이저','embedding':'임베딩','vector':'벡터',
  'database':'데이터베이스','cache':'캐시','queue':'큐','worker':'워커',
  'background':'백그라운드','foreground':'포그라운드','thread':'스레드','process':'프로세스',
  'container':'컨테이너','image':'이미지','registry':'레지스트리','package':'패키지',
  'dependency':'의존성','compatibility':'호환성','migration':'마이그레이션',
  'breaking change':'호환성 변경','deprecated':'사용 중단','experimental':'실험적',
  'stable':'안정','beta':'베타','alpha':'알파','prerelease':'사전 릴리즈',
};

function translate(text: string): string {
  if (!text) return '';
  let r = text;
  r = r.replace(/^###\s*(.+)$/gm, (_, t) => `### ${t.trim()}`);
  r = r.replace(/\*\*(.+?)\*\*/g, '$1');
  r = r.replace(/^- /gm, '• ');
  // Sort by length descending to match longer phrases first
  const entries = Object.entries(TERMS).sort((a, b) => b[0].length - a[0].length);
  for (const [en, ko] of entries) {
    const regex = new RegExp(`\\b${en.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    r = r.replace(regex, ko);
  }
  return r.trim();
}

function classifyTag(title: string, body: string): string {
  const text = `${title} ${body}`.toLowerCase();
  if (/security|vulnerability|websocket|inject|xss|auth|token|secret|cors/i.test(text)) return '보안';
  if (/plugin|context.?engine|interface|slot|architecture|refactor|transport/i.test(text)) return '아키텍처';
  if (/ux|ui|mobile|bottom.?tab|palette|dashboard|layout|theme|dark|design/i.test(text)) return 'UX 개선';
  if (/fix|patch|bug|hotfix|crash|resolve|regression|broken/i.test(text)) return '버그수정';
  if (/add|new|feat|support|introduce|implement/i.test(text)) return '신기능';
  if (/perf|speed|latency|optimize|memory|cache/i.test(text)) return '성능 개선';
  if (/node|device|mobile|pair|companion|app/i.test(text)) return '플랫폼';
  return '개선';
}

function summarizeBody(body: string): string {
  if (!body) return '';
  // Extract bullet points and key changes
  const lines = body.split('\n');
  const bullets: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*•]/.test(trimmed) && trimmed.length > 5 && trimmed.length < 200) {
      bullets.push(trimmed.replace(/^[-*•]\s*/, ''));
    }
    if (bullets.length >= 5) break;
  }
  let summary = bullets.map(b => `• ${translate(b)}`).join('\n');
  if (!summary) {
    summary = translate(body.replace(/###\s*\w+.*\n/g, '').replace(/\*\*/g, '').trim().slice(0, 300));
  }
  return summary.length > 350 ? summary.slice(0, 350) + '...' : summary;
}

function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return isoDate; }
}

let cached: { data: string; ts: number } | null = null;

export default async function handler(request: Request) {
  if (cached && Date.now() - cached.ts < CACHE_DURATION * 1000) {
    return new Response(cached.data, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'HIT' },
    });
  }

  try {
    const res = await fetch('https://api.github.com/repos/openclaw/openclaw/releases?per_page=15', {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error('GitHub API error');
    const data: any[] = await res.json();

    const releases = data.map((r) => {
      const body = r.body ?? '';
      const title = r.name ?? r.tag_name;
      return {
        tag: r.tag_name,
        version: r.tag_name.replace(/^v/, ''),
        date: formatDate(r.published_at),
        dateRaw: r.published_at?.slice(0, 10) ?? '',
        title: translate(title),
        summary: summarizeBody(body),
        tagLabel: classifyTag(title, body),
        htmlUrl: r.html_url,
        prerelease: r.prerelease ?? false,
      };
    });

    const response = {
      updatedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      latest: releases[0]?.version ?? '',
      total: releases.length,
      releases,
    };

    const json = JSON.stringify(response);
    cached = { data: json, ts: Date.now() };

    return new Response(json, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': `public, s-maxage=${CACHE_DURATION}` },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
