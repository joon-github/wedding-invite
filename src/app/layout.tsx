import type { Metadata } from "next";
import { PhoneFrame } from "@/components/phone-frame";
import { THEME_STYLE } from "@/lib/design-tokens";
import type { CSSProperties } from "react";
import "./globals.scss";

export const metadata: Metadata = {
  title: "편범준 · 유정아 결혼합니다",
  description: "2026년 10월 4일 오후 5시, 리움 하우스웨딩",
  openGraph: {
    title: "편범준 · 유정아 결혼합니다",
    description: "2026년 10월 4일 오후 5시, 리움 하우스웨딩",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={THEME_STYLE as CSSProperties}>
      <body>
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}
