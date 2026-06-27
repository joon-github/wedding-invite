import localFont from "next/font/local";

export const handFont = localFont({
  src: "../app/fonts/MaruBuri-Regular.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-hand",
  fallback: ["Apple SD Gothic Neo", "sans-serif"],
});
