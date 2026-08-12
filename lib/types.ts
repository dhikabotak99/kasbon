export const DEBT_TYPES = ["owed_to_me", "i_owe"] as const;

export type DebtType = (typeof DEBT_TYPES)[number];

export interface Debt {
  id: string;
  type: DebtType;
  counterpart_name: string;
  amount: number;
  note: string | null;
  due_date: string | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DebtSummary {
  totalOwedToMe: number;
  totalIOwe: number;
  net: number;
}

export interface GetDebtsResponse {
  data: Debt[];
  summary: DebtSummary;
}

export const DEBT_TYPE_LABELS: Record<DebtType, string> = {
  owed_to_me: "Saya dihutang",
  i_owe: "Saya hutang",
};

export type StatusFilter = "all" | "unsettled" | "settled";
export type TypeFilter = "all" | DebtType;
