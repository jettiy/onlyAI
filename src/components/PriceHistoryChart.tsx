// ── 가격 변동 이력 차트 ─────────────────────────────────
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { usePriceHistory, POPULAR_MODEL_IDS } from '../hooks/usePriceHistory';
import { models } from '../data/models';

function getModelName(modelId: string): string {
  const m = models.find(m => m.id === modelId);
  return m?.name ?? modelId;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-500 dark:text-gray-400">{entry.name}:</span>
          <span className="font-mono font-bold text-gray-900 dark:text-white">${entry.value.toFixed(4)}</span>
        </div>
      ))}
    </div>
  );
}

export default function PriceHistoryChart() {
  const {
    chartData,
  } = usePriceHistory(POPULAR_MODEL_IDS[0]);

  const hasData = chartData.dates.length >= 2;

  const rechartsData = useMemo(() =>
    chartData.dates.map((date, i) => ({
      date,
      inputPrice: chartData.inputPrices[i],
      outputPrice: chartData.outputPrices[i],
      // 짧은 날짜 표시 (MM/DD)
      shortDate: date.slice(5),
    })),
    [chartData]
  );

  const inputChange = useMemo(() => {
    if (chartData.inputPrices.length < 2) return 0;
    const first = chartData.inputPrices[0];
    const last = chartData.inputPrices[chartData.inputPrices.length - 1];
    return last - first;
  }, [chartData.inputPrices]);

  const outputChange = useMemo(() => {
    if (chartData.outputPrices.length < 2) return 0;
    const first = chartData.outputPrices[0];
    const last = chartData.outputPrices[chartData.outputPrices.length - 1];
    return last - first;
  }, [chartData.outputPrices]);

  const ChangeIndicator = ({ value, label }: { value: number; label: string }) => {
    if (Math.abs(value) < 0.0001) return null;
    const isUp = value > 0;
    return (
      <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-red-500' : 'text-green-500'}`}>
        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        <span>{label}</span>
        <span className="font-mono">{isUp ? '+' : ''}{value.toFixed(4)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-brand-500" />
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">가격 변동 이력</h2>
        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
          매일 자동 수집 · 최대 90일
        </span>
      </div>

      {/* 모델 선택 */}
      <div className="flex flex-wrap gap-2">
        {POPULAR_MODEL_IDS.map(id => {
          const name = getModelName(id);
          const isSelected = true; // 기본 첫 번째 모델 (단일 모델 렌더링)
          return (
            <span
              key={id}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                isSelected
                  ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'
              }`}
            >
              {name}
            </span>
          );
        })}
      </div>

      {/* 변동 표시 */}
      {hasData && (
        <div className="flex flex-wrap gap-3">
          <ChangeIndicator value={inputChange} label="입력" />
          <ChangeIndicator value={outputChange} label="출력" />
          <span className="text-[10px] text-gray-400">
            {chartData.dates.length}일 데이터 · {chartData.dates[0]} ~ {chartData.dates[chartData.dates.length - 1]}
          </span>
        </div>
      )}

      {/* 차트 */}
      {hasData ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rechartsData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="inputGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outputGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis
                dataKey="shortDate"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${v}`}
                width={50}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
                )}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              />
              <Area
                type="monotone"
                dataKey="inputPrice"
                name="입력 가격 ($/1M)"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#inputGradient)"
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="outputPrice"
                name="출력 가격 ($/1M)"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#outputGradient)"
                dot={{ r: 3, fill: '#8b5cf6' }}
                activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">데이터 수집 중...</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            매일 방문 시 가격이 자동 저장됩니다. 최소 2일차부터 차트가 표시됩니다.
          </p>
          <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-2">
            현재 {chartData.dates.length}일 데이터 수집됨
          </p>
        </div>
      )}

      {/* 하단 안내 */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
        💡 이 페이지를 매일 방문하면 localStorage에 가격이 누적됩니다. 데이터는 브라우저에만 저장됩니다.
      </div>
    </div>
  );
}
