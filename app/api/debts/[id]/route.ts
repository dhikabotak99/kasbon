import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/utils/api";
import { validateUpdateDebt } from "@/lib/validations/debt";
import type { DebtsUpdate } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/debts/[id]">
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Kamu belum login. Silakan login dulu.", 401);
  }

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Body request bukan JSON yang valid.", 400);
  }

  const result = validateUpdateDebt(body);
  if (!result.success) {
    const firstError = Object.values(result.errors)[0];
    return jsonError(firstError, 400);
  }

  const { data: existing, error: fetchError } = await supabase
    .from("debts")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return jsonError("Gagal mengambil data kasbon.", 500);
  }
  if (!existing) {
    return jsonError("Catatan kasbon tidak ditemukan.", 404);
  }

  const updates: DebtsUpdate = {};

  if (result.data.type !== undefined) updates.type = result.data.type;
  if (result.data.counterpart_name !== undefined)
    updates.counterpart_name = result.data.counterpart_name;
  if (result.data.amount !== undefined) updates.amount = result.data.amount;
  if (result.data.note !== undefined) updates.note = result.data.note;
  if (result.data.due_date !== undefined) updates.due_date = result.data.due_date;

  if (result.data.settled !== undefined) {
    updates.settled_at = result.data.settled ? new Date().toISOString() : null;
  }

  const { data, error } = await supabase
    .from("debts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return jsonError("Gagal memperbarui catatan kasbon.", 500);
  }

  return Response.json({ data });
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/debts/[id]">
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Kamu belum login. Silakan login dulu.", 401);
  }

  const { id } = await ctx.params;

  const { data: existing, error: fetchError } = await supabase
    .from("debts")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return jsonError("Gagal mengambil data kasbon.", 500);
  }
  if (!existing) {
    return jsonError("Catatan kasbon tidak ditemukan.", 404);
  }

  const { error } = await supabase.from("debts").delete().eq("id", id);

  if (error) {
    return jsonError("Gagal menghapus catatan kasbon.", 500);
  }

  return Response.json({ success: true });
}
