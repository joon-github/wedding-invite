"use client";

import { useMemo, useState } from "react";
import styles from "./share-actions.module.scss";

type ShareActionsProps = {
  title: string;
  text: string;
};

export function ShareActions({ title, text }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const fallbackUrl = useMemo(
    () => (typeof window === "undefined" ? "" : window.location.href),
    [],
  );

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function handleCopyUrl() {
    const url = window.location.href || fallbackUrl;
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
