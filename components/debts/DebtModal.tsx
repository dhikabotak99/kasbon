"use client";

import type { Debt } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { DebtForm } from "@/components/debts/DebtForm";

interface DebtModalProps {
  open: boolean;
  mode: "create" | "edit";
  debt: Debt | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: {
    type: Debt["type"];
    counterpart_name: string;
    amount: number;
    note: string;
    due_date: string;
  }) => void;
}

export function DebtModal({
  open,
  mode,
  debt,
  submitting,
  error,
  onClose,
  onSubmit,
}: DebtModalProps) {
  return (
    <Modal
      open={open}
      title={mode === "create" ? "Catat baru" : "Edit catatan"}
      onClose={onClose}
    >
      <DebtForm
        initial={mode === "edit" ? debt ?? undefined : undefined}
        submitting={submitting}
        error={error}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
