import { useState, useMemo } from "react";

type GlossaryCategory = '기초개념' | '학습기법' | '아키텍처' | '실사용' | '성능지표';

interface GlossaryTerm {
  korean: string;
  english: string;
  category: GlossaryCategory;
  description: string;
  example?: string;
}

const categoryColors: Record<GlossaryCategory, string> = {
  '기초개념': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  '학습기법': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  '아키텍처': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  '실사용':   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  '성능지표': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const glossaryData: GlossaryTerm[] = [
  {
    korean: 'LLM (거대 언어 모델)',
    english: 'Large Language Model',
    category: '기초개념',
    description: '수천억 개의 파라미터를 학습한 초대형 AI 언어 모델이에요. GPT, Claude, Gemini 같은 AI가 모두 LLM에 해당해요.',
    example: 'ChatGPT, Claude, Gemini는 모두 LLM이에요.',
  },
  {
    korean: '토큰',
    english: 'Token',
    category: '기초개념',
    description: 'AI가 텍스트를 처리하는 단위예요. 영어는 단어 약 4글자, 한국어는 약 2~3글자가 1토큰이에요. API 비용은 토큰 수로 계산해요.',
    example: '"Hello World"는 약 2토큰, "안녕하세요"는 약 3~4토큰이에요.',
  },
  {
    korean: '컨텍스트 윈도우',
    english: 'Context Window',
    category: '기초개념',
    description: 'AI가 한 번에 읽고 기억할 수 있는 최대 텍스트 길이예요. 128K면 약 10만 단어(A4 용지 300페이지 분량)를 한꺼번에 처리할 수 있어요.',
    example: 'GPT-4.1은 1M 토큰 컨텍스트로 소설책 여러 권을 한 번에 처리해요.',
  },
  {
    korean: '파인튜닝',
    english: 'Fine-tuning',
    category: '학습기법',
    description: '이미 학습된 AI 모델을 내 데이터로 추가 학습시켜서 특정 용도에 맞게 최적화하는 방법이에요. 회사 내부 규칙이나 특수 언어에 적응시킬 수 있어요.',
    example: '의료 AI를 만들기 위해 의학 논문으로 기존 LLM을 파인튜닝해요.',
  },
  {
    korean: 'RAG',
    english: 'Retrieval-Augmented Generation',
    category: '실사용',
    description: 'AI가 답변할 때 외부 데이터베이스나 문서를 검색해서 최신·정확한 정보를 포함시키는 기법이에요. 환각(할루시네이션)을 줄이는 데 효과적이에요.',
    example: '회사 내부 문서를 AI에게 물어보는 "사내 챗봇"이 대표적인 RAG 사례예요.',
  },
  {
    korean: '임베딩',
    english: 'Embedding',
    category: '아키텍처',
    description: '텍스트·이미지 등을 숫자 벡터로 변환하는 기술이에요. 의미가 비슷한 단어끼리 가까운 숫자로 표현돼서 AI가 의미를 이해할 수 있어요.',
    example: '"사과"와 "과일"은 임베딩 공간에서 가까운 벡터를 가져요.',
  },
  {
    korean: '프롬프트 엔지니어링',
    english: 'Prompt Engineering',
    category: '실사용',
    description: 'AI에게 더 좋은 답변을 얻기 위해 질문(프롬프트)을 정교하게 설계하는 기술이에요. 역할 부여, 예시 제공, 단계별 지시 등 다양한 기법이 있어요.',
    example: '"한국어로 번역해줘" 대신 "전문 번역가처럼 자연스러운 한국어로 번역해줘"라고 하면 더 좋은 결과가 나와요.',
  },
  {
    korean: '체인 오브 쏘트 (CoT)',
    english: 'Chain of Thought',
    category: '실사용',
    description: 'AI가 최종 답변을 내기 전에 단계적으로 생각 과정을 거치게 하는 기법이에요. 복잡한 수학·논리 문제에서 정확도가 크게 올라가요.',
    example: '"단계별로 생각해봐"라고 추가하면 CoT를 유도할 수 있어요.',
  },
  {
    korean: 'MoE (전문가 혼합)',
    english: 'Mixture of Experts',
    category: '아키텍처',
    description: '모델 전체를 매번 다 쓰지 않고, 상황에 맞는 일부 "전문가" 네트워크만 선택해서 쓰는 구조예요. 전체 파라미터는 크지만 실제로 쓰이는 파라미터는 훨씬 적어 효율이 높아요.',
    example: 'DeepSeek-V3는 685B 파라미터이지만 실제 추론 시 37B만 활성화돼요.',
  },
  {
    korean: '에이전트',
    english: 'AI Agent',
    category: '실사용',
    description: 'AI가 단순히 답하는 것을 넘어서, 도구(웹 검색, 코드 실행, 파일 조작 등)를 직접 사용하며 자율적으로 여러 단계의 작업을 수행하는 AI를 말해요.',
    example: '코드 작성 → 실행 → 오류 수정을 스스로 반복하는 Claude Code가 에이전트예요.',
  },
  {
    korean: '멀티모달',
    english: 'Multimodal',
    category: '기초개념',
    description: '텍스트뿐만 아니라 이미지·음성·영상 등 여러 종류의 데이터를 함께 이해하고 처리할 수 있는 AI예요.',
    example: 'Gemini 2.5 Pro는 텍스트·이미지·영상을 모두 이해해요.',
  },
  {
    korean: '벤치마크',
    english: 'Benchmark',
    category: '성능지표',
    description: 'AI 모델의 성능을 객관적으로 비교하기 위한 표준 시험이에요. MMLU(지식), HumanEval(코딩), MATH(수학) 등 다양한 벤치마크가 있어요.',
    example: 'SWE-bench는 실제 소프트웨어 버그를 AI가 얼마나 잘 수정하는지 측정해요.',
  },
  {
    korean: 'RLHF',
    english: 'Reinforcement Learning from Human Feedback',
    category: '학습기법',
    description: '사람의 피드백을 기반으로 AI를 강화 학습시키는 방법이에요. AI 응답 중 사람이 더 좋다고 평가한 것을 학습해서 점점 더 인간 친화적인 답변을 하게 돼요.',
    example: 'ChatGPT가 유해한 답변을 피하는 것은 RLHF 덕분이에요.',
  },
  {
    korean: '양자화',
    english: 'Quantization',
    category: '학습기법',
    description: '모델의 숫자 정밀도를 낮춰서(예: 32비트 → 4비트) 파일 크기와 메모리 사용량을 줄이는 기술이에요. 성능은 약간 손실되지만 로컬 실행이 가능해져요.',
    example: 'Llama 70B를 Q4 양자화하면 4GB 정도로 줄어 일반 PC에서도 실행 가능해요.',
  },
  {
    korean: 'LoRA',
    english: 'Low-Rank Adaptation',
    category: '학습기법',
    description: '대형 모델 전체를 파인튜닝하지 않고, 소수의 추가 파라미터만 학습시키는 효율적인 파인튜닝 방법이에요. 비용과 시간이 크게 줄어들어요.',
    example: '7B 모델을 LoRA로 파인튜닝하면 일반 GPU 1장으로도 가능해요.',
  },
  {
    korean: '인퍼런스',
    english: 'Inference',
    category: '기초개념',
    description: '학습된 AI 모델이 실제로 입력을 받아 출력을 생성하는 과정이에요. "학습(Training)"과 구분되며, 우리가 AI를 사용하는 것이 곧 인퍼런스예요.',
    example: 'API 호출 비용은 인퍼런스 비용이에요.',
  },
  {
    korean: '할루시네이션',
    english: 'Hallucination',
    category: '성능지표',
    description: 'AI가 실제로 존재하지 않는 정보를 사실인 것처럼 자신 있게 말하는 현상이에요. 아직 완전히 해결되지 않은 LLM의 고질적인 문제예요.',
    example: '존재하지 않는 논문 제목이나 날짜를 자신 있게 말하는 것이 할루시네이션이에요.',
  },
  {
    korean: '제로샷/퓨샷',
    english: 'Zero-shot / Few-shot',
    category: '실사용',
    description: '제로샷은 예시 없이 AI에게 새로운 작업을 지시하는 것이고, 퓨샷은 2~5개의 예시를 보여준 후 같은 방식으로 수행하게 하는 기법이에요.',
    example: '퓨샷: "A→B, C→D, E→?" 형태로 패턴을 보여주고 유추하게 해요.',
  },
  {
    korean: '시스템 프롬프트',
    english: 'System Prompt',
    category: '실사용',
    description: 'AI의 역할·규칙·성격을 사전에 설정하는 숨겨진 지시문이에요. 사용자 대화가 시작되기 전에 AI에게 "너는 고객센터 직원이야"처럼 역할을 부여해요.',
    example: 'ChatGPT의 친절한 말투는 시스템 프롬프트로 설정된 것이에요.',
  },
  {
    korean: '온디바이스 AI',
    english: 'On-device AI',
    category: '기초개념',
    description: '클라우드 서버 없이 스마트폰이나 PC에서 직접 AI를 실행하는 방식이에요. 인터넷 연결 없이도 사용 가능하고 개인정보가 외부로 나가지 않아요.',
    example: 'iPhone의 Siri나 Galaxy AI 기능 일부가 온디바이스 AI예요.',
  },
  {
    korean: 'KV 캐시',
    english: 'KV Cache',
    category: '아키텍처',
    description: '이전에 계산한 어텐션 값을 저장해두어 재계산을 피하는 최적화 기법이에요. 긴 대화에서 응답 속도를 크게 높여줘요. 프롬프트 캐싱으로 API 비용도 줄일 수 있어요.',
    example: 'Anthropic의 프롬프트 캐싱은 KV 캐시를 활용해 비용을 최대 90% 절감해요.',
  },
  {
    korean: '토큰/초 (TPS)',
    english: 'Tokens Per Second',
    category: '성능지표',
    description: 'AI가 초당 생성하는 토큰 수예요. 숫자가 클수록 응답이 빨라요. 실시간 대화에는 30TPS 이상이 적합하고, 100TPS 이상이면 매우 빠른 편이에요.',
    example: 'Groq의 Llama 4는 수백 TPS를 달성해 즉각적인 응답이 가능해요.',
  },
  {
    korean: '플래그십 모델',
    english: 'Flagship Model',
    category: '기초개념',
    description: '각 회사의 가장 강력하고 성능이 높은 최상위 모델이에요. 주로 가장 비싼 모델이며, 가장 복잡한 작업에 사용해요.',
    example: 'Claude Opus, GPT-5.2 Pro, Gemini 3 Pro가 각 회사의 플래그십이에요.',
  },
  {
    korean: 'SFT',
    english: 'Supervised Fine-Tuning',
    category: '학습기법',
    description: '사람이 직접 만든 고품질 질문-답변 쌍 데이터로 AI를 추가 학습시키는 방법이에요. 기본 모델을 대화·지시 이행에 특화시키는 첫 번째 단계예요.',
    example: 'GPT 베이스 모델에 SFT를 적용해서 ChatGPT로 만들어요.',
  },
  {
    korean: '파라미터',
    english: 'Parameter',
    category: '아키텍처',
    description: 'AI 모델이 학습을 통해 최적화한 내부 숫자(가중치)의 수예요. 숫자가 클수록 더 많은 정보를 담을 수 있지만, 실행 비용과 메모리도 증가해요.',
    example: 'GPT-3는 175B(1750억) 파라미터, GPT-4는 약 1.8T로 추정돼요.',
  },
  {
    korean: '가중치',
    english: 'Weights',
    category: '아키텍처',
    description: '모델의 파라미터 값을 저장한 파일이에요. 오픈소스 모델에서는 이 가중치 파일을 직접 다운로드해서 로컬에서 실행할 수 있어요.',
    example: 'Llama 가중치를 다운받아 자신의 서버에서 돌리는 것이 로컬 실행이에요.',
  },
  {
    korean: '트랜스포머',
    english: 'Transformer',
    category: '아키텍처',
    description: '2017년 Google이 발표한 혁신적인 딥러닝 구조예요. 현재 거의 모든 LLM의 기반이 되는 아키텍처로, 어텐션 메커니즘을 핵심으로 사용해요.',
    example: '"Attention is All You Need" 논문에서 처음 소개됐어요.',
  },
  {
    korean: '어텐션 메커니즘',
    english: 'Attention Mechanism',
    category: '아키텍처',
    description: '입력 텍스트의 어느 부분에 집중해야 할지를 AI가 스스로 학습하는 방법이에요. 문장에서 중요한 단어 사이의 관계를 파악할 수 있게 해줘요.',
    example: '"고양이가 쥐를 쫓았다. 그것이 빠르게 달렸다."에서 "그것"=고양이임을 파악하는 것이 어텐션이에요.',
  },
  {
    korean: '오픈소스 AI',
    english: 'Open Source AI',
    category: '기초개념',
    description: '모델의 가중치·구조·코드를 공개해서 누구나 무료로 사용·수정·배포할 수 있는 AI예요. Llama, DeepSeek, Mistral 등이 대표적이에요.',
    example: 'Llama 4는 오픈소스라 자체 서버에 설치해서 무료로 사용할 수 있어요.',
  },
  {
    korean: 'API',
    english: 'Application Programming Interface',
    category: '실사용',
    description: 'AI 기능을 내 앱이나 서비스에 연결하는 인터페이스예요. HTTP 요청으로 AI에게 질문을 보내고 답변을 받을 수 있어요. 보통 토큰 수로 비용을 청구해요.',
    example: 'OpenAI API 키를 발급받아 앱에 ChatGPT 기능을 추가할 수 있어요.',
  },
  {
    korean: 'JSON 모드',
    english: 'JSON Mode',
    category: '실사용',
    description: 'AI가 자유로운 텍스트 대신 구조화된 JSON 형식으로 응답을 보장하는 기능이에요. 앱 개발 시 AI 응답을 파싱하기 훨씬 쉬워져요.',
    example: '상품 정보 추출 시 {"name": "애플 AirPods", "price": 259000} 형태로 받을 수 있어요.',
  },
  {
    korean: '스트리밍',
    english: 'Streaming',
    category: '실사용',
    description: 'AI 응답이 완성되기를 기다리지 않고, 생성되는 즉시 실시간으로 한 글자씩 받아보는 방식이에요. ChatGPT에서 글자가 하나씩 나타나는 것이 스트리밍이에요.',
    example: 'stream=True 옵션을 사용하면 응답을 스트리밍으로 받을 수 있어요.',
  },
  {
    korean: '함수 호출',
    english: 'Function Calling',
    category: '실사용',
    description: 'AI가 응답할 때 외부 함수나 도구를 호출하도록 요청하는 기능이에요. 날씨 API 조회, 데이터베이스 검색, 코드 실행 등과 AI를 연결할 수 있어요.',
    example: '날씨를 물어보면 AI가 weather_api(city="Seoul")를 호출해 실시간 날씨를 가져와요.',
  },
];

const CATEGORIES: GlossaryCategory[] = ['기초개념', '학습기법', '아키텍처', '실사용', '성능지표'];

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');

  const filtered = useMemo(() => {
    return glossaryData.filter((term) => {
      const matchSearch = search === '' ||
        term.korean.toLowerCase().includes(search.toLowerCase()) ||
        term.english.toLowerCase().includes(search.toLowerCase()) ||
        term.description.includes(search);
      const matchCategory = activeCategory === 'all' || term.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">📚 AI 용어 백과사전</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI를 처음 접한 분도 쉽게 이해할 수 있도록 정리했어요. {glossaryData.length}개 용어 수록.
        </p>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="용어를 검색해보세요 (예: 토큰, RAG, 파인튜닝...)"
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={"px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all " + (
            activeCategory === 'all'
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
          )}
        >
          전체 ({glossaryData.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = glossaryData.filter((t) => t.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={"px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all " + (
                isActive
                  ? categoryColors[cat] + ' border-transparent'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              )}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* 결과 카운트 */}
      {(search || activeCategory !== 'all') && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length}개 용어가 검색됐어요.
          {filtered.length === 0 && ' 다른 검색어를 시도해보세요.'}
        </p>
      )}

      {/* 카드 그리드 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-500 dark:text-gray-400">검색 결과가 없어요. 다른 키워드를 입력해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((term) => (
            <div
              key={term.korean}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-200 dark:hover:border-blue-700 transition-colors flex flex-col gap-2"
            >
              {/* 카테고리 배지 */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold " + categoryColors[term.category]}>
                  {term.category}
                </span>
              </div>

              {/* 용어명 */}
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{term.korean}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{term.english}</p>
              </div>

              {/* 설명 */}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{term.description}</p>

              {/* 예시 */}
              {term.example && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-100 dark:border-blue-800">
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-0.5">💡 예시</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">{term.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-600 text-center pt-4">
        📚 AI 이것만 용어사전 · 계속 업데이트 중이에요!
      </p>
    </div>
  );
}
