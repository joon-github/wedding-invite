/**
 * 청첩장 UI 색·그림자·콘페티 — 한곳에서만 정의.
 * `layout.tsx`의 <html style>에 주입해 `var(--*)`로 전역 사용.
 */

export const TERRA_RGB = [154, 92, 92] as const;

export function rgbaTerra(alpha: number): string {
  const [r, g, b] = TERRA_RGB;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const colors = {
  background: "#f4f0e8",
  /** 봉투 커튼 등 아주 밝은 크림 */
  curtain: "#f9f7f4",
  foreground: "#1a1917",
  ink: "#181818",
  muted: "#6d6460",
  terra: "#9a5c5c",
  coral: "#9a5c5c",
  pink: "#9a5c5c",
  olive: "#181818",
  rose: "#e2d4ce",
  shell: "#f7f4ef",
  line: "#242424",
  softPink: "#e4d8d2",
  paper: "#f7f4ef",
  paperDeep: "#ece5dc",
  tape: "rgba(255, 212, 138, 0.38)",
  sectionCta: "#3d352c",
  sectionCtaText: "#fffcf6",
  heroInk: "#3d3a38",
} as const;

/** D-day 콘페티 (design-tokens 색상과 톤 맞춤) */
export const confettiColors: readonly string[] = [
  colors.terra,
  "#c4a69a",
  "#ffd48a",
  "#fff8f0",
  "#7d5c57",
  "#d4c4be",
  colors.rose,
  "#6b6e5a",
];

/**
 * <html>에 붙이는 CSS 커스텀 프로퍼티.
 * kebab-case 키 = --background 등 그대로.
 */
export const THEME_STYLE: Record<string, string> = {
  "--background": colors.background,
  /** 봉투·커튼용 (아주 밝은 크림) */
  "--curtain": colors.curtain,
  "--foreground": colors.foreground,
  "--ink": colors.ink,
  "--muted": colors.muted,
  "--terra": colors.terra,
  "--coral": colors.coral,
  "--pink": colors.pink,
  "--olive": colors.olive,
  "--rose": colors.rose,
  "--shell": colors.shell,
  "--line": colors.line,
  "--soft-pink": colors.softPink,
  "--paper": colors.paper,
  "--paper-deep": colors.paperDeep,
  "--tape": colors.tape,
  "--section-badge-surface": "linear-gradient(165deg, #fffef9 0%, #f2ebe3 100%)",
  "--section-badge-border": "rgb(100 80 60 / 0.18)",
  "--section-badge-shadow": "0 4px 24px rgb(45 32 20 / 0.08)",
  "--section-cta": colors.sectionCta,
  "--section-cta-text": colors.sectionCtaText,
  "--section-card-shadow": "0 18px 48px rgb(40 32 24 / 0.09)",
  "--hero-ink": colors.heroInk,
  "--hero-ink-mute": "rgb(61 58 56 / 0.7)",

  "--terra-8": rgbaTerra(0.08),
  "--terra-10": rgbaTerra(0.1),
  "--terra-32": rgbaTerra(0.32),
  "--terra-35": rgbaTerra(0.35),
  "--terra-40": rgbaTerra(0.4),
  "--terra-50": rgbaTerra(0.5),
};
