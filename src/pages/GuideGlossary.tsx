import { useState } from 'react';

interface GlossaryItem {
  term: string;
  en: string;
  definition: string;
  example: string;
}

const GLOSSARY: GlossaryItem[] = [
  {
    term: 'LLM',
    en: 'Large Language Model',
    definition: '대규모 언어 모델. 엄청나게 많은 텍스트를 학습해서 사람처럼 글을 이해하고 생성하는 AI 모델이에요. ChatGPT, Claude 같은 서비스의 핵심 기술이에요.',
    example: 'GPT-5, Claude Opus 4.6, Gemini 3.1 Pro가 모두 LLM이에요.',
  },
  {
    term: '프롬프트',
    en: 'Prompt',
    definition: 'AI에게 주는 지시사항이나 질문이에요. 프롬프트를 어떻게 작성하느냐에 따라 AI의 답변 품질이 크게 달라져요.',
    example: '"파이썬으로 피보나치 수열을 구하는 코드를 작성해줘" → 이게 프롬프트예요.',
  },
  {
    term: '토큰',
    en: 'Token',
    definition: 'AI가 텍스트를 처리하는 기본 단위예요. 영어는 대략 1단어 ≈ 1토큰, 한국어는 1글자~1단어 ≈ 1~2토큰이에요. API 요금은 토큰 수로 계산해요.',
    example: '1000토큰 ≈ 한국어 약 500~700자 분량이에요.',
  },
  {
    term: '컨텍스트 윈도우',
    en: 'Context Window',
    definition: 'AI가 한 번에 기억하고 처리할 수 있는 텍스트의 최대 길이예요. 이 범위를 넘어서는 내용은 AI가 잊어버려요.',
    example: 'GPT-5.4는 1.1M(약 150만 자) 컨텍스트 윈도우를 가지고 있어요.',
  },
  {
    term: '파인튜닝',
    en: 'Fine-tuning',
    definition: '이미 학습된 AI 모델을 특정 작업이나 도메인에 맞게 추가로 학습시키는 과정이에요. 의료, 법률 같은 전문 분야에 특화할 수 있어요.',
    example: 'GPT-4.1을 회사 내부 문서로 파인튜닝하면 사내 전용 AI가 돼요.',
  },
  {
    term: 'RAG',
    en: 'Retrieval-Augmented Generation',
    definition: 'AI가 답변하기 전에 관련 문서를 먼저 검색(Retrieval)해서 그 내용을 바탕으로 답변(Generation)하는 기술이에요. 할루시네이션을 줄이는 데 효과적이에요.',
    example: '기업 내부 문서 Q&A 시스템이 RAG를 사용해요.',
  },
  {
    term: '할루시네이션',
    en: 'Hallucination',
    definition: 'AI가 사실이 아닌 내용을 자신 있게 말하는 현상이에요. AI는 "그럴듯한" 답변을 만들어내기 때문에, 항상 사실 확인이 필요해요.',
    example: 'AI가 존재하지 않는 논문을 인용하는 경우가 할루시네이션이에요.',
  },
  {
    term: '에이전트',
    en: 'AI Agent',
    definition: 'AI가 스스로 판단해서 도구를 사용하고, 여러 단계의 작업을 자동으로 수행하는 시스템이에요. 단순한 질의응답을 넘어 실제 작업을 수행해요.',
    example: 'OpenClaw가 AI 에이전트 플랫폼의 예시예요.',
  },
  {
    term: 'MoE',
    en: 'Mixture of Experts',
    definition: '여러 전문가 모델(Expert) 중 상황에 맞는 것만 선택적으로 사용하는 기술이에요. 큰 모델의 성능을 유지하면서 연산량은 줄일 수 있어요.',
    example: 'DeepSeek-V3.2는 685B 파라미터 MoE 모델이에요.',
  },
  {
    term: '오픈소스 모델',
    en: 'Open Source Model',
    definition: '모델의 가중치(Weights)가 공개되어 누구나 다운로드해서 사용할 수 있는 AI 모델이에요. 자체 서버에서 실행하면 데이터 유출 걱정이 없어요.',
    example: 'Meta의 Llama 4, Alibaba의 Qwen 3-32B가 오픈소스 모델이에요.',
  },
  {
    term: 'API',
    en: 'Application Programming Interface',
    definition: '개발자가 AI 모델의 기능을 코드에서 호출할 수 있는 인터페이스예요. API를 쓰면 내 앱에 AI 기능을 쉽게 추가할 수 있어요.',
    example: 'OpenAI API, Anthropic API, Google AI Studio가 대표적인 AI API예요.',
  },
  {
    term: '스트리밍',
    en: 'Streaming',
    definition: 'AI가 답변을 생성하는 즉시 조금씩 보내주는 방식이에요. 전체 답변이 완성될 때까지 기다릴 필요 없이 실시간으로 결과를 볼 수 있어요.',
    example: 'ChatGPT가 글자 하나하나씩 나타나는 것이 스트리밍이에요.',
  },
  {
    term: '벤치마크',
    en: 'Benchmark',
    definition: 'AI 모델의 성능을 객관적으로 평가하는 표준 테스트예요. 코딩, 수학, 추론 등 분야별로 점수를 매겨 모델 간 비교가 가능해요.',
    example: 'MMLU, HumanEval, MATH 등이 대표적인 벤치마크예요.',
  },
  {
    term: '멀티모달',
    en: 'Multimodal',
    definition: '텍스트뿐만 아니라 이미지, 음성, 영상 등 여러 형태의 데이터를 동시에 이해하고 처리할 수 있는 능력이에요.',
    example: 'Gemini 3.1 Pro는 텍스트 + 이미지 + 영상을 동시에 처리할 수 있어요.',
  },
  {
    term: '임베딩',
    en: 'Embedding',
    definition: '텍스트를 AI가 이해할 수 있는 숫자 벡터로 변환하는 과정이에요. 의미가 비슷한 텍스트는 비슷한 숫자로 표현돼요. 검색, 추천 시스템에 필수적이에요.',
    example: 'RAG 시스템에서 문서를 임베딩으로 변환해서 유사도 검색에 활용해요.',
  },
];

export default function GuideGlossary() {
  const [search, setSearch] = useState('');

  const filtered = GLOSSARY.filter(
    g => g.term.includes(search) || g.en.toLowerCase().includes(search.toLowerCase()) || g.definition.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">📖 AI 용어사전</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI 관련 용어를 쉽게 설명해드려요</p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="용어 검색..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>

      {/* Glossary Items */}
      <div className="space-y-4">
        {filtered.map(g => (
          <div key={g.term}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-black text-gray-900 dark:text-white">{g.term}</h3>
              <span className="text-[10px] text-gray-400 font-mono">{g.en}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{g.definition}</p>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-bold">💡 예시:</span> {g.example}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-400">검색 결과가 없어요</p>
        </div>
      )}
    </div>
  );
}
