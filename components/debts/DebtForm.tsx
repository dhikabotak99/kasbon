"use client";

import { useState } from "react";
import type { Debt, DebtType } from "@/lib/types";
import { DEBT_TYPE_LABELS } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextArea, TextInput } from "@/components/ui/Input";

interface DebtFormProps {
  initial?: Debt;
  submitting: boolean;
  error: string | null;
  onSubmit: (values: {
    type: DebtType;
    counterpart_name: string;
    amount: number;
    note: string;
    due_date: string;
  }) => void;
}

export function DebtForm({ initial, submitting, error, onSubmit }: DebtFormProps) {
  const [type, setType] = useState<DebtType>(initial?.type ?? "owed_to_me");
  const [counterpartName, setCounterpartName] = useState(
    initial?.counterpart_name ?? ""
  );
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [dueDate, setDueDate] = useState(initial?.due_date ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!counterpartName.trim()) {
      errors.counterpart_name = "Nama orang wajib diisi.";
    }
    const amountValue = Number(amount);
    if (!amount || !Number.isInteger(amountValue) || amountValue <= 0) {
      errors.amount = "Jumlah harus angka bulat lebih dari 0.";
    }
    if (note.length > 200) {
      errors.note = "Catatan maksimal 200 karakter.";
    }
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      errors.due_date = "Format tanggal tidak valid.";
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onSubmit({
      type,
      counterpart_name: counterpartName.trim(),
      amount: amountValue,
      note: note.trim(),
      due_date: dueDate,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700">
          Tipe
        </span>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(DEBT_TYPE_LABELS) as DebtType[]).map((key) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                type === key
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={key}
                checked={type === key}
                onChange={() => setType(key)}
                className="sr-only"
              />
              {DEBT_TYPE_LABELS[key]}
            </label>
          ))}
        </div>
      </div>

      <TextInput
        label="Nama orang"
        name="counterpart_name"
        required
        placeholder="Contoh: Budi"
        value={counterpartName}
        onChange={(e) => setCounterpartName(e.target.value)}
        error={validationErrors.counterpart_name}
      />

      <TextInput
        label="Jumlah (Rp)"
        name="amount"
        type="number"
        min={1}
        step={1}
        required
        placeholder="Contoh: 1500000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={validationErrors.amount}
      />

      <TextInput
        label="Tanggal"
        name="due_date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        error={validationErrors.due_date}
      />

      <div>
        <TextArea
          label="Catatan (opsional)"
          name="note"
          rows={3}
          maxLength={200}
          placeholder="Contoh: Buat beli kulkas bareng"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          error={validationErrors.note}
        />
        <p className="mt-1 text-right text-xs text-gray-400">{note.length}/200</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" loading={submitting}>
          {initial ? "Simpan perubahan" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
