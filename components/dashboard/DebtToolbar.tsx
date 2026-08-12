"use client";

import { ArrowDownWideNarrow, Search } from "lucide-react";
import type { SortKey, SortOrder } from "@/lib/types";

interface DebtToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortKeyChange: (key: SortKey) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

export function DebtToolbar({
  search,
  onSearchChange,
  sortKey,
  sortOrder,
  onSortKeyChange,
  onSortOrderChange,
}: DebtToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-1 focus:outline-indigo-600"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-2 focus:outline-offset-1 focus:outline-indigo-600"
        >
          <option value="created_at">Tanggal</option>
          <option value="amount">Jumlah</option>
        </select>
        <button
          type="button"
          onClick={() =>
            onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
          }
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
          title={sortOrder === "asc" ? "Urutan naik" : "Urutan turun"}
        >
          <ArrowDownWideNarrow className="size-4" />
          <span className="hidden sm:inline">
            {sortOrder === "asc" ? "Naik" : "Turun"}
          </span>
        </button>
      </div>
    </div>
  );
}
