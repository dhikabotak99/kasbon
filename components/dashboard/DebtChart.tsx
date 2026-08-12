import type { DebtSummary } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/format";

interface DebtChartProps {
  summary: DebtSummary;
}

export function DebtChart({ summary }: DebtChartProps) {
  const max = Math.max(summary.totalOwedToMe, summary.totalIOwe, 1);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Perbandingan utang-piutang
      </h3>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-500">Total dihutang</span>
            <span className="font-medium text-gray-700">
              {formatRupiah(summary.totalOwedToMe)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${(summary.totalOwedToMe / max) * 100}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-500">Total saya hutang</span>
            <span className="font-medium text-gray-700">
              {formatRupiah(summary.totalIOwe)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-red-500"
              style={{
                width: `${(summary.totalIOwe / max) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
