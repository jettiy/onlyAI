---
version: alpha
name: AI이것만 (onlyai.co.kr)
description: AI 모델 비교·가격·벤치마크 정보 포털 — 보라-인디고 브랜드의 미니멀 데이터 시각화.
colors:
  primary: "#1A1A2E"
  on-primary: "#FFFFFF"
  secondary: "#6B7280"
  on-secondary: "#FFFFFF"
  brand: "#5B5FEF"
  brand-light: "#EEEDFF"
  brand-50: "#EEEDFF"
  brand-100: "#D9D8FE"
  brand-200: "#B4B3FD"
  brand-300: "#8E8DFB"
  brand-400: "#7574F9"
  brand-500: "#5B5FEF"
  brand-600: "#4A4AC0"
  brand-700: "#363690"
  brand-800: "#232360"
  brand-900: "#111130"
  success: "#22C55E"
  success-50: "#ECFDF5"
  success-500: "#22C55E"
  success-600: "#16A34A"
  danger: "#EF4444"
  danger-50: "#FEF2F2"
  danger-500: "#EF4444"
  danger-600: "#DC2626"
  warning: "#F59E0B"
  neutral: "#F8FAFC"
  neutral-dark: "#111827"
  surface: "#FFFFFF"
  surface-dark: "#111827"
  border: "#E5E7EB"
  border-dark: "#1F2937"
  muted: "#9CA3AF"
  amber-300: "#FCD34D"
  amber-500: "#F59E0B"
  orange-300: "#FED7AA"
  orange-500: "#F97316"
  gray-300: "#D1D5DB"
  gray-500: "#6B7280"
typography:
  h1:
    fontFamily: Pretendard
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  h2:
    fontFamily: Pretendard
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.2
  h3:
    fontFamily: Pretendard
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Pretendard
    fontSize: 0.875rem
    lineHeight: 1.6
  body-sm:
    fontFamily: Pretendard
    fontSize: 0.75rem
    lineHeight: 1.5
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: 500
  label:
    fontFamily: Pretendard
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: "0.03em"
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  section: 40px
components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    padding: 20px
    borderColor: "{colors.border}"
  card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.neutral}"
    borderColor: "{colors.border-dark}"
  card-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    padding: 20px
    borderColor: "{colors.brand}"
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
    transform: "translateY(-4px)"
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: 10px 24px
    fontWeight: 700
  button-filter-active:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: 6px 16px
    fontSize: 0.75rem
    fontWeight: 600
  button-filter-inactive:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: 6px 16px
    fontSize: 0.75rem
    fontWeight: 600
  button-quicklink:
    backgroundColor: "#F3F4F6"
    textColor: "#374151"
    rounded: "{rounded.lg}"
    padding: 8px 14px
    fontSize: 0.75rem
    fontWeight: 600
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    padding: 14px 16px 14px 44px
    borderColor: "{colors.border}"
    placeholderColor: "{colors.muted}"
  section:
    padding: "40px 0"
    gap: 40px
  highlight-card-icon:
    width: 36px
    height: 36px
    rounded: "{rounded.lg}"
  cta-banner:
    backgroundColor: "linear-gradient(135deg, #5B5FEF 0%, #7C6AEF 50%, #9B8AEF 100%)"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: 24px 32px
  anchor-link:
    textColor: "{colors.brand}"
    fontWeight: 500
    fontSize: 0.75rem
---
<!--
  DESIGN.md — AI이것만 (onlyai.co.kr)
  Generated: 2026-04-25
  Tokens extracted from: index.css, tailwind.config.js, Home.tsx, Guide.tsx, Benchmarks.tsx,
  KoreanAI.tsx, MultiAgent.tsx, and supporting data files.
-->

## Overview

AI이것만은 AI 모델 비교·가격·벤치마크 정보를 한눈에 보여주는 한국형 포털입니다. 보라-인디고 브랜드 컬러(`#5B5FEF`)를 중심으로, 미니멀하고 데이터 중심적인 UI를 지향합니다. 다크모드를 기본 지원하며, 깔끔한 카드 레이아웃과 차트 기반 시각화가 핵심입니다.

**성격:** 전문적이면서도 친근함. 어두운 배경에서도 가독성이 높고, 데이터는 차트로 직관적으로 전달.

## Colors

