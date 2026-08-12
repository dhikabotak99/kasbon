"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password minimal 8 karakter ya.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password nggak sama.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (authError) {
      setError("Gagal daftar. Email mungkin sudah terpakai atau nggak valid.");
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setError(
        "Pendaftaran berhasil! Cek email kamu buat konfirmasi, terus baru bisa login."
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900">Daftar akun</h1>
      <p className="mt-1 text-sm text-gray-500">
        Gratis. Mulai catat utang-piutang kamu sekarang.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextInput
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextInput
          label="Konfirmasi password"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Daftar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Udah punya akun?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
