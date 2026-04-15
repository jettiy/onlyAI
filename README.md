# AI이것만 🤖

**국내 AI 서비스 최신 현황을 한눈에 — 모델 탐색 · 가격 비교 · 뉴스 · 프롬프트**

> "AI, 이것만 보면 된다"

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## 주요 기능

| 섹션 | 내용 |
|---|---|
| 🔍 탐색 | AI 모델 카탈로그 · 가격 비교 · 벤치마크 · 멀티에이전트 |
| 💬 프롬프트 | 분야별 프롬프트 모음 · AI 활용법 가이드 |
| 🦞 OpenClaw | OpenClaw AI 에이전트 플랫폼 소개 · 활용 사례 |
| 📚 배우기 | AI 용어 사전 · 퀴즈 · 학습 타임라인 |
| 📰 뉴스 | AI 최신 뉴스 · 트렌드 |

---

## 기술 스택

- **Framework**: React 18 + TypeScript
- **빌드**: Vite 6
- **스타일**: TailwindCSS v3 + shadcn/ui (Radix UI)
- **라우팅**: React Router v6
- **차트**: Recharts
- **PWA**: vite-plugin-pwa

---

## 로컬 실행

```bash
# 클론
git clone https://github.com/jettiy/onlyAI.git
cd onlyAI

# 패키지 설치 (pnpm 권장)
pnpm install
# 또는
npm install

# 개발 서버 실행 (http://localhost:5173)
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview
```

**요구사항**: Node.js 18+

---

## 프로젝트 구조

```
onlyAI/
├── public/
│   └── ...
└── src/
    ├── App.tsx              # 메인 라우터 + 레이아웃
    ├── components/
    │   ├── Layout.tsx       # 사이드바 + 헤더 레이아웃
    │   └── ErrorBoundary.tsx
    ├── pages/               # 페이지 컴포넌트
    │   ├── Home.tsx         # 메인 홈
    │   ├── Models.tsx       # AI 모델 탐색
    │   ├── Pricing.tsx      # 가격 비교
    │   ├── Benchmarks.tsx   # 벤치마크
    │   ├── News.tsx         # AI 뉴스
    │   ├── Trending.tsx     # 트렌드
    │   ├── Prompts.tsx      # 프롬프트 모음
    │   ├── Guide.tsx        # AI 활용 가이드
    │   ├── KoreanAI.tsx     # 한국 AI 서비스
    │   ├── MultiAgent.tsx   # 멀티에이전트
    │   ├── OpenClawIntro.tsx# OpenClaw 소개
    │   ├── Glossary.tsx     # AI 용어 사전
    │   ├── Quiz.tsx         # AI 퀴즈
    │   └── Timeline.tsx     # AI 타임라인
    └── lib/
        └── utils.ts
```

---

## 라이선스

MIT License

---

## 관련 프로젝트

- [FlameMap](https://github.com/jettiy/flamemap) — 이란-이스라엘 전쟁 에너지 가격 실시간 트래커
