"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./hero-envelope.module.scss";

type HeroEnvelopeProps = {
  imageSrc: string;
};

const MAX_SCROLL = 220;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function HeroEnvelope({ imageSrc }: HeroEnvelopeProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setProgress(clamp(window.scrollY / MAX_SCROLL, 0, 1));
    };

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const style = useMemo(
    () =>
      ({
        "--hero-envelope-progress": progress.toFixed(4),
      }) as React.CSSProperties,
    [progress],
  );

  return (
    <div className={styles.shell} style={style}>
      <div className={styles.stage}>
        <div className={styles.photoCard}>
          <Image
            src={imageSrc}
            alt=""
            width={4672}
            height={7008}
            priority
            unoptimized
            sizes="(max-width: 480px) 70vw, 320px"
            className={styles.photoImage}
          />
        </div>

        <div className={styles.backPocket} aria-hidden />
        <div className={styles.flap} aria-hidden />
        <div className={styles.frontPocket} aria-hidden />
      </div>
    </div>
  );
}
