import type { StatusFilter, TypeFilter } from "@/lib/types";

interface DebtFiltersProps {
  status: StatusFilter;
  type: TypeFilter;
  onStatusChange: (status: StatusFilter) => void;
  onTypeChange: (type: TypeFilter) => void;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "unsettled", label: "Belum lunas" },
  { value: "settled", label: "Lunas" },
];

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "owed_to_me", label: "Saya dihutang" },
  { value: "i_owe", label: "Saya hutang" },
];

export function DebtFilters({
  status,
  type,
  onStatusChange,
  onTypeChange,
}: DebtFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-2 focus:outline-offset-1 focus:outline-indigo-600"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          Tipe
        </label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-2 focus:outline-offset-1 focus:outline-indigo-600"
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
