import { useMemo } from "react";
import { TrendingDown } from "lucide-react";
import { models } from "../data/models";
import { useLivePrices } from "../hooks/useLivePrices";
import { CompanyLogo } from "./CompanyLogo";

interface Drop {
  id: string;
  name: string;
  companyId: string;
  old: number;
  now: number;
  pct: number;
}

// 카탈로그 정가 대비 실시간(OpenRouter) 가격이 5%+ 인하된 모델 알림.
// usePriceHistory 히스토리와 무관하게 즉시 작동한다.
export default function PriceDropAlerts() {
  const { getLivePrice, loading } = useLivePrices();

  const drops = useMemo(() => {
    const out: Drop[] = [];
    for (const m of models) {
      if (!m.openRouterSlug || m.inputPrice == null || m.inputPrice <= 0) continue;
      const live = getLivePrice(m.openRouterSlug);
      if (!live || live.input == null) continue;
      if (live.input < m.inputPrice * 0.95) {
        out.push({
          id: m.id,
          name: m.name,
          companyId: m.companyId,
          old: m.inputPrice,
          now: live.input,
          pct: Math.round((1 - live.input / m.inputPrice) * 100),
        });
      }
    }
    return out.sort((a, b) => b.pct - a.pct).slice(0, 6);
  }, [getLivePrice]);

  if (loading || drops.length === 0) return null;

  return (
    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-900/10 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown size={18} className="text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
          가격 인하 모델 · 정가 대비 실시간
        </h2>
        <span className="ml-auto text-[10px] text-emerald-600/70 dark:text-emerald-400/70">OpenRouter 기준</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {drops.map(d => (
          <div
            key={d.id}
            className="flex items-center gap-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2"
          >
            <CompanyLogo company={d.companyId} size={20} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{d.name}</p>
              <p className="text-[11px] font-mono text-gray-400">
                <span className="line-through">${d.old.toFixed(2)}</span>{" → "}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">${d.now.toFixed(2)}</span>/M
              </p>
            </div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">-{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
