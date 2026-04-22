"use client";

import { useMemo, useState } from "react";

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
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--pink)] px-4 text-sm font-semibold text-black transition hover:bg-white"
        onClick={handleShare}
      >
        <span aria-hidden="true" className="mr-2 text-base leading-none">
          ↗
        </span>
        공유하기
      </button>
      <button
        type="button"
        className="inline-flex h-12 items-center justify-center rounded-full border border-white/45 px-4 text-sm font-semibold text-white transition hover:border-[var(--pink)] hover:text-[var(--pink)]"
        onClick={handleCopyUrl}
      >
        <span aria-hidden="true" className="mr-2 text-base leading-none">
          ⧉
        </span>
        {copied ? "복사 완료" : "주소 복사"}
      </button>
    </div>
  );
}
