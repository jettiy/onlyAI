// 공용 회사 로고 컴포넌트 — artificialanalysis.ai 스타일 모노톤 SVG
// 단일 진실 공급원: logoUtils.ts (이 파일은 컴포넌트만 담당)

import { getLogoUrl } from "../lib/logoUtils";

export function CompanyLogo({ company, size = 18, className = "" }: { company: string; size?: number; className?: string }) {
  const src = getLogoUrl(undefined, company);
  if (!src) return null;
  return (
    <img
      src={src}
      alt={company}
      className={`object-contain inline-block ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}
