"use client";

import { useState } from "react";
import type { Account } from "@/lib/invitation";
import { CopyButton } from "./copy-button";
import styles from "./account-accordion.module.scss";

type AccountAccordionProps = {
  title: string;
  accounts: readonly Account[];
};

export function AccountAccordion({ title, accounts }: AccountAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className={`serif-title ${styles.triggerTitle}`}>
          {title}
        </span>
        <span
          aria-hidden="true"
          className={styles.triggerIcon}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div className={styles.list}>
          {accounts.map((account) => (
            <div
              key={`${account.relation}-${account.holder}`}
              className={styles.item}
            >
              <div>
                <p className={styles.relationBadge}>
                  {account.relation}
                </p>
                <p className={styles.accountNumber}>
                  {account.bank} {account.number}
                </p>
                <p className={styles.accountHolder}>
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
