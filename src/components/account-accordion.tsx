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
    <section className="border-t border-[var(--line)] py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-left"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-[var(--ink)]">
          {title}
        </span>
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-full bg-[var(--shell)] text-lg text-[var(--muted)]"
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div className="mt-2 divide-y divide-[var(--line)]">
          {accounts.map((account) => (
            <div
              key={`${account.relation}-${account.holder}`}
              className="grid grid-cols-[1fr_auto] gap-3 py-4"
            >
              <div>
                <p className="text-xs font-medium text-[var(--muted)]">
                  {account.relation}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                  {account.bank} {account.number}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
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
