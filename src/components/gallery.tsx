"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./gallery.module.scss";

type GalleryProps = {
  images: readonly string[];
};

export function Gallery({ images }: GalleryProps) {
  const [expanded, setExpanded] = useState(false);
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
    </div>
  );
}
