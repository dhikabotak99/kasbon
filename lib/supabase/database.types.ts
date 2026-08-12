import type { DebtType } from "@/lib/types";

export type DebtsRow = {
  id: string;
  user_id: string;
  type: DebtType;
  counterpart_name: string;
  amount: number;
  note: string | null;
  due_date: string | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DebtsInsert = {
  user_id: string;
  type: DebtType;
  counterpart_name: string;
  amount: number;
  note?: string | null;
  due_date?: string | null;
};

export type DebtsUpdate = {
  type?: DebtType;
  counterpart_name?: string;
  amount?: number;
  note?: string | null;
  due_date?: string | null;
  settled_at?: string | null;
};

export type Database = {
  public: {
    Tables: {
      debts: {
        Row: DebtsRow;
        Insert: DebtsInsert;
        Update: DebtsUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      get_debt_summary: {
        Args: { [_ in never]: never };
        Returns: Record<string, unknown>;
      };
    };
    Enums: {
      debt_type: DebtType;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
