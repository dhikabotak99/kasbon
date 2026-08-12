"use client";

import type { Debt } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface DeleteDebtDialogProps {
  debt: Debt | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteDebtDialog({
  debt,
  deleting,
  error,
  onClose,
  onConfirm,
}: DeleteDebtDialogProps) {
  return (
    <Modal open={debt !== null} title="Hapus catatan?" onClose={onClose}>
      {debt && (
        <>
          <p className="text-sm text-gray-600">
            Yakin mau hapus catatan kasbon{" "}
            <span className="font-medium text-gray-900">
              {debt.counterpart_name}
            </span>{" "}
            sebesar{" "}
            <span className="font-medium text-gray-900">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(debt.amount)}
            </span>
            ? Tindakan ini nggak bisa dibatalkan.
          </p>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={deleting}>
              Batal
            </Button>
            <Button variant="danger" onClick={onConfirm} loading={deleting}>
              Hapus
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
