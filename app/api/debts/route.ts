import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/utils/api";
import { isDebtType, validateCreateDebt } from "@/lib/validations/debt";
import type { DebtSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Kamu belum login. Silakan login dulu.", 401);
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const rawType = searchParams.get("type");

  if (status && !["unsettled", "settled"].includes(status)) {
    return jsonError("Filter status tidak valid.", 400);
  }
  if (rawType && !["owed_to_me", "i_owe"].includes(rawType)) {
    return jsonError("Filter tipe tidak valid.", 400);
  }

  const type = isDebtType(rawType) ? rawType : undefined;

  let query = supabase
    .from("debts")
    .select("*")
    .order("created_at", { ascending: false });

  if (status === "unsettled") {
    query = query.is("settled_at", null);
  } else if (status === "settled") {
    query = query.not("settled_at", "is", null);
  }

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    return jsonError("Gagal mengambil data kasbon.", 500);
  }

  const { data: summaryData, error: summaryError } = await supabase.rpc(
    "get_debt_summary"
  );

  if (summaryError) {
    return jsonError("Gagal mengambil ringkasan kasbon.", 500);
  }

  const summaryObj = summaryData as {
    total_owed_to_me: number;
    total_i_owe: number;
  } | null;

  const totalOwedToMe = summaryObj?.total_owed_to_me ?? 0;
  const totalIOwe = summaryObj?.total_i_owe ?? 0;

  const summary: DebtSummary = {
    totalOwedToMe,
    totalIOwe,
    net: totalOwedToMe - totalIOwe,
  };

  return Response.json({ data, summary });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Kamu belum login. Silakan login dulu.", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Body request bukan JSON yang valid.", 400);
  }

  const result = validateCreateDebt(body);
  if (!result.success) {
    const firstError = Object.values(result.errors)[0];
    return jsonError(firstError, 400);
  }

  const { data, error } = await supabase
    .from("debts")
    .insert({
      user_id: user.id,
      type: result.data.type,
      counterpart_name: result.data.counterpart_name,
      amount: result.data.amount,
      note: result.data.note,
      due_date: result.data.due_date,
    })
    .select()
    .single();

  if (error) {
    return jsonError("Gagal menyimpan catatan kasbon.", 500);
  }

  return Response.json({ data }, { status: 201 });
}
