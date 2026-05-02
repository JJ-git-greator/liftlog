import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "리프트로그",
  description: "12주 축분할 트레이닝 트래커 — 매일 운동 스케줄 확인, 무게 기록, 영상 가이드",
  openGraph: {
    title: "리프트로그",
    description: "12주 축분할 트레이닝 트래커 — 매일 운동 스케줄 확인, 무게 기록, 영상 가이드",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "리프트로그" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "리프트로그",
    description: "12주 축분할 트레이닝 트래커",
    images: ["/og-image.png"],
  },
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
