import { DEBT_TYPES, type DebtType } from "@/lib/types";

export interface CreateDebtInput {
  type: DebtType;
  counterpart_name: string;
  amount: number;
  note: string | null;
  due_date: string | null;
}

export interface UpdateDebtInput extends Partial<CreateDebtInput> {
  settled?: boolean;
}

export interface ValidationResult<T> {
  success: true;
  data: T;
}

export interface ValidationError {
  success: false;
  errors: Record<string, string>;
}

export type Validation<T> = ValidationResult<T> | ValidationError;

const MAX_NOTE_LENGTH = 200;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isDebtType(value: unknown): value is DebtType {
  return (
    typeof value === "string" && (DEBT_TYPES as readonly string[]).includes(value)
  );
}

export function validateCreateDebt(input: unknown): Validation<CreateDebtInput> {
  if (typeof input !== "object" || input === null) {
    return { success: false, errors: { _form: "Data tidak valid." } };
  }

  const body = input as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const type = body.type;
  if (!isDebtType(type)) {
    errors.type = "Tipe transaksi tidak valid.";
  }

  const counterpart_name = body.counterpart_name;
  if (
    typeof counterpart_name !== "string" ||
    counterpart_name.trim().length === 0
  ) {
    errors.counterpart_name = "Nama orang wajib diisi.";
  } else if (counterpart_name.trim().length > 100) {
    errors.counterpart_name = "Nama orang maksimal 100 karakter.";
  }

  const amount = body.amount;
  if (typeof amount !== "number" || !Number.isInteger(amount)) {
    errors.amount = "Jumlah harus berupa angka bulat.";
  } else if (amount <= 0) {
    errors.amount = "Jumlah harus lebih besar dari 0.";
  }

  const note = body.note;
  if (note !== undefined && note !== null && typeof note !== "string") {
    errors.note = "Catatan harus berupa teks.";
  } else if (
    typeof note === "string" &&
    note.trim().length > MAX_NOTE_LENGTH
  ) {
    errors.note = `Catatan maksimal ${MAX_NOTE_LENGTH} karakter.`;
  }

  const due_date = body.due_date;
  if (due_date !== undefined && due_date !== null && due_date !== "") {
    if (typeof due_date !== "string" || !DATE_PATTERN.test(due_date)) {
      errors.due_date = "Tanggal tidak valid.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      type: type as DebtType,
      counterpart_name: (counterpart_name as string).trim(),
      amount: amount as number,
      note:
        typeof note === "string" && note.trim() !== "" ? note.trim() : null,
      due_date:
        typeof due_date === "string" && due_date !== "" ? due_date : null,
    },
  };
}

export function validateUpdateDebt(input: unknown): Validation<UpdateDebtInput> {
  if (typeof input !== "object" || input === null) {
    return { success: false, errors: { _form: "Data tidak valid." } };
  }

  const body = input as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const update: UpdateDebtInput = {};

  if (body.type !== undefined) {
    if (!isDebtType(body.type)) {
      errors.type = "Tipe transaksi tidak valid.";
    } else {
      update.type = body.type;
    }
  }

  if (body.counterpart_name !== undefined) {
    if (
      typeof body.counterpart_name !== "string" ||
      body.counterpart_name.trim().length === 0
    ) {
      errors.counterpart_name = "Nama orang wajib diisi.";
    } else if (body.counterpart_name.trim().length > 100) {
      errors.counterpart_name = "Nama orang maksimal 100 karakter.";
    } else {
      update.counterpart_name = body.counterpart_name.trim();
    }
  }

  if (body.amount !== undefined) {
    if (typeof body.amount !== "number" || !Number.isInteger(body.amount)) {
      errors.amount = "Jumlah harus berupa angka bulat.";
    } else if (body.amount <= 0) {
      errors.amount = "Jumlah harus lebih besar dari 0.";
    } else {
      update.amount = body.amount;
    }
  }

  if (body.note !== undefined) {
    if (body.note !== null && typeof body.note !== "string") {
      errors.note = "Catatan harus berupa teks.";
    } else if (
      typeof body.note === "string" &&
      body.note.trim().length > MAX_NOTE_LENGTH
    ) {
      errors.note = `Catatan maksimal ${MAX_NOTE_LENGTH} karakter.`;
    } else {
      update.note =
        typeof body.note === "string" && body.note.trim() !== ""
          ? body.note.trim()
          : null;
    }
  }

  if (body.due_date !== undefined) {
    if (
      body.due_date !== null &&
      (typeof body.due_date !== "string" || !DATE_PATTERN.test(body.due_date))
    ) {
      errors.due_date = "Tanggal tidak valid.";
    } else {
      update.due_date =
        typeof body.due_date === "string" && body.due_date !== ""
          ? body.due_date
          : null;
    }
  }

  if (body.settled !== undefined) {
    if (typeof body.settled !== "boolean") {
      errors.settled = "Status lunas tidak valid.";
    } else {
      update.settled = body.settled;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  if (Object.keys(update).length === 0) {
    return {
      success: false,
      errors: { _form: "Tidak ada field yang dikirim untuk diubah." },
    };
  }

  return { success: true, data: update };
}
