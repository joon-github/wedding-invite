"use client";

import { useState } from "react";
import styles from "./copy-button.module.scss";

type CopyButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

export function CopyButton({
  value,
  label = "복사",
  copiedLabel = "완료",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={handleCopy}
    >
      <span aria-hidden="true" className={styles.icon}>
        {copied ? "✓" : "⧉"}
      </span>
      {copied ? copiedLabel : label}
    </button>
  );
}
