import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type InstallType = '' | 'windows' | 'mac' | 'docker';

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
  { id: 'mac', icon: '', title: 'Mac · Linux', subtitle: '터미널로 간편 설치' },
  { id: 'docker', icon: '🐳', title: 'Docker', subtitle: '컨테이너로 격리 실행' },
];

const GUIDES: Record<Exclude<InstallType, ''>, Guide> = {
  windows: {
    title: 'Windows 설치',
    subtitle: 'PowerShell로 1분 만에 설치합니다.',
    steps: [
      {
        title: 'Install Script Run',
        desc: 'PowerShell을 열고 아래 명령어를 붙여넣습니다.',
        codeBlocks: [{ code: 'iwr -useb https://openclaw.ai/install.ps1 | iex' }],
      },
      {
        title: 'Initial Setup',
        desc: 'AI 제공자를 선택하고 기본 설정을 완료합니다.',
        codeBlocks: [{ code: 'openclaw onboard' }],
        bullets: [
          'ZAI 무료 추천 (한국 특화)',
          'OpenAI, Google, Anthropic 지원',
          'API 키 발급 후 입력',
        ],
      },
      {
        title: 'Start Gateway',
        desc: 'WebUI와 메신저 연동을 위해 Gateway가 필요합니다.',
        codeBlocks: [{ code: 'openclaw gateway start' }],
        note: '모든 기능을 사용하려면 Gateway가 항상 켜져 있어야 합니다.',
      },
      {
        title: 'Open Dashboard',
        desc: '브라우저에서 대시보드를 엽니다.',
        codeBlocks: [{ code: 'openclaw dashboard' }],
      },
    ],
  },
  mac: {
    title: 'Mac / Linux 설치',
    subtitle: '터미널에서 빠르게 설치합니다.',
    steps: [
      {
        title: 'Install Script',
        desc: '터미널을 열고 아래 명령어를 붙여넣습니다.',
        codeBlocks: [{ code: 'curl -fsSL https://openclaw.ai/install.sh | bash' }],
      },
      {
        title: 'Initial Setup',
        codeBlocks: [{ code: 'openclaw onboard' }],
        bullets: ['ZAI 무료 추천', 'AI 제공자 선택'],
      },
      {
        title: 'Start Gateway',
        codeBlocks: [{ code: 'openclaw gateway start' }],
      },
      {
        title: 'Open Dashboard',
        codeBlocks: [{ code: 'openclaw dashboard' }],
      },
      {
        title: 'Background Run for Server',
        desc: '24/7 실행을 위해 PM2를 사용합니다.',
        codeBlocks: [
          { code: 'npm install -g pm2' },
          { code: 'pm2 start openclaw gateway start --name openclaw' },
          { code: 'pm2 save && pm2 startup' },
        ],
      },
    ],
  },
  docker: {
    title: 'Docker 설치',
    subtitle: '컨테이너로 격리해 실행합니다.',
    steps: [
      {
        title: 'Install Docker',
        desc: 'Docker Desktop이 필요합니다.',
        bullets: ['Windows/Mac: docker.com에서 다운로드', 'Linux: sudo apt install docker.io'],
      },
      {
        title: 'Create docker-compose.yml',
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
        title: 'Run',
        desc: 'Gateway가 컨테이너에서 바로 실행됩니다.',
        codeBlocks: [{ code: 'docker compose up -d' }],
      },
      {
        title: 'Initial Setup',
        codeBlocks: [{ code: 'docker exec -it openclaw openclaw onboard' }],
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
  'LLM 응답 없음: API 키/모델명 확인, Gateway 상태 확인',
  '토큰 이슈: openclaw config get gateway.auth.token',
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
            설치 환경을 선택하면 단계별로 안내합니다.
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
        <div className="grid sm:grid-cols-3 gap-3">
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
