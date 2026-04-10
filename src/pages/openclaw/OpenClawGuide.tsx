import { Link } from 'react-router-dom';

const CodeBlock = ({ id, code, label = '명령어' }: { id: string, code: string, label?: string }) => (
  <div className="rounded-xl border border-gray-800 bg-gray-900 text-gray-100 overflow-hidden my-3">
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
      <p className="text-xs text-gray-400">{label}</p>
      <button onClick={() => navigator.clipboard.writeText(code)} className="text-xs font-semibold text-emerald-300 hover:text-emerald-200">복사</button>
    </div>
    <pre className="text-xs font-mono px-4 py-3 whitespace-pre-wrap leading-relaxed"><code>{code}</code></pre>
  </div>
);

export default function OpenClawGuide() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">📖 OpenClaw 설치 상세 가이드</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">초보자도 따라 할 수 있는 단계별 안내서입니다.</p>
      </header>

      <section className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-4 uppercase tracking-wider">🚀 핵심 3단계</h2>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <div><p className="text-2xl mb-1">⚙️</p>온보딩</div>
          <div><p className="text-2xl mb-1">🚀</p>게이트웨이</div>
          <div><p className="text-2xl mb-1">📊</p>대시보드</div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">1. OpenClaw가 뭔가요?</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">OpenClaw는 컴퓨터에서 구동되는 Gateway와 브라우저 기반의 Control UI(WebUI)를 통해 AI를 통합 관리하는 도구입니다.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">2. 설치 전 준비물</h2>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>인터넷 연결</li>
          <li>컴퓨터 (Windows/Mac/Linux)</li>
          <li>사용할 LLM API 키 (OpenAI, Google, Anthropic, ZAI 등)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">3. 운영체제별 설치</h2>
        
        <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-3">
          <summary className="font-bold cursor-pointer">Windows (추천)</summary>
          <p className="text-sm mt-2 mb-2">PowerShell을 열고 다음 명령을 입력하세요:</p>
          <CodeBlock id="win-install" code="iwr -useb https://openclaw.ai/install.ps1 | iex" />
        </details>

        <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-3">
          <summary className="font-bold cursor-pointer">Mac / Linux</summary>
          <p className="text-sm mt-2 mb-2">터미널을 열고 다음 명령을 입력하세요:</p>
          <CodeBlock id="mac-install" code="curl -fsSL https://openclaw.ai/install.sh | bash" />
        </details>

        <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <summary className="font-bold cursor-pointer">Docker</summary>
          <CodeBlock id="docker-yml" label="docker-compose.yml" code={`version: '3.8'
services:
  openclaw:
    image: node:22
    container_name: openclaw
    restart: always
    ports:
      - '18789:18789'
    volumes:
      - ./openclaw-data:/root/.openclaw
    command: npx -y openclaw@latest gateway start`} />
          <CodeBlock id="docker-run" code="docker compose up -d" />
        </details>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">4. 설치 후 초기 설정</h2>
        <CodeBlock id="onboard" code="openclaw onboard" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">5. Gateway 실행 및 사용</h2>
        <CodeBlock id="gw-start" label="Gateway 실행" code="openclaw gateway start" />
        <CodeBlock id="gw-dash" label="대시보드 열기" code="openclaw dashboard" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">6. 자주 묻는 문제 해결</h2>
        <details className="border-b py-3"><summary className="font-bold">Gateway가 실행되지 않아요</summary><p className="text-sm">openclaw gateway status로 상태를 먼저 확인하세요.</p></details>
        <details className="border-b py-3"><summary className="font-bold">대시보드가 안 열려요</summary><p className="text-sm">직접 주소를 입력하지 말고 반드시 openclaw dashboard 명령어로 여세요.</p></details>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center">
        <Link to="/openclaw/install" className="inline-block px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600">
          바로 설치하기 →
        </Link>
      </section>
    </div>
  );
}