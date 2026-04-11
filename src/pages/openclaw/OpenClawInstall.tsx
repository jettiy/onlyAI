import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type InstallType = '' | 'windows' | 'mac' | 'docker' | 'cloud' | 'server';

type StepBlock = {
  title: string;
  desc?: string;
  bullets?: string[];
  codeBlocks?: { label?: string; code: string }[];
  note?: string;
};

type Guide = {
  title: string;
  subtitle: string;
  steps: StepBlock[];
};

type OptionCard = {
  id: Exclude<InstallType, ''>;
  title: string;
  subtitle: string;
  icon: string;
};

const OPTIONS: OptionCard[] = [
  { id: 'windows', icon: '🪟', title: 'Windows (추천)', subtitle: 'PowerShell로 1분 설치' },
  { id: 'mac', icon: '🍎', title: 'Mac / Linux', subtitle: '터미널로 간편 설치' },
  { id: 'docker', icon: '🐳', title: 'Docker', subtitle: '컨테이너로 격리 실행' },
  { id: 'cloud', icon: '☁️', title: '클라우드 (Managed)', subtitle: '가입만 하면 끝 — 설치 불필요' },
  { id: 'server', icon: '🖥️', title: '서버 (VPS/VM)', subtitle: 'PM2로 24/7 실행' },
];

const NODE_JS_STEP: StepBlock = {
  title: 'Node.js 설치 (필수 전제조건)',
  desc: 'OpenClaw는 Node.js v22 이상이 필요합니다. 먼저 설치하세요.',
  codeBlocks: [
    { label: '버전 확인 (설치 후)', code: 'node --version' },
    { label: 'Windows', code: 'https://nodejs.org 에서 LTS 다운로드 (v22+ 권장)' },
    { label: 'Mac (Homebrew)', code: 'brew install node@22' },
    { label: 'Linux (Ubuntu/Debian)', code: 'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -\nsudo apt install -y nodejs' },
  ],
  bullets: [
    'v22+ 이상 필요 — node --version 으로 확인',
    'Windows: nodejs.org에서 LTS 설치 프로그램 다운로드',
    'Mac: Homebrew가 없다면 먼저 brew.sh에서 설치',
    'Linux: 위 curl 명령어로 Nodesource 저장소 추가 후 설치',
  ],
  note: '⚠️ npm 권한 문제 시 (Windows): 관리자 PowerShell에서 Set-ExecutionPolicy RemoteSigned -Scope CurrentUser 실행',
};

