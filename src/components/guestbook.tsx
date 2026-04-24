"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./guestbook.module.scss";

type GuestbookMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type GuestbookResponse = {
  messages: GuestbookMessage[];
  setupRequired?: boolean;
};

export function Guestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "done" | "error" | "setup">("loading");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("name");
    if (param) setName(param);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      try {
        const response = await fetch("/api/guestbook", { cache: "no-store" });
        const data = (await response.json()) as GuestbookResponse;

        if (!active) {
          return;
        }

        setMessages(data.messages ?? []);
        setStatus(data.setupRequired ? "setup" : "idle");
      } catch {
        if (active) {
          setStatus("error");
        }
      }
    }

    loadMessages();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !message.trim() || trap) {
      return;
    }

    setStatus("saving");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          website: trap,
        }),
      });
      const data = (await response.json()) as GuestbookResponse;

      if (!response.ok) {
        throw new Error("Failed to save guestbook message");
      }

      setMessages(data.messages ?? []);
      setName("");
      setMessage("");
      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={`pink-collage ${styles.section}`}>
      <div className={styles.badge}>
        <span className={styles.badgeIcon}>
          ✎
        </span>
        <span className={styles.badgeDivider} />
        <span className={styles.badgeText}>
          방명록
        </span>
        <span className={styles.badgeArrow}>
          ›
        </span>
      </div>

      <div className={`paper-texture ${styles.card}`}>
        <span className={styles.tapeLeft} />
        <span className={styles.tapeRight} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            value={trap}
            onChange={(event) => setTrap(event.target.value)}
            className={styles.honeypot}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            name="website"
          />
          <label className={styles.fieldLabel}>
            <span className={styles.fieldLabelText}>
              Name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={20}
              placeholder="성함"
              className={styles.input}
            />
          </label>
          <label className={styles.fieldLabel}>
            <span className={styles.fieldLabelText}>
              Message
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={140}
              placeholder="축하 메시지를 남겨주세요"
              className={styles.textarea}
            />
          </label>
          <button
            type="submit"
            disabled={status === "saving"}
            className={styles.submitButton}
          >
            {status === "saving" ? "남기는 중" : "축하 메시지 남기기"}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>
            Messages
          </span>
          <span className={styles.dividerLine} />
        </div>

        {status === "setup" ? (
          <p className={styles.statusMessage}>
            Apps Script URL을 연결하면 방명록이 표시됩니다.
          </p>
        ) : null}
        {status === "error" ? (
          <p className={styles.statusMessage}>
            방명록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        ) : null}
        {status === "done" ? (
          <p className={styles.doneMessage}>
            메시지가 저장되었습니다.
          </p>
        ) : null}

        <div className={styles.messageList}>
          {messages.map((item) => (
            <article
              key={item.id}
              className={styles.messageItem}
            >
              <div className={styles.messageHeader}>
                <p className={styles.messageName}>{item.name}</p>
                <time className={styles.messageDate}>
                  {formatDate(item.createdAt)}
                </time>
              </div>
              <p className={styles.messageBody}>
                {item.message}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
