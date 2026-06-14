"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { HandwritingText } from "./handwriting-text";
import styles from "./hero-envelope.module.scss";

type HeroEnvelopeProps = {
  imageSrc: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function HeroEnvelope({ imageSrc }: HeroEnvelopeProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const photoProgress = clamp((progress - 0.38) / 0.62, 0, 1);
  const photoHidden = progress < 0.03 && photoProgress < 0.03;

  useEffect(() => {
    let frame = 0;
    let snapTimer = 0;
    let touchStartY = 0;
    let snapping = false;

    const update = () => {
      frame = 0;
      const hero = shellRef.current?.closest("section");
      const heroTop = hero instanceof HTMLElement ? hero.offsetTop : 0;
      const scrollRange = clamp(window.innerHeight * 0.22, 140, 190);
      const scrollOffset = window.scrollY - heroTop;

      setProgress(clamp(scrollOffset / scrollRange, 0, 1));
    };

    const snapHero = (direction: "open" | "close") => {
      if (snapping) {
        return;
      }

      const hero = shellRef.current?.closest("section");
      const heroTop = hero instanceof HTMLElement ? hero.offsetTop : 0;
      const scrollRange = clamp(window.innerHeight * 0.22, 140, 190);
      const target = direction === "open" ? heroTop + scrollRange : heroTop;

      snapping = true;
      window.clearTimeout(snapTimer);
      window.scrollTo({ top: target, behavior: "smooth" });
      snapTimer = window.setTimeout(() => {
        snapping = false;
      }, 520);
    };

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    const onWheel = (event: WheelEvent) => {
      const hero = shellRef.current?.closest("section");
      const heroTop = hero instanceof HTMLElement ? hero.offsetTop : 0;
      const scrollRange = clamp(window.innerHeight * 0.22, 140, 190);
      const offset = window.scrollY - heroTop;

      if (event.deltaY > 0 && offset >= -2 && offset < scrollRange * 0.75) {
        event.preventDefault();
        snapHero("open");
      } else if (event.deltaY < 0 && offset > 0 && offset <= scrollRange * 1.15) {
        event.preventDefault();
        snapHero("close");
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - currentY;
      const hero = shellRef.current?.closest("section");
      const heroTop = hero instanceof HTMLElement ? hero.offsetTop : 0;
      const scrollRange = clamp(window.innerHeight * 0.22, 140, 190);
      const offset = window.scrollY - heroTop;

      if (deltaY > 12 && offset >= -2 && offset < scrollRange * 0.75) {
        event.preventDefault();
        snapHero("open");
        touchStartY = currentY;
      } else if (deltaY < -12 && offset > 0 && offset <= scrollRange * 1.15) {
        event.preventDefault();
        snapHero("close");
        touchStartY = currentY;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.clearTimeout(snapTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const style = useMemo(
    () => {
      const photoClosedY = 92;
      const photoOpenY = -12;
      const photoY = photoOpenY + (1 - photoProgress) * (photoClosedY - photoOpenY);

      return ({
        "--hero-envelope-progress": progress.toFixed(4),
        "--hero-envelope-flap-rotation": `${progress * 180}deg`,
        "--hero-envelope-photo-y": `${photoY}%`,
        "--hero-envelope-photo-rotation": `${(1 - photoProgress) * -0.35}deg`,
        "--hero-envelope-photo-opacity": photoHidden ? "0" : "1",
        "--hero-envelope-photo-progress": photoProgress.toFixed(4),
      }) as React.CSSProperties;
    },
    [photoHidden, photoProgress, progress],
  );

  return (
    <div ref={shellRef} className={styles.shell} style={style}>
      <div className={styles.typography}>
        <HandwritingText />
      </div>

      <div className={styles.stage}>
        <svg
          className={styles.envelopeBase}
          viewBox="0 0 336 203"
          aria-hidden="true"
        >
          <rect
            className={styles.layerFill}
            x="15.19"
            y="15.12"
            width="305.12"
            height="172.78"
          />
        </svg>

        <svg
          className={styles.envelopeInterior}
          viewBox="0 0 337 204"
          aria-hidden="true"
        >
          <path
            className={styles.layerFill}
            d="M16 15 H321 V188 H16 Z"
          />
        </svg>

        <div className={styles.photoTrack}>
          <div className={styles.photoCard}>
            <Image
              src={imageSrc}
              alt=""
              width={4672}
              height={7008}
              priority
              unoptimized
              sizes="(max-width: 480px) calc(100vw - 48px), 248px"
              className={styles.photoImage}
            />
          </div>
        </div>

        <div
          className={styles.envelopeFlap}
          data-behind={progress >= 0.5}
          aria-hidden="true"
        >
          <svg viewBox="0 0 337 204">
            <path
              className={styles.layerFill}
              d="M16 15 H321 L180 104 Q168.5 112 157 104 Z"
            />
          </svg>
        </div>

        <svg
          className={styles.envelopeLeft}
          viewBox="0 0 337 204"
          aria-hidden="true"
        >
          <path
            className={styles.layerFill}
            d="M15.95,15.4c7.32,1.46,16.37,2.43,23.27,4.86,6.89,2.43,14.65,6.32,21.54,10.21,6.89,3.89,71.52,45.2,76.26,48.12,4.74,2.92,11.45,6.56,11.45,14.1s-1.54,11.9-9.3,17.49c-7.76,5.59-74.54,60.27-84.45,64.88-9.91,4.62-14.22,6.08-19.39,7.78-5.17,1.7-19.39,5.35-19.39,5.35V15.4Z"
          />
        </svg>

        <svg
          className={styles.envelopeRight}
          viewBox="0 0 337 204"
          aria-hidden="true"
        >
          <path
            className={styles.layerFill}
            d="M321.5,15.4c-7.32,1.46-16.37,2.43-23.27,4.86-6.89,2.43-14.65,6.32-21.54,10.21-6.89,3.89-71.52,45.2-76.26,48.12-4.74,2.92-11.45,6.56-11.45,14.1,0,7.53,1.54,11.9,9.3,17.49,7.76,5.59,74.54,60.27,84.45,64.88,9.91,4.62,14.22,6.08,19.39,7.78,5.17,1.7,19.39,5.35,19.39,5.35V15.4Z"
          />
        </svg>

        <svg
          className={styles.envelopeBottom}
          viewBox="0 0 337 204"
          aria-hidden="true"
        >
          <path
            className={styles.layerFill}
            d="M16.01,188.18s2.62-10.79,5.24-14.07c2.62-3.28,10.04-9.62,14.4-12.67,4.36-3.05,85.97-63.81,88.15-65.92s6.98-4.46,11.78-4.46h33.17s28.37,0,33.17,0,9.6,2.35,11.78,4.46c2.18,2.11,83.79,62.87,88.15,65.92s11.78,9.38,14.4,12.67c2.62,3.28,5.24,14.07,5.24,14.07H16.01Z"
          />
        </svg>

      </div>
    </div>
  );
}
