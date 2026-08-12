import { Wallet } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2 text-gray-900">
            <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Wallet className="size-4" />
            </span>
            <span className="font-semibold">Kasbon</span>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
