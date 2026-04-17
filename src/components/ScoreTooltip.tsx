type ScoreTooltipType = 'useCase' | 'budget' | 'korean' | 'privacy';

const TOOLTIP_TEXT: Record<ScoreTooltipType, string> = {
  useCase:
    'AI마다 잘하는 분야가 다르니, "이 AI는 내가 자주 하는 일에 도우미로 적합한가?"를 기준으로 평가합니다. 코딩, 글쓰기, 이미지 생성 등 각 용도의 성능을 반영합니다.',
  budget:
    '매월 지불하는 구독료가 예산을 초과하면 아무리 좋아도 오래 사용할 수 없습니다. 무료 플랜으로 충분한지, 돈을 낼 만큼의 가치가 있는지 평가합니다.',
  korean:
    'AI가 사용자의 언어를 제대로 이해하지 못하면 질문의 의도를 빗나가거나 어색한 답변을 내놓습니다. 자연스러운 대화를 원한다면 이 점수가 중요합니다.',
  privacy:
    '회사 기밀이나 개인적인 생각을 AI에 입력할 때, 그 데이터가 어디에서 안전하게 보호되는지가 가장 중요합니다. 로컬 실행이 가장 안전합니다.',
};

const TOOLTIP_TITLE: Record<ScoreTooltipType, string> = {
  useCase: '용도 점수 (최대 40점)',
  budget: '가격 점수 (최대 30점)',
  korean: '언어 점수 (최대 15점)',
  privacy: '개인정보 점수 (최대 15점)',
};

export function ScoreTooltip({ type }: { type: ScoreTooltipType }) {
  return (
    <span className="relative inline-flex items-center group">
      <span className="text-[10px] font-bold rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-1.5 py-0.5 cursor-help">
        ?
      </span>
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 rounded-lg bg-gray-900 text-white text-[11px] leading-relaxed px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
        <p className="font-bold mb-1">{TOOLTIP_TITLE[type]}</p>
        <p>{TOOLTIP_TEXT[type]}</p>
      </span>
    </span>
  );
}
