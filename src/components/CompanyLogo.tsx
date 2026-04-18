// 공용 회사 로고 컴포넌트 — artificialanalysis.ai 스타일 모노톤 SVG
// 단일 진실 공급원: logoUtils.ts (이 파일은 컴포넌트만 담당)

import { getLogoUrl } from "../lib/logoUtils";

export function CompanyLogo({ company, size = 18, className = "" }: { company: string; size?: number; className?: string }) {
  // company prop can be either companyId (e.g. 'zhipu') or companyName (e.g. 'Zhipu AI')
  const src = getLogoUrl(company, undefined) || getLogoUrl(undefined, company);
  if (!src) {
    // Fallback: show first character as text
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.55 }}
      >
        {company.charAt(0)}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={company}
      className={`object-contain inline-block ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        const parent = target.parentElement;
        if (parent) {
          const fallback = document.createElement('span');
          fallback.textContent = company.charAt(0);
          fallback.style.cssText = `width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;font-size:${size * 0.55}px;font-weight:700;border-radius:4px;background:#f3f4f6;color:#6b7280;`;
          parent.replaceChild(fallback, target);
        }
      }}
    />
  );
}
