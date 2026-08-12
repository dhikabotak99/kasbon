import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";
import type { DebtSummary } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/format";

interface SummaryCardsProps {
  summary: DebtSummary | null;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  if (!summary) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  const netIsPositive = summary.net >= 0;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center gap-1.5 text-gray-500">
          <ArrowDownLeft className="size-4 text-emerald-600" />
          <span className="text-xs font-medium">Total dihutang ke saya</span>
        </div>
        <p className="mt-2 text-lg font-semibold text-gray-900">
          {formatRupiah(summary.totalOwedToMe)}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center gap-1.5 text-gray-500">
          <ArrowUpRight className="size-4 text-red-500" />
          <span className="text-xs font-medium">Total saya hutang</span>
        </div>
        <p className="mt-2 text-lg font-semibold text-gray-900">
          {formatRupiah(summary.totalIOwe)}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Scale className="size-4 text-indigo-600" />
          <span className="text-xs font-medium">Net</span>
        </div>
        <p
          className={`mt-2 text-lg font-semibold ${netIsPositive ? "text-emerald-600" : "text-red-600"
            }`}
        >
          {formatRupiah(summary.net)}
        </p>
      </div>
    </div>
  );
}
