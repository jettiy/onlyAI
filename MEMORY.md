# MEMORY.md - Long-Term Memory

## 🎯 Projects

### China-HK Market Report System (2026-03-11)

**목표**: 중국/홍콩 증시 자동 보고서 시스템 구축

**개발 이력**:
- v1.0: 기본 크롤링 (동방재부)
- v2.0: 신랑재경 추가, 데이터 추출 개선
- v3.1: 종목 DB 구축, 섹터 분석, 백틱 포맷팅
- v4.0: Yahoo Finance API 통합, 실시간 정확 데이터
- v4.1: 뉴스 통합 (글로벌이코노믹)
- v4.2: 장전 보고서 (뉴스 중심)
- v4.3: 장마감 보고서 (특징주 + 섹터)
- **v4.5** (현재): **최종 완성본**

**v4.5 주요 개선사항** (2026-03-12 완료):
1. ✅ **URL 자동 링크 완전 차단**: HTML 엔티티 `&#46;` 사용
2. ✅ **섹터별 대표종목 등락률 추가**: 실시간 데이터 표시
3. ✅ **홍콩 종목명 한글화**: 150+ 종목 DB 확장
4. ✅ **상승 이유 구체적 표시**: "탄소섬유 수요 급증, 항공우주용 소재 수주 증가"
5. ✅ **대표종목 상장코드 정확히 표시**: CATL(300750&#46;SZ) -0.3%
6. ✅ **동방재부 API 실제 크롤링**: 특징주 + 섹터 데이터

**Cron Job 설정 (v4.5)** - 2026-03-13 수정:
- 장전 보고서: 9:30 KST (1:1) - `china-market-pre-v4.2` (ID: 74dee2ce-c7aa-4ebe-bbe1-35c0bf0cf7f5)
- 장마감 보고서: 17:55 KST (1:1) - `china-market-close-v4.5` (ID: cd5494c0-50cc-4753-83f8-d1e88b258447)
- 대상: telegram:1240498349 (1:1로 변경)
- 스크립트:
  - 장전: `/app/skills/china-market-report/scripts/market_report_v4.2.py`
  - 장마감: `/app/skills/china-market-report/scripts/market_report_v4.5.py`

**데이터 소스**:
1. Yahoo Finance API (실시간 지수)
2. 글로벌이코노믹 (한국어 중국/홍콩 뉴스)
3. 동방재부 (eastmoney.com) - 백업 데이터
4. 신랑재경 (sina.com.cn) - 백업 뉴스

**종목 DB**:
- 위치: `/app/skills/china-market-report/data/stocks_detailed.json`
- 등록 종목: 40+ 개 (중국 A주 + 홍콩)
- 섹터 정보: 12개 섹터

**뉴스 소스**:
- 위치: `/app/skills/china-market-report/data/news_sources.json`
- 주요 소스: 글로벌이코노믹 (중국/아시아 섹션)
- URL 패턴: `https://m.g-enews.com/list.php?ct=g080300` (중국)

**알려진 제한사항** (v4.5 기준):
1. ✅ ~~섹터별 등락률~~ - **동방재부 API로 해결** (v4.5)
2. ⚠️ 거래대금 - Yahoo Finance API에서 추출 필요 (향후 개선)
3. ⚠️ 뉴스 본문 - 현재 헤드라인만 제공 (본문 크롤링 향후 예정)
4. ⚠️ 그룹 메시지 정책 - groupAllowFrom 설정 필요
5. ⚠️ 홍콩 종목 - 일부 Yahoo Finance 404 에러 (대체 데이터 사용)

**향후 개선 계획**:
- Phase 1 (v4.6): 거래대금 데이터 추가, 뉴스 본문 크롤링
- Phase 2 (v4.7): 이데일리 뉴스 추가, 뉴스 소스 다양화
- Phase 3 (v5.0): 종목 DB 확충 (200+ 종목), AI 분석 도입

---

## 💡 Key Learnings

### OpenClaw System (2026-03-11)

**Cron Jobs**:
- `openclaw cron add` - 새 job 생성
- `openclaw cron list` - 목록 확인
- `openclaw cron rm <id>` - 삭제
- Timezone: `--tz "Asia/Seoul"` 필수
- Delivery: `--to "telegram:CHAT_ID"`로 다중 전송 가능
- 단일 생성 + 다중 전송 방식 권장 (비효율 방지)

**Telegram Integration**:
- 그룹 메시지 정책: `groupPolicy: "allowlist"` + `groupAllowFrom` 설정 필요
- 다중 전송: 하나의 cron job에서 여러 대상에게 전송 가능
- Format: 백틱(`)으로 코드 감싸면 URL 자동 링크 방지

**Subagents**:
- `sessions_spawn(runtime="acp", agentId="claude-code")` - 외부 코딩 에이전트 호출
- `sessions_spawn(runtime="subagent")` - 독립 에이전트 생성
- GLM/MiniMax도 독립 에이전트로 사용 가능

---

## 🔧 Technical Stack

**Current Environment**:
- OS: WSL2 (Windows) + Docker
- Runtime: Node.js v22.22.1
- Python: 3.x (urllib, json, re)

**Models** (GLM 중심 정책 - Max-Yearly 구독):
- **zai/glm-5-turbo**: 기본 모델 (메인 대화, cron job, 웹검색, 요약)
- **zai/glm-5**: 복잡한 코딩, 데이터분석, 심층 추론 (subagent 배치)
- **zai-coding/glm-5.1**: 코딩 특화 (ACP/Claude Code 호환, subagent 배치)
- **zai/glm-5v-turbo**: 이미지 분석 전용 (필요시만)
- **외부 모델 최소화**: OpenAI/Google은 최소한만 사용
- **Subagent 배치**: 복잡한 작업(코딩, 긴 글쓰기, 다중 검색)은 subagent로 위임

**GLM-5 Turbo API**:
```bash
curl -X POST "https://api.z.ai/api/paas/v4/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "glm-5-turbo",
    "messages": [
      {"role": "user", "content": "Your prompt here"}
    ],
    "thinking": {"type": "enabled"},
    "max_tokens": 4096,
    "temperature": 1.0
  }'
```
- 문서: https://docs.z.ai/guides/llm/glm-5-turbo
- 특징: 빠른 응답, 저렴한 가격, 채팅/분류/크롤링에 적합

**Skills Developed**:
1. `china-market-report` - 증시 보고서 자동화 (v4.5)
2. `weather` - 날씨 확인
3. `skill-creator` - 스킬 생성
4. `email-classifier` - 이메일 분류 (v3)
5. `github-ai-news` - GitHub + AI 뉴스 (v6)

---

## 📌 Important Notes

### 준석님 Preferences
- 한국어 사용
- 텔레그램 연동 선호
- 정확한 데이터 중시 (Yahoo Finance API 사용)
- 장전/장마감 보고서 자동화 (9:55/17:55 KST)
- 그룹 + 채널 동시 전송
- 뉴스 통합 (한국어 금융 뉴스)
- **주식비타민 = 미국 주식 추천** (2026-04-15 변경, 국내→미국)

### Active Channels
- 1:1: `telegram:1240498349`
- 그룹: `telegram:-1002633856900`
- 채널: `telegram:@onetopjt`

### Project Files
- v4.1 스크립트: `/app/skills/china-market-report/scripts/market_report_v4.1.py`
- 종목 DB: `/app/skills/china-market-report/data/stocks_detailed.json`
- 뉴스 소스: `/app/skills/china-market-report/data/news_sources.json`

---

## ⏰ Cron Job 설정 (2026-04-04 v2 효율화)

| # | 이름 | 스케줄 | 모델 | 용도 |
|---|------|--------|------|------|
| 1 | `daily-report` | 매일 08:00 | gemini-flash-lite | 데일리 리포트 3종 |
| 2 | `stock-vitamin-request` | 수요일 09:00 | zai/glm-5-turbo | 주식비타민 종목 |
| 3 | `geopolitics-update` | 월/수/금 21:00 | zai/glm-5-turbo | 지정학 리스크 일지 |
| 4 | `weekly-trend` | 일요일 22:00 | gemini-flash-lite | GitHub + ClawHub 주간 (병합) |
| 5 | `monthly-trend` | 매월 1일 00:00 | gemini-flash-lite | GitHub + ClawHub 월간 (병합) |

**v2 변경사항 (2026-04-04)**:
- 7개 → 5개 job 병합 (github/clawhub 주간·월간 각각 통합)
- stock-vitamin 모델: openai → zai (API 비용 절감)
- geopolitics: 매일 → 주 3회 (월/수/금)
- 타임아웃: 전부 300초 통일 (기존 600~900초)
- delivery: 전부 telegram 명시 (channel: "last" 제거)
- 유료 모델 사용 0개 (zai 무료 + gemini 저렴만)
- Isolated 세션, Compaction 모드 default

---

## 🤖 Hermes Agent

**설정 완료일**: 2026-03-26 (4/16 g-stack 설치, 4/18 Claude Code/Codex 논의)

**기본 정보:**
- 설치 위치: WSL2 (`~/.hermes/`)
- 제어: `wsl -d Ubuntu -- bash -lc "hermes <명령어>"`
- 텔레그램: `@jun1hermes_bot`
- 대시보드: `http://localhost:9119`
- 설정: `~/.hermes/config.yaml`, `~/.hermes/.env`, `~/.hermes/auth.json`
- CLI: `hermes chat -q '질문'` (단발성), `hermes gateway run` (게이트웨이)
- WSL 비밀번호: juni2026

**모델:** GLM-5.1 (코딩 전담), MiMo V2 Pro 보조
**스킬:** 79개 기본 + g-stack 37개 + codex 스킬

**역할 분담:**
| 작업 | 담당 | 이유 |
|------|------|------|
| onlyAI 프론트엔드 | Codex CLI (GPT Plus 무료, 타임아웃 없음) | |
| 복잡 코딩 | Hermes (GLM-5.1 + g-stack) | |
| 코드 리뷰/검토 | 주니클로 | 빌드 테스트 + 품질 점수 |
| 시스템 제어/배포 | 주니클로 | 파일 시스템 + Vercel |
| AI 시그널톡 | Hermes 전담 | |

**공유 워크스페이스:** `C:\Users\USER-PC\.openclaw\workspace\shared\`
- `projects/onlyai/` (CONTEXT + TASKS + DECISIONS)
- `projects/flamemap/`
- `handoff/` (인수인계 노트)
- `memory/` (공유 기억)

**ZAI 키 변경:** 2026-04-19 → `9422e89b...`로 교체 완료

**주의:** WSL2 재부팅 시 게이트웨이 자동 종료 → 수동 재시작 필요

---

## 📋 3월 주요 이력 (2026-03-12 ~ 2026-03-31)

### 3/12: 주니클로 첫 페어링 + 초기 설정
- OpenClaw Docker 구동, 준석님 PC 설치
- 주식비타민 첫 작업 (버라이즌 VZ 매수가/목표가/손절가)
- 게더타운 연동 시도 (나중에 보류)
- 중국/홍콩 증시 장전/장마감 보고서 첫 생성
- URL 자동 링크 방지 → 백틱(`) 사용 결정

