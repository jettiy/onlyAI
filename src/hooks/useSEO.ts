import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
  title: string;
  description: string;
}

const PAGE_SEO: Record<string, SEOConfig> = {
  '/': {
    title: 'AI이것만 — AI 모델 비교·추천·가격·뉴스',
    description: '최신 AI 모델의 성능, 가격, 벤치마크를 한눈에 비교하고 나에게 맞는 AI를 추천받으세요. GPT, Claude, Gemini 등',
  },
  '/explore/compare': {
    title: 'AI 모델 비교 — 성능·가격·벤치마크 한눈에 | AI이것만',
    description: 'GPT vs Claude vs Gemini 등 주요 AI 모델을 성능, 가격, 벤치마크로 비교하세요.',
  },
  '/explore/ranking': {
    title: 'AI 모델 랭킹 — 최신 순위표 | AI이것만',
    description: '전 세계 AI 모델의 벤치마크 순위를 확인하고 최고 성능 모델을 찾아보세요.',
  },
  '/explore/calculator': {
    title: 'AI 토큰 계산기 — API 비용 계산 | AI이것만',
    description: 'AI 모델 사용 시 토큰 수와 API 비용을 미리 계산해 보세요.',
  },
  '/explore/tokenizer': {
    title: 'AI 토크나이저 — 텍스트 토큰 수 확인 | AI이것만',
    description: '입력한 텍스트가 몇 토큰인지 확인하세요. GPT, Claude, Gemini 토큰 단위 비교.',
  },
  '/explore/prompt-bench': {
    title: 'AI 프롬프트 벤치마크 — 모델별 응답 비교 | AI이것만',
    description: '같은 프롬프트로 여러 AI 모델의 응답 품질을 비교해 보세요.',
  },
  '/explore/context-window': {
    title: 'AI 컨텍스트 윈도우 비교 — 수용 토큰 수 | AI이것만',
    description: '주요 AI 모델의 컨텍스트 윈도우 크기를 비교하고, 긴 문서 처리에 적합한 모델을 찾으세요.',
  },
  '/explore/korean-bench': {
    title: '한국어 AI 벤치마크 — 국내 성능 비교 | AI이것만',
    description: 'AI 모델의 한국어 성능을 전용 벤치마크로 비교하세요. KQA, KorQuAD 등 한국어 데이터 기반.',
  },
  '/explore/timeline': {
    title: 'AI 모델 발전 연표 — 역사와 미래 | AI이것만',
    description: 'GPT부터 최신 모델까지, AI의 발전 역사를 타임라인으로 확인하세요.',
  },
  '/explore/guide': {
    title: 'AI 모델 가이드 — 초보자를 위한 완벽 정리 | AI이것만',
    description: 'AI 모델 선택 가이드. 용도, 예산, 성능에 맞는 모델을 찾는 방법을 알려드립니다.',
  },
  '/video/compare': {
    title: 'AI 영상 생성 비교 — Sora vs Runway vs Kling | AI이것만',
    description: '주요 AI 영상 생성 모델을 품질, 속도, 가격으로 비교하세요.',
  },
  '/video/timeline': {
    title: 'AI 영상 생성 타임라인 — 발전 역사 | AI이것만',
    description: 'AI 영상 생성 기술의 발전 역사를 타임라인으로 살펴보세요.',
  },
  '/image': {
    title: 'AI 이미지 비교 — Midjourney vs DALL-E vs Flux | AI이것만',
    description: '주요 AI 이미지 생성 모델의 품질과 스타일을 비교해 보세요.',
  },
  '/recommend': {
    title: 'AI 모델 추천 — 나에게 맞는 AI 찾기 | AI이것만',
    description: '사용 목적과 예산에 맞는 최적의 AI 모델을 추천받으세요.',
  },
  '/pc-check': {
    title: 'AI PC 사양 체크 — 내 PC로 AI 돌려보기 | AI이것만',
    description: '내 PC 사양으로 어떤 AI 모델을 로컬에서 실행할 수 있는지 확인하세요.',
  },
  '/news': {
    title: 'AI 뉴스 브리핑 — 매일 핵심 AI 소식 | AI이것만',
    description: '전 세계 AI 기술 소식을 매일 요약해 드립니다. 빠르게 트렌드를 파악하세요.',
  },
  '/prompts': {
    title: '프롬프트 엔지니어링 — AI 활용 가이드 | AI이것만',
    description: '프롬프트 작성법부터 고급 기법까지, AI를 더 잘 활용하는 방법을 배워보세요.',
  },
  '/prompts/intro': {
    title: '프롬프트 엔지니어링 입문 — 기초 가이드 | AI이것만',
    description: '프롬프트 엔지니어링의 기본 개념과 핵심 원칙을 알기 쉽게 설명합니다.',
  },
  '/prompts/how': {
    title: '프롬프트 작성법 — 실전 예제 | AI이것만',
    description: '상황별 프롬프트 작성 예제와 팁을 확인하고 AI 응답 품질을 높이세요.',
  },
  '/prompts/library': {
    title: '프롬프트 라이브러리 — 추천 프롬프트 모음 | AI이것만',
    description: '자주 쓰는 프롬프트를 목적별로 모아놓은 라이브러리입니다. 바로 복사해서 사용하세요.',
  },
  '/openclaw': {
    title: 'OpenClaw — AI 에이전트 플랫폼 | AI이것만',
    description: 'OpenClaw AI 에이전트 플랫폼 소개. 설치부터 스킬 활용까지 한곳에.',
  },
  '/openclaw/intro': {
    title: 'OpenClaw 소개 — AI를 개인 비서로 | AI이것만',
    description: 'OpenClaw이 무엇인지, 어떤 기능을 제공하는지 알아보세요.',
  },
  '/openclaw/guide': {
    title: 'OpenClaw 사용 가이드 — 시작하기 | AI이것만',
    description: 'OpenClaw 설치부터 기본 사용법까지 단계별 가이드를 확인하세요.',
  },
  '/openclaw/skills': {
    title: 'OpenClaw 스킬 트리 — 기능 목록 | AI이것만',
    description: 'OpenClaw의 스킬 목록과 각 기능을 확인하고 필요한 스킬을 추가하세요.',
  },
  '/openclaw/devnews': {
    title: 'OpenClaw 개발 뉴스 — 업데이트 소식 | AI이것만',
    description: 'OpenClaw 최신 업데이트, 새로운 기능, 개발 소식을 확인하세요.',
  },
  '/openclaw/install': {
    title: 'OpenClaw 설치 — Windows/Mac/Linux | AI이것만',
    description: 'OpenClaw를 Windows, macOS, Linux에 설치하는 방법을 안내합니다.',
  },
  '/learn': {
    title: 'AI 배우기 — 초보자를 위한 AI 학습 | AI이것만',
    description: 'AI의 기본 개념부터 실전 활용까지 단계별로 배워보세요.',
  },
  '/learn/glossary': {
    title: 'AI 용어 사전 — 핵심 개념 정리 | AI이것만',
    description: 'AI 관련 핵심 용어를 알기 쉽게 정리한 사전입니다.',
  },
  '/learn/simulator': {
    title: 'AI 학습 시뮬레이터 — 체험해 보기 | AI이것만',
    description: 'AI의 작동 원리를 직접 시뮬레이션으로 체험해 보세요.',
  },
};

const DEFAULT_SEO: SEOConfig = {
  title: 'AI이것만 — AI 모델 비교·추천·가격·뉴스',
  description: '최신 AI 모델의 성능, 가격, 벤치마크를 한눈에 비교하고 나에게 맞는 AI를 추천받으세요.',
};

export function useSEO() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const seo = PAGE_SEO[path] || DEFAULT_SEO;

    document.title = seo.title;

    // Update description meta
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // Update og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);

    // Update og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);

    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://onlyai.co.kr${path}`);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://onlyai.co.kr${path}`);
  }, [location]);
}
