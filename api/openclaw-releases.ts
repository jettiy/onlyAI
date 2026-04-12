// Vercel Edge Function — OpenClaw GitHub Releases (한글 요약)
// GET /api/openclaw-releases

export const config = { runtime: 'nodejs' };
const CACHE_DURATION = 3600;

// ─── 번역 사전 (fallback용) ───────────────────────────────────
const TERMS: Record<string, string> = {
  'security':'보안','vulnerability':'취약점','websocket':'WebSocket','injection':'인젝션',
  'authentication':'인증','authorization':'인가','dashboard':'대시보드','plugin':'플러그인',
  'context engine':'문맥 엔진(AI가 이전 대화를 기억하는 방식)','interface':'인터페이스','slot':'슬롯','refactor':'코드 정리',
  'cli':'명령어 도구','command':'명령어','backup':'백업','verify':'검증','onboarding':'초기 설정',
  'secret':'시크릿(비밀 정보)','audit':'감사','model':'모델','support':'지원','feature':'기능',
  'fix':'수정','bug':'버그','improvement':'개선','update':'업데이트','release':'릴리즈',
  'version':'버전','config':'설정','mobile':'모바일','bottom tab':'하단 탭',
  'command palette':'명령 팔레트','proxy':'프록시','header':'헤더','browser':'브라우저',
  'cross-site':'크로스사이트','trusted':'신뢰된','gateway':'게이트웨이','session':'세션',
  'agent':'에이전트(자동 작업 시스템)','compaction':'대화 요약(긴 대화를 자동으로 압축하는 기능)','chat':'채팅','view':'화면','setting':'설정',
  'module':'모듈','deploy':'배포','install':'설치','remove':'제거','add':'추가',
  'enable':'활성화','disable':'비활성화','provider':'공급자',
  'startup':'시작','trigger':'트리거','cron':'예약 실행','workflow':'자동화 흐름',
  'heartbeat':'정기 확인','node':'노드','device':'디바이스','pairing':'페어링',
  'message':'메시지','channel':'채널','group':'그룹','policy':'정책',
  'permission':'권한','elevation':'승격','sandbox':'안전 실행 환경','runtime':'실행 환경',
  'memory':'메모리','prompt':'프롬프트','tool':'도구','response':'응답',
  'request':'요청','handler':'처리기','middleware':'미들웨어','transport':'전송',
  'media':'미디어','attachment':'첨부파일','notification':'알림','event':'이벤트',
  'listener':'리스너','callback':'콜백','logger':'로그','formatter':'포매터',
  'parser':'파서','tokenizer':'토크나이저','embedding':'임베딩','vector':'벡터',
  'database':'데이터베이스','cache':'캐시','queue':'대기열','worker':'워커',
  'background':'백그라운드','foreground':'포그라운드','thread':'스레드','process':'프로세스',
  'container':'컨테이너','image':'이미지','registry':'레지스트리','package':'패키지',
  'dependency':'의존성','compatibility':'호환성','migration':'마이그레이션',
  'breaking change':'호환성 변경(기존 방식이 바뀌는 중요 변경)','deprecated':'사용 중단','experimental':'실험적',
  'stable':'안정','beta':'베타','alpha':'알파','prerelease':'사전 릴리즈',
  'webhook':'웹훅(외부 서비스와 자동 연동하는 기능)',
  'plugin sdk':'플러그인 개발 도구(외부 기능을 쉽게 만들 수 있는 도구)',
  'skill':'스킬(특정 작업을 수행하는 기능 모음)',
  'subagent':'하위 에이전트(메인 AI가 다른 AI에게 작업을 위임하는 기능)',
  'cron job':'예약 작업(정해진 시간에 자동으로 실행되는 작업)',
  'context window':'컨텍스트 창(AI가 한 번에 기억할 수 있는 대화 길이)',
  'token limit':'토큰 제한(처리할 수 있는 텍스트 양의 한계)',
  'rate limit':'요청 제한(너무 많은 요청을 막는 보호 기능)',
  'hotfix':'긴급 수정',
  'typo':'오타',
  'edge function':'엣지 함수(서버 없이 빠르게 실행되는 코드)',
  'streaming':'스트리밍(답변을 조금씩 실시간으로 보내는 방식)',
  'retry':'재시도',
  'fallback':'대안(기본 방식이 실패하면 사용하는 예비 방식)',
  'concurrency':'동시 실행(여러 작업을 동시에 처리하는 것)',
  'timeout':'시간 초과',
  'graceful shutdown':'안전한 종료(작업을 안전하게 마무리하고 끄는 것)',
  'log rotation':'로그 교체(오래된 로그 파일을 자동으로 정리하는 기능)',
  'api':'API(프로그램 간에 통신하는 방식)',
  'payload':'전송 데이터',
  'endpoint':'접속 주소',
  'dependency update':'의존성 업데이트(사용하는 외부 라이브러리를 최신으로 갱신)',
  'type safety':'타입 안전(코드 오류를 미리 방지하는 기능)',
  'error handling':'오류 처리(문제 발생 시 안전하게 대처하는 방식)',
  'pagination':'페이지 나누기(많은 데이터를 여러 페이지로 나누어 보여주기)',
};

