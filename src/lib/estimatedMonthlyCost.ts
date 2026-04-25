/**
 * estimatedMonthlyCost.ts
 *
 * "초보자용" 월 예상 비용 산출 유틸.
 * 전문가용 per-1M-tokens 가격을 일상 사용 시나리오 기준의
 * 월 예상 비용(USD)으로 변환합니다.
 *
 * 산출 기준:
 *   - 하루 30분 채팅
 *   - 1분당 10메시지
 *   - 메시지당 입력 200토큰 + 출력 400토큰
 *   - 월 22일 사용
 */

// ── 상수 ────────────────────────────────────────────────────────
const MINUTES_PER_DAY = 30;
const MESSAGES_PER_MINUTE = 10;
const INPUT_TOKENS_PER_MSG = 200;
const OUTPUT_TOKENS_PER_MSG = 400;
const DAYS_PER_MONTH = 22;

// 월간 총 토큰 수
const TOTAL_MESSAGES = MESSAGES_PER_MINUTE * MINUTES_PER_DAY * DAYS_PER_MONTH; // 6,600
const MONTHLY_INPUT_TOKENS = TOTAL_MESSAGES * INPUT_TOKENS_PER_MSG;  // 1,320,000
const MONTHLY_OUTPUT_TOKENS = TOTAL_MESSAGES * OUTPUT_TOKENS_PER_MSG; // 2,640,000

// per-1M → 실제 비용 변환 계수
const INPUT_COST_FACTOR = MONTHLY_INPUT_TOKENS / 1_000_000;  // 1.32
const OUTPUT_COST_FACTOR = MONTHLY_OUTPUT_TOKENS / 1_000_000; // 2.64

// ── 타입 ────────────────────────────────────────────────────────
interface PricingInput {
  inputPrice: number | null | undefined;
  outputPrice: number | null | undefined;
}

export interface MonthlyCostBreakdown {
  /** 월 예상 총 비용 (USD). 가격 정보가 없으면 null */
  total: number | null;
  /** 입력 토큰 비용 */
  inputCost: number | null;
  /** 출력 토큰 비용 */
  outputCost: number | null;
  /** 산출 기준 설명 (UI 표시용) */
  basis: string;
}

// ── 함수 ────────────────────────────────────────────────────────

/**
 * per-1M-tokens 가격을 월 예상 비용으로 변환합니다.
 *
 * @param inputPrice  per 1M input tokens (USD). null이면 무료로 간주.
 * @param outputPrice per 1M output tokens (USD). null이면 무료로 간주.
 * @returns MonthlyCostBreakdown
 */
export function estimateMonthlyCost(
  inputPrice: number | null | undefined,
  outputPrice: number | null | undefined,
): MonthlyCostBreakdown {
  const basis = `하루 30분 × 1분당 10msg × 월 22일 (입력 200토큰, 출력 400토큰/msg)`;

  const inCost = inputPrice != null ? inputPrice * INPUT_COST_FACTOR : 0;
  const outCost = outputPrice != null ? outputPrice * OUTPUT_COST_FACTOR : 0;

  // 둘 다 null/undefined → 정보 없음
  if (inputPrice == null && outputPrice == null) {
    return { total: null, inputCost: null, outputCost: null, basis };
  }

  const total = inCost + outCost;

  return {
    total: Math.round(total * 100) / 100,   // 소수점 둘째 자리
    inputCost: Math.round(inCost * 100) / 100,
    outputCost: Math.round(outCost * 100) / 100,
    basis,
  };
}

/**
 * 객체 형태로 받는 편의 오버로드.
 * AIModel 등의 객체를 그대로 넘길 수 있습니다.
 */
export function estimateMonthlyCostFromModel(
  model: PricingInput,
): MonthlyCostBreakdown {
  return estimateMonthlyCost(model.inputPrice, model.outputPrice);
}

/**
 * USD 금액을 읽기 쉬운 문자열로 포맷합니다.
 * 예) 1.5 → "$1.50", 0.083 → "$0.08", null → "가격 정보 없음"
 */
export function formatMonthlyCost(cost: number | null): string {
  if (cost == null) return '가격 정보 없음';
  if (cost < 0.01) return '<$0.01';
  return `$${cost.toFixed(2)}`;
}
