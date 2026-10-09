import { Library } from "lucide-react";
import { useState } from 'react';

interface Prompt {
  title: string;
  prompt: string;
  tags: string[];
}

interface PromptCategory {
  id: string;
  label: string;
  icon: string;
  prompts: Prompt[];
}

const CATEGORIES: PromptCategory[] = [
  {
    id: 'coding',
    label: '코딩',
    icon: '',
    prompts: [
      {
        title: '코드 리뷰',
        prompt: '너는 10년 차 시니어 개발자야. 다음 코드를 성능, 보안, 가독성 관점에서 리뷰해줘. 개선점은 번호를 매겨서 구체적으로 설명해줘.\n\n```\n[여기에 코드 붙여넣기]\n```',
        tags: ['코드리뷰', '개발'],
      },
      {
        title: '버그 수정',
        prompt: '다음 코드에서 발생하는 에러의 원인을 찾고, 수정된 코드를 제시해줘. 원인 설명도 함께 적어줘.\n\n에러 메시지: [에러 내용]\n\n```\n[코드]\n```',
        tags: ['디버깅', '에러'],
      },
      {
        title: '테스트 코드 작성',
        prompt: '다음 함수에 대한 단위 테스트를 작성해줘. 정상 케이스 3개, 엣지 케이스 3개, 에러 케이스 2개를 포함해줘. Jest + TypeScript로 작성해줘.\n\n```\n[함수 코드]\n```',
        tags: ['테스트', 'Jest'],
      },
    ],
  },
  {
    id: 'writing',
    label: '글쓰기',
 icon: '',
    prompts: [
      {
        title: '블로그 포스팅',
        prompt: '[주제]에 대한 블로그 포스팅을 작성해줘.\n조건:\n- 분량: 2000자\n- 톤: 전문적이면서 읽기 쉬운\n- 구조: 서론(왜 중요한가) → 본론(3가지 핵심 포인트) → 결론(요약 + 다음 단계)\n- 한국어로 작성',
        tags: ['블로그', '콘텐츠'],
      },
      {
        title: '이메일 작성',
        prompt: '다음 상황에 대한 비즈니스 이메일을 작성해줘.\n\n상황: [상황 설명]\n받는 사람: [직책/관계]\n핵심 메시지: [전달할 내용]\n\n조건: 정중하고 간결하게, 핵심만 전달',
        tags: ['이메일', '비즈니스'],
      },
      {
        title: 'SNS 캡션',
        prompt: '다음 이미지/제품에 대한 인스타그램 캡션을 3개 작성해줘.\n\n제품/이미지: [설명]\n타겟: 20~30대\n해시태그 10개 포함\n각 캡션은 다른 톤으로 작성 (1. 정보형, 2. 감성형, 3. 유머형)',
        tags: ['SNS', '마케팅'],
      },
    ],
  },
  {
    id: 'translate',
    label: '번역',
    icon: '',
    prompts: [
      {
        title: '자연스러운 번역',
        prompt: '다음 문장을 [원어]에서 [목표어]로 번역해줘. 직역하지 말고, [목표어] 원어민이 쓰는 자연스러운 표현으로 번역해줘.\n\n[원문]',
        tags: ['번역', '현지화'],
      },
      {
        title: '비즈니스 번역',
        prompt: '다음 비즈니스 문서를 [원어]에서 한국어로 번역해줘. 비즈니스 용어는 업계 표준 용어로, 존댓말로 번역해줘.\n\n[원문]',
        tags: ['번역', '비즈니스'],
      },
    ],
  },
  {
    id: 'analysis',
    label: '분석·요약',
    icon: '',
    prompts: [
      {
        title: '문서 요약',
        prompt: '다음 문서를 요약해줘.\n\n조건:\n- 3문장 이내로 핵심만\n- 첫 문장은 결론\n- 숫자/데이터가 있으면 반드시 포함\n\n[문서 내용]',
        tags: ['요약', '분석'],
      },
      {
        title: '경쟁사 분석',
        prompt: '[제품/서비스]의 경쟁사 3개를 분석해줘.\n\n분석 항목:\n1. 주요 기능 비교\n2. 가격 비교\n3. 장단점\n4. 타겟 고객 차이\n\n마크다운 표로 정리해줘.',
        tags: ['분석', '경쟁사'],
      },
      {
        title: '회의록 정리',
 prompt: '다음 회의 내용을 정리해줘.\n\n형식:\n 회의 주제: \n 날짜: \n 참석자: \n 주요 논의사항 (3~5개):\n 액션 아이템 (담당자 + 기한):\n 다음 회의 일정:\n\n[회의 내용]',
        tags: ['회의록', '정리'],
      },
    ],
  },
];

export default function PromptLibrary() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const current = CATEGORIES.find(c => c.id === activeCat)!;
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white"><Library className="inline-block shrink-0 align-text-bottom" size={16} /> 프롬프트 저장소</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">바로 복사해서 쓸 수 있는 프롬프트 예시 모음</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCat === cat.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Prompts */}
      <div className="space-y-4">
        {current.prompts.map((p, idx) => (
          <div key={p.title}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{p.title}</h3>
              <button
                onClick={() => copyPrompt(p.prompt, idx)}
                className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
 {copiedIdx === idx ? ' 복사됨' : '복사'}
              </button>
            </div>
            <pre className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 whitespace-pre-wrap leading-relaxed font-sans">
              {p.prompt}
            </pre>
            <div className="flex flex-wrap gap-1 mt-3">
              {p.tags.map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">#{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