function translate(text: string): string {
  if (!text) return '';
  let r = text;
  r = r.replace(/^###\s*(.+)$/gm, (_, t) => `### ${t.trim()}`);
  r = r.replace(/\*\*(.+?)\*\*/g, '$1');
  r = r.replace(/^- /gm, '• ');
  const entries = Object.entries(TERMS).sort((a, b) => b[0].length - a[0].length);
  for (const [en, ko] of entries) {
    const regex = new RegExp(`\\b${en.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    r = r.replace(regex, ko);
  }
  return r.trim();
}

function translateToNatural(text: string): string {
  if (!text) return '';
  let r = text.trim();
  r = r.replace(/add(?:ed)?\s+(.+?)\s+support/i, (_, feature) => `${feature.trim()} 기능이 추가되었습니다`);
  r = r.replace(/add(?:ed)?\s+(?:support\s+for\s+)?(.+)/i, (_, feature) => {
    const f = feature.trim().replace(/^to\s+/i, '');
    return `${f} 기능이 추가되었습니다`;
  });
  r = r.replace(/fix(?:ed)?\s+(.+)/i, (_, desc) => {
    const d = desc.trim();
    return d.length > 60 ? `문제가 수정되었습니다: ${d}` : `${d} 문제를 수정했습니다`;
  });
  r = r.replace(/(?:bump|update|upgrade)\s+(.+?)\s+to\s+(.+)/i, (_, pkg, ver) => `${pkg.trim()}을(를) 최신 버전(${ver.trim()})으로 업데이트했습니다`);
  r = r.replace(/improv(?:e|ed)\s+(.+)/i, (_, desc) => `${desc.trim()}이(가) 개선되었습니다`);
  r = r.replace(/remov(?:e|ed)\s+(.+)/i, (_, desc) => `${desc.trim()} 기능이 제거되었습니다`);
  r = r.replace(/enabl(?:e|ed)\s+(.+)/i, (_, desc) => `${desc.trim()} 기능이 활성화되었습니다`);
  r = r.replace(/disabl(?:e|ed)\s+(.+)/i, (_, desc) => `${desc.trim()} 기능이 비활성화되었습니다`);
  r = r.replace(/migrat(?:e|ed|ion)\s+(?:from\s+)?(.+?)\s+to\s+(.+)/i, (_, from, to) => `${from.trim()}에서 ${to.trim()}(으)로 전환되었습니다`);
  r = r.replace(/refactor(?:ed)?\s+(.+)/i, (_, desc) => `${desc.trim()} 코드가 정리되었습니다`);
  r = r.replace(/optimiz(?:e|ed)\s+(.+)/i, (_, desc) => `${desc.trim()}이(가) 최적화되었습니다`);
  r = r.replace(/implement(?:ed)?\s+(.+)/i, (_, desc) => `${desc.trim()} 기능이 구현되었습니다`);
  r = r.replace(/introduc(?:e|ed)\s+(.+)/i, (_, desc) => `${desc.trim()} 기능이 새롭게 도입되었습니다`);
  r = r.replace(/rename(?:d)?\s+(.+?)\s+to\s+(.+)/i, (_, from, to) => `${from.trim()} 이름이 ${to.trim()}(으)로 변경되었습니다`);
  r = r.replace(/replace(?:d)?\s+(.+?)\s+with\s+(.+)/i, (_, from, to) => `${from.trim()}이(가) ${to.trim()}(으)로 교체되었습니다`);
  r = r.replace(/deprecat(?:e|ed|ion)\s+(?:of\s+)?(.+)/i, (_, desc) => `${desc.trim()}이(가) 사용 중단되었습니다`);
  r = r.replace(/releas(?:e|ed)\s+(.+)/i, (_, desc) => `${desc.trim()}이(가) 출시되었습니다`);
  const entries = Object.entries(TERMS).sort((a, b) => b[0].length - a[0].length);
  for (const [en, ko] of entries) {
    const regex = new RegExp(`\\b${en.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    r = r.replace(regex, ko);
  }
  r = r.replace(/^[-*•]\s*/gm, '• ');
  r = r.replace(/\*\*(.+?)\*\*/g, '$1');
  r = r.trim();
  return r;
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

// ─── fallback: 기존 요약 함수들 ──────────────────────────────
function summarizeBodyKo(body: string): string {
  if (!body) return '';
  const lines = body.split('\n');
  const bullets: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*•]/.test(trimmed) && trimmed.length > 5 && trimmed.length < 300) {
      const cleaned = trimmed.replace(/^[-*•]\s*/, '');
      const translated = translateToNatural(cleaned);
      if (translated && translated.length > 3) {
        bullets.push(translated);
      }
    }
    if (bullets.length >= 5) break;
  }
  let summary = bullets.map(b => `• ${b}`).join('\n');
  if (!summary) {
    const fallback = body.replace(/###\s*\w+.*\n/g, '').replace(/\*\*/g, '').trim().slice(0, 300);
    summary = translateToNatural(fallback);
  }
  return summary.length > 400 ? summary.slice(0, 400) + '...' : summary;
}

function summarizeBody(body: string): string {
  if (!body) return '';
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

// ─── 타입 정의 ───────────────────────────────────────────
interface RawRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  published_at: string | null;
  html_url: string;
  prerelease: boolean | null;
}

// ─── 캐시 & 메인 핸들러 ──────────────────────────────────────
let cached: { data: string; ts: number } | null = null;

export default async function handler(request: Request) {
  if (cached && Date.now() - cached.ts < CACHE_DURATION * 1000) {
    return new Response(cached.data, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'HIT' },
    });
  }

  try {
    // 1. 정적 파일 시도 (GitHub Actions에서 미리 번역한 데이터)
    const staticRes = await fetch(new URL('/data/releases-ko.json', request.url));
    if (staticRes.ok) {
      const data = await staticRes.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'STATIC', 'Cache-Control': `public, s-maxage=${CACHE_DURATION}` },
      });
    }

    // 2. fallback: GitHub API에서 영문만
    const res = await fetch('https://api.github.com/repos/openclaw/openclaw/releases?per_page=10', {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error('GitHub API error');
    const rawReleases: RawRelease[] = await res.json();

    const releases = rawReleases.map((r) => {
      const body = r.body ?? '';
      const title = r.name ?? r.tag_name;
      const tag = r.tag_name;
      return {
        tag,
        version: tag.replace(/^v/, ''),
        date: formatDate(r.published_at ?? ''),
        dateRaw: r.published_at?.slice(0, 10) ?? '',
        title: translate(title),
        summary: summarizeBody(body),
        summaryKo: summarizeBodyKo(body),
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
