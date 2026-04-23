"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./dday-counter.module.scss";

type DdayCounterProps = {
  targetDate: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isPast: boolean;
};

function getTimeLeft(target: string): TimeLeft {
  const now = new Date();
  const wedding = new Date(target + "T17:00:00+09:00");
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWedding = new Date(wedding.getFullYear(), wedding.getMonth(), wedding.getDate());

  const isToday = startOfToday.getTime() === startOfWedding.getTime();
  const diff = wedding.getTime() - now.getTime();
  const isPast = diff <= 0 && !isToday;

  if (isToday || isPast) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday, isPast };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isToday, isPast };
}

export function DdayCounter({ targetDate }: DdayCounterProps) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(targetDate));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiFired = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const fireConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      type: "rect" | "circle" | "emoji";
      emoji?: string;
    };

    const colors = [
      "#e6a0bf", "#f8d7e5", "#ffd48a", "#fff",
      "#ff8fa3", "#ffc2d1", "#ffebcd", "#c9a0dc",
    ];
    const emojis = ["😇", "👼", "✨", "💕", "💒", "💍"];

    const particles: Particle[] = [];

    function spawn(cx: number) {
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        const isEmoji = Math.random() < 0.12;
        particles.push({
          x: cx,
          y: H * 0.6,
          vx: Math.cos(angle) * speed * (0.6 + Math.random()),
          vy: -Math.abs(Math.sin(angle) * speed * (1.5 + Math.random())),
          size: isEmoji ? 16 + Math.random() * 8 : 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          opacity: 1,
          type: isEmoji ? "emoji" : Math.random() > 0.5 ? "rect" : "circle",
          emoji: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
        });
      }
    }

    spawn(W * 0.25);
    spawn(W * 0.75);

    setTimeout(() => {
      spawn(W * 0.5);
    }, 300);

    let frame: number;
    function animate() {
      ctx.clearRect(0, 0, W, H);
      let alive = false;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.005;

        if (p.opacity <= 0) continue;
        alive = true;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === "emoji") {
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.emoji!, 0, 0);
        } else if (p.type === "rect") {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (time.isToday && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
  }, [time.isToday, fireConfetti]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__fireConfetti = fireConfetti;
    return () => {
      delete (window as unknown as Record<string, unknown>).__fireConfetti;
    };
  }, [fireConfetti]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className={styles.section}>
      <canvas ref={canvasRef} className={styles.confettiCanvas} />
      <div className={styles.content}>
        <p className={styles.label}>
          {time.isToday ? "Today is the day" : "Until our wedding"}
        </p>

        {time.isToday ? (
          <div className={styles.ddayHero}>
            <p className={styles.ddayEmoji}>😇</p>
            <p className={styles.ddayTitle}>D-Day</p>
            <p className={styles.ddayMessage}>
              10월 4일, 1004
              <br />
              천사 같은 두 사람의 결혼식 날입니다
            </p>
          </div>
        ) : (
          <>
            <div className={styles.countdown}>
              <div className={styles.unit}>
                <span className={`${styles.number} ${styles.numberDays}`}>
                  {time.days}
                </span>
                <span className={styles.unitLabel}>Days</span>
              </div>
              <span className={styles.separator}>:</span>
              <div className={styles.unit}>
                <span className={styles.number}>{pad(time.hours)}</span>
                <span className={styles.unitLabel}>Hours</span>
              </div>
              <span className={styles.separator}>:</span>
              <div className={styles.unit}>
                <span className={styles.number}>{pad(time.minutes)}</span>
                <span className={styles.unitLabel}>Min</span>
              </div>
              <span className={styles.separator}>:</span>
              <div className={styles.unit}>
                <span className={styles.number}>{pad(time.seconds)}</span>
                <span className={styles.unitLabel}>Sec</span>
              </div>
            </div>
            <p className={styles.subtitle}>
              <span className={styles.subtitleEmoji} aria-hidden>
                🪽
              </span>{" "}
              결혼식까지{" "}
              <span className={styles.subtitlePink}>
                D-{time.days}
              </span>{" "}
              <span className={styles.subtitleEmoji} aria-hidden>
                🪽
              </span>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
