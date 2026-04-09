import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type InstallType = '' | 'cloud' | 'docker' | 'local';

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
  { id: 'cloud', icon: '☁️', title: '클라우드 (VPS/서버)', subtitle: '외부 서버에서 24시간 가동' },
  { id: 'docker', icon: '🐳', title: '로컬 도커', subtitle: '내 PC에서 컨테이너로 실행' },
  { id: 'local', icon: '💻', title: '내 PC 직접 설치', subtitle: 'Windows/Mac에 직접 설치' },
];

const GUIDES: Record<Exclude<InstallType, ''>, Guide> = {
  cloud: {
    title: '클라우드 설치',
    subtitle: '서버에 설치하고 24시간 안정적으로 운영합니다.',
    steps: [
      {
        title: '서버 준비',
        desc: 'AWS EC2, Oracle Cloud Free Tier, 카페24 등 Linux 서버 필요',
        bullets: ['최소 사양: 1GB RAM, 10GB 디스크', '권장: Ubuntu 22.04 LTS'],
      },
      {
        title: 'Node.js 설치',
        codeBlocks: [
          { code: 'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -' },
          { code: 'sudo apt-get install -y nodejs' },
        ],
      },
      {
        title: 'OpenClaw 설치',
        codeBlocks: [
          { code: 'sudo npm install -g openclaw@latest' },
          { label: 'PowerShell 필요시', code: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser' },
        ],
      },
      {
        title: '초기 설정',
        codeBlocks: [{ code: 'openclaw init' }],
        bullets: ['AI 제공자 선택 (ZAI 무료, OpenAI, Google 등)', 'API 키 입력', '기본 모델 설정'],
      },
      {
        title: '게이트웨이 실행',
        codeBlocks: [{ code: 'openclaw gateway start' }],
      },
      {
        title: '백그라운드 실행 (24시간 가동용)',
        codeBlocks: [
          { code: "pm2 start 'openclaw gateway start' --name openclaw" },
          { code: 'pm2 save' },
          { code: 'pm2 startup' },
        ],
      },
    ],
  },
  docker: {
    title: '도커 설치',
    subtitle: '로컬 환경에서 컨테이너로 실행합니다.',
    steps: [
      {
        title: 'Docker 설치',
        desc: 'Docker Desktop 다운로드',
        bullets: [
          'Windows: https://www.docker.com/products/docker-desktop/',
          'Mac: brew install --cask docker',
          'Linux: sudo apt install docker.io',
        ],
      },
      {
        title: 'Docker Compose 설정 파일 생성 (docker-compose.yml)',
        codeBlocks: [
          {
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
        title: '실행',
        codeBlocks: [{ code: 'docker compose up -d' }],
      },
      {
        title: '초기 설정 (컨테이너 내부)',
        codeBlocks: [{ code: 'docker exec -it openclaw openclaw init' }],
      },
    ],
  },
  local: {
    title: '내 PC 직접 설치',
    subtitle: 'Windows/Mac에 직접 설치합니다.',
    steps: [
      {
        title: 'Node.js 설치',
        desc: 'v22 LTS 권장',
        bullets: ['다운로드: https://nodejs.org/', 'PowerShell에서 버전 확인: node --version'],
      },
      {
        title: '실행 정책 변경 (Windows만)',
        desc: '관리자 PowerShell에서 실행',
        codeBlocks: [{ code: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser' }],
      },
      {
        title: 'OpenClaw 설치',
        codeBlocks: [
          { code: 'npm install -g openclaw@latest' },
          { code: 'npm install -g grammy @grammyjs/runner' },
        ],
        bullets: ['설치 중 postinstall 스크립트가 실행됩니다 (30초~1분)', '에러 시 개별 모듈 설치'],
      },
      {
        title: '초기 설정',
        codeBlocks: [{ code: 'openclaw init' }],
        bullets: [
          'AI 제공자 선택',
          'API 키 입력 (ZAI 무료 가입 추천)',
          '메신저 연결 (Telegram Bot 토큰 등)',
          '기본 모델 설정',
        ],
      },
      {
        title: '게이트웨이 실행',
        codeBlocks: [{ code: 'openclaw gateway start' }],
      },
      {
        title: '자동 시작 설정 (Windows)',
        codeBlocks: [
          { code: "schtasks /create /tn OpenClaw /tr 'cmd /c openclaw gateway start' /sc onstart" },
        ],
        bullets: ['또는 시작 폴더에 바로가기 추가'],
      },
    ],
  },
};

const TROUBLESHOOTING = [
  '포트 충돌: openclaw.json에서 gateway.port 변경 (기본 18789)',
  'PM2 버전 캐싱: pm2 kill 후 재시작',
  'postinstall 에러: 개별 모듈 수동 설치',
  'PowerShell 인코딩: UTF-8 BOM 문제 시 VS Code에서 저장',
];

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
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
  const progress = useMemo(() => total ? Math.round(((step + 1) / total) * 100) : 0, [step, total]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleSelect = (id: Exclude<InstallType, ''>) => { setSel(id); setStep(0); };

  const handleCopy = (id: string, code: string) => {
    void copyToClipboard(code);
    setCopied(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <Link to="/openclaw" className="text-xs text-gray-500 hover:text-gray-700">← OpenClaw 허브로 돌아가기</Link>
        <div className="mt-3">
          <h1 className="text-2xl font-black text-gray-900">OpenClaw 설치 가이드</h1>
          <p className="text-sm text-gray-500 mt-1">설치 환경을 선택하면 단계별로 필요한 명령과 설정을 안내합니다.</p>
        </div>
      </div>

      {/* Step 1: Select install type */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">1. 어디에 설치하시겠어요?</h2>
          {sel && (
            <button type="button" onClick={() => setSel('')} className="text-xs text-gray-500 hover:text-gray-700">설치 방식 변경</button>
          )}
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {OPTIONS.map(o => {
            const active = sel === o.id;
            return (
              <button key={o.id} type="button" onClick={() => handleSelect(o.id)}
                className={`text-left p-4 rounded-xl border transition-all bg-white ${active ? 'border-emerald-400 shadow-md ring-2 ring-emerald-100' : 'border-gray-200 hover:border-emerald-300 hover:shadow'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{o.icon}</span>
                  <span className="text-sm font-bold text-gray-900">{o.title}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{o.subtitle}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Guide */}
      {guide && (
        <section className="space-y-6">
          {/* Progress */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-emerald-600 font-semibold">선택됨 · {guide.title}</p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{guide.subtitle}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">진행률</p>
                <p className="text-lg font-bold text-gray-900">{step + 1} / {total}</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white border border-gray-200 overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Stepper */}
          <div className="grid lg:grid-cols-[240px_1fr] gap-5">
            {/* Sidebar steps */}
            <div className="space-y-2">
              {guide.steps.map((s, i) => {
                const cur = i === step;
                const done = i < step;
                return (
                  <button key={s.title} type="button" onClick={() => setStep(i)}
                    className={`w-full flex items-center gap-3 text-left p-3 rounded-xl border transition-all ${cur ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-200'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${done ? 'bg-emerald-200 text-emerald-700' : cur ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {done ? '✓' : i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${cur ? 'text-gray-900' : 'text-gray-700'}`}>{s.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main content */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold text-base flex items-center justify-center shrink-0">
                  {step + 1}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{guide.steps[step].title}</h4>
                  {guide.steps[step].desc && <p className="text-sm text-gray-500 mt-1">{guide.steps[step].desc}</p>}
                </div>
              </div>

              {guide.steps[step].bullets && (
                <ul className="space-y-2 pl-1">
                  {guide.steps[step].bullets!.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
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
                          <p className="text-xs text-gray-400">{block.label ?? '명령어'}</p>
                          <button type="button" onClick={() => handleCopy(cid, block.code)}
                            className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors">
                            {copied === cid ? '✓ 복사됨' : '복사'}
                          </button>
                        </div>
                        <pre className="text-xs font-mono px-4 py-3 whitespace-pre-wrap leading-relaxed"><code>{block.code}</code></pre>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Nav */}
              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-300 transition-colors">
                  ← 이전
                </button>
                {step === total - 1 ? (
                  <Link to="/openclaw" className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                    🎉 설치 완료!
                  </Link>
                ) : (
                  <button type="button" onClick={() => setStep(s => Math.min(s + 1, total - 1))}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                    다음 →
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Troubleshooting */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">🔧 자주 묻는 문제 해결</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {TROUBLESHOOTING.map(item => (
            <div key={item} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
