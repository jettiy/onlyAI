import { useState, useEffect, useCallback } from "react";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  sourceUrl: string;
  url: string;
  category: NewsCategory;
  lang: "ko" | "en";
  readingTime?: string;
  isNew?: boolean;
  tags?: string[];
}

export type NewsCategory =
  | "모델 출시"
  | "연구·논문"
  | "에이전트"
  | "오픈소스"
  | "파인튜닝"
  | "벤치마크"
  | "인프라·하드웨어"
  | "산업·정책"
  | "개발 도구"
  | "멀티모달";

export const categoryColor: Record<NewsCategory, string> = {
  "모델 출시":     "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  "연구·논문":     "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  "에이전트":      "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  "오픈소스":      "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  "파인튜닝":      "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500",
  "벤치마크":      "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  "인프라·하드웨어":"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  "산업·정책":     "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400",
  "개발 도구":     "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  "멀티모달":      "bg-pink-50 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400",
};

// 2026-03-19 최신 크롤링 데이터 (광고·PR 제외, 기술·모델·논문·정책만)
export const CURATED_NEWS: NewsItem[] = [
  // ── Hugging Face 블로그 ─────────────────────────────
  {
    id: "hf-bitnet-lora",
    title: "QVAC Fabric으로 엣지 GPU에서 BitNet b1.58 LoRA 파인튜닝",
    summary: "이기종 엣지 GPU에서 1비트 LLM(BitNet b1.58)을 LoRA로 파인튜닝하는 방법을 소개한다. QVAC Fabric 분산 프레임워크를 활용해 단일 고사양 GPU 없이도 도메인 특화 소형 모델을 효율적으로 학습할 수 있다.",
    date: "2026-03-18",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/qvac/fabric-llm-finetune-bitnet",
    category: "파인튜닝",
    lang: "en",
    readingTime: "11분",
    isNew: true,
    tags: ["LoRA", "BitNet", "엣지 AI", "파인튜닝"],
  },
  {
    id: "hf-healthcare-robotics",
    title: "NVIDIA, 헬스케어 로봇 전용 첫 AI 데이터셋과 기반 모델 공개",
    summary: "NVIDIA가 의료 현장 로봇 특화 Physical AI 모델과 데이터셋을 Hugging Face에 공개했다. 수술 보조·환자 이송 등 헬스케어 환경에서의 로봇 학습을 위한 기반 모델로, 의료 AI 로봇 연구의 진입 장벽을 크게 낮출 것으로 기대된다.",
    date: "2026-03-17",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/nvidia/physical-ai-for-healthcare-robotics",
    category: "연구·논문",
    lang: "en",
    readingTime: "9분",
    isNew: true,
    tags: ["로봇", "헬스케어", "NVIDIA", "Physical AI"],
  },
  {
    id: "hf-alpamayo",
    title: "Alpamayo 1.5: 자율주행 추론 AI 오픈 플랫폼 확장",
    summary: "NVIDIA의 자율주행 추론 AI 오픈 플랫폼 Alpamayo가 1.5 버전으로 확장됐다. 더 많은 모델·데이터·시뮬레이션 환경을 지원하며 자율주행 에이전트 연구의 협업 기반이 강화됐다.",
    date: "2026-03-17",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/drmapavone/nvidia-alpamayo-1-5",
    category: "에이전트",
    lang: "en",
    readingTime: "8분",
    isNew: true,
    tags: ["자율주행", "NVIDIA", "시뮬레이션"],
  },
  {
    id: "hf-tokenization-multilingual",
    title: "토크나이제이션이 다국어 LLM의 꿈을 망치고 있다",
    summary: "현재 토크나이저 설계가 영어 중심으로 편향돼 있어 다국어 LLM 개발을 심각하게 저해한다는 분석. 한국어·아랍어 등 비라틴 언어의 토큰 효율이 영어 대비 최대 4배 낮다. 적응형 토크나이저 개발이 시급하다.",
    date: "2026-03-16",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/omarkamali/tokenization",
    category: "연구·논문",
    lang: "en",
    readingTime: "12분",
    isNew: true,
    tags: ["토크나이저", "다국어", "한국어", "LLM"],
  },
  {
    id: "hf-silma-tts",
    title: "SILMA TTS: 아랍어-영어 이중 언어 경량 오픈소스 음성 합성",
    summary: "실마 AI가 아랍어와 영어를 동시 지원하는 경량 오픈소스 TTS 모델을 공개했다. 소규모 환경에서도 자연스러운 음성 합성이 가능하며, 중동·북아프리카 지역 AI 접근성을 높인다.",
    date: "2026-03-15",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/silma-ai/opensource-arabic-english-text-to-speech-model",
    category: "오픈소스",
    lang: "en",
    readingTime: "6분",
    isNew: true,
    tags: ["TTS", "음성합성", "아랍어", "오픈소스"],
  },
  {
    id: "hf-nemo-retrieval",
    title: "NVIDIA NeMo Retriever: 의미 유사도를 넘은 에이전트형 범용 검색",
    summary: "NVIDIA NeMo Retriever 팀이 ReACT 기반 에이전트 검색 파이프라인을 공개했다. 데이터셋별 별도 튜닝 없이 ViDoRe v3 1위(NDCG@10 69.22), BRIGHT 2위 달성. LLM 추론과 검색기를 결합한 에이전트 RAG의 새 기준을 제시한다.",
    date: "2026-03-14",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/nvidia/nemo-retriever-agentic-retrieval",
    category: "에이전트",
    lang: "en",
    readingTime: "10분",
    isNew: true,
    tags: ["RAG", "에이전트 검색", "NVIDIA", "벤치마크"],
  },
  {
    id: "hf-super-analyzer",
    title: "Super Analyzer: 추론·코딩 결합으로 코드 성능 분석 향상",
    summary: "Dell Enterprise Hub 기반 Super Analyzer가 LLM 추론 능력과 코딩 기능을 결합해 코드 성능 분석의 새 기준을 제시한다. 복잡한 코드베이스를 심층 분석하고 최적화 포인트를 자동으로 식별한다.",
    date: "2026-03-14",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/balaatdell/super-analyzer-app-on-dell-enterprise-hub",
    category: "개발 도구",
    lang: "en",
    readingTime: "7분",
    tags: ["코드 분석", "추론", "개발 도구"],
  },
  {
    id: "hf-nvidia-deepresearch",
    title: "NVIDIA AI-Q, DeepResearch 벤치 I·II 동시 1위 달성 비결",
    summary: "NVIDIA AI-Q 에이전트가 DeepResearch Bench I과 II에서 모두 1위를 차지했다. 반복적 추론·검색·합성 루프와 도구 호출 최적화가 핵심. 오픈소스 경쟁 모델 대비 30%+ 높은 성능을 보였다.",
    date: "2026-03-12",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/nvidia/how-nvidia-won-deepresearch-bench",
    category: "벤치마크",
    lang: "en",
    readingTime: "11분",
    tags: ["NVIDIA", "에이전트", "벤치마크"],
  },
  {
    id: "hf-smol-worldcup",
    title: "소형 LLM 18개 5축 벤치마크: 4B 모델이 8B를 이긴다",
    summary: "Smol AI WorldCup이 18개 소형 모델(1B~35B)을 품질·효율·환각·추론·속도 5축으로 평가했다. Gemma-3n-E4B(4B, 2GB RAM)가 품질 1위. MoE 구조 GPT-OSS-20B는 라즈베리파이 메모리에서 Claude Sonnet 82% 성능 달성. 아키텍처 세대가 파라미터 수보다 중요하다.",
    date: "2026-03-11",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/FINAL-Bench/smol-worldcup",
    category: "벤치마크",
    lang: "en",
    readingTime: "12분",
    isNew: true,
    tags: ["소형 모델", "벤치마크", "MoE", "Gemma"],
  },
  {
    id: "hf-neo-unify",
    title: "NEO-unify: SenseNova의 엔드투엔드 네이티브 멀티모달 통합 모델",
    summary: "SenseNova가 텍스트·이미지·비디오·오디오를 하나의 아키텍처로 통합한 NEO-unify를 공개했다. 별도 모달리티 전환 없이 네이티브 다중 입력을 처리하는 진정한 멀티모달 모델이다.",
    date: "2026-03-06",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/sensenova/neo-unify",
    category: "멀티모달",
    lang: "en",
    readingTime: "9분",
    tags: ["멀티모달", "SenseNova", "통합 모델"],
  },
  {
    id: "hf-nemo-dabstep",
    title: "데이터 과학자처럼 생각하는 에이전트: DABStep 1위 달성",
    summary: "NVIDIA NeMo 에이전트 툴킷이 재사용 가능한 도구 생성 방식으로 DABStep 데이터 분석 에이전트 벤치마크 1위를 달성했다. 에이전트가 분석 도구를 반복 생성·재활용하는 새 패러다임이다.",
    date: "2026-03-14",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/nvidia/nemo-agent-toolkit-data-explorer-dabstep-1st-place",
    category: "에이전트",
    lang: "en",
    readingTime: "8분",
    tags: ["에이전트", "데이터 분석", "NVIDIA"],
  },
  {
    id: "hf-nvidia-code-dataset",
    title: "Code Concepts: 프로그래밍 개념 씨앗 기반 대규모 합성 코드 데이터셋",
    summary: "NVIDIA가 프로그래밍 개념 설명에서 출발해 대규모 코드 학습 데이터를 자동 생성하는 방법론과 데이터셋을 공개했다. 코드 이해·생성 모델의 학습 효율을 크게 높이는 합성 데이터 파이프라인이다.",
    date: "2026-03-12",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/nvidia/synthetic-code-concepts",
    category: "오픈소스",
    lang: "en",
    readingTime: "8분",
    tags: ["합성 데이터", "코드 AI", "NVIDIA"],
  },
  {
    id: "hf-arabic-tts-arena",
    title: "아랍어 TTS 아레나: 체스처럼 음성 AI 모델 랭킹 매긴다",
    summary: "아랍어 TTS 모델들을 Elo 레이팅 시스템으로 비교하는 아레나가 공개됐다. 사용자 투표로 랭킹이 실시간 갱신되며, 다국어 음성 AI 평가의 새 표준을 제시한다.",
    date: "2026-03-13",
    source: "Hugging Face Blog",
    sourceUrl: "https://huggingface.co/blog",
    url: "https://huggingface.co/blog/Navid-AI/introducing-arabic-tts-arena",
    category: "벤치마크",
    lang: "en",
    readingTime: "7분",
    tags: ["TTS", "벤치마크", "아랍어", "Elo 랭킹"],
  },

  // ── AI타임스 ───────────────────────────────────────
  {
    id: "at-baidu-openclaw",
    title: "바이두, 새 AI 에이전트로 중국의 '오픈클로 열풍' 합류",
    summary: "중국에 부는 '오픈클로 열풍'이 AI 시장 경쟁을 에이전트 중심으로 이동시키고 있다. 바이두가 새로운 AI 에이전트를 공개하며 빅테크 기업들의 AI 주도권 경쟁이 새 국면에 접어들었다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208055",
    category: "에이전트",
    lang: "ko",
    isNew: true,
    tags: ["바이두", "에이전트", "중국 AI"],
  },
  {
    id: "at-vibe-coding",
    title: "기업 63% 바이브 코딩 도입…코드 품질 문제도 대폭 감소",
    summary: "AI 코딩 도구가 소프트웨어 개발의 중심을 빠르게 이동시키고 있다. 기업의 63%가 AI 코딩 도구를 본격 도입했으며, 버그 발생률이 유의미하게 감소한 것으로 조사됐다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208052",
    category: "산업·정책",
    lang: "ko",
    isNew: true,
    tags: ["AI 코딩", "바이브 코딩", "생산성"],
  },
  {
    id: "at-midjourney-v8",
    title: "미드저니 V8 알파: 속도·개인화·해상도 동시 향상",
    summary: "미드저니가 V8 알파 이미지 생성 모델을 공개했다. 이미지 생성 속도가 빨라졌으며, 사용자 스타일 학습 개인화 기능과 고해상도 출력이 동시에 강화됐다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208049",
    category: "모델 출시",
    lang: "ko",
    isNew: true,
    tags: ["미드저니", "이미지 생성", "V8"],
  },
  {
    id: "at-ms-copilot-reorg",
    title: "MS, 나델라 중심 '코파일럿' 조직 개편…술레이먼은 초지능 집중",
    summary: "마이크로소프트가 AI 전략을 전면 재정비하며 코파일럿 중심의 조직 개편에 나섰다. 소비자용·기업용 AI 제품 조직을 통합하고, 무스타파 술레이먼은 AGI 개발에 전념한다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208027",
    category: "산업·정책",
    lang: "ko",
    isNew: true,
    tags: ["마이크로소프트", "코파일럿", "AGI"],
  },
  {
    id: "at-elevenlabs-ai-insurance",
    title: "일레븐랩스, 세계 최초 'AI 음성 에이전트 전용 보험' 도입",
    summary: "일레븐랩스가 AIUC와 협력해 세계 최초 AI 음성 에이전트 전용 종합 보험을 도입했다. AI 에이전트의 잘못된 결과물에 대한 책임 문제를 보험으로 해결하는 새로운 리스크 관리 패러다임이다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208060",
    category: "산업·정책",
    lang: "ko",
    isNew: true,
    tags: ["일레븐랩스", "AI 보험", "에이전트"],
  },
  {
    id: "at-openai-aws-defense",
    title: "오픈AI, 미 국방부 모델 공급 위해 아마존과 유통 계약",
    summary: "오픈AI가 미 국방부 AI 모델 공급 계약을 위해 AWS와 유통 계약을 체결했다. 미국 정부 및 국방부 대상 AI 서비스 제공이 본격화된다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208029",
    category: "산업·정책",
    lang: "ko",
    isNew: true,
    tags: ["오픈AI", "AWS", "국방"],
  },
  {
    id: "at-nvidia-h200-china",
    title: "엔비디아, 중국 AI 칩 판매 재개 시동…H200 생산 재가동",
    summary: "엔비디아가 중국 시장 재진입을 위해 H200 AI 칩 생산을 재개했다. 젠슨 황 CEO가 중국 고객 대상 공급 준비에 돌입했다고 밝혔다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208031",
    category: "인프라·하드웨어",
    lang: "ko",
    isNew: true,
    tags: ["엔비디아", "H200", "중국", "AI 칩"],
  },
  {
    id: "at-skt-itu-standard",
    title: "SKT, AI 데이터센터 연동 규격 ITU 국제 표준 승인",
    summary: "SK텔레콤이 'AI 데이터센터를 위한 기술 요소 및 연동 구조'를 ITU-T SG11 회의에서 국제 표준으로 최종 승인받았다. 한국 AI 인프라 기술이 글로벌 표준으로 인정받은 첫 사례다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208022",
    category: "산업·정책",
    lang: "ko",
    isNew: true,
    tags: ["SKT", "ITU", "국제 표준", "데이터센터"],
  },
  {
    id: "at-korea-ai-semiconductor",
    title: "AI 반도체 5년간 50조 투자…'K-엔비디아 육성' 프로젝트 추진",
    summary: "과기정통부와 금융위가 국민성장펀드로 K-엔비디아 육성 프로젝트를 추진한다. AI 반도체 분야에 5년간 50조 원 투자를 계획 중이며, 민관 합동 추진 체계를 구성한다.",
    date: "2026-03-18",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=208039",
    category: "산업·정책",
    lang: "ko",
    isNew: true,
    tags: ["AI 반도체", "한국", "정부 정책"],
  },
  {
    id: "at-moonshot-attention",
    title: "문샷(Moonshot), 어텐션 아키텍처 근본 개선 '주의 잔차' 공개",
    summary: "Moonshot AI가 트랜스포머의 어텐션 메커니즘을 근본적으로 개선한 '주의 잔차' 기법을 공개했다. 기존 어텐션 대비 긴 시퀀스 처리 효율을 높이며 이론적 기반도 강화했다.",
    date: "2026-03-17",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=207982",
    category: "연구·논문",
    lang: "ko",
    isNew: true,
    tags: ["Moonshot", "Kimi", "어텐션", "아키텍처"],
  },
  {
    id: "at-nvidia-gtc-auto",
    title: "엔비디아, GTC서 자율주행·로봇 칩 대규모 제휴 발표",
    summary: "엔비디아가 GTC 2026에서 자율주행차, 휴머노이드 로봇, 기업용 AI 에이전트 플랫폼 분야의 협력과 신기술을 발표했다. AI 산업 전반으로 영향력을 확대하는 중이다.",
    date: "2026-03-17",
    source: "AI타임스",
    sourceUrl: "https://www.aitimes.com",
    url: "https://www.aitimes.com/news/articleView.html?idxno=207974",
    category: "인프라·하드웨어",
    lang: "ko",
    tags: ["NVIDIA", "GTC", "자율주행", "로봇"],
  },

  // ── GeekNews ─────────────────────────────────────────
  {
    id: "gn-llm-arch-gallery",
    title: "LLM 아키텍처 갤러리: GPT-2부터 DeepSeek V3·Qwen3까지 한눈에",
    summary: "Sebastian Raschka가 공개한 LLM 아키텍처 갤러리. GPT-2, Llama 3, DeepSeek V3, Qwen3 등 주요 모델의 구조 도식과 파라미터·컨텍스트·어텐션 사양을 한 페이지에서 비교 가능하다.",
    date: "2026-03-19",
    source: "GeekNews",
    sourceUrl: "https://news.hada.io",
    url: "https://sebastianraschka.com/llm-architecture-gallery/",
    category: "연구·논문",
    lang: "ko",
    readingTime: "자유 탐색",
    isNew: true,
    tags: ["LLM", "아키텍처", "GPT", "DeepSeek"],
  },
  {
    id: "gn-unsloth-studio",
    title: "Unsloth Studio: 로컬 AI 모델 학습·실행 노코드 웹 UI",
    summary: "텍스트·오디오·임베딩·비전 모델을 하나의 인터페이스에서 로컬 학습·실행 가능한 오픈소스 노코드 도구. Mac/Windows/Linux 지원. 코딩 없이 파인튜닝부터 추론까지 처리 가능하다.",
    date: "2026-03-19",
    source: "GeekNews",
    sourceUrl: "https://news.hada.io",
    url: "https://unsloth.ai/docs/new/studio",
    category: "개발 도구",
    lang: "ko",
    readingTime: "5분",
    isNew: true,
    tags: ["Unsloth", "파인튜닝", "노코드", "로컬 AI"],
  },
  {
    id: "gn-open-swe",
    title: "Open SWE: Stripe·Ramp·Coinbase 사내 코딩 에이전트 아키텍처 오픈소스화",
    summary: "대형 엔지니어링 조직들이 독립적으로 구축한 사내 코딩 에이전트들이 유사한 패턴으로 수렴한다는 사실을 발견, 오픈소스 프레임워크로 공개했다. AI 코딩 에이전트 설계의 공통 모범 사례를 담고 있다.",
    date: "2026-03-19",
    source: "GeekNews",
    sourceUrl: "https://news.hada.io",
    url: "https://news.hada.io/topic?id=19000",
    category: "에이전트",
    lang: "ko",
    isNew: true,
    tags: ["코딩 에이전트", "LangChain", "오픈소스"],
  },
  {
    id: "gn-nullclaw",
    title: "nullclaw: Zig로 구현한 678KB 초경량 자율 AI 어시스턴트",
    summary: "런타임·VM·프레임워크 의존성 없이 678KB 정적 바이너리로 동작하는 자율형 AI 어시스턴트. 1MB 미만 메모리, 2ms 미만 부팅, ARM/x86/RISC-V 지원. 진정한 엣지 AI의 극한을 보여준다.",
    date: "2026-03-19",
    source: "GeekNews",
    sourceUrl: "https://news.hada.io",
    url: "https://news.hada.io/topic?id=19010",
    category: "오픈소스",
    lang: "ko",
    isNew: true,
    tags: ["Zig", "경량 AI", "엣지 AI", "임베디드"],
  },
  {
    id: "gn-open-generative-ui",
    title: "OpenGenerativeUI: Claude 스타일 인터랙티브 UI 자동 생성 오픈소스",
    summary: "Claude의 대화형 차트·다이어그램 자동 생성 기능을 오픈소스로 구현한 프레임워크. 텍스트 응답 대신 시각화 자료를 자동 생성해 사용자 경험을 혁신한다.",
    date: "2026-03-18",
    source: "GeekNews",
    sourceUrl: "https://news.hada.io",
    url: "https://github.com/CopilotKit/OpenGenerativeUI",
    category: "개발 도구",
    lang: "ko",
    isNew: true,
    tags: ["Claude", "UI 생성", "오픈소스", "CopilotKit"],
  },
  {
    id: "gn-moe-explainer",
    title: "트랜스포머의 MoE(Mixture of Experts) 완전 해설",
    summary: "DeepSeek·Qwen·Llama 4 등 최신 모델 대다수가 채택한 MoE 아키텍처를 심층 설명한 Hugging Face 공식 가이드. 라우팅 메커니즘, 전문가 병렬화, 학습 안정성 과제까지 폭넓게 다룬다.",
    date: "2026-03-10",
    source: "GeekNews",
    sourceUrl: "https://news.hada.io",
    url: "https://huggingface.co/blog/moe",
    category: "연구·논문",
    lang: "ko",
    readingTime: "18분",
    tags: ["MoE", "아키텍처", "딥러닝", "트랜스포머"],
  },
];