### 3/13: Google OAuth + Cron 설정
- Google OAuth Playground로 토큰 발급 (Gmail, Calendar, Drive)
- 이메일 분류 작업 시작 (라벨 분류)
- 장전/장마감 보고서 Cron 등록

### 3/14: 인프라 설정
- 옵시디언 연동 설정 (무료, 로컬 폴더 방식)
- WSL2, Node.js, Git, gcloud CLI, Tailscale 설치 확인
- ClawHub 인기 스킬 탐색

### 3/16: API 키 확보
- Google 서비스 계정 인증키 저장 (구글 클라우드 편집자 권한)
- 하이브리드 모델 사용 결정 (GLM-5 코딩/분석, GLM-5-Turbo 간단작업)
- 종목 DB 확장

### 3/17: 데이터 소스 확충
- Alpha Vantage API 등록
- FMP(Financial Modeling Prep) API 등록 (키: AqviBX7Q...)
- 동방재부 API 활용
- Yahoo Finance API 주 데이터소스로 확정

### 3/18: signalchart.kr
- 준석님 제작 서비스 (프론트 Vercel, 백엔드+DB Render, 도메인 가비아)
- 배포 후 로그인/접속 문제 발생 → 서버 문제 의심

### 3/20: AI이것만 디자인 + 부가 작업
- AI이것만(onlyai.co.kr 전신) 디자인 리뉴얼 시작
- 베트남 휘발유 가격 조사, LNG 선박 추적, 와우글로벌 미라클 원고