const GUIDES: Record<Exclude<InstallType, ''>, Guide> = {
  windows: {
    title: 'Windows 설치',
    subtitle: 'PowerShell로 1분 만에 설치합니다.',
    steps: [
      NODE_JS_STEP,
      {
        title: 'OpenClaw 설치',
        desc: 'PowerShell을 열고 아래 명령어를 붙여넣습니다.',
        codeBlocks: [{ label: '설치 스크립트', code: 'iwr -useb https://openclaw.ai/install.ps1 | iex' }],
      },
      {
        title: '초기 설정',
        desc: 'AI 제공자를 선택하고 기본 설정을 완료합니다.',
        codeBlocks: [{ code: 'openclaw onboard' }],
        bullets: [
          'ZAI 무료 추천 (한국 특화)',
          'OpenAI, Google, Anthropic 지원',
          'API 키 발급 후 입력',
        ],
      },
      {
        title: 'Gateway 실행',
        desc: 'WebUI와 메신저 연동을 위해 Gateway가 필요합니다.',
        codeBlocks: [{ code: 'openclaw gateway start' }],
        note: '모든 기능을 사용하려면 Gateway가 항상 켜져 있어야 합니다.',
      },
      {
        title: '대시보드 열기',
        desc: '브라우저에서 대시보드를 엽니다.',
        codeBlocks: [{ code: 'openclaw dashboard' }],
      },
    ],
  },
  mac: {
    title: 'Mac / Linux 설치',
    subtitle: '터미널에서 빠르게 설치합니다.',
    steps: [
      NODE_JS_STEP,
      {
        title: 'OpenClaw 설치',
        desc: '터미널을 열고 아래 명령어를 붙여넣습니다.',
        codeBlocks: [{ label: '설치 스크립트', code: 'curl -fsSL https://openclaw.ai/install.sh | bash' }],
      },
      {
        title: '초기 설정',
        codeBlocks: [{ code: 'openclaw onboard' }],
        bullets: ['ZAI 무료 추천', 'AI 제공자 선택'],
      },
      {
        title: 'Gateway 실행',
        codeBlocks: [{ code: 'openclaw gateway start' }],
      },
      {
        title: '대시보드 열기',
        codeBlocks: [{ code: 'openclaw dashboard' }],
      },
    ],
  },
  docker: {
    title: 'Docker 설치',
    subtitle: '컨테이너로 격리해 실행합니다.',
    steps: [
      {
        title: 'Docker 설치',
        desc: 'Docker가 필요합니다.',
        bullets: ['Windows/Mac: docker.com에서 Docker Desktop 다운로드', 'Linux: sudo apt install docker.io && sudo usermod -aG docker $USER'],
      },
      NODE_JS_STEP,
      {
        title: 'docker-compose.yml 작성',
        desc: '아래 내용을 docker-compose.yml로 저장합니다.',
        codeBlocks: [
          {
            label: 'docker-compose.yml',
            code: [
              "version: '3.8'",
              'services:',
              '  openclaw:',
              '    image: node:22',
              '    container_name: openclaw',
              '    restart: always',
              '    ports:',
              "      - '18789:18789'",
              '    volumes:',
              '      - ./openclaw-data:/root/.openclaw',
              '    command: npx -y openclaw@latest gateway start',
            ].join('\n'),
          },
        ],
      },
      {
        title: '컨테이너 실행',
        desc: 'Gateway가 컨테이너에서 바로 실행됩니다.',
        codeBlocks: [{ code: 'docker compose up -d' }],
      },
      {
        title: '초기 설정',
        desc: '컨테이너 내에서 onboard를 실행합니다.',
        codeBlocks: [{ code: 'docker exec -it openclaw openclaw onboard' }],
      },
      {
        title: '대시보드 접속',
        desc: '브라우저에서 접속합니다.',
        codeBlocks: [{ code: 'http://localhost:18789' }],
      },
    ],
  },
  cloud: {
    title: '클라우드 (Managed 서비스)',
    subtitle: '가입만 하면 끝 — 서버 설치가 전혀 필요 없습니다.',
    steps: [
      {
        title: 'Managed OpenClaw란?',
        desc: 'MaxClaw, XiaoClaw 등은 OpenClaw를 클라우드에서 대신 호스팅해주는 서비스입니다. 직접 설치할 필요 없이 가입만 하면 즉시 사용 가능합니다.',
        bullets: [
          '🚀 설치 없이 가입만으로 즉시 사용',
          '🌐 웹 대시보드 자동 제공',
          '💬 Telegram, Discord, Slack 등 메신저 연동 자동 설정',
          '🔑 API 키만 입력하면 끝',
          '🔄 업데이트/유지보수 자동 처리',
        ],
      },
      {
        title: 'MaxClaw (maxclaw.ai)',
        desc: 'OpenClaw의 Managed 서비스 중 하나입니다.',
        bullets: [
          '무료 플랜: 기본 기능 사용 가능',
          '유료 플랜: 더 많은 API 호출, 프리미엄 AI 모델, 우선 지원',
          '가입 → API 키 입력 → 메신저 연동 완료',
        ],
        codeBlocks: [{ label: 'MaxClaw 접속', code: 'https://maxclaw.ai' }],
      },
      {
        title: 'XiaoClaw (xiaoclaw.ai)',
        desc: '중국어 환경에 최적화된 Managed 서비스입니다.',
        bullets: [
          '무료 플랜: 기본 기능 제공',
          '유료 플랜: 고급 AI 모델, 커스텀 스킬, 대시보드 기능',
          '가입 후 웹 대시보드에서 바로 설정',
        ],
        codeBlocks: [{ label: 'XiaoClaw 접속', code: 'https://xiaoclaw.ai' }],
      },
      {
        title: '가입 후 설정',
        desc: 'Managed 서비스 공통 설정 순서입니다.',
        bullets: [
          '1. 가입 완료 (이메일 또는 SSO)',
          '2. AI 제공자 API 키 입력 (OpenAI, Google 등)',
          '3. 연동할 메신저 선택 (Telegram, Discord 등)',
          '4. 대시보드에서 AI 페르소나, 스킬 설정',
          '5. 바로 대화 시작!',
        ],
      },
    ],
  },
  server: {
    title: '서버 (VPS/VM) 설치',
    subtitle: 'Ubuntu/Debian 서버에 PM2로 24/7 실행합니다.',
    steps: [
      NODE_JS_STEP,
      {
        title: 'OpenClaw 설치',
        desc: '전역으로 설치합니다.',
        codeBlocks: [
          { code: 'npm install -g openclaw' },
        ],
      },
      {
        title: '초기 설정',
        desc: 'AI 제공자를 선택하고 기본 설정을 완료합니다.',
        codeBlocks: [{ code: 'openclaw onboard' }],
        bullets: ['ZAI 무료 추천', 'API 키 입력'],
      },
      {
        title: 'PM2로 백그라운드 실행',
        desc: '서버 재부팅 후에도 자동 실행되도록 설정합니다.',
        codeBlocks: [
          { label: 'PM2 설치', code: 'npm install -g pm2' },
          { label: 'Gateway를 PM2로 등록', code: 'pm2 start "openclaw gateway start" --name openclaw' },
          { label: 'PM2 상태 확인', code: 'pm2 status' },
          { label: '서버 재부팅 시 자동 실행', code: 'pm2 save && pm2 startup' },
        ],
        note: 'pm2 startup 명령 실행 후 출력되는 sudo 명령을 복사해서 실행하세요.',
      },
      {
        title: 'Nginx 리버스 프록시 (선택)',
        desc: '도메인과 HTTPS를 사용하려면 Nginx를 설정합니다.',
        codeBlocks: [
          { label: 'Nginx 설치', code: 'sudo apt install nginx -y' },
          {
            label: '/etc/nginx/sites-available/openclaw',
            code: [
              'server {',
              '    listen 80;',
              '    server_name your-domain.com;',
              '',
              '    location / {',
              '        proxy_pass http://127.0.0.1:18789;',
              '        proxy_http_version 1.1;',
              '        proxy_set_header Upgrade $http_upgrade;',
              '        proxy_set_header Connection "upgrade";',
              '        proxy_set_header Host $host;',
              '        proxy_set_header X-Real-IP $remote_addr;',
              '    }',
              '}',
            ].join('\n'),
          },
          { label: '활성화', code: 'sudo ln -s /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/\nsudo nginx -t && sudo systemctl reload nginx' },
        ],
      },
      {
        title: 'SSL/HTTPS 설정 (선택)',
        desc: 'Let\'s Encrypt로 무료 SSL 인증서를 발급받습니다.',
        codeBlocks: [
          { label: 'Certbot 설치', code: 'sudo apt install certbot python3-certbot-nginx -y' },
          { label: '인증서 발급', code: 'sudo certbot --nginx -d your-domain.com' },
          { label: '자동 갱신 확인', code: 'sudo certbot renew --dry-run' },
        ],
        note: 'Certbot이 Nginx 설정을 자동으로 HTTPS로 변경합니다. 매 90일마다 자동 갱신됩니다.',
      },
    ],
  },
};

