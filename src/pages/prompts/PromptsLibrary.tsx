import { useState, useMemo } from 'react';

interface Prompt {
  id: string;
  category: string;
  difficulty: '초급' | '중급' | '고급';
  title: string;
  desc: string;
  prompt: string;
  expectedOutput: string;
  model: string;
  tags: string[];
  likes: number;
}

const CATEGORIES = ['전체', 'AI 활용', '글쓰기', '코딩', '마케팅', '업무', '자기계발', '여행', '분석', '교육'];

const DIFFICULTY_COLORS: Record<string, string> = {
  '초급': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  '중급': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  '고급': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const CAT_COLORS: Record<string, string> = {
  'AI 활용': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  '글쓰기': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  '코딩': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  '마케팅': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  '업무': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  '자기계발': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  '여행': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  '분석': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  '교육': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

const PROMPTS: Prompt[] = [
  // ── AI 활용 ──
  {
    id: 'ai1', category: 'AI 활용', difficulty: '초급',
    title: '모델 추천받기',
    desc: '내 작업을 설명하면 가장 적합한 AI 모델과 이유를 골라주는 프롬프트',
    tags: ['AI 선택', '모델 비교', '추천'], model: 'GPT-5.4 / Claude Opus 4.6', likes: 412,
    expectedOutput: '작업 유형에 맞는 AI 모델 TOP 3 추천, 각 모델의 장단점, 예상 비용, 시작 방법이 출력돼요.',
    prompt: `당신은 AI 모델 전문가예요. 아래 내용을 바탕으로 가장 적합한 AI 모델을 추천해주세요.

작업 유형: [예: 긴 문서 요약 / 코드 작성 / 이미지 생성 / 한국어 글쓰기]
사용 빈도: [매일 / 가끔 / 테스트용]
예산: [무료 / 월 $10 이하 / 비용 무관]
중요도: [속도 / 정확도 / 저비용 / 한국어 능력 / 코딩 능력 중 선택]

아래 형식으로 추천해주세요:

🥇 1순위: [모델명]
- 이유: [왜 이 작업에 최적인지]
- 비용: [실제 가격]
- 시작 방법: [바로 쓸 수 있는 링크나 방법]

🥈 2순위: [모델명]
- 이유 / 비용 / 시작 방법

🥉 3순위 (대안):
- 이유 / 비용 / 시작 방법

주의사항이나 함정이 있다면 알려주세요.`,
  },
  {
    id: 'ai2', category: 'AI 활용', difficulty: '중급',
    title: 'AI 프롬프트 개선기',
    desc: '내 프롬프트를 분석해서 더 나은 버전으로 업그레이드해주는 메타 프롬프트',
    tags: ['프롬프트 엔지니어링', '개선', '최적화'], model: 'Claude Opus 4.6', likes: 378,
    expectedOutput: '원본 프롬프트의 문제점 분석, 개선된 프롬프트 전문, 변경 이유 설명이 출력돼요.',
    prompt: `당신은 프롬프트 엔지니어링 전문가예요. 아래 프롬프트를 분석하고 개선해주세요.

[내 원본 프롬프트]
---
[여기에 개선받고 싶은 프롬프트를 붙여넣기]
---

목표: [이 프롬프트로 원하는 결과]
현재 문제점: [어떤 답변이 나왔는지, 어디가 부족한지]

아래 형식으로 분석해주세요:

**문제점 분석**
1. [역할 설정 부재 / 맥락 부족 / 출력 형식 미지정 / 너무 모호함 등]
2. ...

**개선된 프롬프트**
\`\`\`
[전면 개선된 프롬프트 전문]
\`\`\`

**핵심 변경점**
- [무엇을 왜 바꿨는지]`,
  },
  {
    id: 'ai3', category: 'AI 활용', difficulty: '고급',
    title: 'AI 비용 분석기',
    desc: '내 작업을 여러 AI API에서 실행할 때 실제 비용을 계산하고 비교해주는 프롬프트',
    tags: ['비용 계산', 'API', '토큰'], model: 'GPT-5.4', likes: 201,
    expectedOutput: '각 모델별 예상 토큰 수, 비용 계산, 월간 예산 시뮬레이션이 표 형식으로 출력돼요.',
    prompt: `당신은 AI API 비용 최적화 전문가예요. 아래 정보를 바탕으로 비용을 분석해주세요.

작업 내용: [예: 하루 100건의 뉴스 기사를 500토큰으로 요약]
예상 입력 토큰: [건당 약 몇 토큰?]
예상 출력 토큰: [건당 약 몇 토큰?]
하루 처리량: [몇 건?]

비교할 모델:
- GPT-5.4 ($10/1M input, $30/1M output)
- Claude Opus 4.6 ($15/1M input, $75/1M output)
- DeepSeek V3 ($0.27/1M input, $1.1/1M output)
- MiniMax M2.7 ($0.8/1M input, $2.5/1M output)

아래 형식으로 계산해주세요:

| 모델 | 건당 비용 | 일 비용 | 월 비용 |
|------|---------|---------|---------|

**추천 모델**: [이유 포함]
**비용 절감 팁**: [배치 처리, 캐싱, 프롬프트 압축 등]`,
  },
  // ── 글쓰기 ──
  {
    id: 'w1', category: '글쓰기', difficulty: '초급',
    title: 'SNS 바이럴 캡션 생성기',
    desc: '제품·서비스 정보만 입력하면 인스타그램·링크드인 캡션 자동 생성',
    tags: ['SNS', '마케팅', '인스타그램'], model: 'GPT-5.4', likes: 342,
    expectedOutput: '인스타그램용 150자 캡션(해시태그 10개 포함), 링크드인용 300자 전문 캡션, X(트위터)용 120자 임팩트 캡션 3종 세트가 출력돼요. 각 플랫폼 특성에 맞는 톤과 CTA가 포함됩니다.',
    prompt: `당신은 10년 경력의 SNS 마케팅 전문가예요. 아래 정보로 각 플랫폼에 최적화된 캡션을 작성해주세요.

제품/서비스명: [입력]
핵심 혜택 3가지: [입력]
대상 고객: [예: 20~30대 직장인]
톤: [친근함 / 전문적 / 유머러스 중 선택]

각각 작성해주세요:
1. 📸 인스타그램 (150자 이내, 관련 해시태그 10개 포함, 이모지 2~3개)
2. 💼 링크드인 (300자 이내, 전문적 통찰 포함, 행동 유도 문구 포함)
3. 🐦 X(트위터) (120자 이내, 강렬한 훅 문장으로 시작)

각 캡션 하단에 A/B 테스트용 대안 버전 1개씩 추가해주세요.`,
  },
  {
    id: 'w2', category: '글쓰기', difficulty: '중급',
    title: '자기소개서 5단계 정밀 검토',
    desc: '자소서를 붙여넣으면 HR 전문가 + 글쓰기 코치가 교정표와 완성본 제공',
    tags: ['취업', '자소서', 'HR', '커리어'], model: 'Claude Opus 4.6', likes: 891,
    expectedOutput: '강점 3가지, 개선 포인트 5가지(구체적 수정 예시 포함), 수정된 완성본 전체, 그리고 다음에 자소서 쓸 때 참고할 학습 피드백까지 출력됩니다.',
    prompt: `당신은 HR 컨설턴트(10년 경력)와 글쓰기 코치의 역할을 동시에 맡고 있어요.
아래 자기소개서를 5단계로 정밀 검토해주세요.

[자기소개서 내용을 여기에 붙여넣으세요]

검토 5단계:
1단계 - 첫인상 분석: 첫 문장만 읽었을 때 인상
2단계 - 강점 발굴: 잘 표현된 부분 3가지 (이유 포함)
3단계 - 개선 포인트: 수정이 필요한 부분 5가지 (원문→수정문 예시 포함)
4단계 - 완성본: 전체 수정 버전 작성
5단계 - 학습 피드백: 이 자소서에서 배울 수 있는 글쓰기 원칙 3가지

검토 기준: 구체적 경험·수치 포함 여부, 지원 동기 설득력, 문장 간결성, 차별점`,
  },
  {
    id: 'w3', category: '글쓰기', difficulty: '초급',
    title: '블로그 글 완성 패키지',
    desc: '주제 하나로 SEO 최적화된 블로그 글 + 메타 설명 + 목차까지 한 번에',
    tags: ['블로그', 'SEO', '콘텐츠'], model: 'GPT-5.4', likes: 567,
    expectedOutput: 'SEO 최적화 제목 3개, 독자를 끌어당기는 도입부, 3~5개 소제목이 있는 본문, 실용적 결론, 메타 설명(160자), 핵심 키워드 10개가 완성 패키지로 출력됩니다.',
    prompt: `당신은 월 100만 방문자 블로그를 운영하는 SEO 전문 작가예요.
아래 조건으로 블로그 글 완성 패키지를 작성해주세요.

주제: [입력]
타겟 독자: [예: AI에 관심 있는 30대 직장인]
글 길이: 약 [800/1200/2000자 중 선택]
참고할 관점이나 논거: [선택사항]

패키지 구성:
📌 SEO 최적화 제목 3가지 (각각 다른 키워드 전략)
📝 본문 (도입부 → 소제목 3~5개 → 실용적 결론)
🔍 메타 설명 (160자)
🏷️ 핵심 키워드 10개
📊 독자가 공유하고 싶은 핵심 인사이트 1문장`,
  },

  // ── 코딩 ──
  {
    id: 'c1', category: '코딩', difficulty: '중급',
    title: '코드 리뷰 전문가',
    desc: '코드를 붙여넣으면 버그·보안·성능·가독성 관점에서 시니어급 리뷰',
    tags: ['코드리뷰', '개발', '보안', '성능'], model: 'Claude Sonnet 4.6', likes: 723,
    expectedOutput: '버그/잠재적 오류, 보안 취약점, 성능 병목, 가독성 문제를 각각 심각도(🔴/🟡/🟢)로 분류해서 알려줘요. 각 문제마다 수정된 코드 예시도 함께 제공됩니다.',
    prompt: `당신은 10년 경력의 시니어 개발자예요. 아래 코드를 꼼꼼히 리뷰해주세요.

\`\`\`
[코드를 여기에 붙여넣으세요]
\`\`\`

언어/프레임워크: [예: Python 3.11, React 18]

리뷰 항목 (각각 🔴위험/🟡주의/🟢권장으로 분류):
1. 🐛 버그 및 잠재적 오류 (엣지 케이스 포함)
2. 🔒 보안 취약점 (SQL 인젝션, XSS, 인증 이슈 등)
3. ⚡ 성능 최적화 포인트 (시간복잡도, 메모리 등)
4. 📖 가독성 및 유지보수성
5. ✅ 더 나은 구현 대안 (코드 예시 포함)

마지막에 총평 한 줄과 우선순위 수정 순서를 알려주세요.`,
  },
  {
    id: 'c2', category: '코딩', difficulty: '초급',
    title: '에러 메시지 즉시 해결사',
    desc: '에러 메시지 붙여넣기 → 원인 분석 + 해결 코드 + 재발 방지법',
    tags: ['디버깅', '에러', '개발'], model: 'DeepSeek V3.2', likes: 456,
    expectedOutput: '에러의 정확한 원인을 쉬운 말로 설명해줘요. 즉시 적용 가능한 수정 코드와 함께, 같은 에러가 다시 발생하지 않도록 방지하는 코드 패턴도 알려줍니다.',
    prompt: `아래 에러를 분석하고 완전한 해결책을 알려주세요.

에러 메시지:
\`\`\`
[에러 메시지를 그대로 붙여넣으세요]
\`\`\`

발생한 코드 (있으면):
\`\`\`
[관련 코드]
\`\`\`

환경:
- 언어/프레임워크: [예: Python 3.11 / Next.js 14]
- 운영체제: [macOS / Windows / Linux]
- 패키지 버전: [선택사항]

알려주세요:
1. 🎯 에러 원인 (비전문가도 이해할 수 있게)
2. 🔧 즉시 해결 방법 + 수정된 전체 코드
3. 🛡️ 재발 방지 패턴 및 베스트 프랙티스
4. 🔍 유사 에러 종류 및 예방 체크리스트`,
  },
  {
    id: 'c3', category: '코딩', difficulty: '고급',
    title: '시스템 아키텍처 설계 조언자',
    desc: '서비스 요구사항 입력 → 확장 가능한 아키텍처 설계 + 기술 스택 추천',
    tags: ['아키텍처', '시스템설계', '백엔드'], model: 'GPT-5.4', likes: 334,
    expectedOutput: '요구사항에 맞는 시스템 아키텍처 다이어그램(텍스트 형식), 기술 스택 추천과 선택 이유, 예상 트래픽 처리 계획, 잠재적 병목 지점과 해결 전략이 포함된 설계서가 출력됩니다.',
    prompt: `당신은 대규모 서비스를 설계한 경험 있는 소프트웨어 아키텍트예요.
아래 요구사항으로 시스템 아키텍처를 설계해주세요.

서비스 개요: [어떤 서비스인지 설명]
예상 사용자 수: [초기: X명, 1년 후: Y명]
핵심 기능: [주요 기능 3~5가지]
예산/팀 규모: [예: 스타트업 3인 팀, 클라우드 예산 월 $500]
기술 제약사항: [있으면 입력]

설계 결과물:
1. 📐 시스템 아키텍처 개요 (컴포넌트 다이어그램)
2. 🛠️ 기술 스택 추천 (이유 포함, 대안 비교)
3. 📊 데이터베이스 설계 방향
4. 🚀 배포 전략 (CI/CD, 클라우드 선택)
5. ⚠️ 잠재적 병목 & 확장 전략
6. 💰 예상 인프라 비용`,
  },

  // ── 마케팅 ──
  {
    id: 'm1', category: '마케팅', difficulty: '중급',
    title: '경쟁사 분석 + 포지셔닝 전략',
    desc: '경쟁사 정보 입력 → SWOT + 차별화 포지셔닝 + 마케팅 메시지 도출',
    tags: ['경쟁분석', '포지셔닝', '전략'], model: 'GPT-5.4', likes: 289,
    expectedOutput: '경쟁사별 강·약점 비교표, 내 서비스만의 차별화 포인트 3가지, 타겟 고객별 핵심 메시지, 그리고 구체적인 마케팅 캠페인 아이디어 5가지가 출력됩니다.',
    prompt: `당신은 전략 컨설팅 펌의 마케팅 전략가예요.
아래 정보를 바탕으로 경쟁 분석과 포지셔닝 전략을 수립해주세요.

내 서비스: [설명]
주요 경쟁사 3곳: [이름 + 간단한 설명]
타겟 고객: [설명]
예산: [마케팅 월 예산]

분석 결과:
1. 📊 경쟁사 비교표 (기능, 가격, 타겟, 강약점)
2. 💎 나만의 차별화 포인트 (Blue Ocean 관점)
3. 🎯 고객 세그먼트별 핵심 메시지
4. 📢 마케팅 캠페인 아이디어 5가지 (채널별)
5. 📈 90일 성장 로드맵`,
  },
  {
    id: 'm2', category: '마케팅', difficulty: '초급',
    title: '이메일 뉴스레터 작성기',
    desc: '주제와 목적만 입력하면 클릭률 높은 뉴스레터 완성',
    tags: ['이메일', '뉴스레터', 'CRM'], model: 'Claude Sonnet 4.6', likes: 412,
    expectedOutput: 'A/B 테스트용 제목 3가지, 시선을 끄는 도입부, 핵심 본문(섹션 3개), 명확한 CTA 버튼 텍스트, 그리고 PS 한 줄이 포함된 뉴스레터 전체가 출력됩니다.',
    prompt: `당신은 평균 오픈율 40%, 클릭율 15%를 달성하는 이메일 마케터예요.
아래 조건으로 뉴스레터를 작성해주세요.

발신자: [회사/브랜드명]
뉴스레터 목적: [신제품 안내 / 콘텐츠 공유 / 이벤트 안내 등]
핵심 내용: [전달할 주요 내용]
CTA 목표: [구매 / 클릭 / 등록 등]
독자 특성: [설명]

뉴스레터 구성:
📧 제목 3가지 (A/B 테스트용, 각각 다른 심리 트리거)
👋 도입부 (독자의 고통/욕망 건드리기, 2~3문장)
📰 본문 (섹션 3개, 각 100자 이내)
🎯 CTA 버튼 텍스트 3가지 대안
PS: [독자에게 주는 작은 보너스나 긴박감]`,
  },

  // ── 업무 ──
  {
    id: 'b1', category: '업무', difficulty: '초급',
    title: '회의록 → 액션아이템 자동 정리',
    desc: '회의 내용을 붙여넣으면 구조화된 회의록 + 담당자별 액션아이템 즉시 생성',
    tags: ['회의', '업무효율', '정리'], model: 'Claude Sonnet 4.6', likes: 678,
    expectedOutput: '회의 개요, 논의 내용 요약, 담당자-할일-기한이 명시된 액션아이템 표, 다음 회의 예정 사항이 포함된 완성형 회의록이 출력됩니다.',
    prompt: `당신은 조직의 효율적인 커뮤니케이션을 돕는 전문 비서예요.
아래 회의 내용을 전문적인 회의록으로 정리해주세요.

[회의 내용, 녹취록, 또는 메모를 여기에 붙여넣으세요]

회의 날짜: [입력]
참석자: [이름 목록]

출력 형식:
📋 회의 개요 (일시/참석자/주제)
📝 논의 내용 요약 (안건별)
✅ 액션아이템 표:
| 담당자 | 할 일 | 기한 | 우선순위 |
🔁 다음 회의 예정 사항
💡 오늘 회의의 핵심 결정사항 한 줄 요약`,
  },
  {
    id: 'b2', category: '업무', difficulty: '중급',
    title: '보고서 한 줄 요약 + 인사이트 추출',
    desc: '긴 문서를 붙여넣으면 핵심만 뽑아 경영진 브리핑 형식으로 변환',
    tags: ['요약', '보고서', '분석'], model: 'Gemini 2.5 Pro', likes: 445,
    expectedOutput: '30자 이내 핵심 한 줄 요약, 5가지 핵심 포인트, 주요 데이터와 수치, 시사점과 권장 행동 방향, 추가 확인이 필요한 질문 사항이 구조화되어 출력됩니다.',
    prompt: `당신은 맥킨지 출신 전략 컨설턴트예요. 다음 문서를 경영진 브리핑 형식으로 요약해주세요.

[문서 내용을 여기에 붙여넣으세요]

브리핑 형식:
🎯 핵심 한 줄 (30자 이내, 숫자 포함)
🔑 5가지 핵심 포인트 (각 2문장 이내)
📊 주요 데이터·수치 (표 형식)
💡 시사점 및 권장 액션 (우선순위 순)
❓ 추가 확인이 필요한 질문 3가지
⏱️ 읽기 예상 시간: [X분]

CEO가 엘리베이터에서 30초 안에 이해할 수 있게 작성해주세요.`,
  },
  {
    id: 'b3', category: '업무', difficulty: '중급',
    title: '비즈니스 이메일 상황별 생성기',
    desc: '상황 설명만 하면 한국어·영어 이메일 동시 생성 + 제목 A/B 테스트안',
    tags: ['이메일', '커뮤니케이션', '비즈니스'], model: 'GPT-5.4', likes: 534,
    expectedOutput: '상황에 맞는 A/B 제목 3가지, 완성된 한국어 이메일 본문, 영어 버전 이메일, 그리고 후속 팔로업 이메일 초안까지 한 번에 출력됩니다.',
    prompt: `당신은 글로벌 비즈니스 커뮤니케이션 전문가예요.
아래 상황에 맞는 이메일을 작성해주세요.

상황: [상황을 구체적으로 설명 - 예: 미팅 후 제안서 검토 요청]
수신자: [상대방 직급과 관계 - 예: 거래처 팀장, 처음 연락]
목적: [이메일로 원하는 결과]
긴박도: [낮음/보통/높음]
톤: [정중함/친근함/단호함 중 선택]

출력:
📩 제목 3가지 (각각 다른 오픈율 전략)
🇰🇷 한국어 이메일 (인사→본론→요청→마무리)
🇺🇸 영어 이메일 (같은 내용)
🔁 3일 후 팔로업 이메일 초안`,
  },

  // ── 자기계발 ──
  {
    id: 'd1', category: '자기계발', difficulty: '초급',
    title: '90일 목표 달성 플랜 생성기',
    desc: '목표를 입력하면 주차별 실행 계획 + 측정 지표 + 장애물 극복 전략까지',
    tags: ['목표설정', '생산성', '자기계발'], model: 'Claude Sonnet 4.6', likes: 612,
    expectedOutput: '목표를 SMART 기준으로 재정의하고, 4주 단위 3단계 계획, 매주 해야 할 구체적 행동 목록, KPI 추적 방법, 그리고 흔한 장애물과 극복 전략이 포함된 실행 플랜이 출력됩니다.',
    prompt: `당신은 성과 코치(executive coach)예요. 내가 설정한 목표를 90일 실행 플랜으로 만들어주세요.

목표: [달성하고 싶은 목표를 구체적으로]
현재 상태: [지금 어디에 있는지]
활용 가능한 시간: [하루 X시간, 주 X일]
주요 제약사항: [시간, 비용, 기술 등]

90일 플랜:
🎯 SMART 목표 재정의 (Specific/Measurable/Achievable/Relevant/Time-bound)
📅 3단계 로드맵 (30일/60일/90일 마일스톤)
📋 주차별 실행 체크리스트 (각 주 3~5개 행동)
📊 성과 측정 KPI (숫자로 측정 가능한 지표)
⚠️ 예상 장애물 3가지 + 극복 전략
🔁 매주 리뷰할 질문 3가지`,
  },
  {
    id: 'd2', category: '자기계발', difficulty: '중급',
    title: '이력서 포트폴리오 최적화',
    desc: '현재 이력서를 붙여넣으면 업계별 최적화된 이력서 + 링크드인 프로필까지',
    tags: ['이력서', '취업', '포트폴리오'], model: 'Claude Opus 4.6', likes: 789,
    expectedOutput: 'ATS(채용 시스템) 통과율을 높이는 키워드 분석, 각 경력 항목의 STAR 방식 재작성, 정량적 성과 표현으로 업그레이드된 이력서, 그리고 링크드인 헤드라인·요약 섹션 초안이 출력됩니다.',
    prompt: `당신은 500명 이상 채용에 참여한 HR 컨설턴트 겸 커리어 코치예요.

현재 이력서:
[이력서 내용을 붙여넣으세요]

지원하려는 직무: [예: 스타트업 데이터 분석가]
목표 회사 유형: [스타트업/대기업/외국계]
경력 연차: [X년]

최적화 결과:
📋 ATS 키워드 분석 (업계 핵심 키워드 20개)
✨ 경력 항목 STAR 방식 재작성 (상황→행동→결과)
📊 정량적 성과 표현으로 업그레이드 (수치/% 포함)
💼 링크드인 헤드라인 3가지 대안
📝 링크드인 요약(About) 섹션 초안`,
  },

  // ── 여행 ──
  {
    id: 't1', category: '여행', difficulty: '초급',
    title: '완벽한 여행 일정 생성기',
    desc: '목적지·기간·예산·취향을 입력하면 시간별 여행 일정 완성',
    tags: ['여행', '일정', '관광'], model: 'GPT-5.4', likes: 523,
    expectedOutput: '날짜별 시간대별 방문지와 예상 이동 시간, 식당 추천(예산별), 각 명소의 팁과 주의사항, 그리고 예상 총 비용 내역이 포함된 완성형 여행 플랜이 출력됩니다.',
    prompt: `당신은 20년 경력의 여행 플래너예요. 아래 조건에 맞는 완벽한 여행 일정을 짜주세요.

목적지: [예: 도쿄, 일본]
여행 기간: [예: 5박 6일]
인원: [예: 커플 2명]
예산 (총액): [예: 200만원]
여행 스타일: [맛집 위주 / 관광지 위주 / 자연·힐링 / 쇼핑 위주]
특별 요청: [예: 고령자 동행, 어린이 포함, 채식주의자 등]

일정 형식:
📅 [Day 1] 날짜 및 이동 방법
- 09:00 [장소명] — 특징, 팁, 소요시간
- 11:30 [식당] — 메뉴 추천, 예산
...
📊 예상 비용 내역 (항목별)
⚠️ 주의사항 및 현지 팁 5가지`,
  },
  {
    id: 't2', category: '여행', difficulty: '중급',
    title: '현지인처럼 여행하는 숨겨진 스팟 발굴',
    desc: '관광객이 모르는 현지 맛집·골목·카페를 소개해주는 여행 큐레이터',
    tags: ['여행', '로컬', '맛집', '숨은명소'], model: 'Gemini 2.5 Pro', likes: 378,
    expectedOutput: '관광객 몰리지 않는 로컬 식당 5곳(가격대·특징 포함), 사진 스팟 3곳, 현지인 즐겨 찾는 거리·시장, 그리고 현지어 기본 회화 10문장이 출력됩니다.',
    prompt: `당신은 [목적지]에서 3년 살았던 로컬 전문가예요.
관광객 티 나지 않게 현지인처럼 여행하고 싶어요.

목적지: [도시명]
관심사: [음식 / 예술 / 자연 / 역사 / 나이트라이프 중 선택]
여행 날짜: [기간]
이미 알고 있는 유명 관광지: [패스할 곳 목록]

알려주세요:
🍜 로컬 식당 5곳 (관광객 안 가는 곳, 가격대 표시)
📸 인생샷 포인트 3곳 (최적 촬영 시간대 포함)
🛍️ 현지인 시장/거리 (구체적 위치)
🚶 추천 산책 코스 (소요 시간 포함)
🗣️ 현지어 기본 회화 10문장 (발음 표기 포함)
⚠️ 이것만은 피하세요 (관광지 함정 3가지)`,
  },

  // ── 분석 ──
  {
    id: 'a1', category: '분석', difficulty: '고급',
    title: '데이터 인사이트 분석가',
    desc: '숫자·표 데이터를 붙여넣으면 패턴 발견 + 시각화 방향 + 비즈니스 인사이트',
    tags: ['데이터분석', '인사이트', '비즈니스'], model: 'GPT-5.4', likes: 298,
    expectedOutput: '데이터의 주요 패턴과 이상값, 핵심 KPI 트렌드, 비즈니스에 미치는 영향 분석, 추천 시각화 차트 타입과 구성 방법, 그리고 데이터 기반 의사결정 제안이 출력됩니다.',
    prompt: `당신은 데이터 분석 전문가예요. 아래 데이터를 분석해주세요.

데이터:
[데이터, 표, CSV를 여기에 붙여넣으세요]

분석 목적: [예: 매출 하락 원인 파악]
비즈니스 컨텍스트: [회사/서비스에 대한 간단한 설명]

분석 결과:
🔍 데이터 품질 검토 (결측값, 이상값, 편향)
📊 핵심 통계 요약 (평균, 중앙값, 표준편차 등)
📈 주요 트렌드 및 패턴 (시각화 설명 포함)
💡 비즈니스 인사이트 TOP 5
🎯 즉시 실행 가능한 액션 아이템 3가지
📉 리스크 요인 및 주의사항`,
  },
  {
    id: 'a2', category: '분석', difficulty: '중급',
    title: '논문·리포트 비판적 분석',
    desc: '논문이나 리포트를 붙여넣으면 방법론·결론·한계점 심층 분석',
    tags: ['논문', '비판적사고', '리서치'], model: 'Claude Opus 4.6', likes: 234,
    expectedOutput: '연구 목적과 방법론 요약, 주요 주장과 근거의 타당성 평가, 방법론적 한계와 편향 가능성, 결론의 일반화 가능 범위, 그리고 후속 연구 제안이 포함된 학술적 분석이 출력됩니다.',
    prompt: `당신은 연구 방법론 전문가예요. 아래 논문/리포트를 비판적으로 분석해주세요.

[논문 또는 리포트 내용을 붙여넣으세요]

분석 요청:
1. 📋 연구 개요 (목적, 방법론, 샘플 크기)
2. 💪 강점: 잘 된 부분과 이유
3. ⚠️ 약점 & 한계: 방법론적 문제, 편향 가능성
4. 🔍 주요 주장의 근거 타당성 평가
5. 📊 통계 해석의 적절성
6. 🌐 결론의 일반화 가능 범위
7. 🔮 후속 연구 방향 제안`,
  },

  // ── 교육 ──
  {
    id: 'e1', category: '교육', difficulty: '초급',
    title: '어떤 주제든 5분 만에 이해하기',
    desc: '어려운 개념을 초등학생도 이해할 수 있게 + 전문가 수준까지 단계별 설명',
    tags: ['학습', '개념설명', '이해'], model: 'Claude Sonnet 4.6', likes: 834,
    expectedOutput: '5살도 이해하는 비유적 설명, 중학생 수준의 개요, 고등학생 수준의 심화, 전문가 수준의 디테일이 레벨별로 구분되어 출력됩니다. 실생활 예시와 핵심 포인트 3가지도 함께 제공됩니다.',
    prompt: `당신은 복잡한 개념을 누구에게나 쉽게 설명하는 최고의 교육자예요.
아래 주제를 4단계로 설명해주세요.

주제: [예: 양자컴퓨팅, 블록체인, 미적분, 머신러닝 등]
나의 배경 지식: [전혀 없음 / 기초 있음 / 어느 정도 앎]

4단계 설명:
🧒 레벨 1: 5살 아이에게 (비유와 그림 묘사로)
📚 레벨 2: 중학생에게 (기본 개념과 예시)
🎓 레벨 3: 대학생에게 (원리와 응용)
💼 레벨 4: 전문가에게 (기술적 디테일)

마지막에:
✅ 핵심 포인트 3가지 (한 줄씩)
🌟 실생활에서 보이는 예시 3가지
❓ 더 깊이 공부하려면 알아야 할 것`,
  },
  {
    id: 'e2', category: '교육', difficulty: '중급',
    title: '맞춤형 학습 커리큘럼 설계사',
    desc: '배우고 싶은 분야와 수준을 입력하면 12주 학습 로드맵 + 리소스 목록',
    tags: ['학습', '커리큘럼', '자기계발'], model: 'GPT-5.4', likes: 467,
    expectedOutput: '현재 수준 진단 질문, 12주 단계별 학습 계획, 각 주차별 학습 목표와 리소스(책·강의·실습), 그리고 진도 체크 방법과 완료 기준이 포함된 학습 로드맵이 출력됩니다.',
    prompt: `당신은 맞춤형 교육 커리큘럼 전문가예요.
아래 조건으로 나만의 학습 계획을 설계해주세요.

배우고 싶은 분야: [예: 파이썬 프로그래밍, 영어회화, 투자 등]
현재 수준: [완전 초보 / 기초 있음 / 중급]
하루 학습 가능 시간: [X시간]
학습 목표: [예: 6개월 후 취업, 사이드 프로젝트 완성]
선호 학습 방식: [영상 / 책 / 실습 / 강의 중 선택]

커리큘럼 (12주):
📋 주차별 학습 목표와 내용
📚 추천 리소스 (무료/유료 구분, 한국어/영어 구분)
🎯 각 주차 완료 기준 (체크리스트)
📊 전체 진도 체크 방법
⚡ 학습 효율을 높이는 팁 5가지`,
  },
  {
    id: 'e3', category: '교육', difficulty: '고급',
    title: '소크라테스식 대화 튜터',
    desc: '답을 알려주지 않고 질문으로 스스로 생각하게 만드는 철학적 학습 방식',
    tags: ['교육', '비판적사고', '철학', '학습'], model: 'Claude Opus 4.6', likes: 156,
    expectedOutput: '주제에 대한 첫 질문으로 시작해서 대화를 이어가며, 스스로 사고하도록 유도하는 질문들이 이어집니다. 결론을 직접 알려주지 않고 스스로 발견하게 돕는 방식으로 진행됩니다.',
    prompt: `당신은 소크라테스식 문답법을 사용하는 튜터예요.
나에게 답을 주지 말고, 질문으로 스스로 생각하게 도와주세요.

주제: [내가 깊이 이해하고 싶은 주제]
나의 초기 생각: [현재 내가 알고 있거나 믿는 것]
탐구하고 싶은 방향: [선택사항]

규칙:
1. 절대 직접적인 답을 주지 마세요
2. 내 대답의 가정을 파고드는 질문을 해주세요
3. 내가 모순을 스스로 발견하도록 유도해주세요
4. 한 번에 질문 하나만 해주세요
5. 내가 "이제 알겠어요"라고 할 때 최종 인사이트를 정리해주세요

시작해주세요.`,
  },
];

function PromptModal({ prompt, onClose }: { prompt: Prompt; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[prompt.category] ?? ''}`}>{prompt.category}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[prompt.difficulty]}`}>{prompt.difficulty}</span>
              <span className="text-[10px] text-gray-400">추천 모델: <span className="font-semibold text-gray-600 dark:text-gray-300">{prompt.model}</span></span>
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{prompt.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Expected Output */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1.5">💬 AI가 이렇게 답해줘요</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{prompt.expectedOutput}</p>
          </div>

          {/* Prompt text */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">📋 프롬프트 전문</p>
            <pre className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed border border-gray-200 dark:border-gray-700 overflow-auto max-h-64">
              {prompt.prompt}
            </pre>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleCopy}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100'
            }`}
          >
            {copied ? '✅ 복사 완료!' : '📋 프롬프트 복사'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PromptsLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('전체');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const filtered = useMemo(() => {
    return PROMPTS.filter((p) => {
      const catMatch = selectedCategory === '전체' || p.category === selectedCategory;
      const diffMatch = selectedDifficulty === '전체' || p.difficulty === selectedDifficulty;
      const query = searchQuery.toLowerCase();
      const searchMatch = !query
        || p.title.toLowerCase().includes(query)
        || p.desc.toLowerCase().includes(query)
        || p.tags.some((t) => t.toLowerCase().includes(query));
      return catMatch && diffMatch && searchMatch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-gray-900 dark:border-gray-100 pb-3">
        <p className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 uppercase mb-0.5">
          Ready-to-use AI Prompts
        </p>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
          프롬프트 라이브러리
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          복사해서 바로 쓸 수 있는 고품질 프롬프트 {PROMPTS.length}개 · 8개 카테고리
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="프롬프트 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 shrink-0">난이도:</span>
        {['전체', '초급', '중급', '고급'].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDifficulty(d)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              selectedDifficulty === d
                ? d === '전체' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : DIFFICULTY_COLORS[d]
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400">
        {filtered.length}개 프롬프트
        {(selectedCategory !== '전체' || searchQuery || selectedDifficulty !== '전체') && (
          <button
            onClick={() => { setSelectedCategory('전체'); setSearchQuery(''); setSelectedDifficulty('전체'); }}
            className="ml-2 text-blue-500 hover:underline"
          >
            필터 초기화
          </button>
        )}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPrompt(p)}
            className="text-left bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-600 transition-all group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${CAT_COLORS[p.category] ?? ''}`}>{p.category}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${DIFFICULTY_COLORS[p.difficulty]}`}>{p.difficulty}</span>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0">❤️ {p.likes.toLocaleString()}</span>
            </div>

            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {p.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
              {p.desc}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {p.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full">#{tag}</span>
                ))}
              </div>
              <span className="text-[10px] font-semibold text-blue-500">복사 →</span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">검색 결과가 없어요</p>
          <p className="text-sm mt-1">다른 키워드로 검색해보세요</p>
        </div>
      )}

      {/* Modal */}
      {selectedPrompt && (
        <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
      )}
    </div>
  );
}
