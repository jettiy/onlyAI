You need to update two files in this Vite+React+TypeScript project. IMPORTANT: Do NOT use Set-Content. The files MUST be UTF-8 without BOM.

## File 1: src/pages/openclaw/OpenClawInstall.tsx (REWRITE)

This is a quiz-style install guide. Current version uses openclaw init which is outdated. Renew it based on the following requirements:

### Options (3 cards):
1. Windows (recommended) - icon: window icon - subtitle: PowerShell 1min install
2. Mac / Linux - icon: apple icon - subtitle: Terminal quick install  
3. Docker - icon: whale icon - subtitle: Container isolated run

### GUIDES data:

**Windows guide** steps:
1. title: Install Script Run - desc: Open PowerShell and paste this command - code: iwr -useb https://openclaw.ai/install.ps1 | iex
2. title: Initial Setup - desc: Select AI provider, enter API key, set default model - code: openclaw onboard - bullets: ZAI free recommended Korean specialized, OpenAI Google Anthropic supported, Get API key and enter
3. title: Start Gateway - desc: Gateway must be running for WebUI and messenger - code: openclaw gateway start - note: Gateway must be on for all features
4. title: Open Dashboard - desc: Open Control UI in browser - code: openclaw dashboard

**Mac/Linux guide** steps:
1. title: Install Script - desc: Open Terminal and paste - code: curl -fsSL https://openclaw.ai/install.sh | bash
2. title: Initial Setup - code: openclaw onboard - bullets: ZAI free recommended, Choose your AI provider
3. title: Start Gateway - code: openclaw gateway start
4. title: Open Dashboard - code: openclaw dashboard
5. title: Background Run for Server - desc: Use PM2 for 24/7 - codeBlocks: npm install -g pm2 THEN pm2 start openclaw gateway start --name openclaw THEN pm2 save && pm2 startup

**Docker guide** steps:
1. title: Install Docker - desc: Need Docker Desktop - bullets: Windows Mac from docker.com, Linux sudo apt install docker.io
2. title: Create docker-compose.yml - single code block with docker-compose content (image node:22, port 18789, restart always)
3. title: Run - code: docker compose up -d
4. title: Initial Setup - code: docker exec -it openclaw openclaw onboard

### TROUBLESHOOTING (8 items):
- Gateway not starting: openclaw gateway status
- Dashboard not opening: openclaw dashboard command
- API key error: openclaw doctor
- Settings corrupted: openclaw doctor --fix
- Port conflict: change gateway.port in openclaw.json (default 18789)
- Windows execution policy: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser in admin PowerShell
- LLM not responding: check API key and model name, check Gateway status
- Token issue: openclaw config get gateway.auth.token

### Add link at bottom:
Detail guide link to /openclaw/guide with text: First time? See detailed guide

Keep same visual design (progress bar, step sidebar, code blocks with copy, dark code blocks). Support dark mode. Same imports (useState, useEffect, useMemo, useRef, Link from react-router-dom). Export default function OpenClawInstall.

Korean UI text:
- Page title: OpenClaw 설치 가이드
- Page subtitle: 설치 환경을 선택하면 단계별로 안내합니다
- Step 1 header: 1. 어디에 설치하시겠어요?
- Options: Windows (추천) / Mac · Linux / Docker
- Windows subtitle: PowerShell로 1분 설치
- Mac subtitle: 터널로 간편 설치
- Docker subtitle: 컨테이너로 격리 실행
- Progress: 진행률, 선택됨
- Selected guide title text
- Code block header: 명령어, 복사, 복사됨
- Nav: 이전, 다음, 설치 완료!
- Change option: 설치 방식 변경
- Troubleshooting header: 자주 묻는 문제 해결
- Bottom link: 상세 가이드 보기

## File 2: src/pages/openclaw/OpenClawGuide.tsx (REWRITE)

Comprehensive scroll-based guide page (blog style). NOT a quiz.

Korean content sections:
1. Header: OpenClaw 설치 상세 가이드 - 초보자도 따라할 수 있는 단계별 안내서
2. Quick summary card: 핵심 3단계 - openclaw onboard then openclaw gateway then openclaw dashboard
3. Section: OpenClaw가 뭔가요? - Gateway와 WebUI로 AI를 연결하는 도구
4. Section: 설치 전 준비물 - 인터넷, 컴퓨터, LLM API 키
5. Section: 가장 쉬운 설치 (Windows) - iwr command with code block
6. Section: Mac/Linux 설치 - curl command with code block
7. Section: Docker 설치 - docker-compose with code block
8. Section: 설치 후 초기 설정 - openclaw onboard explained
9. Section: Gateway 실행하기 - gateway start, status, dashboard
10. Section: 초보자 자주 하는 실수 - troubleshooting with details/summary HTML
11. Section: LLM이 안 답할 때 - checklist
12. Bottom CTA: 바로 설치하기 link to /openclaw/install

Use details/summary for collapsible sections. Code blocks with copy button (copyToClipboard function). Tailwind classes. Dark mode support. useState useRef for copy. Link from react-router-dom. Export default function OpenClawGuide.

All content must be in Korean.

After creating both files run: npx vite build
Fix any TypeScript errors.
