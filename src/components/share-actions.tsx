"use client";

import { useState } from "react";
import styles from "./share-actions.module.scss";

type ShareActionsProps = {
  title: string;
  text: string;
};

/** `?name=` 등 쿼리·해시 없이 페이지 URL만 (복사/공유용) */
function getCleanPageUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}`;
}

export function ShareActions({ title, text }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = getCleanPageUrl();

    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function handleCopyUrl() {
    const url = getCleanPageUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={styles.grid}>
      <button
        type="button"
        className={styles.shareButton}
        onClick={handleShare}
      >
        <span aria-hidden="true" className={styles.buttonIcon}>
          ↗
        </span>
        공유하기
      </button>
      <button
        type="button"
        className={styles.copyButton}
        onClick={handleCopyUrl}
      >
        <span aria-hidden="true" className={styles.buttonIcon}>
          ⧉
        </span>
        {copied ? "복사 완료" : "주소 복사"}
      </button>
    </div>
  );
}
