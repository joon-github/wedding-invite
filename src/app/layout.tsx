import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "편범준 · 유정아 결혼합니다",
  description: "2026년 5월 2일 오전 11시, 웨딩피치 웨딩홀",
  openGraph: {
    title: "편범준 · 유정아 결혼합니다",
    description: "2026년 5월 2일 오전 11시, 웨딩피치 웨딩홀",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
