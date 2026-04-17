import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/': 'onlyAI - AI 모델 비교 및 추천',
  '/models': 'AI 모델 목록',
  '/explore': 'AI 탐색',
  '/pricing': 'API 가격 비교',
  '/news': 'AI 뉴스 브리핑',
  '/quiz': '나에게 맞는 AI 찾기',
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/': '최신 AI 모델의 성능, 가격, 벤치마크를 한눈에 비교하고 나에게 딱 맞는 AI 모델을 추천받으세요.',
  '/models': '전 세계 50개 이상의 주요 AI 모델 목록과 상세 정보를 확인하세요.',
  '/explore': 'AI 모델의 토큰 계산, 벤치마크 비교 등 다양한 탐색 도구를 제공합니다.',
  '/pricing': '주요 AI 모델의 API 입출력 가격을 실시간으로 비교하여 비용을 최적화하세요.',
  '/news': '전 세계 AI 기술 소식을 빠르게 수집하여 요약해 드립니다.',
  '/quiz': '몇 가지 질문으로 나에게 최적화된 AI 모델을 추천해 드립니다.',
};

export function useSEO() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    document.title = PAGE_TITLES[path] || 'onlyAI';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', PAGE_DESCRIPTIONS[path] || 'onlyAI - AI 모델 비교 및 추천 서비스');
  }, [location]);
}