### 3/21: GPT API 등록
- OpenAI API 키 등록 (GPT-5.4 mini 서브에이전트용)

### 3/24: 샤오미 MiMo
- MiMo V2 Pro API 키 등록 (sk-sqg35...)

### 3/26: 브라우저 자동화 + 방송 리서치
- Playwright 설치 (Docker 내)
- 아시아마켓나우 방송용 주제 제안 시스템 구상
- 스테이블 코인, 광통신 등 10개 주제 제안
- ClawHub에서 도움될 스킬 탐색

### 3/27: 모델 정비
- GLM-5 Turbo를 메인 모델로 변경
- Gemini 3 Flash Preview로 업데이트
- GPT-4o-mini → GPT-5.4 mini로 변경
- Tesseract OCR 설치 시도 (sudo 권한 필요)
- 옵시디언 정리 (노트 세분화, 날짜별 정리)
- 구독 관리 자동화 구상 (결제 전날 알림)

### 3/30: 중국 출장
- 상해 출장, 호텔/맛집/샤오미 매장 조사
- ClawHub 인기 스킬 정리

---

### 4/20: Kimi K2.6 출시 by Moonshot AI
- 2026-04-20 출시, 오픈소스 멀티모달 에이전틱 모델
- 1T 파라미터 MoE, 32B 활성
- SWE-Bench Pro 58.6% (GPT-5.4 57.7%, Opus 4.6 53.4% 상회)
- HLE-Full with Tools: 54.0 (GPT-5.4 52.1 리드)
- API: $0.60/M input, OpenAI 호환, self-hosting 가능
- 멀티 에이전트 오케스트레이션, 장기 코딩 특화

