import { Check, Loader2, Pencil, Trash2 } from "lucide-react";
import type { Debt } from "@/lib/types";
import { DEBT_TYPE_LABELS } from "@/lib/types";
import { formatRelativeDate, formatRupiah } from "@/lib/utils/format";
import { DebtStatusBadge } from "@/components/debts/DebtStatusBadge";

interface DebtItemProps {
  debt: Debt;
  busy?: "settled" | "delete" | null;
  onMarkSettled: (id: string) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
}

export function DebtItem({
  debt,
  busy = null,
  onMarkSettled,
  onEdit,
  onDelete,
}: DebtItemProps) {
  const settled = debt.settled_at !== null;
  const isIOwe = debt.type === "i_owe";

  return (
    <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-900">
              {debt.counterpart_name}
            </span>
            <DebtStatusBadge settled={settled} />
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {DEBT_TYPE_LABELS[debt.type]} · {formatRelativeDate(debt.created_at)}
          </p>
          {debt.note && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{debt.note}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p
            className={`text-base font-semibold whitespace-nowrap ${
              isIOwe ? "text-red-600" : "text-emerald-700"
            }`}
          >
            {isIOwe ? "-" : "+"} {formatRupiah(debt.amount)}
          </p>
          {debt.due_date && (
            <p className="mt-0.5 text-xs text-gray-400">
              Jatuh tempo {formatRelativeDate(debt.due_date)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {!settled && (
          <button
            type="button"
            onClick={() => onMarkSettled(debt.id)}
            disabled={busy === "settled"}
            className="inline-flex min-h-9 flex-1 basis-auto items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50 cursor-pointer sm:flex-none sm:py-1.5"
          >
            {busy === "settled" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            Tandai lunas
          </button>
        )}
        <button
          type="button"
          onClick={() => onEdit(debt)}
          className="inline-flex min-h-9 flex-1 basis-auto items-center justify-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer sm:flex-none sm:py-1.5"
        >
          <Pencil className="size-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(debt)}
          disabled={busy === "delete"}
          className="inline-flex min-h-9 flex-1 basis-auto items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 cursor-pointer sm:flex-none sm:py-1.5"
        >
          {busy === "delete" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          Hapus
        </button>
      </div>
    </li>
  );
}
