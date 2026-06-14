/**
 * 청첩장 UI 색·그림자·콘페티 — 한곳에서만 정의.
 * `layout.tsx`의 <html style>에 주입해 `var(--*)`로 전역 사용.
 */

export const ACCENT_RGB = [107, 114, 128] as const;

export function rgbaAccent(alpha: number): string {
  const [r, g, b] = ACCENT_RGB;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const colors = {
  background: "#ffffff",
  curtain: "#ffffff",
  foreground: "#111111",
  ink: "#111111",
  muted: "#6b7280",
  terra: "#4b5563",
  coral: "#4b5563",
  pink: "#4b5563",
  olive: "#111111",
  rose: "#f3f4f6",
  shell: "#ffffff",
  line: "#d1d5db",
  softPink: "#e5e7eb",
  paper: "#ffffff",
  paperDeep: "#f3f4f6",
  tape: "rgba(17, 24, 39, 0.08)",
  heroEnvelope: "#99c0e9",
  heroEnvelopeDeep: "#8ab2dc",
  heroEnvelopeLine: "#739cc6",
  sectionCta: "#111827",
  sectionCtaText: "#ffffff",
  heroInk: "#111111",
} as const;

/** D-day 콘페티 (design-tokens 색상과 톤 맞춤) */
export const confettiColors: readonly string[] = [
  "#111111",
  "#374151",
  "#6b7280",
  "#9ca3af",
  "#d1d5db",
  "#e5e7eb",
  "#f3f4f6",
  "#ffffff",
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
  "--hero-envelope": colors.heroEnvelope,
  "--hero-envelope-deep": colors.heroEnvelopeDeep,
  "--hero-envelope-line": colors.heroEnvelopeLine,
  "--section-badge-surface": "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
  "--section-badge-border": "rgb(209 213 219 / 0.9)",
  "--section-badge-shadow": "0 8px 30px rgb(17 24 39 / 0.06)",
  "--section-cta": colors.sectionCta,
  "--section-cta-text": colors.sectionCtaText,
  "--section-card-shadow": "0 14px 40px rgb(17 24 39 / 0.06)",
  "--hero-ink": colors.heroInk,
  "--hero-ink-mute": "rgb(107 114 128 / 0.92)",

  "--terra-8": rgbaAccent(0.08),
  "--terra-10": rgbaAccent(0.1),
  "--terra-32": rgbaAccent(0.32),
  "--terra-35": rgbaAccent(0.35),
  "--terra-40": rgbaAccent(0.4),
  "--terra-50": rgbaAccent(0.5),
};
