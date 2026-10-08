# onlyAI WORKLOG

작업 이력. AI 에이전트는 작업 완료 시 한 줄 추가 (날짜 | 누가 | 무엇을 | 결과).

---

## 2026-10-09 | Hermes(default) | Phase 0 리부트 — 진단·키 교체·레포 청소

- **진단**: release-translate.yml 크론이 2026-06-28부터 매주 실패 (ZAI_API_KEY 401). 데이터 갱신은 수동(workflow_dispatch)이라 방치됨 → 사이트 데이터 7/24 동결. 원인 = "실패해도 조용한 구조".
- **ZAI 키 교체**: new-ai 프로필 키 유효성 확인(HTTP 200) 후 gh secret 교체. 크론 수동 트리거 → **6m12s success**, releases-ko.json 갱신 커밋(c4ce2bd), Vercel 자동 배포 확인.
- **Vercel 토큰 발급**: Aside MCP로 jettiy 계정 로그인 → `hermes-onlyai-ops` 토큰(No Expiration) 발급 → 로컬 8899 POST 수신(값 비노출) → hermes .env 저장, API 검증 완료. (교훈: URL 경로 전달은 값 잘림. POST 본문+OPTIONS/CORS 필수. 8899 좀비 리스너 3개 정리.)
- **레포 청소 (이 PR)**: 임시파일 22개 삭제(시크릿 스캔 클린 확인), .gitignore 보강(_*.py/_*.txt/debug* 등), AGENTS.md 신설(에이전트 규칙서), WORKLOG.md 신설. 백업 태그 `backup-pre-cleanup-20261009`.
- **다음**: Phase 1 — 데이터 갱신 워크플로우 예약화 + 자동 배포 연결 + 실패 알림(텔레그램) + CI 신설. 이후 Jev 뉴스 필터 쉐도우.

### 운영 구조 (2026-10-09 확정)
- 목적: **수익화** (제휴·광고 염두)
- 알림: 텔레그램 / 주간 브리핑: 일요일 저녁
- 배포: Vercel (onlyai-phi.vercel.app), 커밋 푸시 시 자동
- 로컬 클론: `Desktop\Projects\onlyAI` / 원칙: 워커는 PR만, main 직접 커밋 금지

## 2026-10-09 (2) | Phase 1~2 — 자동화·탭버그·모델 리프레시·파이프라인 v2

- **Phase 1 완료 (PR #3)**: update-data.yml 매일 2회(KST 03:30/21:00) 예약화+뉴스통합, ci.yml 신설(PR마다 lint+build), 텔레그램 알림(notify.mjs) 실전송 확인. CI 셸 인용 버그 1건 즉시 수정.
- **탭 버그 수정 (PR #4)**: ①메가메뉴 드롭다운 hover 전용→onClick 토글 추가 ②stale chunk 에러→ChunkReloadGuard 자동복구. Aside 실측 재현→수정.
- **모델 리프레시 (PR #5, 워커 spacebunny 2회 실행)**: models.ts 62→78 (2026-08~10 신모델 24종, 가격 실측 갱신, 보수적 제거), 이모티콘 46파일 전면 제거(lucide 전환·국기→텍스트 라벨), 로고 매핑(arcee·microsoft SVG 추가). 검수: eslint/tsc/build 0에러, Playwright 5페이지+비전 검수(이모지 0·레이아웃 정상). 워커 2단계 확인제(제거범위·이모지범위) 운영 효과 있었음.
- **파이프라인 v2 (PR #5)**: AA 제외 확정(재배포 약관 리스크·Tier1로 커버). sync-models.mjs(OpenRouter 469+models.dev+LiteLLM 가격검증→unified.json, 체인지로그 이관), tier-classify.mjs(Jev 판정→major 즉시 텔레그램, 실측 10건), fetch-data 모델수집 제거·detect-new-models 삭제(중복 해소), liveData 방문자 직접호출→정적 JSON 전환('매 10분 갱신' 거짓 해소).
- **Jev 실전 스키마 발견** (typesafe-jev 스킬 반영): OpenRouter Decisions는 `~typesafe/jev-latest` 틸드 필수, 질문 `instructions` 필수, 응답 `answers.<키>`.
- **준석님 승인 대기**: PR #5 머지 여부 — Aside localhost:4173 프리뷰에서 직접 확인 후 결정.

### 모델 최신화 + 로고 매핑 + 이모티콘 제거 (2026-10-09, 브랜치 feat/model-refresh-2026-10)
- 모델 카탈로그 62 → 78개. 2026-08~10 신모델 24개 추가 (GPT-6 계열 4, Claude 5.5/5.1 4종, Gemini 3.8 Flash, Qwen3.8 3종, GLM-5.3 2종, Muse Spark 1.3, DeepSeek V4.1 Flash, MiMo-V2.6 2종, Grok 4.7, Mistral Large 4, Step 5 Preview, Solar 2종, Nemotron 3.5 Lightning)
- 가격·컨텍스트 OpenRouter(2026-10-09) 실측으로 전면 갱신. 제거 6종은 명백한 대체분만
- 로고: aa_arcee.svg·aa_microsoft.svg 신규 추가(단색 라인아트). 미매핑 회사 0개
- 이모티콘 1,062건(76파일) → 0건. lucide-react 아이콘 + iconRegistry로 전환
- 검증: lint 0 / build 성공 / 5페이지 Playwright 통과 / 신규모델 24/24 렌더 / 로고 broken 0 / 이모티콘 0
- 보고서: `_scratch/REPORT.md` (커밋 없음)
