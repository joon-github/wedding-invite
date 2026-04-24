"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./photo-upload.module.scss";

type Photo = {
  url: string;
  uploadedAt: string;
  pathname: string;
};

export function PhotoUpload() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "uploading" | "error">("loading");
  const [dragOver, setDragOver] = useState(false);
  const [newUrls, setNewUrls] = useState<Set<string>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/photos", { cache: "no-store" });
        const data = await res.json();
        setPhotos(data.photos ?? []);
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    }
    load();
  }, []);

  const upload = useCallback(async (file: File) => {
    if (status === "uploading") return;
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed");
      }

      const data = await res.json();
      const newPhoto: Photo = {
        url: data.url,
        uploadedAt: new Date().toISOString(),
        pathname: "",
      };

      setNewUrls((prev) => new Set(prev).add(data.url));
      setPhotos((prev) => [newPhoto, ...prev]);
      setStatus("idle");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [status]);

  const selectedPhoto = selectedIndex === null ? null : photos[selectedIndex] ?? null;

  const movePhoto = useCallback((direction: -1 | 1) => {
    setSelectedIndex((current) => {
      if (current === null || photos.length === 0) {
        return current;
      }

      return (current + direction + photos.length) % photos.length;
    });
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowLeft") {
        movePhoto(-1);
      }

      if (event.key === "ArrowRight") {
        movePhoto(1);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movePhoto, selectedIndex]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  return (
    <section className={styles.section}>
      <div className="section-badge">
        <span className="section-badge__icon">📸</span>
        <span className="section-badge__divider" />
        <span className="section-badge__text">포토부스</span>
        <span className="section-badge__arrow">›</span>
      </div>

      <div className={`paper-texture ${styles.card}`}>
        <span className={styles.tapeLeft} />
        <span className={styles.tapeRight} />

        <div className={styles.header}>
          <p className={styles.label}>Share your moments</p>
          <p className={styles.subtitle}>
            현장에서 찍은 사진을 공유해주세요!
          </p>
        </div>

        {/* Upload area */}
        <div
          className={`${styles.uploadArea} ${dragOver ? styles.uploadAreaDragOver : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <span className={styles.uploadIcon}>📷</span>
          <span className={styles.uploadText}>
            {status === "uploading" ? "업로드 중..." : "사진을 선택하거나 드래그하세요"}
          </span>
          <span className={styles.uploadHint}>JPG, PNG, WebP · 최대 10MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFileChange}
            disabled={status === "uploading"}
          />
        </div>

        {status === "uploading" ? (
          <>
            <div className={styles.uploadingBar}>
              <div className={styles.uploadingProgress} />
            </div>
            <p className={styles.uploadingText}>사진을 업로드하고 있어요</p>
          </>
        ) : null}

        {/* Prize message */}
        <div className={styles.prizeMessage}>
          <p className={styles.prizeText}>
            <span className={styles.prizeHighlight}>베스트샷</span>에
            선정되신 분께는{" "}
            <span className={styles.prizeHighlight}>특별한 선물</span>이
            있습니다 🎁
          </p>
        </div>

        {/* Photo grid */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>Gallery</span>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.photoGrid}>
          {photos.length === 0 && status !== "loading" ? (
            <p className={styles.emptyState}>
              아직 공유된 사진이 없어요. 첫 번째 사진을 올려주세요!
            </p>
          ) : null}
          {photos.map((photo) => (
            <button
              type="button"
              key={photo.url}
              className={`${styles.photoItem} ${newUrls.has(photo.url) ? styles.photoNew : ""}`}
              onClick={() => setSelectedIndex(photos.findIndex((item) => item.url === photo.url))}
              aria-label="포토부스 사진 크게 보기"
            >
              <img
                src={photo.url}
                alt=""
                className={styles.photoImage}
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {photos.length > 0 ? (
          <p className={styles.photoCount}>
            {photos.length}장의 사진이 공유되었어요
          </p>
        ) : null}
      </div>
      {selectedPhoto ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="포토부스 사진 크게 보기"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setSelectedIndex(null)}
            aria-label="닫기"
          >
            ×
          </button>
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                className={styles.lightboxNavLeft}
                onClick={(event) => {
                  event.stopPropagation();
                  movePhoto(-1);
                }}
                aria-label="이전 사진"
              >
                ‹
              </button>
              <button
                type="button"
                className={styles.lightboxNavRight}
                onClick={(event) => {
                  event.stopPropagation();
                  movePhoto(1);
                }}
                aria-label="다음 사진"
              >
                ›
              </button>
            </>
          ) : null}
          <div
            className={styles.lightboxImageWrap}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt=""
              className={styles.lightboxImage}
            />
          </div>
          <p className={styles.lightboxCount}>
            {selectedIndex + 1} / {photos.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}
