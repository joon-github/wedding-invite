"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryProps = {
  images: readonly string[];
};

export function Gallery({ images }: GalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleImages = expanded ? images : images.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {visibleImages.map((src, index) => (
          <button
            type="button"
            key={src}
            className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-[var(--shell)]"
            aria-label={`갤러리 사진 ${index + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 480px) 50vw, 240px"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              priority={index < 2}
            />
          </button>
        ))}
      </div>
      {images.length > 4 ? (
        <button
          type="button"
          className="mx-auto flex h-11 min-w-32 items-center justify-center rounded-full border border-[var(--line)] px-5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--coral)] hover:text-[var(--coral)]"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "접기" : "더보기"}
        </button>
      ) : null}
    </div>
  );
}
