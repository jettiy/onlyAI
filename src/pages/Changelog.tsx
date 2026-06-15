import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  DollarSign,
  MinusCircle,
  ArrowUpDown,
  Calendar,
  Filter,
} from "lucide-react";

/* ── Types ── */

interface ChangeItem {
  type: "new_model" | "price_change" | "model_removed";
  modelId: string;
  modelName: string;
  provider: string;
  description: string;
  input?: number;
  output?: number;
  context?: string;
  oldInput?: number;
  newInput?: number;
  oldOutput?: number;
  newOutput?: number;
}

interface ChangelogDay {
  date: string;
  items: ChangeItem[];
}

type FilterType = "all" | "new_model" | "price_change" | "model_removed";

/* ── Helpers ── */

function formatPrice(val: number | undefined): string {
  if (val === undefined || val === null) return "—";
  return `$${val.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

function getDaysAgo(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  const diff = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  if (diff < 7) return `${diff}일 전`;
  if (diff < 30) return `${Math.floor(diff / 7)}주 전`;
  return `${Math.floor(diff / 30)}개월 전`;
}

/* ── Config ── */

const TYPE_CONFIG: Record<
  string,
  {
    icon: typeof PlusCircle;
    label: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  new_model: {
    icon: PlusCircle,
    label: "새 모델",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  price_change: {
    icon: DollarSign,
    label: "가격 변동",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
  },
  model_removed: {
    icon: MinusCircle,
    label: "모델 제거",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
  },
};

/* ── Components ── */

function PriceChangeDetail({ item }: { item: ChangeItem }) {
  const inputDown =
    item.oldInput !== undefined &&
    item.newInput !== undefined &&
    item.newInput < item.oldInput;
  const outputDown =
    item.oldOutput !== undefined &&
    item.newOutput !== undefined &&
    item.newOutput < item.oldOutput;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
      {item.oldInput !== undefined && item.newInput !== undefined && (
        <span>
          입력: {formatPrice(item.oldInput)} →{" "}
          <span
            className={
              inputDown
                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-red-600 dark:text-red-400 font-medium"
            }
          >
            {formatPrice(item.newInput)}
          </span>
        </span>
      )}
      {item.oldOutput !== undefined && item.newOutput !== undefined && (
        <span>
          출력: {formatPrice(item.oldOutput)} →{" "}
          <span
            className={
              outputDown
                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-red-600 dark:text-red-400 font-medium"
            }
          >
            {formatPrice(item.newOutput)}
          </span>
        </span>
      )}
    </div>
  );
}

function NewModelDetail({ item }: { item: ChangeItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
      {item.input !== undefined && <span>입력: {formatPrice(item.input)}</span>}
      {item.output !== undefined && (
        <span>출력: {formatPrice(item.output)}</span>
      )}
      {item.context && <span>컨텍스트: {item.context}</span>}
    </div>
  );
}

function ChangeItemCard({ item }: { item: ChangeItem }) {
  const config = TYPE_CONFIG[item.type];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${config.border} ${config.bg} transition-colors`}
    >
      <div className={`mt-0.5 ${config.color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/explore/compare?model=${encodeURIComponent(item.modelId)}`}
            className="font-semibold text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            {item.modelName}
          </Link>
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${config.color} ${config.bg}`}
          >
            {config.label}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {item.provider}
          </span>
        </div>
        {item.type === "price_change" && <PriceChangeDetail item={item} />}
        {item.type === "new_model" && <NewModelDetail item={item} />}
      </div>
    </div>
  );
}

/* ── Page ── */

export default function Changelog() {
  const [changelog, setChangelog] = useState<ChangelogDay[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/changelog.json")
      .then((r) => r.json())
      .then((data: ChangelogDay[]) => {
        setChangelog(data);
        setLoading(false);
      })
      .catch(() => {
        setChangelog([]);
        setLoading(false);
      });
  }, []);

  // Apply filter
  const filtered: ChangelogDay[] = changelog
    .map((day) => ({
      ...day,
      items:
        filter === "all"
          ? day.items
          : day.items.filter((i) => i.type === filter),
    }))
    .filter((day) => day.items.length > 0);

  // Stats
  const totalCounts = changelog.reduce(
    (acc, day) => {
      for (const item of day.items) {
        acc[item.type] = (acc[item.type] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const filterButtons: { key: FilterType; label: string; icon: typeof Filter }[] = [
    { key: "all", label: "전체", icon: ArrowUpDown },
    {
      key: "new_model",
      label: `새 모델 (${totalCounts["new_model"] || 0})`,
      icon: PlusCircle,
    },
    {
      key: "price_change",
      label: `가격 변동 (${totalCounts["price_change"] || 0})`,
      icon: DollarSign,
    },
    {
      key: "model_removed",
      label: `제거 (${totalCounts["model_removed"] || 0})`,
      icon: MinusCircle,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-brand-500" size={24} />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            변경 이력
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          AI 모델의 추가, 가격 변동, 제거 내역을 최신순으로 확인하세요.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filterButtons.map((btn) => {
          const isActive = filter === btn.key;
          return (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <btn.icon size={14} />
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="mx-auto mb-4 text-slate-300 dark:text-slate-600" size={48} />
          <p className="text-slate-400 dark:text-slate-500 text-lg font-medium">
            변경 이력이 없습니다
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            데이터 수집 시 자동으로 감지됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((day) => (
            <div key={day.date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/50">
                  <Calendar
                    className="text-brand-500 dark:text-brand-400"
                    size={18}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(day.date)}
                  </h2>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {getDaysAgo(day.date)} · {day.items.length}개 변경
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="ml-5 pl-5 border-l-2 border-slate-200 dark:border-slate-700 space-y-3">
                {day.items.map((item, idx) => (
                  <ChangeItemCard key={`${item.modelId}-${idx}`} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
