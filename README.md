# Kasbon

Aplikasi web sederhana untuk mencatat dan mengelola **utang-piutang pribadi** dalam Rupiah.

> **Kasbon** dalam bahasa Indonesia sehari-hari berarti "gaji/uang yang diambil lebih dulu" — di sini dipakai sebagai istilah untuk utang-piutang antar orang.

## Project Overview

Kasbon membantu kamu mencatat:

- Orang lain berhutang ke kamu (**Saya dihutang**).
- Kamu berhutang ke orang lain (**Saya hutang**).
- Menandai transaksi sebagai **lunas**, **mengedit**, dan **menghapus**.
- Melihat ringkasan total utang-piutang (`Net = Total dihutang − Total saya hutang`).

Seluruh data disimpan di **Supabase PostgreSQL** dengan **Row Level Security (RLS)**, sehingga setiap user hanya bisa mengakses data miliknya sendiri. Tidak ada mock data maupun hardcoded data.

## Features

**Core**

- 🔐 Autentikasi Supabase Auth (signup, login, logout) dan halaman yang terproteksi.
- 📊 3 summary cards: `Total dihutang ke saya`, `Total saya hutang`, dan `Net` (hijau/merah).
- 📝 CRUD lengkap untuk catatan utang-piutang.
- ✅ Tandai lunas yang **persistent** (`settled_at` di database, bukan hanya di client).
- 🗂️ Filter status (`Semua` / `Belum lunas` / `Lunas`) dan tipe (`Semua` / `Saya dihutang` / `Saya hutang`) via API.
- 🧮 Ringkasan dihitung di **database layer** (RPC), bukan sembarangan di UI.
- 💹 Format Rupiah Indonesia (`Rp 1.234.000`) dan relative date Bahasa Indonesia (`3 hari lalu`).
- 📱 Mobile-first, responsive di mobile/tablet/desktop.
- Empty state, loading state, dan error state dalam Bahasa Indonesia.

**Bonus**

- 🔍 Search berdasarkan nama orang.
- ↔️ Sorting berdasarkan jumlah dan tanggal (asc/desc).
- 📊 Bar chart perbandingan `Total dihutang` vs `Total saya hutang` (tanpa library eksternal, pakai CSS murni).

## Tech Stack