const TROUBLESHOOTING = [
  'Gateway가 실행되지 않으면: openclaw gateway status',
  'Dashboard가 열리지 않으면: openclaw dashboard 명령 실행',
  'API 키 오류: openclaw doctor',
  '설정 손상: openclaw doctor --fix',
  '포트 충돌: openclaw.json의 gateway.port 변경 (기본 18789)',
  'Windows 실행 정책: 관리자 PowerShell에서 Set-ExecutionPolicy RemoteSigned -Scope CurrentUser',
  'Node.js 버전 오류: node --version 으로 v22+ 확인, nvm use 22 또는 재설치',
  'PM2 로그 확인: pm2 logs openclaw',
  'Docker 권한 오류: sudo usermod -aG docker $USER (재로그인 필요)',
  'LLM 응답 없음: API 키/모델명 확인, Gateway 상태 확인',
];

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}

export default function OpenClawInstall() {
  const [sel, setSel] = useState<InstallType>('');
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const guide = sel ? GUIDES[sel] : null;
  const total = guide?.steps.length ?? 0;
  const progress = useMemo(
    () => (total ? Math.round(((step + 1) / total) * 100) : 0),
    [step, total],
  );

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleSelect = (id: Exclude<InstallType, ''>) => {
    setSel(id);
    setStep(0);
  };

  const handleCopy = (id: string, code: string) => {
    void copyToClipboard(code);
    setCopied(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <Link to="/openclaw" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ← OpenClaw 허브로 돌아가기
        </Link>
        <div className="mt-3">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">OpenClaw 설치 가이드</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            설치 환경을 선택하면 단계별로 안내합니다. 로컬/Docker/서버 설치에는 Node.js v22+가 필요합니다.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">1. 어디에 설치하시겠어요?</h2>
          {sel && (
            <button
              type="button"
              onClick={() => setSel('')}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              설치 방식 변경
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {OPTIONS.map((o) => {
            const active = sel === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => handleSelect(o.id)}
                className={`text-left p-4 rounded-xl border transition-all bg-white dark:bg-gray-900 ${
                  active
                    ? 'border-emerald-400 shadow-md ring-2 ring-emerald-100 dark:ring-emerald-900/40'
                    : 'border-gray-200 dark:border-gray-800 hover:border-emerald-300 hover:shadow'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{o.icon}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{o.title}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{o.subtitle}</p>
              </button>
            );
          })}
        </div>
      </section>

      {guide && (
        <section className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-300 font-semibold">선택됨 · {guide.title}</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{guide.subtitle}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">진행률</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {step + 1} / {total}
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-5">
            <div className="space-y-2">
              {guide.steps.map((s, i) => {
                const cur = i === step;
                const done = i < step;
                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => setStep(i)}
                    className={`w-full flex items-center gap-3 text-left p-3 rounded-xl border transition-all ${
                      cur
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-emerald-200'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        done
                          ? 'bg-emerald-200 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200'
                          : cur
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${cur ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {s.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold text-base flex items-center justify-center shrink-0">
                  {step + 1}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{guide.steps[step].title}</h4>
                  {guide.steps[step].desc && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{guide.steps[step].desc}</p>
                  )}
                </div>
              </div>

              {guide.steps[step].bullets && (
                <ul className="space-y-2 pl-1">
                  {guide.steps[step].bullets!.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {guide.steps[step].codeBlocks && (
                <div className="space-y-3">
                  {guide.steps[step].codeBlocks!.map((block, i) => {
                    const cid = `${sel}-${step}-${i}`;
                    return (
                      <div key={cid} className="rounded-xl border border-gray-800 bg-gray-900 text-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                          <p className="text-xs text-gray-400">{block.label ?? '명령어 복사'}</p>
                          <button
                            type="button"
                            onClick={() => handleCopy(cid, block.code)}
                            className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                          >
                            {copied === cid ? '복사됨' : '복사'}
                          </button>
                        </div>
                        <pre className="text-xs font-mono px-4 py-3 whitespace-pre-wrap leading-relaxed">
                          <code>{block.code}</code>
                        </pre>
                      </div>
                    );
                  })}
                </div>
              )}

              {guide.steps[step].note && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
                  {guide.steps[step].note}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(s - 1, 0))}
                  disabled={step === 0}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-300 transition-colors"
                >
                  이전
                </button>
                {step === total - 1 ? (
                  <Link
                    to="/openclaw"
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  >
                    설치 완료!
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.min(s + 1, total - 1))}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  >
                    다음
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">자주 묻는 문제 해결</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {TROUBLESHOOTING.map((item) => (
            <div key={item} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-2">
        <Link to="/openclaw/guide" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200">
          📖 설치가 처음이세요? 상세 가이드 보기 →
        </Link>
      </div>
    </div>
  );
}
