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
      <div className={styles.badge}>
        <span className={styles.badgeIcon}>📸</span>
        <span className={styles.badgeDivider} />
        <span className={styles.badgeText}>포토부스</span>
        <span className={styles.badgeArrow}>›</span>
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
            <div
              key={photo.url}
              className={`${styles.photoItem} ${newUrls.has(photo.url) ? styles.photoNew : ""}`}
            >
              <img
                src={photo.url}
                alt=""
                className={styles.photoImage}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {photos.length > 0 ? (
          <p className={styles.photoCount}>
            {photos.length}장의 사진이 공유되었어요
          </p>
        ) : null}
      </div>
    </section>
  );
}