### Brand (보라-인디고 계열 — 핵심 브랜드 컬러)
- **Brand 500 (`#5B5FEF`):** 주 액센트 — 버튼, 링크, 활성화 상태, 아이콘.
- **Brand 50 (`#EEEDFF`):** 매우 옅은 보라 — 아이콘 배경, 강조 배경.
- **Brand 100-200 (`#D9D8FE`, `#B4B3FD`):** 차트 바, 약한 강조.
- **Brand 600-900 (`#4A4AC0`→`#111130`):** hover, pressed, 어두운 배경 위 텍스트.

### Signal Colors
- **Success (`#22C55E`):** 긍정 신호 — 무료 모델, 저렴한 모델, 가성비 태그.
- **Danger (`#EF4444`):** 경고 — 비싼 모델 표시.
- **Warning (`#F59E0B`):** 중간 가치 — 중간 가성비 영역.

### Neutral
- **Surface/White (`#FFFFFF`):** 라이트모드 배경, 카드 면.
- **Surface-dark (`#111827`):** 다크모드 카드 배경.
- **Border (`#E5E7EB` / dark `#1F2937`):** 경계선, 구분선.
- **Muted (`#9CA3AF`):** 보조 텍스트, 플레이스홀더, 레이블.

### Arena Medals
- **Gold:** `#F59E0B` (text) / `#FCD34D` (border) / `#FFFBEB` (bg)
- **Silver:** `#6B7280` (text) / `#D1D5DB` (border) / `#F9FAFB` (bg)
- **Bronze:** `#F97316` (text) / `#FED7AA` (border) / `#FFF7ED` (bg)

### Scatter Plot Colors (가성비 차트)
- Green `#22C55E` — ratio > 0.8 (최고 가성비)
- Brand `#5B5FEF` — ratio > 0.4 (보통)
- Yellow `#F59E0B` — ratio > 0.15 (다소 비쌈)
- Red `#EF4444` — ratio <= 0.15 (비싼 편)

### Bar Chart Colors (주간 인기 모델)
- 1위: `#5B5FEF` — brand solid
- 2위: `#7C6AEF` — brand lighter
- 3위: `#9B8AEF`
- 4-5위: `#B8AAEF`
- 6-8위: `#D4CAEF`

## Typography

### Font Stack
- **한글 / 기본:** Pretendard (CDN: orioncactus)
- **영문 보조:** Inter (Google Fonts, weight 400-700)
- **코드/가격:** JetBrains Mono (Google Fonts, weight 400-500)

### Size Scale
| Token | Size | Weight | Used For |
|-------|------|--------|----------|
| `h1` | 2rem (32px) | 700 (Black) | Hero 제목 |
| `h2` | 1.5rem (24px) | 700 (Bold) | 섹션 제목 |
| `h3` | 1.125rem (18px) | 600 | 카드 제목 |
| `body` | 0.875rem (14px) | 400 | 본문, 뉴스 제목 |
| `body-sm` | 0.75rem (12px) | 400 | 보조 텍스트 |
| `label` | 0.75rem (12px) | 600 | 버튼, 태그, 뱃지 |
| `meta` | 0.6875rem (11px) | 400 | 날짜, 데이터 기준일 |
| `price` | 0.6875rem (11px) | 700 | 가격 수치 |

## Layout & Spacing

- **Section gap:** `space-y-10` (40px between major sections)
- **Grid gap:** `gap-4` (16px for 3-column cards), `gap-3` (12px for arena cards)
- **Card internal padding:** `p-5` (20px)
- **Container max-width:** Tailwind `container` with 2rem padding, max 1400px at 2xl
- **Hero padding:** `py-10` -> `md:py-16` (40px → 64px)
- **Responsive breakpoints:** sm(640), md(768), lg(1024)

### Responsive Patterns
- 3-column grids collapse to 1-column on mobile (`md:grid-cols-3`)
- Charts are horizontally scrollable on mobile (`overflow-x-auto`, `min-w-[480px]`)
- Hero is always centered, stacks vertically on mobile

## Elevation & Depth

- **Cards:** `border` based (no shadow by default)
- **Card hover:** `shadow-xl` + `-translate-y-1` + stronger border
- **CTA Banner:** gradient background (`#5B5FEF → #9B8AEF`), decorative `rounded-full` circles at corners
- **Modals/Dialogs:** Not present in current design (all inline content)

