import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kasbon",
  description:
    "Catat dan kelola utang-piutang pribadi dengan mudah. Biar nggak lupa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-dvh bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
