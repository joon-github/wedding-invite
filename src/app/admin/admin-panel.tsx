"use client";

import JSZip from "jszip";
import { useCallback, useEffect, useState } from "react";
import styles from "./admin.module.scss";

type Photo = { url: string; uploadedAt: string; pathname: string };
type Message = { id: string; name: string; message: string; createdAt: string };

function downloadUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function AdminPanel({ adminKey }: { adminKey: string }) {
  const [tab, setTab] = useState<"photos" | "guestbook">("photos");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState("");

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then((d) => setPhotos(d.photos ?? []));
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages ?? []));
  }, []);

  const deletePhoto = useCallback(
    async (url: string) => {
      if (!confirm("이 사진을 삭제할까요?")) return;
      setDeleting(url);
      await fetch(`/api/photos?key=${adminKey}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      setPhotos((prev) => prev.filter((p) => p.url !== url));
      setDeleting(null);
    },
    [adminKey],
  );

  const downloadSingle = useCallback((photo: Photo) => {
    const ext = photo.pathname.split(".").pop() ?? "jpg";
    const name = photo.pathname.split("/").pop() ?? `photo.${ext}`;
    downloadUrl(photo.url, name);
  }, []);

  const downloadAll = useCallback(async () => {
    if (photos.length === 0 || zipping) return;
    setZipping(true);
    setZipProgress(`0 / ${photos.length}`);

    try {
      const zip = new JSZip();
      const folder = zip.folder("wedding-photos")!;

      for (let i = 0; i < photos.length; i++) {
        setZipProgress(`${i + 1} / ${photos.length}`);
        const res = await fetch(photos[i].url);
        const blob = await res.blob();
        const ext = photos[i].pathname.split(".").pop() ?? "jpg";
        folder.file(`photo-${String(i + 1).padStart(3, "0")}.${ext}`, blob);
      }

      setZipProgress("압축 중...");
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      downloadUrl(url, "wedding-photos.zip");
      URL.revokeObjectURL(url);
    } catch {
      alert("다운로드 중 오류가 발생했습니다.");
    } finally {
      setZipping(false);
      setZipProgress("");
    }
  }, [photos, zipping]);

  const deleteMessage = useCallback(
    async (id: string) => {
      if (!confirm("이 메시지를 삭제할까요?")) return;
      setDeleting(id);
      await fetch(`/api/guestbook?key=${adminKey}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setDeleting(null);
    },
    [adminKey],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>관리자</h1>
        <span className={styles.badge}>Admin</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statNumber}>{photos.length}</p>
          <p className={styles.statLabel}>Photos</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statNumber}>{messages.length}</p>
          <p className={styles.statLabel}>Messages</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === "photos" ? styles.tabActive : ""}`}
          onClick={() => setTab("photos")}
        >
          사진 ({photos.length})
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === "guestbook" ? styles.tabActive : ""}`}
          onClick={() => setTab("guestbook")}
        >
          방명록 ({messages.length})
        </button>
      </div>

      {tab === "photos" ? (
        <>
          {photos.length > 0 ? (
            <button
              type="button"
              className={styles.downloadAllButton}
              disabled={zipping}
              onClick={downloadAll}
            >
              {zipping ? `다운로드 중 (${zipProgress})` : `전체 다운로드 (${photos.length}장)`}
            </button>
          ) : null}
          <div className={styles.photoGrid}>
            {photos.length === 0 ? (
              <p className={styles.empty}>업로드된 사진이 없습니다</p>
            ) : null}
            {photos.map((photo) => (
              <div key={photo.url} className={styles.photoCard}>
                <img src={photo.url} alt="" className={styles.photoImage} loading="lazy" />
                <div className={styles.photoOverlay}>
                  <button
                    type="button"
                    className={styles.photoActionButton}
                    onClick={() => downloadSingle(photo)}
                    aria-label="다운로드"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={`${styles.photoActionButton} ${styles.photoActionDelete}`}
                    disabled={deleting === photo.url}
                    onClick={() => deletePhoto(photo.url)}
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.messageList}>
          {messages.length === 0 ? (
            <p className={styles.empty}>방명록이 비어있습니다</p>
          ) : null}
          {messages.map((msg) => (
            <div key={msg.id} className={styles.messageCard}>
              <div className={styles.messageContent}>
                <p>
                  <span className={styles.messageName}>{msg.name}</span>
                  <span className={styles.messageDate}>
                    {new Date(msg.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </p>
                <p className={styles.messageBody}>{msg.message}</p>
              </div>
              <button
                type="button"
                className={styles.messageDelete}
                disabled={deleting === msg.id}
                onClick={() => deleteMessage(msg.id)}
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