## Shapes

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Inline elements, small badges |
| `md` | 8px | 아이콘 컨테이너, 일반 버튼 |
| `lg` | 12px | 퀵링크 버튼, 작은 카드 |
| `xl` | 16px | 입력창, 주요 카드, CTA |
| `2xl` | 24px | 섹션 컨테이너 |
| `full` | 9999px | 필터 버튼, 태그 |

### Card Shape
- Default: `rounded-2xl` (16px)
- Arena Top3 cards: `rounded-xl` (12px) with thicker `border-2`
- Highlight cards (경제성/활용도/성능): `rounded-2xl` with icon container `rounded-xl`

## Components

### Card
모든 콘텐츠 그룹의 기본 표면. 라이트: 흰 배경 + 회색 테두리. 다크: 어두운 배경 + 어두운 테두리.

- **Default:** `bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800`
- **Hover:** `hover:shadow-xl hover:-translate-y-1 hover:border-brand/30 dark:hover:border-brand/50`
- **No-hover variants:** 뉴스 리스트, 차트 컨테이너 (scrollbar, no hover)

### Button — Filter Pill
둥근 필터 버튼. 활성화 시 브랜드 컬러로 변경.
- **Active:** `bg-brand-500 text-white rounded-full px-4 py-1.5 text-xs font-semibold`
- **Inactive:** `bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full px-4 py-1.5 text-xs font-semibold`

### Button — Quick Link / Chip
용도별 바로가기 칩. hover 시 브랜드 컬러 변경.
- `px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800`
- `hover:bg-brand/10 hover:text-brand dark:hover:bg-brand/20 dark:hover:text-[#8B8FFF]`

### Input — Search
검색 입력창. 왼쪽 Lucide Search 아이콘 포함.
- `rounded-2xl pl-11 pr-4 py-3.5 text-sm border`
- `focus:ring-2 focus:ring-brand/30 focus:border-brand`

### Anchor Link
텍스트 링크. hover 시 브랜드 컬러로 전환.
- `text-xs text-gray-400 hover:text-brand dark:hover:text-[#8B8FFF]`

### Highlight Card (경제성/활용도/성능)
3개의 주요 하이라이트 카드. 각각 다른 아이콘 배경색.
- **경제성:** emerald 아이콘 배경 (`bg-emerald-50 dark:bg-emerald-900/30`)
- **활용도:** violet 아이콘 배경 (`bg-violet-50 dark:bg-violet-900/30`)
- **성능:** amber 아이콘 배경 (`bg-amber-50 dark:bg-amber-900/30`)

### Arena Top3 Card
랭킹 1-3위 표시 카드. 각각 금/은/동 스타일링.
- 1위: amber 테두리, amber 배경 그라데이션
- 2위: gray 테두리, gray 배경 그라데이션
- 3위: orange 테두리, orange 배경 그라데이션

### CTA Banner
섹션 하단 그라데이션 배너. 흰색 텍스트 + 2개의 CTA 버튼.
- Primary CTA: 흰색 배경에 브랜드 컬러 텍스트
- Secondary CTA: 투명 배경에 흰색 테두리

### News List Item
뉴스 리스트 아이템. 카테고리별 컬러 태그 + hover 시 브랜드 컬러.
- Category colors: `#5B5FEF` (모델출시), `#4A4AC0` (연구), `#6D6DE0` (에이전트), `#22C55E` (오픈소스), `#64748B` (인프라)

## Do's and Don'ts

- **Do** use `{colors.brand}` as the primary interaction color everywhere.
- **Do** apply dark mode as a first-class citizen — every component has both `light:` and `dark:` variants.
- **Do** use token references (`{colors.brand}`) over hardcoded hex in component definitions.
- **Do** prefer Lucide React icons over emoji for interactive elements and branding.
- **Do** reserve emoji only for content/editorial use (not UI chrome).
- **Don't** add new colors to components without extending the palette in this file first.
- **Don't** use shadows on cards by default — reserve shadows for hover states only.
- **Don't** nest component variant styles — `button-filter-active` is a sibling, not a child.
- **Don't** use inline `style=` for colors — pull from DESIGN.md tokens or Tailwind classes.
- **Don't** mix `hsl(var(--*))` CSS variable colors with Tailwind utility colors in the same component — pick one system.
