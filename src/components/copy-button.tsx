"use client";

import { useState } from "react";

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
      className={`inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] px-4 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--coral)] hover:text-[var(--coral)] ${className}`}
      onClick={handleCopy}
    >
      <span aria-hidden="true" className="mr-1.5 text-base leading-none">
        {copied ? "✓" : "⧉"}
      </span>
      {copied ? copiedLabel : label}
    </button>
  );
}
