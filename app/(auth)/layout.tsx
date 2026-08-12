import { Wallet } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-10 sm:py-12">
      <div className="flex items-center gap-2 text-gray-900">
        <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Wallet className="size-5" />
        </span>
        <span className="text-xl font-semibold">Kasbon</span>
      </div>
      {children}
    </main>
  );
}
