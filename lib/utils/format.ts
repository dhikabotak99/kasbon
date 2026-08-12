export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeDate(date: string): string {
  const target = new Date(date);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diffDays = Math.round(
    (startOfToday.getTime() - startOfTarget.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1 && diffDays < 14) return "1 minggu lalu";

  if (diffDays < 30) {
    if (diffDays === 7) return "1 minggu lalu";
    return `${diffDays} hari lalu`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 bulan lalu";
  return `${diffMonths} bulan lalu`;
}
