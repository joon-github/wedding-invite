"use client";

import { FormEvent, useEffect, useState } from "react";

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
    <section className="pink-collage px-6 py-14 text-black">
      <div className="mx-auto mb-8 grid h-16 max-w-[340px] grid-cols-[58px_1px_1fr_38px] items-center rounded-full border border-black/55 bg-[#11110f] px-5 text-[var(--pink)] shadow-[0_0_18px_rgba(0,0,0,0.22)]">
        <span className="grid place-items-center text-[32px] font-light leading-none">
          ✎
        </span>
        <span className="h-9 w-px bg-[var(--pink)]/60" />
        <span className="text-center text-[23px] font-light tracking-[0.04em] text-white">
          방명록
        </span>
        <span className="text-center text-[34px] font-light leading-none text-[var(--pink)]">
          ›
        </span>
      </div>

      <div className="paper-texture relative px-5 py-6 shadow-2xl shadow-black/25">
        <span className="absolute -top-4 left-10 h-8 w-20 -rotate-6 bg-[var(--tape)]/90" />
        <span className="absolute -top-4 right-10 h-8 w-20 rotate-6 bg-[var(--tape)]/90" />

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            value={trap}
            onChange={(event) => setTrap(event.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            name="website"
          />
          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45">
              Name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={20}
              placeholder="성함"
              className="mt-1 h-11 w-full border border-black/15 bg-white/45 px-3 text-sm font-semibold outline-none transition focus:border-black"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45">
              Message
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={140}
              placeholder="축하 메시지를 남겨주세요"
              className="mt-1 min-h-28 w-full resize-none border border-black/15 bg-white/45 p-3 text-sm font-medium leading-6 outline-none transition focus:border-black"
            />
          </label>
          <button
            type="submit"
            disabled={status === "saving"}
            className="h-11 w-full rounded-full bg-black text-sm font-bold text-white transition hover:bg-[var(--pink)] hover:text-black disabled:opacity-55"
          >
            {status === "saving" ? "남기는 중" : "축하 메시지 남기기"}
          </button>
        </form>

        <div className="my-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-black/25" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/45">
            Messages
          </span>
          <span className="h-px flex-1 bg-black/25" />
        </div>

        {status === "setup" ? (
          <p className="bg-white/35 p-4 text-center text-sm font-semibold leading-6 text-black/65">
            Apps Script URL을 연결하면 방명록이 표시됩니다.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="bg-white/35 p-4 text-center text-sm font-semibold leading-6 text-black/65">
            방명록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        ) : null}
        {status === "done" ? (
          <p className="mb-3 text-center text-sm font-bold text-black">
            메시지가 저장되었습니다.
          </p>
        ) : null}

        <div className="space-y-2">
          {messages.map((item) => (
            <article
              key={item.id}
              className="border border-black/10 bg-white/35 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{item.name}</p>
                <time className="text-[11px] font-bold text-black/40">
                  {formatDate(item.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-6 text-black/68">
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