### 4/21: Qwen3.6-27B 출시 by Alibaba
- 2026-04-22 출시, Apache 2.0 오픈소스
- 27B dense 모델 (첫번째 Qwen3.6 dense)
- Qwen3.5-397B-A17B MoE를 코딩 벤치마크에서 능가
- SWE-bench Verified 77.2%
- 싱글 GPU 구동 가능, 텍스트/이미지/비디오 멀티모달

### 4/23: GPT-5.5 / GPT-5.5 Pro 출시 by OpenAI
- 2026-04-23 출시, 에이전틱 코딩/컴퓨터 사용/지식 작업/초기 연구 특화
- Terminal-Bench 2.0: 82.7% (GPT-5.4 75.1% 대비 +7.6%p)
- ARC-AGI: 0.95, ARC-AGI v2: 0.85, GPQA: 0.94
- API 가격: $5/M input, $30/M output (GPT-5.4 대비 2배)
- GPT-5.5 Pro: $21/M input (연구 파트너 포지션)
- 전작 대비 더 적은 토큰으로 동일 작업 완료 (실제 비용 덜 증가)
- ARC-AGI v2 #1, Coding #2, Reasoning #2, Tool Calling #2

### 4/24: DeepSeek V4 Preview 출시
- 2026-04-24 출시, 오픈소스. 1M 컨텍스트
- **V4-Pro**: 1.6T 파라미터 (49B 활성), 오픈소스 SOTA 에이전틱 코딩
  - API: $1.74/M input, $3.48/M output, 캐시 히트 90% 할인
  - GPT-5.4 및 Gemini 3.1 Pro와 경쟁, 모든 오픈 모델 리드
- **V4-Flash**: 284B 파라미터 (13B 활성), 경량 고효율
  - API: $0.14/M input, $0.28/M output, 캐시 $0.028/M
  - 최대 384K 출력, 경제적 선택
- 구조적 혁신으로 V3.2 대비 10% 컴퓨팅, 7% 메모리로 동급 성능
- API 즉시 사용 가능, chat.deepseek.com Expert/Instant Mode

### AI 모델 랜드스케이프 4월 4주차 요약
- **OpenAI vs Open**: GPT-5.5 프리미엄 전략 vs DeepSeek/Kimi/Qwen 오픈소스
- **가격 격차 극대화**: GPT-5.5 ($5/M) vs DeepSeek V4-Flash ($0.14/M) = 35배 차이
- **오픈소스 성능 급등**: Kimi K2.6 → GPT-5.4 수준 근접. DeepSeek V4-Pro → 오픈 SOTA
- **dense 코딩 특화**: Qwen3.6-27B로 27B dense가 397B MoE 능가하는 트렌드
- **에이전틱 워크로드**: 모든 신규 모델이 에이전틱 코딩/툴 사용 벤치마크 중심

마지막 업데이트: 2026-04-25 17:00 KST (4월 4주차 모델 러쉬 타임라인 추가)

---

## 🚫 Lessons Learned (반드시 지킬 것)

### onlyAI 프로젝트 (2026-04-08)

1. **JSX 배열에 비-Element 섞지 않기**: `NAV.filter().slice()` 결과와 `<Link>`를 spread로 같은 배열에 섞으면 TS2322 에러. 반드시 `<Fragment>(<>)`로 감싸고 `.map()` 안에서만 Element 반환
2. **Vercel Edge에서 `process.env` 주의**: Edge Runtime에서 일부 환경변수 접근 제한 있음. API 라우트 테스트 시 로컬에서는 되는데 Vercel에서 안 될 수 있음
3. **`write` tool 사용**: PowerShell `Set-Content`는 UTF-8 BOM 문제 발생 → 항상 `write` tool 사용
4. **Subagent에 빌드 테스트 반드시 포함**: GLM-5.1에게 작업 시킬 때 항상 `npx vite build` 에러 0 확인 명시
5. **커밋 메시지 한글 인코딩**: git push 시 PowerShell에서 한글 깨짐 → 정상 동작하므로 무시해도 됨
6. **SEO canonical URL**: 도메인 변경 시 index.html의 canonical, og:url, sitemap.xml 전부 변경
7. **이미지 분석 불가**: 현재 기본 모델(glm-5-turbo)은 이미지 분석 불가 → `zai/glm-5v-turbo` 모델 지정 필요
8. **가비아 CNAME**: 끝에 점(.) 필수 → `cname.vercel-dns.com.`
9. **절대 Set-Content 사용 금지**: PowerShell Set-Content로 한국어 파일 쓰면 인코딩 깨짐. 반드시 `write` tool만 사용
10. **GLM-5.1 subagent 에러**: `zai-coding` 키 없으면 폴백됨. auth-profiles.json에 `zai` 키를 `zai-coding:default`로도 복사해둘 것