| Teknologi | Kegunaan | Alasan |
| --- | --- | --- |
| [Next.js 16](https://nextjs.org) (App Router) | Framework, API routes, SSR | Standar untuk jangka waktu pengembangan cepat dan deployment mudah |
| [TypeScript](https://www.typescriptlang.org) (strict) | Type safety di seluruh codebase | Mencegah bug sebelum runtime; optimal untuk demo/code review |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling | Utility-first, cepat, konsisten |
| [Supabase](https://supabase.com) | PostgreSQL + Auth + RLS | Postgres dengan autentikasi dan security bawaan (RLS) |
| [Lucide React](https://lucide.dev) | Icon | Ringan, konsisten, hanya SVG |

### Library tambahan

| Library | Alasan | Alternatif tanpa library |
| --- | --- | --- |
| `@supabase/ssr` | Client Supabase yang bekerja dengan cookies di Next.js App Router (auth + session) | SDK Supabase inti (`@supabase/supabase-js`) tanpa helper SSR, tapi harus urus cookie manual |
| `@supabase/supabase-js` | Client resmi Supabase untuk query dan auth | — (wajib untuk terhubung ke Supabase) |

Tidak ada library tambahan untuk formatting Rupiah atau relative date — keduanya dibuat dengan **API bawaan JavaScript** (`Intl.NumberFormat` dan util sederhana) agar minim dependency dan mudah dijelaskan.

## Setup

### 1. Clone repository

```bash
git clone <url-repository-kamu>
cd Kasbon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Siapkan environment variables

Buat file `.env.local` di root project (contoh ada di `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Cara mendapatkannya:

1. Buat project baru di [supabase.com](https://supabase.com) (free plan).
2. Buka **Project Settings → API**.
3. Salin **Project URL** ke `NEXT_PUBLIC_SUPABASE_URL`.
4. Salin **anon public key** ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

> ⚠️ Jangan pernah commit `.env.local`. Gunakan `anon` key (bukan service role key) — keamanan tetap dijaga oleh RLS di database.

### 4. Jalankan database migration

Migrasi SQL tersedia di `supabase/migrations/0001_create_debts.sql`. Jalankan dengan Supabase CLI:

```bash
# Login ke Supabase (sekali saja)
npx supabase login

# Hubungkan project lokal ke project Supabase kamu
npx supabase link --project-ref <project-ref>

# Jalankan semua migration
npx supabase db push
```

Atau tanpa CLI: buka **Supabase Dashboard → SQL Editor**, paste isi file `0001_create_debts.sql`, lalu jalankan.

## Local Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

- Langkah pertama: buat akun di [http://localhost:3000/signup](http://localhost:3000/signup).
- Lalu login di [http://localhost:3000/login](http://localhost:3000/login).

### Lint & build

```bash
npm run lint
npm run build
```

## Demo

LIVE_URL_PLACEHOLDER

(Deployment Vercel — isi dengan URL setelah `vercel deploy`.)

## Approach

**Poin teknis yang paling dibanggakan: membiarkan database yang menghitung.**

Ringkasan utang-piutang tidak dihitung manual/repetitif di client melainkan melalui function SQL `get_debt_summary()` dengan `security invoker`. Karena function ikut memfilter `where user_id = auth.uid()` dan RLS tetap aktif, siapa pun yang memanggilnya — dari Supabase REST API, SQL Editor, ataupun aplikasi — hanya akan mendapat angka milik dirinya sendiri. Ini membuat business logic (termasuk perhitungan `Net`) tinggal di satu tempat, konsisten, dan dijamin benar sejak dari database. Di sisi client hanya tinggal menampilkan hasilnya.

Selain itu, setiap field di-validasi **dua kali** (Zod-like validasi manual di server + validasi client) untuk memastikan tidak ada input aneh yang lolos, dan `user_id` selalu berasal dari sesi yang sedang login — tidak pernah dipercayai dari body request.

## Trade-off

> Kalau ada 1 hari lagi, apa yang akan kamu polish?

1. **Grouping per orang** — menampilkan "Budi (3 catatan, total Rp 2.500.000)" seperti requirement bonus `Grouping`.
2. **Pagination** — saat data sudah banyak, daftar debt sebaiknya di-paginate atau infinite scroll.
3. **Tampilkan debt yang sudah lunas lebih redup/dicoret** agar status lebih terasa visual.
4. **Testing otomatis** — integrasi test untuk RLS (user A tidak bisa akses data user B) dan unit test untuk util formatting.

## Time Spent

Estimasi pengerjaan end-to-end (setup → API → UI → bonus → dokumentasi): **± 12–14 jam** tersebar dalam beberapa sesi kerja.

- Foundation + Supabase setup: ±2 jam
- Auth: ±2 jam
- Schema + RLS + migration: ±2 jam
- CRUD API: ±3 jam
- Dashboard UI + formatting + states: ±3 jam
- Bonus (search, sort, chart): ±1,5 jam
- Dokumentasi & polish: ±1 jam

## Struktur Proyek

```text
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (dashboard)/page.tsx
└── api/debts/
    ├── route.ts          # GET (list + filter + summary), POST
    └── [id]/route.ts     # PATCH (edit + settled), DELETE

components/
├── auth/                 # LoginForm, SignupForm, LogoutButton
├── dashboard/            # SummaryCards, DebtList items, Filters, Chart, EmptyState
├── debts/                # DebtForm, DebtModal, DeleteDebtDialog, DebtStatusBadge
└── ui/                   # Button, Input, Modal

lib/
├── supabase/             # client.ts (browser), server.ts (server) , middleware.ts
├── validations/          # debt.ts (validasi create & update)
├── utils/                # api.ts (helper error), format.ts (Rupiah & relative date)
└── types.ts              # Debt, DebtSummary, filter/sort types

supabase/migrations/      # 0001_create_debts.sql (schema + RLS)
```