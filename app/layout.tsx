import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "리프트로그",
  description: "12주 축분할 트레이닝 트래커",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen antialiased`}>
        <main className="max-w-md mx-auto min-h-screen pb-24">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
