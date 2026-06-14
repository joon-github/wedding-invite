import { useId, type CSSProperties } from "react";
import {
  HERO_HANDWRITING_ARTWORK,
  type HandwritingMaskGroup,
} from "./handwriting-text.paths";
import {
  HERO_HANDWRITING_OUTLINES,
  type HandwritingOutline,
} from "./handwriting-text.outlines";
import styles from "./handwriting-text.module.scss";

export const HANDWRITING_ANIMATION = {
  startDelayMs: 220,
  strokeDelayMs: 55,
  drawDurationMs: 220,
  glyphSettleDurationMs: 100,
  eyebrowAdvanceMs: 70,
  titleAdvanceMs: 260,
  dateAdvanceMs: 70,
  lineGapMs: 100,
} as const;

type HandwritingArtwork = {
  ariaLabel: string;
  viewBox: string;
  groups: readonly HandwritingMaskGroup[];
};

type HandwritingTextProps = {
  artwork?: HandwritingArtwork;
  outlines?: readonly HandwritingOutline[];
  className?: string;
};

function getGroupAdvance(group: HandwritingMaskGroup) {
  if (group.line === "eyebrow") {
    return HANDWRITING_ANIMATION.eyebrowAdvanceMs;
  }

  if (group.line === "title") {
    return HANDWRITING_ANIMATION.titleAdvanceMs;
  }

  return HANDWRITING_ANIMATION.dateAdvanceMs;
}

function getGroupStartDelays(groups: readonly HandwritingMaskGroup[]) {
  return groups.reduce<number[]>((delays, group, groupIndex) => {
    if (groupIndex === 0) {
      return [HANDWRITING_ANIMATION.startDelayMs];
    }

    const previousGroup = groups[groupIndex - 1];
    const previousStartDelay =
      delays[groupIndex - 1] ?? HANDWRITING_ANIMATION.startDelayMs;
    const lineGap =
      previousGroup.line !== group.line
        ? HANDWRITING_ANIMATION.lineGapMs
        : 0;

    return [
      ...delays,
      previousStartDelay + getGroupAdvance(previousGroup) + lineGap,
    ];
  }, []);
}

export function HandwritingText({
  artwork = HERO_HANDWRITING_ARTWORK,
  outlines = HERO_HANDWRITING_OUTLINES.paths,
  className = "",
}: HandwritingTextProps) {
  const maskIdPrefix = `handwriting-mask-${useId().replaceAll(":", "")}`;
  const rootStyle = {
    "--handwriting-draw-duration": `${HANDWRITING_ANIMATION.drawDurationMs}ms`,
    "--handwriting-glyph-settle-duration": `${HANDWRITING_ANIMATION.glyphSettleDurationMs}ms`,
  } as CSSProperties;
  const groupStartDelays = getGroupStartDelays(artwork.groups);

  const preparedGroups = artwork.groups.flatMap((group, groupIndex) => {
    const outline = outlines[group.outlineIndex];
    const maskId = `${maskIdPrefix}-${group.outlineIndex}`;
    const groupStartDelay =
      groupStartDelays[groupIndex] ?? HANDWRITING_ANIMATION.startDelayMs;

    if (!outline) {
      return [];
    }

    const strokes = group.strokes.map((stroke, strokeIndex) => {
      const drawDelay =
        groupStartDelay +
        strokeIndex * HANDWRITING_ANIMATION.strokeDelayMs;

      return {
        ...stroke,
        key: `${group.outlineIndex}-${strokeIndex}-${stroke.d.slice(0, 12)}`,
        style: {
          "--handwriting-draw-delay": `${drawDelay}ms`,
          "--handwriting-reveal-width": stroke.revealWidth,
        } as CSSProperties,
      };
    });
    const settleDelay =
      groupStartDelay +
      Math.max(0, group.strokes.length - 1) *
        HANDWRITING_ANIMATION.strokeDelayMs +
      Math.round(HANDWRITING_ANIMATION.drawDurationMs * 0.72);

    return [{ maskId, outline, settleDelay, strokes }];
  });

  const maskDefinitions = preparedGroups.map(({ maskId, strokes }) => (
    <mask
      key={maskId}
      id={maskId}
      className={styles.writingMask}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="320"
      height="108"
    >
      {strokes.map((stroke) => (
        <path
          key={stroke.key}
          className={styles.maskPath}
          style={stroke.style}
          d={stroke.d}
          transform={stroke.transform}
          pathLength={1}
        />
      ))}
    </mask>
  ));

  const maskedGlyphs = preparedGroups.map(
    ({ maskId, outline, settleDelay }) => (
      <g key={maskId} aria-hidden="true">
        <g mask={`url(#${maskId})`}>
          <path
            className={styles.outlinePath}
            d={outline.d}
            transform={outline.transform}
          />
        </g>
        <path
          className={`${styles.outlinePath} ${styles.settledGlyph}`}
          style={
            {
              "--handwriting-glyph-settle-delay": `${settleDelay}ms`,
            } as CSSProperties
          }
          d={outline.d}
          transform={outline.transform}
        />
      </g>
    ),
  );

  return (
    <svg
      className={`${styles.root} ${className}`}
      style={rootStyle}
      viewBox={artwork.viewBox}
      role="img"
      aria-label={artwork.ariaLabel}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>{maskDefinitions}</defs>
      {maskedGlyphs}
    </svg>
  );
}
