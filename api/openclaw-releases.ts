// Vercel Edge Function — OpenClaw GitHub Releases (Korean translated)
// GET /api/openclaw-releases

export const config = {
  runtime: 'edge',
};

const CACHE_DURATION = 3600; // 1 hour

const TRANSLATION_CACHE = new Map<string, string>();

// Simple translation patterns (no API key needed for common tech terms)
const TECH_TERMS: Record<string, string> = {
  'security': '보안',
  'vulnerability': '취약점',
  'websocket': 'WebSocket',
  'injection': '인젝션',
  'authentication': '인증',
  'authorization': '인가',
  'dashboard': '대시보드',
  'plugin': '플러그인',
  'context engine': '컨텍스트 엔진',
  'interface': '인터페이스',
  'slot': '슬롯',
  'refactor': '리팩토링',
  'cli': 'CLI',
  'command': '명령어',
  'backup': '백업',
  'verify': '검증',
  'macos': 'macOS',
  'onboarding': '온보딩',
  'secret': '시크릿',
  'audit': '감사',
  'model': '모델',
  'support': '지원',
  'feature': '기능',
  'fix': '수정',
  'bug': '버그',
  'improvement': '개선',
  'update': '업데이트',
  'release': '릴리즈',
  'version': '버전',
  'config': '설정',
  'mobile': '모바일',
  'bottom tab': '하단 탭',
  'command palette': '커맨드 팔레트',
  'proxy': '프록시',
  'header': '헤더',
  'browser': '브라우저',
  'cross-site': '크로스사이트',
  'trusted': '신뢰된',
  'gateway': '게이트웨이',
  'session': '세션',
  'agent': '에이전트',
  'compaction': '압축',
  'chat': '채팅',
  'view': '뷰',
  'setting': '설정',
  'module': '모듈',
  'typescript': 'TypeScript',
  'python': 'Python',
  'node': 'Node.js',
  'deploy': '배포',
  'install': '설치',
  'remove': '제거',
  'add': '추가',
  'enable': '활성화',
  'disable': '비활성화',
};

function autoTranslate(text: string): string {
  if (!text) return '';
  let result = text;
  // Clean markdown formatting
  result = result.replace(/^###\s*(.+)$/gm, (_, title) => `### ${title.trim()}`);
  result = result.replace(/\*\*(.+?)\*\*/g, '$1');
  result = result.replace(/^- /gm, '• ');
  
  // Translate common tech terms (word boundary)
  for (const [en, ko] of Object.entries(TECH_TERMS)) {
    const regex = new RegExp(`\\b${en.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    result = result.replace(regex, ko);
  }
  
  return result.trim();
}

// Classify release notes into a tag (Korean)
function classifyTag(title: string, body: string): string {
  const text = `${title} ${body}`.toLowerCase();
  if (/security|vulnerability|websocket|inject|xss|auth|token|secret/i.test(text)) return '보안';
  if (/plugin|context.?engine|interface|slot|architecture|refactor/i.test(text)) return '아키텍처';
  if (/ux|ui|mobile|bottom.?tab|palette|dashboard|layout|theme|dark/i.test(text)) return 'UX 개선';
  if (/fix|patch|bug|hotfix|crash|resolve|regression/i.test(text)) return '버그수정';
  if (/add|new|feat|support|introduce/i.test(text)) return '신기능';
  return '기본';
}

function truncateBody(body: string, maxLen = 250): string {
  if (!body) return '';
  const clean = body
    .replace(/###\s*\w+\s*\n/g, '')
    .replace(/\*\*/g, '')
    .replace(/- /g, '• ')
    .trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean;
}

let cachedResponse: { data: string; timestamp: number } | null = null;

export default async function handler(request: Request) {
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION * 1000) {
    return new Response(cachedResponse.data, {
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
      const tag = classifyTag(title, body);
      const translatedBody = autoTranslate(truncateBody(body));

      return {
        tag: r.tag_name,
        version: r.tag_name.replace(/^v/, ''),
        date: r.published_at?.slice(0, 10) ?? '',
        title: autoTranslate(title),
        body: translatedBody,
        originalBody: body,
        htmlUrl: r.html_url,
        author: r.author?.login ?? 'openclaw',
        prerelease: r.prerelease ?? false,
        classifiedTag: tag,
      };
    });

    const response = {
      updatedAt: new Date().toISOString(),
      updatedAtKST: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      latest: releases[0]?.version ?? '',
      total: releases.length,
      releases,
    };

    const jsonStr = JSON.stringify(response);
    cachedResponse = { data: jsonStr, timestamp: Date.now() };

    return new Response(jsonStr, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS',
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
