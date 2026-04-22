"use client";

import { useState } from "react";
import type { Account } from "@/lib/invitation";
import { CopyButton } from "./copy-button";

type AccountAccordionProps = {
  title: string;
  accounts: readonly Account[];
};

export function AccountAccordion({ title, accounts }: AccountAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-t border-black/20 py-3 first:border-t-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="serif-title text-lg font-black text-black">
          {title}
        </span>
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-full border border-black/25 bg-white/45 text-xl font-black text-black"
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div className="mt-2 space-y-2">
          {accounts.map((account) => (
            <div
              key={`${account.relation}-${account.holder}`}
              className="grid grid-cols-[1fr_auto] gap-3 border border-black/10 bg-white/35 p-3"
            >
              <div>
                <p className="inline-flex rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                  {account.relation}
                </p>
                <p className="mt-2 text-sm font-black text-black">
                  {account.bank} {account.number}
                </p>
                <p className="mt-1 text-sm text-black/60">
                  {account.holder}
                </p>
              </div>
              <CopyButton
                value={`${account.bank} ${account.number} ${account.holder}`}
                label="복사"
              />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
