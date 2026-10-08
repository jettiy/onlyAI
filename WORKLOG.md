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
