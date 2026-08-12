import { ReceiptText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <ReceiptText className="size-6" />
      </span>
      <div>
        <p className="font-medium text-gray-900">Belum ada catatan kasbon.</p>
        <p className="mt-1 text-sm text-gray-500">
          Mulai catat utang-piutang kamu biar nggak lupa.
        </p>
      </div>
    </div>
  );
}