export function useNewsRSS() {
  const [news, setNews] = useState<NewsItem[]>(CURATED_NEWS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated] = useState(new Date("2026-03-19T07:00:00+08:00"));

  const fetchLiveRSS = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://news.hada.io/rss")}&count=20`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (!data.items?.length) return;

      const aiKeywords = ["llm", "ai", "모델", "gpt", "claude", "gemini", "딥러닝", "에이전트", "파인튜닝", "rag", "transformer", "diffusion", "inference", "benchmark", "openai", "anthropic", "deepseek", "llama", "embedding", "agent", "moe", "lora"];
      const aiItems: NewsItem[] = data.items
        .filter((item: { title: string; description: string }) => {
          const text = (item.title + " " + item.description).toLowerCase();
          return aiKeywords.some((kw) => text.includes(kw));
        })
        .slice(0, 5)
        .map((item: { title: string; description: string; pubDate: string; link: string }, idx: number) => ({
          id: `gn-live-${idx}`,
          title: item.title,
          summary: item.description?.replace(/<[^>]+>/g, "").slice(0, 150) ?? "",
          date: item.pubDate?.slice(0, 10) ?? "",
          source: "GeekNews",
          sourceUrl: "https://news.hada.io",
          url: item.link,
          category: "연구·논문" as NewsCategory,
          lang: "ko" as const,
          isNew: true,
        }));

      if (aiItems.length > 0) {
        setNews((prev) => {
          const existingIds = new Set(prev.map((n) => n.url));
          const fresh = aiItems.filter((n) => !existingIds.has(n.url));
          return fresh.length > 0 ? [...fresh, ...prev] : prev;
        });
      }
    } catch {/* silent */}
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchLiveRSS().finally(() => setLoading(false));
  }, [fetchLiveRSS]);

  return { news, loading, lastUpdated, refetch: fetchLiveRSS };
}
