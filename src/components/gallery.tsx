"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./gallery.module.scss";

type GalleryProps = {
  images: readonly string[];
};

export function Gallery({ images }: GalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const visibleImages = expanded ? images : images.slice(0, 4);

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {visibleImages.map((src, index) => (
          <button
            type="button"
            key={src}
            className={styles.imageButton}
            aria-label={`갤러리 사진 ${index + 1}`}
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 480px) 50vw, 240px"
              className={styles.image}
              priority={index < 2}
            />
          </button>
        ))}
      </div>
      {images.length > 4 ? (
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "접기" : "더보기"}
        </button>
      ) : null}

      {lightboxIndex !== null ? (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  );
}

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: readonly string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(true);
  const dragRef = useRef({ startX: 0, currentX: 0, dragging: false });
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setAnimate(true);
      setCurrent(Math.max(0, Math.min(images.length - 1, index)));
    },
    [images.length],
  );

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" && current > 0) goTo(current - 1);
      if (e.key === "ArrowRight" && current < images.length - 1) goTo(current + 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, images.length, close, goTo]);

  function handlePointerDown(e: React.PointerEvent) {
    dragRef.current = { startX: e.clientX, currentX: e.clientX, dragging: true };
    setAnimate(false);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current.dragging) return;
    dragRef.current.currentX = e.clientX;
    const dx = e.clientX - dragRef.current.startX;
    setDragOffset(dx);
  }

  function handlePointerUp() {
    if (!dragRef.current.dragging) return;
    const dx = dragRef.current.currentX - dragRef.current.startX;
    dragRef.current.dragging = false;

    const threshold = 50;
    if (dx < -threshold && current < images.length - 1) {
      goTo(current + 1);
    } else if (dx > threshold && current > 0) {
      goTo(current - 1);
    } else {
      setAnimate(true);
    }
    setDragOffset(0);
  }

  const translateX = -(current * 100);
  const pxOffset = dragOffset;

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.overlayVisible : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="갤러리"
    >
      <div className={styles.topBar}>
        <span className={styles.counter}>
          {current + 1} / {images.length}
        </span>
        <button
          type="button"
          className={styles.closeButton}
          onClick={close}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      <div
        className={styles.stage}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {current > 0 ? (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navPrev}`}
            onClick={() => goTo(current - 1)}
            aria-label="이전"
          >
            ‹
          </button>
        ) : null}

        <div
          ref={trackRef}
          className={`${styles.slideTrack} ${animate ? styles.slideTrackAnimated : ""}`}
          style={{
            transform: `translateX(calc(${translateX}% + ${pxOffset}px))`,
          }}
        >
          {images.map((src, i) => (
            <div key={src} className={styles.slide}>
              <Image
                src={src}
                alt=""
                width={1200}
                height={1600}
                sizes="100vw"
                className={styles.slideImage}
                priority={Math.abs(i - current) <= 1}
              />
            </div>
          ))}
        </div>

        {current < images.length - 1 ? (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navNext}`}
            onClick={() => goTo(current + 1)}
            aria-label="다음"
          >
            ›
          </button>
        ) : null}
      </div>

      <div className={styles.dots}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`사진 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
