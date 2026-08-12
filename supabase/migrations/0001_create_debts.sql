-- Kasbon: tabel utama untuk mencatat utang-piutang.
-- amount disimpan sebagai bigint dalam Rupiah utuh (bukan decimal).

create type debt_type as enum ('owed_to_me', 'i_owe');

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type debt_type not null,
  counterpart_name text not null,
  amount bigint not null check (amount > 0),
  note text,
  due_date date,
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index agar query per user cepat.
create index if not exists debts_user_id_idx on public.debts (user_id);
create index if not exists debts_user_id_created_at_idx on public.debts (user_id, created_at desc);

-- Trigger untuk otomatis update updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_debts_updated_at on public.debts;
create trigger set_debts_updated_at
  before update on public.debts
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- RLS: user hanya bisa mengakses debt miliknya sendiri.
-- ============================================================
alter table public.debts enable row level security;

drop policy if exists "Users can view own debts" on public.debts;
create policy "Users can view own debts"
  on public.debts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own debts" on public.debts;
create policy "Users can insert own debts"
  on public.debts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own debts" on public.debts;
create policy "Users can update own debts"
  on public.debts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own debts" on public.debts;
create policy "Users can delete own debts"
  on public.debts for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Ringkasan utang-piutang.
-- Dihitung di database (bukan di client) agar Net konsisten.
-- security invoker => RLS tetap berlaku, hanya data milik user.
-- ============================================================
create or replace function public.get_debt_summary()
returns json
language sql
security invoker
stable
as $$
  select json_build_object(
    'total_owed_to_me',
    coalesce(sum(amount) filter (where type = 'owed_to_me' and settled_at is null), 0),
    'total_i_owe',
    coalesce(sum(amount) filter (where type = 'i_owe' and settled_at is null), 0)
  )
  from public.debts
  where user_id = auth.uid();
$$;
