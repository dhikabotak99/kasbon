"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Debt,
  DebtSummary,
  GetDebtsResponse,
  SortKey,
  SortOrder,
  StatusFilter,
  TypeFilter,
} from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DebtFilters } from "@/components/dashboard/DebtFilters";
import { DebtToolbar } from "@/components/dashboard/DebtToolbar";
import { DebtChart } from "@/components/dashboard/DebtChart";
import { DebtItem } from "@/components/dashboard/DebtItem";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DebtModal } from "@/components/debts/DebtModal";
import { DeleteDebtDialog } from "@/components/debts/DeleteDebtDialog";

export function DashboardView() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [summary, setSummary] = useState<DebtSummary | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deletingDebt, setDeletingDebt] = useState<Debt | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);

  const loadDebts = useCallback(async (statusParam: StatusFilter, typeParam: TypeFilter) => {
    const params = new URLSearchParams();
    if (statusParam !== "all") params.set("status", statusParam);
    if (typeParam !== "all") params.set("type", typeParam);

    const res = await fetch(`/api/debts${params.toString() ? `?${params}` : ""}`);
    const json = (await res.json()) as GetDebtsResponse & { error?: string };

    if (!res.ok) {
      throw new Error(json.error ?? "Gagal mengambil data kasbon.");
    }

    return json;
  }, []);

  const fetchDebts = useCallback(async () => {
    try {
      const json = await loadDebts(status, type);
      setError(null);
      setDebts(json.data);
      setSummary(json.summary);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data kasbon. Coba lagi beberapa saat."
      );
    }
  }, [loadDebts, status, type]);

  useEffect(() => {
    let cancelled = false;

    loadDebts(status, type)
      .then((json) => {
        if (!cancelled) {
          setError(null);
          setDebts(json.data);
          setSummary(json.summary);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data kasbon. Coba lagi beberapa saat."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadDebts, status, type]);

  const visibleDebts = useMemo(() => {
    const term = search.trim().toLowerCase();

    let filtered = debts;
    if (term) {
      filtered = filtered.filter((debt) =>
        debt.counterpart_name.toLowerCase().includes(term)
      );
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortKey === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      const diff =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortOrder === "asc" ? diff : -diff;
    });

    return sorted;
  }, [debts, search, sortKey, sortOrder]);

  async function openCreate() {
    setModalMode("create");
    setEditingDebt(null);
    setSubmitError(null);
    setModalOpen(true);
  }

  async function openEdit(debt: Debt) {
    setModalMode("edit");
    setEditingDebt(debt);
    setSubmitError(null);
    setModalOpen(true);
  }

  async function handleSubmit(values: {
    type: Debt["type"];
    counterpart_name: string;
    amount: number;
    note: string;
    due_date: string;
  }) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const isEdit = modalMode === "edit" && editingDebt;
      const url = isEdit ? `/api/debts/${editingDebt.id}` : "/api/debts";
      const method = isEdit ? "PATCH" : "POST";

      const body: Record<string, unknown> = {
        type: values.type,
        counterpart_name: values.counterpart_name,
        amount: values.amount,
        note: values.note,
        due_date: values.due_date,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(json.error ?? "Gagal menyimpan catatan kasbon.");
      }

      setModalOpen(false);
      fetchDebts();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal menyimpan catatan kasbon."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkSettled(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/debts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settled: true }),
      });
      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(json.error ?? "Gagal menandai lunas.");
      }

      fetchDebts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menandai lunas."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deletingDebt) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/debts/${deletingDebt.id}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(json.error ?? "Gagal menghapus catatan kasbon.");
      }

      setDeletingDebt(null);
      fetchDebts();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Gagal menghapus catatan kasbon."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Catatan Kasbon
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Kelola utang-piutang kamu di satu tempat.
          </p>
        </div>
        <Button
          onClick={openCreate}
          size="sm"
          className="w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Catat baru
        </Button>
      </div>

      <SummaryCards summary={summary} />

      {summary && <DebtChart summary={summary} />}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_2.5fr] lg:items-end lg:gap-4">
        <DebtFilters
          status={status}
          type={type}
          onStatusChange={setStatus}
          onTypeChange={setType}
        />
        <DebtToolbar
          search={search}
          onSearchChange={setSearch}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortKeyChange={setSortKey}
          onSortOrderChange={setSortOrder}
        />
      </div>

      {error && !loading && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : visibleDebts.length === 0 ? (
        debts.length === 0 ? (
          <EmptyState />
        ) : (
          <p className="rounded-lg bg-gray-100 px-3 py-2 text-center text-sm text-gray-500">
            Nggak ada catatan yang cocok sama pencarian.
          </p>
        )
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleDebts.map((debt) => (
            <DebtItem
              key={debt.id}
              debt={debt}
              busy={busyId === debt.id ? "settled" : null}
              onMarkSettled={handleMarkSettled}
              onEdit={openEdit}
              onDelete={setDeletingDebt}
            />
          ))}
        </ul>
      )}

      <DebtModal
        open={modalOpen}
        mode={modalMode}
        debt={editingDebt}
        submitting={submitting}
        error={submitError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteDebtDialog
        debt={deletingDebt}
        deleting={deleting}
        error={deleteError}
        onClose={() => setDeletingDebt(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
