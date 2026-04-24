"use client";

import { Nanum_Pen_Script } from "next/font/google";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./envelope-intro.module.scss";

const penFont = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type EnvelopeIntroProps = {
  guestName: string;
  onComplete: () => void;
};

const STORAGE_KEY = "wedding-envelope-seen";
const SWIPE_THRESHOLD = 80;

export function EnvelopeIntro({ guestName, onComplete }: EnvelopeIntroProps) {
  const [phase, setPhase] = useState<"typing" | "envelope" | "leaving" | "done">("typing");
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const dragRef = useRef({ startY: 0, currentY: 0, dragging: false });
  const [dragOffset, setDragOffset] = useState(0);
  const fullText = `${guestName}님,\n편범준 ♡ 유정아\n결혼식에 초대합니다`;

  useEffect(() => {
    document.getElementById("envelope-curtain")?.remove();
    document.body.style.overflow = "hidden";
    const screen = document.querySelector("[data-phone-screen]") as HTMLElement | null;
    if (screen) screen.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      if (screen) screen.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;

    let i = 0;
    const id = setInterval(() => {
      i++;
      setTypedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(id);
        setTimeout(() => setShowCursor(false), 400);
        setTimeout(() => setPhase("envelope"), 1800);
      }
    }, 60);

    return () => clearInterval(id);
  }, [phase, fullText]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = setTimeout(() => {
      document.body.style.overflow = "";
      const screen = document.querySelector("[data-phone-screen]") as HTMLElement | null;
      if (screen) screen.style.overflow = "";
      setPhase("done");
      onComplete();
    }, 800);
    return () => clearTimeout(id);
  }, [phase, onComplete]);

  const handleSwipeEnd = useCallback(() => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;

    const dy = dragRef.current.startY - dragRef.current.currentY;
    if (dy > SWIPE_THRESHOLD) {
      localStorage.setItem(STORAGE_KEY, "1");
      setPhase("leaving");
    }
    setDragOffset(0);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    dragRef.current = { startY: e.clientY, currentY: e.clientY, dragging: true };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current.dragging) return;
    dragRef.current.currentY = e.clientY;
    const dy = dragRef.current.startY - e.clientY;
    if (dy > 0) {
      setDragOffset(Math.min(dy, 300));
    }
  }

  if (phase === "done") return null;

  const cardTranslateY = phase === "leaving" ? -120 : -dragOffset * 0.6;
  const overlayOpacity = phase === "leaving" ? 0 : 1 - dragOffset / 400;

  const dustParticles = Array.from({ length: 12 }, (_, i) => ({
    left: `${8 + Math.random() * 84}%`,
    animationDuration: `${4 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 5}s`,
    size: 2 + Math.random() * 2,
  }));

  return (
    <div
      className={`${styles.overlay} ${phase === "leaving" ? styles.overlayHidden : ""}`}
      style={{ opacity: overlayOpacity }}
    >
      <div className={styles.dustContainer}>
        {dustParticles.map((p, i) => (
          <span
            key={i}
            className={styles.dust}
            style={{
              left: p.left,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Phase 1: typing */}
      <div className={`${styles.welcomeLayer} ${phase !== "typing" ? styles.welcomeHidden : ""}`}>
        <p className={`${styles.welcomeText} ${penFont.className}`}>
          {typedText.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 ? <br /> : null}
            </span>
          ))}
          <span className={`${styles.cursor} ${!showCursor ? styles.cursorHidden : ""}`} />
        </p>
      </div>

      {/* Phase 2: envelope image */}
      <div
        className={`${styles.envelopeLayer} ${phase === "envelope" ? styles.envelopeVisible : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handleSwipeEnd}
        onPointerCancel={handleSwipeEnd}
      >
        <div className={styles.envelopeTop} />
        <div className={styles.envelopeCenter}>
          <div
            className={`${styles.envelopeCard} ${dragRef.current.dragging ? styles.envelopeCardDragging : ""}`}
            style={{ transform: `translateY(${cardTranslateY}px)` }}
          >
            <Image
              src="/image/welcome_image.png"
              alt="청첩장"
              width={600}
              height={840}
              className={styles.envelopeImage}
              priority
            />
            <div className={styles.recipientOverlay}>
              <p className={styles.recipientTo}>To.</p>
              <p className={styles.recipientName}>
                {guestName}
                <span className={styles.recipientSuffix}>님께</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.swipeHint}>
          <span className={styles.swipeArrow}>↑</span>
          <span className={styles.swipeText}>위로 쓸어 올려주세요</span>
        </div>
      </div>
    </div>
  );
}

export function useEnvelopeIntro() {
  const [guestName, setGuestName] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");

    if (name && !localStorage.getItem(STORAGE_KEY)) {
      setGuestName(name);
      setShow(true);
    }
  }, []);

  return { guestName, show, dismiss: () => setShow(false) };
}
